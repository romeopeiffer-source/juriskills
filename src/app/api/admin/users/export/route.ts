import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { role: "CLIENT", newsletterOptIn: true },
    select: { name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const header = "nom,email,inscrit_le";
  const rows = users.map(
    (u) => `"${u.name.replace(/"/g, '""')}",${u.email},${u.createdAt.toISOString().slice(0, 10)}`
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-juriskills.csv"`,
    },
  });
}
