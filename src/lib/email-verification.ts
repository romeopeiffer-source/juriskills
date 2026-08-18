import { randomInt } from "crypto";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { getFeaturedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/pricing";

const CODE_LENGTH = 6;
const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function generateVerificationCode(): { code: string; expiresAt: Date } {
  const code = randomInt(0, 10 ** CODE_LENGTH).toString().padStart(CODE_LENGTH, "0");
  return { code, expiresAt: new Date(Date.now() + CODE_TTL_MS) };
}

export async function sendVerificationCodeEmail(email: string, name: string, code: string): Promise<void> {
  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `${code} — Vérifie ton adresse email Juriskills`,
      html: `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">Bienvenue, ${name} !</h1>
          <p>Un dernier pas avant de profiter de Juriskills : confirme ton adresse email avec le code suivant.</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4d4696; margin: 24px 0;">${code}</p>
          <p>Ce code expire dans 15 minutes. Saisis-le sur la page de vérification pour activer ton compte.</p>
          <p>L'équipe Juriskills</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de vérification :", err);
  }
}

export async function sendWelcomeEmail(email: string, name: string, siteUrl: string): Promise<void> {
  const featured = await getFeaturedProducts(3);

  const productsHtml = featured.length
    ? featured
        .map(
          (p) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5ea;">
                <a href="${siteUrl}/produits/${p.slug}" style="color:#4d4696; font-weight: bold; text-decoration: none;">${p.name}</a>
                <div style="color:#6b7280; font-size: 13px;">${formatPrice(p.price)}</div>
              </td>
            </tr>
          `
        )
        .join("")
    : "";

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Ton compte Juriskills est activé !",
      html: `
        <div style="font-family: sans-serif; color: #0b0f1a;">
          <h1 style="color: #4d4696;">Merci ${name}, ton adresse email est vérifiée !</h1>
          <p>Ton compte Juriskills est maintenant pleinement actif. Merci de nous faire confiance pour tes révisions.</p>
          ${
            productsHtml
              ? `<p>En attendant, jette un œil à quelques-uns de nos outils IA pensés pour le droit :</p>
                 <table style="width: 100%; border-collapse: collapse;">${productsHtml}</table>`
              : ""
          }
          <p style="margin-top: 24px;"><a href="${siteUrl}/prompts" style="color:#4d4696;">Découvrir tout le catalogue</a></p>
          <p>À très vite,<br/>L'équipe Juriskills</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de bienvenue :", err);
  }
}
