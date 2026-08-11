import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BUCKET_INVOICES, getSignedUrl } from "@/lib/supabase-storage";

export async function GET(_req: Request, { params }: { params: { purchaseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const purchase = await prisma.purchase.findUnique({ where: { id: params.purchaseId } });

  const isOwner = purchase?.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!purchase || (!isOwner && !isAdmin) || !purchase.invoiceUrl) {
    return NextResponse.json({ error: "Facture introuvable." }, { status: 404 });
  }

  const signedUrl = await getSignedUrl(BUCKET_INVOICES, purchase.invoiceUrl);
  return NextResponse.redirect(signedUrl);
}
