import { notFound } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, FileText, Sparkles, Star } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { PriceTag } from "@/components/products/PriceTag";
import { BuyButton } from "@/components/products/BuyButton";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { ProductResultsSection } from "@/components/products/ProductResultsSection";
import { CATEGORY_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: `${product.name} — Juriskills` };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-night-800">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-night-800 to-night-700">
              <FileText className="h-14 w-14 text-slate-600" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-electric-400">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <Star className="h-4 w-4 fill-trust text-trust" />
              <span className="font-medium">{product.avgRating.toFixed(1)}</span>
              <span className="text-slate-500">({product.reviewCount} avis)</span>
            </div>
          )}

          <p className="mt-5 whitespace-pre-line text-slate-400">{product.description}</p>

          <div className="mt-8">
            <PriceTag
              size="lg"
              price={product.price}
              discountPercent={product.discountPercent}
              discountAmount={product.discountAmount}
              discountStart={product.discountStart}
              discountEnd={product.discountEnd}
            />
          </div>

          <div className="mt-6">
            <BuyButton productId={product.id} productSlug={product.slug} />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Compatible avec ChatGPT, Claude, Gemini et tous les assistants IA du marché
          </div>
        </div>
      </div>

      {product.contents.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold text-white">Contenu du pack</h2>
          <p className="mt-1 text-sm text-slate-500">
            {product.contents.length} élément{product.contents.length > 1 ? "s" : ""} inclus dans cet achat.
          </p>
          <div className="glass-card mt-5 grid grid-cols-1 gap-x-8 gap-y-3 p-6 sm:grid-cols-2">
            {product.contents.map((item, index) => (
              <div key={index} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductResultsSection results={product.results} />

      <div className="mt-20">
        <ReviewsSection
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt.toISOString(),
            userName: r.user.name,
          }))}
        />
      </div>
    </div>
  );
}
