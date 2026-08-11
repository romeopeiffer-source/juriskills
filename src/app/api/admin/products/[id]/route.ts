import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { parseContentsList } from "@/lib/utils";
import {
  BUCKET_PRODUCT_FILES,
  BUCKET_PRODUCT_IMAGES,
  uploadPrivateFile,
  uploadPublicFile,
} from "@/lib/supabase-storage";

const productSchema = z.object({
  category: z.enum(["PROMPT", "SKILL", "AGENT"]),
  name: z.string().trim().min(2).max(150),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit être en minuscules, chiffres et tirets."),
  shortDescription: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(5000),
  price: z.coerce.number().int().min(0),
  discountPercent: z.coerce.number().int().min(0).max(100).optional().nullable(),
  discountAmount: z.coerce.number().int().min(0).optional().nullable(),
  discountStart: z.string().optional().nullable(),
  discountEnd: z.string().optional().nullable(),
  isPublished: z.coerce.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  const formData = await req.formData();
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Données invalides." }, { status: 400 });
  }

  const data = parsed.data;

  if (data.slug !== product.slug) {
    const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé par un autre produit." }, { status: 409 });
    }
  }

  let imageUrl = product.imageUrl;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const imagePath = `${product.id}/${Date.now()}-${image.name}`;
    imageUrl = await uploadPublicFile(
      BUCKET_PRODUCT_IMAGES,
      imagePath,
      Buffer.from(await image.arrayBuffer()),
      image.type
    );
  }

  let fileUrl = product.fileUrl;
  const deliverable = formData.get("file");
  if (deliverable instanceof File && deliverable.size > 0) {
    const filePath = `${product.id}/${deliverable.name}`;
    await uploadPrivateFile(
      BUCKET_PRODUCT_FILES,
      filePath,
      Buffer.from(await deliverable.arrayBuffer()),
      deliverable.type
    );
    fileUrl = filePath;
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      category: data.category,
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      contents: parseContentsList(formData.get("contents")),
      price: data.price,
      discountPercent: data.discountPercent || null,
      discountAmount: data.discountAmount || null,
      discountStart: data.discountStart ? new Date(data.discountStart) : null,
      discountEnd: data.discountEnd ? new Date(data.discountEnd) : null,
      isPublished: data.isPublished ?? true,
      imageUrl,
      fileUrl,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const purchaseCount = await prisma.purchase.count({ where: { productId: params.id } });
  if (purchaseCount > 0) {
    await prisma.product.update({ where: { id: params.id }, data: { isPublished: false } });
    return NextResponse.json({ success: true, unpublishedOnly: true });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
