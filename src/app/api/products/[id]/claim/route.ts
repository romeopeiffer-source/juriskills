import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { resolveSiteUrl } from "@/lib/newsletter";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Vous devez être connecté pour obtenir ce produit." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product || !product.isPublished || !product.isFree) {
    return NextResponse.json({ error: "Produit introuvable ou non gratuit." }, { status: 404 });
  }

  const existing = await prisma.purchase.findFirst({
    where: { userId: session.user.id, productId: product.id, status: "PAID" },
  });
  if (existing) {
    return NextResponse.json({ success: true, alreadyClaimed: true });
  }

  await prisma.purchase.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      pricePaid: 0,
      status: "PAID",
    },
  });

  const siteUrl = resolveSiteUrl(req);

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: session.user.email ?? "",
      subject: `Votre produit gratuit Juriskills : ${product.name}`,
      html: `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">C'est à vous, ${session.user.name ?? ""} !</h1>
          <p>Vous venez d'obtenir gratuitement <strong>${product.name}</strong>. Il est disponible dès
          maintenant dans votre espace personnel :</p>
          <p><a href="${siteUrl}/compte/mes-achats" style="color:#4d4696;">Accéder à mes achats</a></p>
          <p>L'équipe Juriskills</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de confirmation (produit gratuit) :", err);
  }

  return NextResponse.json({ success: true });
}
