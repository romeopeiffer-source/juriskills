import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { BUCKET_PRODUCT_IMAGES, uploadPublicFile } from "@/lib/supabase-storage";

const resultSchema = z.object({
  type: z.enum(["IMAGE", "TEXT"]),
  textContent: z.string().trim().max(5000).optional().nullable(),
  caption: z.string().trim().max(200).optional().nullable(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  const formData = await req.formData();
  const raw = Object.fromEntries(formData.entries());
  const parsed = resultSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const { type, caption } = parsed.data;

  let imageUrl: string | null = null;
  let textContent: string | null = null;

  if (type === "IMAGE") {
    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: "Merci de choisir une image." }, { status: 400 });
    }
    const imagePath = `${product.id}/results/${Date.now()}-${image.name}`;
    imageUrl = await uploadPublicFile(
      BUCKET_PRODUCT_IMAGES,
      imagePath,
      Buffer.from(await image.arrayBuffer()),
      image.type
    );
  } else {
    if (!parsed.data.textContent || parsed.data.textContent.length === 0) {
      return NextResponse.json({ error: "Merci de renseigner le texte de l'exemple." }, { status: 400 });
    }
    textContent = parsed.data.textContent;
  }

  const last = await prisma.productResult.findFirst({
    where: { productId: product.id },
    orderBy: { order: "desc" },
  });

  const result = await prisma.productResult.create({
    data: {
      productId: product.id,
      type,
      imageUrl,
      textContent,
      caption: caption || null,
      order: (last?.order ?? -1) + 1,
    },
  });

  return NextResponse.json({ id: result.id });
}
