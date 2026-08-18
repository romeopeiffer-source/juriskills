import { prisma } from "@/lib/prisma";
import { getResend, EMAIL_FROM } from "@/lib/resend";

/**
 * Single source of truth for "who's on the newsletter": every subscriber, whether they came from the
 * homepage free-prompt form or checked the newsletter box at registration, lands in the same
 * WaitlistSignup(category: "NEWSLETTER") rows — so the admin list/export sees one unified list.
 */
export async function subscribeToNewsletter(
  email: string,
  siteUrl: string
): Promise<{ alreadySubscribed: boolean; freePromptUrl: string }> {
  const normalizedEmail = email.toLowerCase();
  const freePromptUrl = `${siteUrl}/prompt-gratuit-fiche-arret-juriskills.pdf`;

  let alreadySubscribed = false;
  try {
    await prisma.waitlistSignup.create({ data: { email: normalizedEmail, category: "NEWSLETTER" } });
  } catch (err: unknown) {
    const isDuplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
    if (!isDuplicate) throw err;
    alreadySubscribed = true;
  }

  if (!alreadySubscribed) {
    try {
      await getResend().emails.send({
        from: EMAIL_FROM,
        to: normalizedEmail,
        subject: "Ton prompt gratuit Juriskills",
        html: `
          <div style="font-family: sans-serif; color: #0b0f1a;">
            <h1 style="color: #4d4696;">Bienvenue dans la newsletter Juriskills !</h1>
            <p>Comme promis, voici ton prompt gratuit « Fiche d'arrêt guidée pour étudiant en L1 », extrait de notre
            Pack rentrée L1 — à copier-coller directement dans ton IA préférée :</p>
            <p><a href="${freePromptUrl}" style="color:#4d4696;">Télécharger le prompt gratuit</a></p>
            <p>Tu recevras aussi nos prochaines nouveautés et bons plans. Tu peux te désinscrire à tout moment.</p>
            <p>À très vite,<br/>L'équipe Juriskills</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("Échec de l'envoi de l'email de bienvenue newsletter :", err);
    }
  }

  return { alreadySubscribed, freePromptUrl };
}

export function resolveSiteUrl(req: Request): string {
  return (
    req.headers.get("origin") ??
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}
