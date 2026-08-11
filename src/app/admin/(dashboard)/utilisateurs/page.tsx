import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Utilisateurs</h1>
        <a href="/api/admin/users/export" className="btn-secondary text-sm">
          <Download className="h-4 w-4" />
          Export newsletter (CSV)
        </a>
      </div>

      {users.length === 0 ? (
        <p className="mt-10 text-slate-400">Aucun utilisateur pour l&apos;instant.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Nom</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Newsletter</th>
                <th className="pb-3 font-medium">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">{user.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{user.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        user.newsletterOptIn
                          ? "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-400"
                          : "rounded-full bg-slate-500/15 px-2.5 py-1 text-xs text-slate-400"
                      }
                    >
                      {user.newsletterOptIn ? "Inscrit" : "Non inscrit"}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{user.createdAt.toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
