/**
 * One-off script: manually fulfills a Purchase that the webhook never processed
 * (marks PAID, generates + uploads the invoice, sends the confirmation email).
 * Usage: npx tsx scripts/fulfill-stuck-purchase.ts <purchaseId> <stripePaymentIntentId>
 */
import { PrismaClient } from "@prisma/client";
import { generateInvoicePdf } from "../src/lib/invoice";
import { getResend, EMAIL_FROM } from "../src/lib/resend";
import { BUCKET_INVOICES, uploadPrivateFile } from "../src/lib/supabase-storage";

const prisma = new PrismaClient();

async function main() {
  const [purchaseId, paymentIntentId] = process.argv.slice(2);
  if (!purchaseId || !paymentIntentId) {
    console.error("Usage: fulfill-stuck-purchase.ts <purchaseId> <stripePaymentIntentId>");
    process.exit(1);
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { user: true, product: true },
  });

  if (!purchase) throw new Error("Purchase introuvable.");
  if (purchase.status === "PAID") {
    console.log("Déjà marqué PAID, rien à faire.");
    return;
  }

  const invoiceNumber = `JRK-${purchase.createdAt.getFullYear()}-${purchase.id.slice(-8).toUpperCase()}`;

  const pdfBytes = await generateInvoicePdf({
    invoiceNumber,
    purchaseDate: new Date(),
    customerName: purchase.user.name,
    customerEmail: purchase.user.email,
    productName: purchase.product.name,
    pricePaid: purchase.pricePaid,
  });

  const invoicePath = `${purchase.userId}/${purchase.id}.pdf`;
  await uploadPrivateFile(BUCKET_INVOICES, invoicePath, Buffer.from(pdfBytes), "application/pdf");

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { status: "PAID", stripePaymentId: paymentIntentId, invoiceUrl: invoicePath },
  });

  console.log("Achat marqué PAID, facture générée:", invoicePath);

  const siteUrl = "https://juriskills.juristras.eu";

  await getResend().emails.send({
    from: EMAIL_FROM,
    to: purchase.user.email,
    subject: `Votre achat Juriskills : ${purchase.product.name}`,
    html: `
      <div style="font-family: sans-serif; color: #0b1220;">
        <h1 style="color: #7C3AED;">Merci pour votre achat, ${purchase.user.name} !</h1>
        <p>Vous venez d'acquérir <strong>${purchase.product.name}</strong>.</p>
        <p>Votre facture est jointe à cet email. Vous pouvez également retrouver votre produit et votre facture
        à tout moment dans votre espace personnel :</p>
        <p><a href="${siteUrl}/compte/mes-achats" style="color:#7C3AED;">Accéder à mes achats</a></p>
        <p>L'équipe Juriskills</p>
      </div>
    `,
    attachments: [
      {
        filename: `facture-${invoiceNumber}.pdf`,
        content: Buffer.from(pdfBytes).toString("base64"),
      },
    ],
  });

  console.log("Email envoyé à", purchase.user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
