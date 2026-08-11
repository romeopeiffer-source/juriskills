import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
