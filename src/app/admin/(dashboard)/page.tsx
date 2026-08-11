import { Package, Receipt, Users, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productCount, userCount, paidPurchases] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.purchase.findMany({ where: { status: "PAID" } }),
  ]);

  const revenue = paidPurchases.reduce((sum, p) => sum + p.pricePaid, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Tableau de bord</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Package className="h-5 w-5" />} label="Produits" value={productCount} />
        <StatCard icon={<Receipt className="h-5 w-5" />} label="Ventes" value={paidPurchases.length} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Chiffre d'affaires" value={formatPrice(revenue)} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Clients" value={userCount} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-gradient text-white shadow-glow">
          {icon}
        </span>
        <div>
          <p className="font-display text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
