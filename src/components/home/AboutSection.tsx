import { BadgeCheck, Clock, Gavel, LifeBuoy, ShieldCheck, Tag } from "lucide-react";
import { TrustStat } from "@/components/home/TrustStat";
import { TestedByAIBadge } from "@/components/ui/TestedByAIBadge";
import { StudentCountBadge } from "@/components/ui/StudentCountBadge";
import { getStudentCount } from "@/config/social-proof";

export async function AboutSection({ compact = false }: { compact?: boolean }) {
  const studentCount = await getStudentCount();

  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Fait par des étudiants qui vivent l&apos;IA au quotidien
            </h2>
          </div>

          <div className="mt-5 space-y-4 text-slate-400">
            <p>
              Juriskills est né dans les couloirs de la fac, entre deux révisions et une conversation sans fin sur
              ce que l&apos;IA pouvait vraiment changer pour les étudiants en droit. On est une bande d&apos;étudiants
              passionnés d&apos;intelligence artificielle, autant que de droit — on passe nos soirées à tester, casser
              et reconstruire des prompts, pas à regarder Netflix.
            </p>
            <p>
              On a vécu la même galère que vous : des heures perdues à chercher le bon prompt, des réponses d&apos;IA
              à moitié fiables, du contenu payant hors de prix pour un budget étudiant. Alors on a décidé de
              construire ce qu&apos;on aurait aimé avoir : des outils IA pensés spécifiquement pour le droit, testés
              en conditions réelles, et vendus à des prix qu&apos;un étudiant peut se permettre.
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span>
                Chaque prompt, skill et agent publié sur Juriskills passe par nos propres agents IA de test avant
                d&apos;être mis en ligne — on vérifie la cohérence juridique, la clarté des réponses et la fiabilité
                avant de vous le proposer.
              </span>
              <TestedByAIBadge />
            </p>
            <p>
              On n&apos;est pas un cabinet, on n&apos;est pas une legaltech financée à coups de millions : on est des
              étudiants qui veulent que d&apos;autres étudiants réussissent, sans y laisser leur bourse.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="font-display text-sm font-semibold text-white">
              Créé par des étudiants, pour des étudiants — et on compte bien le rester.
            </p>
            <StudentCountBadge count={studentCount} />
          </div>

          {!compact && (
            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
              <TrustStat icon={<ShieldCheck className="h-5 w-5" />} label="Paiement 100% sécurisé" value="Stripe Checkout" />
              <TrustStat icon={<BadgeCheck className="h-5 w-5" />} label="Prompts testés & approuvés" value="Testé dans nos laboratoires IA" />
              <TrustStat icon={<Tag className="h-5 w-5" />} label="Qualité testée, prix étudiant" value="Pensé pour votre budget" />
              <TrustStat
                icon={<LifeBuoy className="h-5 w-5" />}
                label="On vous aide à bien démarrer"
                value="Accompagnement à l'installation"
              />
              <TrustStat
                icon={<Gavel className="h-5 w-5" />}
                label="Fonctionne aussi avec les IA spécialisées en droit"
                value="Compatible IA juridiques"
              />
              <TrustStat
                icon={<Clock className="h-5 w-5" />}
                label="Fini les heures perdues à chercher le bon prompt"
                value="Un gain de temps immédiat"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
