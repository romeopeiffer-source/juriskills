/**
 * One-off script: backfills WaitlistSignup(category: "NEWSLETTER") rows for existing users who already
 * opted into the newsletter at registration (User.newsletterOptIn = true), so the admin "liste d'attente"
 * NEWSLETTER export reflects every subscriber, not just those who came through the homepage free-prompt form.
 * Does not send the welcome email — these users already opted in previously, no need to re-notify them.
 * Usage: npx tsx scripts/backfill-newsletter-waitlist.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { newsletterOptIn: true },
    select: { email: true },
  });

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    try {
      await prisma.waitlistSignup.create({
        data: { email: user.email.toLowerCase(), category: "NEWSLETTER" },
      });
      created++;
    } catch (err: unknown) {
      const isDuplicate =
        typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
      if (!isDuplicate) throw err;
      skipped++;
    }
  }

  console.log(`Backfill terminé : ${created} inscription(s) ajoutée(s), ${skipped} déjà présente(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
