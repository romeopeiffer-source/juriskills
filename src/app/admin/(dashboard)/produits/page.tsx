import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";
import { CATEGORY_LABELS } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Produits</h1>
        <Link href="/admin/produits/nouveau" className="btn-primary text-sm">
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-slate-400">Aucun produit pour l&apos;instant.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Nom</th>
                <th className="pb-3 pr-4 font-medium">Catégorie</th>
                <th className="pb-3 pr-4 font-medium">Prix</th>
                <th className="pb-3 pr-4 font-medium">Statut</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">{product.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{CATEGORY_LABELS[product.category]}</td>
                  <td className="py-3 pr-4 text-slate-400">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        product.isPublished
                          ? "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-400"
                          : "rounded-full bg-slate-500/15 px-2.5 py-1 text-xs text-slate-400"
                      }
                    >
                      {product.isPublished ? "Publié" : "Masqué"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
