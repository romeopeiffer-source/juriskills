export const metadata = { title: "Mentions légales — Juriskills" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Mentions légales</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-6 text-slate-400">
        <section>
          <h2 className="text-lg font-semibold text-white">Éditeur du site</h2>
          <p>
            Le site juriskills.juristras.eu (ci-après « Juriskills ») est édité par :
          </p>
          <ul>
            <li>Nom / raison sociale : [À COMPLÉTER : nom ou raison sociale]</li>
            <li>Forme juridique : [À COMPLÉTER : ex. entreprise individuelle, EI, SASU...]</li>
            <li>Adresse du siège : [À COMPLÉTER : adresse complète]</li>
            <li>
              Numéro RCS / SIREN-SIRET : [À COMPLÉTER] — Capital social : [À COMPLÉTER, le cas échéant si
              société]
            </li>
            <li>Numéro de TVA intracommunautaire : [À COMPLÉTER, si assujetti à la TVA]</li>
            <li>Email de contact : [À COMPLÉTER]</li>
            <li>Téléphone : [À COMPLÉTER]</li>
            <li>Directeur de la publication : [À COMPLÉTER : nom]</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li>Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com</li>
          </ul>
          <p>
            La base de données et le stockage des fichiers sont hébergés par Supabase (Supabase Inc.),
            supabase.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des éléments du site (textes, mise en page, charte graphique, logo, base de
            données des produits) est protégé par le droit de la propriété intellectuelle. Toute
            reproduction ou représentation, totale ou partielle, sans autorisation, est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Responsabilité</h2>
          <p>
            Juriskills s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le
            site, sans garantir qu&apos;elles soient exemptes d&apos;erreurs. L&apos;éditeur ne saurait
            être tenu responsable des dommages directs ou indirects résultant de l&apos;accès au site ou
            de son utilisation.
          </p>
        </section>
      </div>
    </div>
  );
}
