import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function isRateLimited(identifier: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await prisma.loginAttempt.count({
    where: { identifier, createdAt: { gte: since } },
  });
  return count >= MAX_ATTEMPTS;
}

export async function recordAttempt(identifier: string): Promise<void> {
  await prisma.loginAttempt.create({ data: { identifier } });
}
