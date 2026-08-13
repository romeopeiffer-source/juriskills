"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tag, Receipt, MessageSquare, Users, Clock, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/layout/LogoIcon";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/reductions", label: "Réductions", icon: Tag },
  { href: "/admin/achats", label: "Achats", icon: Receipt },
  { href: "/admin/avis", label: "Avis & commentaires", icon: MessageSquare },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/liste-attente", label: "Liste d'attente", icon: Clock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-1 border-b border-white/10 bg-night-950/60 px-4 py-6 md:w-64 md:border-b-0 md:border-r md:px-4">
      <div className="mb-6 flex items-center gap-2 px-2 font-display text-lg font-semibold text-white">
        <LogoIcon className="h-8 w-8 rounded-lg" />
        Juri<span className="text-electric-400">skills</span>{" "}
        <span className="text-xs font-normal text-slate-500">admin</span>
      </div>

      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </button>
    </aside>
  );
}
