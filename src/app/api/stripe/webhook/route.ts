import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/invoice";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { BUCKET_INVOICES, uploadPrivateFile } from "@/lib/supabase-storage";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Configuration webhook manquante." }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature invalide.";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(checkoutSession);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(checkoutSession: Stripe.Checkout.Session) {
  const purchase = await prisma.purchase.findUnique({
    where: { stripeSessionId: checkoutSession.id },
    include: { user: true, product: true },
  });

  if (!purchase || purchase.status === "PAID") return; // idempotent

  const paymentIntentId =
    typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id ?? checkoutSession.id;

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
    data: {
      status: "PAID",
      stripePaymentId: paymentIntentId,
      invoiceUrl: invoicePath,
    },
  });

  const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: purchase.user.email,
      subject: `Votre achat Juriskills : ${purchase.product.name}`,
      html: `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">Merci pour votre achat, ${purchase.user.name} !</h1>
          <p>Vous venez d'acquérir <strong>${purchase.product.name}</strong>.</p>
          <p>Votre facture est jointe à cet email. Vous pouvez également retrouver votre produit et votre facture
          à tout moment dans votre espace personnel :</p>
          <p><a href="${siteUrl}/compte/mes-achats" style="color:#4d4696;">Accéder à mes achats</a></p>
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
  } catch (err) {
    console.error("Échec de l'envoi de l'email de confirmation :", err);
  }
}
