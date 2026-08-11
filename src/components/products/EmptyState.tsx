import { Sparkles } from "lucide-react";

export function EmptyState({ category }: { category: string }) {
  return (
    <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-4 px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-gradient shadow-glow">
        <Sparkles className="h-7 w-7 text-white" />
      </span>
      <h2 className="font-display text-xl font-semibold text-white">
        Aucun {category} disponible pour le moment
      </h2>
      <p className="text-sm text-slate-400">
        Notre équipe prépare actuellement les premiers outils IA de cette catégorie. Revenez bientôt — ou
        inscrivez-vous à la newsletter pour être averti dès leur mise en ligne.
      </p>
    </div>
  );
}
