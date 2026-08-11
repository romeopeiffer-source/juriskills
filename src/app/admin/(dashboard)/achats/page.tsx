import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400",
  PAID: "bg-emerald-500/15 text-emerald-400",
  FAILED: "bg-red-500/15 text-red-400",
  REFUNDED: "bg-slate-500/15 text-slate-400",
};

export default async function AdminPurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Achats</h1>

      {purchases.length === 0 ? (
        <p className="mt-10 text-slate-400">Aucun achat pour l&apos;instant.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Client</th>
                <th className="pb-3 pr-4 font-medium">Produit</th>
                <th className="pb-3 pr-4 font-medium">Prix payé</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Statut</th>
                <th className="pb-3 font-medium">Facture</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white">{purchase.user.name}</p>
                    <p className="text-xs text-slate-500">{purchase.user.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{purchase.product.name}</td>
                  <td className="py-3 pr-4 text-slate-300">{formatPrice(purchase.pricePaid)}</td>
                  <td className="py-3 pr-4 text-slate-500">{purchase.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_STYLES[purchase.status]}`}>
                      {STATUS_LABELS[purchase.status]}
                    </span>
                  </td>
                  <td className="py-3">
                    {purchase.invoiceUrl ? (
                      <a
                        href={`/api/invoice/${purchase.id}`}
                        className="flex items-center gap-1.5 text-electric-400 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        Voir
                      </a>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
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
