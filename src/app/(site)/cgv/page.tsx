export const metadata = { title: "Conditions générales de vente — Juriskills" };

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Conditions générales de vente</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-6 text-slate-400">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Objet et produits vendus</h2>
          <p>
            Juriskills vend des contenus numériques (prompts, skills et agents IA à destination des
            étudiants en droit) livrés sous forme de fichiers téléchargeables (PDF/DOCX) ou d&apos;accès
            à un contenu numérique, sans support physique.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Prix et paiement</h2>
          <p>
            Les prix affichés sur le site sont exprimés en euros, toutes taxes comprises (TTC). Le paiement
            s&apos;effectue en une seule fois, par carte bancaire, via la plateforme sécurisée Stripe. Le
            site ne stocke aucune donnée de carte bancaire.
          </p>
          <p>
            Régime de TVA applicable : [À COMPLÉTER : régime de TVA applicable — franchise en base de TVA
            (mention « TVA non applicable, art. 293 B du CGI ») si non assujetti, ou régime standard avec
            application du taux du pays du client et déclaration via le guichet unique OSS si assujetti].
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Modalités de mise à disposition</h2>
          <p>
            L&apos;accès au contenu numérique acheté est fourni immédiatement après confirmation du
            paiement, via l&apos;espace « Mes achats » du compte client et par email de confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Conditions de licence</h2>
          <p>
            L&apos;achat d&apos;un produit Juriskills accorde un droit d&apos;usage personnel, non
            exclusif et non cessible. La revente, la diffusion, le partage ou la mise à disposition de
            tout ou partie du contenu à des tiers, à titre gratuit ou onéreux, est strictement interdite
            sans autorisation écrite préalable de Juriskills.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Garanties légales</h2>
          <p>
            Tout achat bénéficie, sans frais supplémentaires, de la garantie légale de conformité (articles
            L217-3 et suivants du Code de la consommation) et de la garantie relative aux défauts de la
            chose vendue, dans les conditions de l&apos;article 1641 du Code civil (garantie des vices
            cachés).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Droit de rétractation</h2>
          <p>
            Conformément à l&apos;article L221-18 du Code de la consommation, le client dispose en
            principe d&apos;un délai de 14 jours calendaires pour exercer son droit de rétractation, sans
            avoir à justifier de motifs.
          </p>
          <p>
            Toutefois, s&apos;agissant d&apos;un contenu numérique non fourni sur support matériel,
            conformément à l&apos;article L221-28 13° du Code de la consommation, le client qui demande
            expressément l&apos;exécution immédiate du contrat (accès immédiat au contenu) et qui reconnaît
            renoncer ainsi à son droit de rétractation — via la case à cocher présentée avant le paiement —
            ne peut plus exercer ce droit une fois l&apos;exécution commencée. Cette renonciation expresse
            est confirmée par écrit au client dans l&apos;email de confirmation de commande, avec sa date
            et son heure.
          </p>
          <p>
            Lorsque le droit de rétractation n&apos;a pas été expressément écarté dans les conditions
            ci-dessus, le client peut notifier sa décision de rétractation au moyen du formulaire type
            suivant, adressé à l&apos;adresse de contact indiquée dans les mentions légales :
          </p>
          <blockquote>
            <p>
              À l&apos;attention de [À COMPLÉTER : nom / raison sociale, adresse, email de l&apos;éditeur]
              — Je/nous notifie/notifions par la présente ma/notre rétractation du contrat portant sur la
              vente du produit numérique ci-dessous :
            </p>
            <p>
              Commandé le : ……………… — Nom du consommateur : ……………… — Adresse du consommateur : ………………
              — Signature du consommateur (uniquement en cas de notification du présent formulaire sur
              papier) — Date :
            </p>
          </blockquote>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Réclamation et médiation</h2>
          <p>
            En cas de litige, le client peut adresser une réclamation à Juriskills aux coordonnées
            indiquées dans les mentions légales. À défaut de résolution amiable, le client a le droit de
            recourir gratuitement au médiateur de la consommation suivant :
            [À COMPLÉTER : nom et coordonnées du médiateur de la consommation adhéré].
          </p>
          <p>
            Le client peut également recourir à la plateforme européenne de règlement en ligne des litiges
            (ODR) : <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Loi applicable et juridiction compétente</h2>
          <p>
            Les présentes conditions générales de vente sont soumises au droit français. En cas de litige
            et à défaut de résolution amiable, les tribunaux du ressort du siège social de Juriskills sont
            seuls compétents, sous réserve des règles impératives de compétence applicables au
            consommateur.
          </p>
        </section>
      </div>
    </div>
  );
}
