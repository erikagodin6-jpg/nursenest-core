import "../src/lib/db/env-bootstrap";

/**
 * Create or promote a user to ADMIN by email + password.
 *
 *   npx tsx scripts/create-admin.ts --email=you@example.com --password='…'
 *
 * Same bcrypt cost and validation as signup / `ensure-admin-user`.
 */
import { hash } from "bcryptjs";
import { PrismaClient, type CountryCode, type TierCode } from "@prisma/client";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";

const prisma = new PrismaClient();

function parseCli(): { email: string; password: string } {
  let email = "";
  let password = "";
  for (const a of process.argv.slice(2)) {
    const m = /^--([\w-]+)=(.*)$/.exec(a);
    if (!m) continue;
    if (m[1] === "email") email = m[2].trim().toLowerCase();
    if (m[1] === "password") password = m[2];
  }
  return { email, password };
}

async function main() {
  const { email, password } = parseCli();

  if (!email || !email.includes("@")) {
    console.error("Usage: npx tsx scripts/create-admin.ts --email=you@example.com --password='…'");
    process.exit(1);
  }
  const pw = strongPasswordSchema.safeParse(password);
  if (!pw.success) {
    console.error(pw.error.issues[0]?.message ?? "Invalid password.");
    process.exit(1);
  }

  const passwordHash = await hash(password, 12);
  const country: CountryCode = "US";
  const tier: TierCode = "RN";

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: { passwordHash, role: "ADMIN" },
      })
    : await prisma.user.create({
        data: {
          email,
          name: "Admin",
          passwordHash,
          role: "ADMIN",
          country,
          tier,
        },
      });

  console.log("Admin ready:", user.email, "role=", user.role, "id=", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
