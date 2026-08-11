import Link from "next/link";
import { Pencil, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, getEffectivePrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const products = await prisma.product.findMany({
    where: { OR: [{ discountPercent: { not: null } }, { discountAmount: { not: null } }] },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Réductions</h1>
      <p className="mt-2 text-slate-400">
        Gérez les réductions produit par produit depuis la fiche de chaque produit. Voici un aperçu des réductions
        configurées.
      </p>

      {products.length === 0 ? (
        <div className="glass-card mt-8 flex flex-col items-center gap-3 px-8 py-14 text-center">
          <Tag className="h-8 w-8 text-slate-500" />
          <p className="text-slate-400">Aucune réduction configurée pour l&apos;instant.</p>
          <Link href="/admin/produits" className="btn-secondary text-sm">
            Aller aux produits
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {products.map((product) => {
            const { finalPrice, hasDiscount, discountLabel } = getEffectivePrice(product);
            const now = new Date();
            const isFuture = product.discountStart && product.discountStart > now;
            const isExpired = product.discountEnd && product.discountEnd < now;

            return (
              <div key={product.id} className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatPrice(product.price)} → <span className="text-white">{formatPrice(finalPrice)}</span>
                    {hasDiscount && <span className="badge-discount ml-2">{discountLabel}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isExpired
                        ? "rounded-full bg-slate-500/15 px-2.5 py-1 text-xs text-slate-400"
                        : isFuture
                          ? "rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-400"
                          : "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-400"
                    }
                  >
                    {isExpired ? "Expirée" : isFuture ? "À venir" : "Active"}
                  </span>
                  <Link
                    href={`/admin/produits/${product.id}`}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
