/**
 * Create the first super-admin user when the database has zero staff users.
 * Idempotent: if any staff user exists, exits without changes (use admin-staff-users + reset-staff-user-password instead).
 *
 * Password: STAFF_BOOTSTRAP_PASSWORD (non-interactive) or first line of stdin.
 *
 * Usage:
 *   DATABASE_URL=... STAFF_BOOTSTRAP_PASSWORD='...' npx tsx scripts/bootstrap-super-admin.mts --email admin@yourdomain.com
 *
 * Optional:
 *   STAFF_BOOTSTRAP_NAME="Site Admin"
 *   STAFF_BOOTSTRAP_COUNTRY=US|CA  (default CA)
 */
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, CountryCode, TierCode } from "@prisma/client";

import "../src/lib/db/env-bootstrap";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";
import { createInterface } from "node:readline";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const prisma = new PrismaClient();

const STAFF_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
  UserRole.CONTENT_ADMIN,
  UserRole.SUPPORT_ADMIN,
];

async function readLineStdin(): Promise<string> {
  return await new Promise((resolve, reject) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    let buf = "";
    rl.on("line", (line) => {
      buf = line;
      rl.close();
    });
    rl.on("close", () => resolve(buf));
    rl.on("error", reject);
  });
}

function parseEmail(): string | undefined {
  const idx = process.argv.indexOf("--email");
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1].trim().toLowerCase();
  return process.argv[2]?.startsWith("--") ? undefined : process.argv[2]?.trim().toLowerCase();
}

async function main(): Promise<void> {
  const email = parseEmail();
  if (!email?.includes("@")) {
    console.error("Usage: npx tsx scripts/bootstrap-super-admin.mts --email admin@example.com");
    process.exit(1);
  }

  const existingStaff = await prisma.user.count({
    where: { role: { in: STAFF_ROLES } },
  });
  if (existingStaff > 0) {
    console.log(
      `Staff users already exist (${existingStaff}). No-op. List: npx tsx scripts/admin-staff-users.mts list`,
    );
    process.exit(0);
  }

  const dup = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, role: true },
  });
  if (dup) {
    console.error(
      `User ${dup.email} already exists with role ${dup.role}. Promote first: npx tsx scripts/admin-staff-users.mts promote ${dup.email}`,
    );
    process.exit(1);
  }

  let plain = process.env.STAFF_BOOTSTRAP_PASSWORD?.trim();
  if (!plain) plain = (await readLineStdin()).trim();
  if (!plain) {
    console.error("Set STAFF_BOOTSTRAP_PASSWORD or pipe one line on stdin.");
    process.exit(1);
  }

  const parsed = strongPasswordSchema.safeParse(plain);
  if (!parsed.success) {
    console.error(parsed.error.issues[0]?.message ?? "Invalid password");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(plain, 12);
  plain = "";

  const name = process.env.STAFF_BOOTSTRAP_NAME?.trim() || "Super Admin";
  const countryRaw = process.env.STAFF_BOOTSTRAP_COUNTRY?.trim().toUpperCase();
  const country: CountryCode = countryRaw === "US" ? CountryCode.US : CountryCode.CA;

  const created = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      country,
      tier: TierCode.RN,
      credentialVersion: 0,
    },
    select: { id: true, email: true, role: true },
  });

  console.log(`OK — created ${created.email} id=${created.id.slice(0, 8)}… role=${created.role}`);
  console.log("Sign in at /login with this email and the password you set.");
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
