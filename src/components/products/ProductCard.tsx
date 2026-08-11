import Link from "next/link";
import Image from "next/image";
import { FileText, ListChecks, Star } from "lucide-react";
import { PriceTag } from "@/components/products/PriceTag";
import type { ProductWithRating } from "@/types/product";

export function ProductCard({ product }: { product: ProductWithRating }) {
  return (
    <Link href={`/produits/${product.slug}`} className="glass-card group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-night-800">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-800 to-night-700">
            <FileText className="h-10 w-10 text-slate-600" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-base font-semibold text-white group-hover:text-electric-400">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm text-slate-400">{product.shortDescription}</p>

        {product.contents.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ListChecks className="h-3.5 w-3.5" />
            {product.contents.length} élément{product.contents.length > 1 ? "s" : ""} inclus
          </div>
        )}

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-slate-300">
            <Star className="h-4 w-4 fill-discount text-discount" />
            <span className="font-medium">{product.avgRating.toFixed(1)}</span>
            <span className="text-slate-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="mt-2">
          <PriceTag
            price={product.price}
            discountPercent={product.discountPercent}
            discountAmount={product.discountAmount}
            discountStart={product.discountStart}
            discountEnd={product.discountEnd}
          />
        </div>
      </div>
    </Link>
  );
}
