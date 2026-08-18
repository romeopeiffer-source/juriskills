import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";
import { generateVerificationCode, sendVerificationCodeEmail } from "@/lib/email-verification";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
  }

  const identifier = `verify-email-resend:${session.user.id}`;
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

  const { code, expiresAt } = generateVerificationCode();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationCode: code, verificationCodeExpiresAt: expiresAt },
  });

  await sendVerificationCodeEmail(user.email, user.name, code);

  return NextResponse.json({ success: true });
}
