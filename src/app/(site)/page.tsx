import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/products/EmptyState";
import { AboutSection } from "@/components/home/AboutSection";
import { StudentCountBadge } from "@/components/ui/StudentCountBadge";
import { getStudentCount } from "@/config/social-proof";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, studentCount] = await Promise.all([getFeaturedProducts(), getStudentCount()]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="glass-card inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-electric-400">
              <Sparkles className="h-3.5 w-3.5" />
              Créé par des étudiants, pour des étudiants
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Équipez-vous des meilleurs outils IA{" "}
              <span className="bg-electric-gradient bg-clip-text text-transparent">pensés pour le droit</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Prompts, skills et agents IA conçus par des étudiants en droit, testés en conditions réelles avant
              publication, à un prix pensé pour un budget étudiant. Gagnez des heures de recherche, de rédaction et
              de veille — sans compromis sur la rigueur.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/prompts" className="btn-primary">
                Découvrir le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/compte/inscription" className="btn-secondary">
                Créer un compte gratuit
              </Link>
            </div>

            <div className="mt-6 flex justify-center">
              <StudentCountBadge count={studentCount} />
            </div>

            <div className="mt-12">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Compatible avec toutes les IA du marché
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                {["ChatGPT", "Claude", "Gemini", "+ tous les assistants IA"].map((ai) => (
                  <span
                    key={ai}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-slate-300"
                  >
                    {ai}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Produits phares</h2>
            <p className="mt-2 text-slate-400">Les derniers outils ajoutés à notre catalogue.</p>
          </div>
          <Link href="/prompts" className="hidden text-sm font-medium text-electric-400 hover:underline sm:block">
            Voir tout le catalogue →
          </Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState category="produit" />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
