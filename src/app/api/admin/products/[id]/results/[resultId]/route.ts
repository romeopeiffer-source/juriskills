import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { BUCKET_PRODUCT_IMAGES, getSupabaseAdmin } from "@/lib/supabase-storage";

const reorderSchema = z.object({ direction: z.enum(["up", "down"]) });

export async function PATCH(req: Request, { params }: { params: { id: string; resultId: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await req.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const current = await prisma.productResult.findUnique({ where: { id: params.resultId } });
  if (!current || current.productId !== params.id) {
    return NextResponse.json({ error: "Exemple introuvable." }, { status: 404 });
  }

  const neighbor = await prisma.productResult.findFirst({
    where: {
      productId: params.id,
      order: parsed.data.direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: parsed.data.direction === "up" ? "desc" : "asc" },
  });

  if (!neighbor) {
    return NextResponse.json({ success: true }); // already at the edge, nothing to do
  }

  await prisma.$transaction([
    prisma.productResult.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.productResult.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string; resultId: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const result = await prisma.productResult.findUnique({ where: { id: params.resultId } });
  if (!result || result.productId !== params.id) {
    return NextResponse.json({ error: "Exemple introuvable." }, { status: 404 });
  }

  if (result.type === "IMAGE" && result.imageUrl) {
    const supabase = getSupabaseAdmin();
    const path = result.imageUrl.split(`${BUCKET_PRODUCT_IMAGES}/`)[1];
    if (path) await supabase.storage.from(BUCKET_PRODUCT_IMAGES).remove([path]);
  }

  await prisma.productResult.delete({ where: { id: result.id } });
  return NextResponse.json({ success: true });
}
