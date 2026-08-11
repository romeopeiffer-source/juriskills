import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BUCKET_PRODUCT_FILES, getSignedUrl } from "@/lib/supabase-storage";

export async function GET(_req: Request, { params }: { params: { purchaseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { id: params.purchaseId },
    include: { product: true },
  });

  if (!purchase || purchase.userId !== session.user.id || purchase.status !== "PAID") {
    return NextResponse.json({ error: "Achat introuvable." }, { status: 404 });
  }

  if (!purchase.product.fileUrl) {
    return NextResponse.json({ error: "Aucun fichier disponible pour ce produit." }, { status: 404 });
  }

  const signedUrl = await getSignedUrl(BUCKET_PRODUCT_FILES, purchase.product.fileUrl);
  return NextResponse.redirect(signedUrl);
}
