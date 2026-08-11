export const metadata = { title: "Mentions légales — Juriskills" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Mentions légales</h1>
      <div className="prose prose-invert mt-6 max-w-none text-slate-400">
        <p>
          Cette page est un modèle à compléter avec les informations légales de votre société (raison sociale,
          adresse, SIRET, directeur de publication, hébergeur, etc.) avant la mise en production du site.
        </p>
      </div>
    </div>
  );
}
