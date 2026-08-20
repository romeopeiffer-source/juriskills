export const metadata = { title: "Conditions générales d'utilisation — Juriskills" };

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white">Conditions générales d&apos;utilisation</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-6 text-slate-400">
        <section>
          <h2 className="text-lg font-semibold text-white">1. Accès au site</h2>
          <p>
            Le site juriskills.juristras.eu est accessible gratuitement à tout utilisateur disposant d&apos;un
            accès à internet. La création d&apos;un compte est nécessaire pour acheter et accéder aux
            produits. L&apos;éditeur se réserve le droit de suspendre ou de fermer un compte en cas
            d&apos;usage frauduleux ou contraire aux présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Propriété intellectuelle</h2>
          <p>
            La structure du site, sa charte graphique, sa marque « Juriskills », son logo et sa base de
            données de produits sont la propriété exclusive de l&apos;éditeur ou de ses partenaires. Toute
            reproduction, extraction substantielle ou réutilisation, totale ou partielle, sans autorisation
            écrite préalable est interdite et susceptible d&apos;engager la responsabilité de son auteur.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Limitation de responsabilité</h2>
          <p>
            L&apos;éditeur met tout en œuvre pour assurer la disponibilité et le bon fonctionnement du
            site, sans garantie de continuité absolue. L&apos;éditeur ne saurait être tenu responsable des
            interruptions de service, dysfonctionnements techniques indépendants de sa volonté, ou de
            l&apos;usage qui serait fait des contenus proposés au-delà de leur objet pédagogique et
            méthodologique.
          </p>
        </section>
      </div>
    </div>
  );
}
