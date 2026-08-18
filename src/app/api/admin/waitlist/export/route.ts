import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const category = new URL(req.url).searchParams.get("category");
  if (!category || !["PROMPT", "SKILL", "AGENT", "NEWSLETTER"].includes(category)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const signups = await prisma.waitlistSignup.findMany({
    where: { category },
    select: { email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const header = "email,inscrit_le";
  const rows = signups.map((s) => `${s.email},${s.createdAt.toISOString().slice(0, 10)}`);
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="liste-attente-${category.toLowerCase()}.csv"`,
    },
  });
}
