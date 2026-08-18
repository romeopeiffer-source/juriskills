import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email-verification";
import { resolveSiteUrl } from "@/lib/newsletter";

const verifySchema = z.object({ code: z.string().trim().length(6) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Merci de saisir un code à 6 chiffres." }, { status: 400 });
  }

  const identifier = `verify-email:${session.user.id}`;
  if (await isRateLimited(identifier)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes." }, { status: 429 });
  }
  await recordAttempt(identifier);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  if (!user.verificationCode || !user.verificationCodeExpiresAt) {
    return NextResponse.json({ error: "Aucun code en attente. Demande un nouveau code." }, { status: 400 });
  }

  if (user.verificationCodeExpiresAt < new Date()) {
    return NextResponse.json({ error: "Ce code a expiré. Demande un nouveau code." }, { status: 400 });
  }

  if (user.verificationCode !== parsed.data.code) {
    return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
  });

  await sendWelcomeEmail(user.email, user.name, resolveSiteUrl(req));

  return NextResponse.json({ success: true });
}
