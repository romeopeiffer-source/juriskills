import type { Product, ProductCategory } from "@prisma/client";

export type ProductWithRating = Product & {
  avgRating: number;
  reviewCount: number;
};

export type { Product, ProductCategory };
