import { prisma } from "@/lib/prisma";
import type { ProductCategory } from "@prisma/client";
import type { ProductWithRating } from "@/types/product";

function withRating<T extends { reviews: { rating: number }[] }>(product: T) {
  const { reviews, ...rest } = product;
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
  return { ...rest, avgRating, reviewCount } as unknown as ProductWithRating;
}

export async function getProductsByCategory(category: ProductCategory): Promise<ProductWithRating[]> {
  const products = await prisma.product.findMany({
    where: { category, isPublished: true },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });
  return products.map(withRating);
}

export async function getFeaturedProducts(limit = 3): Promise<ProductWithRating[]> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(withRating);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
      results: { orderBy: { order: "asc" } },
    },
  });
  if (!product || !product.isPublished) return null;

  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0 ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

  return { ...product, avgRating, reviewCount };
}
