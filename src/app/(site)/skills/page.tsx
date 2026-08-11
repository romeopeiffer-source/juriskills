import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import { CategoryHeader } from "@/components/products/CategoryHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyStateWaitlist } from "@/components/products/EmptyStateWaitlist";

export const metadata: Metadata = { title: "Skills IA — Juriskills" };
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const products = await getProductsByCategory("SKILL");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <CategoryHeader
        title="Skills IA"
        description="Des compétences packagées pour vos agents IA : recherche juridique, rédaction d'actes, veille réglementaire."
      />
      {products.length === 0 ? (
        <EmptyStateWaitlist category="SKILL" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
