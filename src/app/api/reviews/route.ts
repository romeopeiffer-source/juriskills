import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Vous devez être connecté pour laisser un avis." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  try {
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: session.user.id, productId: parsed.data.productId } },
      update: { rating: parsed.data.rating, comment: parsed.data.comment },
      create: {
        userId: session.user.id,
        productId: parsed.data.productId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });
    return NextResponse.json({ id: review.id });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer votre avis." }, { status: 500 });
  }
}
