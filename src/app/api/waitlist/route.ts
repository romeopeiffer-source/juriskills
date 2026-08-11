import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { getResend, EMAIL_FROM } from "@/lib/resend";

const waitlistSchema = z.object({
  email: z.string().trim().email().max(200),
  category: z.enum(["PROMPT", "SKILL", "AGENT"]),
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

  try {
    await prisma.waitlistSignup.create({
      data: { email, category: parsed.data.category },
    });
  } catch (err: unknown) {
    const isDuplicate =
      typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
    if (isDuplicate) {
      return NextResponse.json({ alreadySubscribed: true });
    }
    console.error("Erreur lors de l'inscription à la liste d'attente :", err);
    return NextResponse.json({ error: "Une erreur est survenue. Réessaie plus tard." }, { status: 500 });
  }

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Tu es sur la liste d'attente Juriskills",
      html: `
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

  return NextResponse.json({ success: true });
}
