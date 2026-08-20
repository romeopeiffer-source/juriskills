export const metadata = { title: "Politique de confidentialité — Juriskills" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Politique de confidentialité</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-6 text-slate-400">
        <section>
          <h2 className="text-lg font-semibold text-white">Données collectées et finalités</h2>
          <p>
            Juriskills collecte les données strictement nécessaires à la création de votre compte (nom,
            email, mot de passe), à la gestion de vos achats (facturation, accès aux produits) et, si vous
            y consentez, à l&apos;envoi de notre newsletter. Base légale : exécution du contrat pour la
            gestion du compte et des achats, consentement pour la newsletter.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Durée de conservation</h2>
          <ul>
            <li>
              Données de compte : conservées pendant toute la durée d&apos;activité du compte, puis
              [À COMPLÉTER : délai retenu, par exemple 3 ans après la dernière activité] à des fins
              commerciales avant suppression ou anonymisation.
            </li>
            <li>
              Factures et données de facturation : conservées 10 ans, conformément à l&apos;article
              L123-22 du Code de commerce.
            </li>
            <li>Consentement newsletter : conservé jusqu&apos;à désinscription.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de
            suppression, de portabilité et d&apos;opposition sur vos données personnelles. Pour exercer
            ces droits, contactez [À COMPLÉTER : email du responsable de traitement / DPO].
          </p>
          <p>
            Juriskills tient un registre des traitements recensant les finalités, catégories de données et
            durées de conservation associées à chaque traitement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Cookies</h2>
          <p>
            Le bandeau de consentement affiché lors de votre première visite vous permet de choisir les
            cookies non essentiels (mesure d&apos;audience, marketing) que vous autorisez. Aucun cookie
            non essentiel n&apos;est déposé avant votre consentement, et vous pouvez modifier ou retirer
            votre choix à tout moment via ce bandeau.
          </p>
        </section>
      </div>
    </div>
  );
}
