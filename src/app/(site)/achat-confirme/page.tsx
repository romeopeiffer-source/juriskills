import Link from "next/link";
import { CheckCircle2, Mail, Receipt, Star } from "lucide-react";

export const metadata = { title: "Achat confirmé — Juriskills" };

export default function AchatConfirmePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-electric-gradient shadow-glow">
        <CheckCircle2 className="h-8 w-8 text-white" />
      </span>

      <h1 className="mt-6 font-display text-3xl font-bold text-white">Merci pour votre achat !</h1>

      <p className="mt-4 text-slate-400">
        Votre paiement a bien été confirmé. Un email récapitulatif contenant votre facture et l&apos;accès à votre
        produit vient de vous être envoyé.
      </p>

      <div className="glass-card mt-8 w-full space-y-3 p-6 text-left">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-electric-400" />
          <p className="text-sm text-slate-300">
            Vérifiez votre boîte mail (et vos spams) pour retrouver la facture et le lien d&apos;accès à votre
            produit.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-electric-400" />
          <p className="text-sm text-slate-300">
            Votre achat et votre facture restent aussi accessibles à tout moment depuis votre espace "Mes achats".
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Star className="mt-0.5 h-5 w-5 shrink-0 text-electric-400" />
          <p className="text-sm text-slate-300">
            Une fois que vous l&apos;avez testé, pensez à laisser un avis sur le produit : ça aide les autres
            étudiants à choisir en confiance.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/compte/mes-achats" className="btn-primary">
          Voir mes achats
        </Link>
        <Link href="/prompts" className="btn-secondary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
