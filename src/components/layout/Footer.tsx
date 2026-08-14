import Link from "next/link";
import { LogoIcon } from "./LogoIcon";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-950/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <LogoIcon className="h-8 w-8 rounded-lg" />
              Juri<span className="text-electric-400">skills</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Une marketplace d&apos;étudiants, pour des étudiants en droit : des outils IA testés par nos soins, à
              prix étudiant.
            </p>
            <Link
              href="/a-propos"
              className="mt-3 inline-block text-sm font-medium text-electric-400 hover:underline"
            >
              En savoir plus sur nous →
            </Link>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Catalogue</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/prompts" className="hover:text-white">
                  Prompts IA
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-white">
                  Skills IA
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-white">
                  Agents IA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Compte</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/compte/connexion" className="hover:text-white">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/compte/inscription" className="hover:text-white">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/compte/mes-achats" className="hover:text-white">
                  Mes achats
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Légal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/mentions-legales" className="hover:text-white">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-white">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Juriskills. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
