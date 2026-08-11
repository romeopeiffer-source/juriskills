import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

function generateStrongPassword(length = 20): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*()-_=+";
  const all = upper + lower + digits + symbols;

  const pick = (charset: string) => charset[randomBytes(1)[0] % charset.length];

  const required = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const rest = Array.from({ length: length - required.length }, () => pick(all));

  const combined = [...required, ...rest];
  // Fisher-Yates shuffle using crypto-random indices
  for (let i = combined.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

async function main() {
  const email = process.argv[2] ?? "admin@juriskills.fr";
  const password = generateStrongPassword(20);
  const hash = await bcrypt.hash(password, 12);

  console.log("\n=== Identifiants administrateur Juriskills ===\n");
  console.log(`ADMIN_EMAIL=${email}`);
  console.log(`Mot de passe (à noter maintenant, il ne sera plus jamais affiché) : ${password}\n`);
  const escapedHash = hash.replace(/\$/g, "\\$");

  console.log("Ajoutez ces lignes à votre fichier .env.local :\n");
  console.log(`ADMIN_EMAIL=${email}`);
  console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"`);
  console.log(
    "\n⚠️  Les symboles $ sont échappés (\\$) volontairement : Next.js expanse les $VAR dans les .env,"
  );
  console.log("   même entre guillemets — un hash non échappé serait corrompu au chargement.");
  console.log("\n==============================================\n");
}

main();
