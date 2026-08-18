import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { subscribeToNewsletter, resolveSiteUrl } from "@/lib/newsletter";
import { generateVerificationCode, sendVerificationCodeEmail } from "@/lib/email-verification";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(100)
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule.")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
  newsletterOptIn: z.boolean().default(false),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Merci de vérifier les informations saisies.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, password, newsletterOptIn } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { code, expiresAt } = generateVerificationCode();

  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      newsletterOptIn,
      role: "CLIENT",
      verificationCode: code,
      verificationCodeExpiresAt: expiresAt,
    },
  });

  await sendVerificationCodeEmail(normalizedEmail, name, code);

  if (newsletterOptIn) {
    try {
      await subscribeToNewsletter(normalizedEmail, resolveSiteUrl(req));
    } catch (err) {
      // Newsletter enrollment is a side effect of registration — a failure here shouldn't fail account creation.
      console.error("Erreur lors de l'inscription à la newsletter pendant l'inscription :", err);
    }
  }

  return NextResponse.json({ success: true });
}
