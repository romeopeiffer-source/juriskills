/**
 * One-off script: removes throwaway test accounts created while verifying features in this
 * environment. Scoped strictly to @example.com (RFC 2606 reserved domain — no real user can
 * ever have this address), and skips any account that somehow has real purchases attached.
 * Usage: npx tsx scripts/cleanup-test-accounts.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const testUsers = await prisma.user.findMany({
    where: { email: { endsWith: "@example.com" } },
    select: { id: true, email: true },
  });

  console.log(`Found ${testUsers.length} test user(s) with @example.com emails.`);

  let deleted = 0;
  let skipped = 0;

  for (const u of testUsers) {
    const purchaseCount = await prisma.purchase.count({ where: { userId: u.id } });
    if (purchaseCount > 0) {
      console.log(`Skipping ${u.email} — has ${purchaseCount} purchase(s), not deleting.`);
      skipped++;
      continue;
    }
    await prisma.user.delete({ where: { id: u.id } });
    console.log(`Deleted user: ${u.email}`);
    deleted++;
  }

  const waitlistDeleted = await prisma.waitlistSignup.deleteMany({
    where: { email: { endsWith: "@example.com" } },
  });

  console.log(
    `\nDone. ${deleted} user(s) deleted, ${skipped} skipped (had purchases), ${waitlistDeleted.count} waitlist/newsletter signup(s) removed.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
