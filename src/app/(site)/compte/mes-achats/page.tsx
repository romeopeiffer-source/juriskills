import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Download, FileText, Package } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function MesAchatsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/compte/connexion?callbackUrl=/compte/mes-achats");
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, status: "PAID" },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Mes achats</h1>
      <p className="mt-2 text-slate-400">Retrouvez ici tous vos produits achetés et vos factures.</p>

      {purchases.length === 0 ? (
        <div className="glass-card mt-10 flex flex-col items-center gap-3 px-8 py-16 text-center">
          <Package className="h-10 w-10 text-slate-500" />
          <p className="text-slate-400">Vous n&apos;avez pas encore effectué d&apos;achat.</p>
          <Link href="/prompts" className="btn-primary mt-2 text-sm">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <Link href={`/produits/${purchase.product.slug}`} className="font-display font-semibold text-white hover:text-electric-400">
                  {purchase.product.name}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  Acheté le {purchase.createdAt.toLocaleDateString("fr-FR")} — {formatPrice(purchase.pricePaid)}
                </p>
              </div>
              <div className="flex gap-2">
                {purchase.product.fileUrl && (
                  <a href={`/api/download/${purchase.id}`} className="btn-secondary !px-4 !py-2 text-sm">
                    <Download className="h-4 w-4" />
                    Télécharger
                  </a>
                )}
                {purchase.invoiceUrl && (
                  <a href={`/api/invoice/${purchase.id}`} className="btn-secondary !px-4 !py-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Facture
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
