import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { getResend, EMAIL_FROM } from "@/lib/resend";

const waitlistSchema = z.object({
  email: z.string().trim().email().max(200),
  category: z.enum(["PROMPT", "SKILL", "AGENT", "NEWSLETTER"]),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: must stay empty
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Merci de renseigner un email valide." }, { status: 400 });
  }

  // Honeypot: bots tend to fill every field. Pretend success without writing anything.
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const identifier = `waitlist:${parsed.data.category}:${ip}`;
  if (await isRateLimited(identifier)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
  }
  await recordAttempt(identifier);

  const email = parsed.data.email.toLowerCase();

  const siteUrl =
    req.headers.get("origin") ??
    (req.headers.get("host") ? `https://${req.headers.get("host")}` : null) ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  const isNewsletter = parsed.data.category === "NEWSLETTER";
  const freePromptUrl = `${siteUrl}/prompt-gratuit-fiche-arret-juriskills.pdf`;

  try {
    await prisma.waitlistSignup.create({
      data: { email, category: parsed.data.category },
    });
  } catch (err: unknown) {
    const isDuplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
    if (isDuplicate) {
      return NextResponse.json({ alreadySubscribed: true, freePromptUrl: isNewsletter ? freePromptUrl : undefined });
    }
    console.error("Erreur lors de l'inscription à la liste d'attente :", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: isNewsletter ? "Ton prompt gratuit Juriskills" : "Tu es sur la liste d'attente Juriskills",
      html: isNewsletter
        ? `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">Bienvenue dans la newsletter Juriskills !</h1>
          <p>Comme promis, voici ton prompt gratuit « Fiche d'arrêt guidée pour étudiant en L1 », extrait de notre
          Pack rentrée L1 — à copier-coller directement dans ton IA préférée :</p>
          <p><a href="${freePromptUrl}" style="color:#4d4696;">Télécharger le prompt gratuit</a></p>
          <p>Tu recevras aussi nos prochaines nouveautés et bons plans. Tu peux te désinscrire à tout moment.</p>
          <p>À très vite,<br/>L'équipe Juriskills</p>
        </div>
      `
        : `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">C'est noté !</h1>
          <p>On te préviendra dès que les premiers produits de cette catégorie seront en ligne sur Juriskills.</p>
          <p>À très vite,<br/>L'équipe Juriskills</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de confirmation waitlist :", err);
  }

  return NextResponse.json({ success: true, freePromptUrl: isNewsletter ? freePromptUrl : undefined });
}
