"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./LogoIcon";

const TABS = [
  { href: "/prompts", label: "Prompts IA" },
  { href: "/skills", label: "Skills IA" },
  { href: "/agents", label: "Agents IA" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <LogoIcon className="h-9 w-9 shadow-glow rounded-lg" />
          Juri<span className="text-electric-400">skills</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(tab.href)
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <>
              <Link href="/compte/mes-achats" className="btn-secondary !px-4 !py-2 text-sm">
                <ShoppingBag className="h-4 w-4" />
                Mes achats
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/compte/connexion" className="btn-secondary !px-4 !py-2 text-sm">
                <User className="h-4 w-4" />
                Connexion
              </Link>
              <Link href="/compte/inscription" className="btn-primary !px-4 !py-2 text-sm">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-night-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {tab.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {status === "authenticated" ? (
                <>
                  <Link href="/compte/mes-achats" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                    Mes achats
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary text-sm">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/compte/connexion" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                  <Link href="/compte/inscription" className="btn-primary text-sm" onClick={() => setOpen(false)}>
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
