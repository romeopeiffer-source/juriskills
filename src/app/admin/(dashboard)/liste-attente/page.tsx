import { Download, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORIES = ["PROMPT", "SKILL", "AGENT", "NEWSLETTER"] as const;

export default async function AdminWaitlistPage() {
  const counts = await Promise.all(
    CATEGORIES.map((category) => prisma.waitlistSignup.count({ where: { category } }))
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Liste d&apos;attente</h1>
      <p className="mt-2 text-slate-400">
        Inscriptions laissées par des visiteurs sur les catégories encore sans produit publié.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category, index) => (
          <div key={category} className="glass-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric-gradient text-white shadow-glow">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-white">{counts[index]}</p>
                <p className="text-xs text-slate-500">{CATEGORY_LABELS[category]}</p>
              </div>
            </div>
            <a
              href={`/api/admin/waitlist/export?category=${category}`}
              className="btn-secondary mt-4 w-full !py-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Exporter en CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
