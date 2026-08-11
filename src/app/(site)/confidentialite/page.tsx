export const metadata = { title: "Politique de confidentialité — Juriskills" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Politique de confidentialité</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-4 text-slate-400">
        <p>
          Juriskills collecte les données strictement nécessaires à la création de votre compte, à la gestion de vos
          achats et, si vous y consentez, à l&apos;envoi de notre newsletter.
        </p>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
          données. Le bandeau de consentement affiché lors de votre première visite vous permet de choisir les
          cookies non essentiels que vous autorisez.
        </p>
        <p>Cette page est un modèle à personnaliser avant la mise en production du site.</p>
      </div>
    </div>
  );
}
