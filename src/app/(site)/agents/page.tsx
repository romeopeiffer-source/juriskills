import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import { CategoryHeader } from "@/components/products/CategoryHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyStateWaitlist } from "@/components/products/EmptyStateWaitlist";

export const metadata: Metadata = { title: "Agents IA — Juriskills" };
export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const products = await getProductsByCategory("AGENT");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <CategoryHeader
        title="Agents IA"
        description="Des agents autonomes prêts à automatiser vos tâches juridiques répétitives, du tri de contrats à la veille jurisprudentielle."
      />
      {products.length === 0 ? (
        <EmptyStateWaitlist category="AGENT" />
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
