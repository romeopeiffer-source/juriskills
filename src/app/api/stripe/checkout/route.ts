import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getEffectivePrice } from "@/lib/pricing";

const checkoutSchema = z.object({ productId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Vous devez être connecté pour acheter." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Produit invalide." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || !product.isPublished) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  const { finalPrice } = getEffectivePrice(product);
  // Use the domain the customer is actually browsing on (not a fixed env var) so the
  // Stripe redirect lands back on the same origin as their session cookie — otherwise
  // the app has multiple valid domains (e.g. a custom domain + the *.vercel.app one),
  // the customer appears logged out after paying.
  const siteUrl =
    req.headers.get("origin") ??
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: finalPrice,
            product_data: {
              name: product.name,
              description: product.description.slice(0, 300),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        productId: product.id,
        pricePaid: String(finalPrice),
      },
      success_url: `${siteUrl}/achat-confirme`,
      cancel_url: `${siteUrl}/produits/${product.slug}?canceled=1`,
    });
  } catch (err) {
    console.error("Erreur Stripe lors de la création de la session de paiement :", err);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible. Merci de réessayer dans quelques instants." },
      { status: 502 }
    );
  }

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }

  await prisma.purchase.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      pricePaid: finalPrice,
      stripeSessionId: checkoutSession.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
