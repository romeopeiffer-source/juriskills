import { AboutSection } from "@/components/home/AboutSection";

export const metadata = {
  title: "À propos — Juriskills",
  description:
    "Juriskills est une marketplace de prompts, skills et agents IA pour le droit, créée par des étudiants et testée par nos propres agents IA avant chaque publication.",
};

export default function AProposPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-14 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">À propos de Juriskills</h1>
        <p className="mt-3 text-slate-400">L&apos;histoire, les valeurs et le processus derrière la marketplace.</p>
      </div>

      <AboutSection />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-slate-400 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl font-bold text-white">Notre processus de test</h2>
        <p>
          Avant sa mise en ligne, chaque prompt, skill ou agent est passé au crible par nos propres agents IA de
          test : cohérence juridique des réponses, clarté de la formulation, robustesse face à des questions pièges.
          Rien n&apos;est publié sur la base d&apos;une simple relecture — chaque produit doit passer ce filtre.
        </p>
        <h2 className="font-display text-xl font-bold text-white">Pourquoi des étudiants et pas un cabinet ?</h2>
        <p>
          Parce qu&apos;on est directement concernés. On sait ce que c&apos;est de rédiger un mémo à 23h avant un
          rendu, de chercher une jurisprudence introuvable, ou de devoir choisir entre un outil payant et son budget
          du mois. Juriskills existe pour combler cet écart, pas pour vendre un abonnement à prix cabinet.
        </p>
        <p className="text-sm text-slate-500">
          Assurance responsabilité civile professionnelle : [À COMPLÉTER : assureur et numéro de police].
        </p>
      </div>
    </div>
  );
}
