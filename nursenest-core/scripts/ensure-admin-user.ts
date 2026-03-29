import "../src/lib/db/env-bootstrap";

/**
 * Idempotent: upserts by email (single row). bcrypt cost 12 — same as signup / Credentials auth.
 * Uses effective DATABASE_URL (production may copy from PROD_DATABASE_URL — see `env-bootstrap`).
 *
 * Update path: passwordHash, role ADMIN, optional username; does not change country/tier/subscription fields.
 * Create path: sets defaults for country/tier only for new rows.
 *
 *   BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_PASSWORD='…' BOOTSTRAP_ADMIN_USERNAME=handle npm run db:ensure-admin
 *
 * CLI (optional, overrides env for that run):
 *   npm run admin:promote -- --email=you@example.com --password='…' --name=Admin
 */
import { hash } from "bcryptjs";
import { PrismaClient, type CountryCode, type Prisma, type TierCode } from "@prisma/client";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";

const prisma = new PrismaClient();

function applyCliArgs(): void {
  for (const a of process.argv.slice(2)) {
    const m = /^--([\w-]+)=(.*)$/.exec(a);
    if (!m) continue;
    const key = m[1];
    const val = m[2];
    if (key === "email") process.env.BOOTSTRAP_ADMIN_EMAIL = val;
    else if (key === "password") process.env.BOOTSTRAP_ADMIN_PASSWORD = val;
    else if (key === "name") process.env.BOOTSTRAP_ADMIN_NAME = val;
    else if (key === "username") process.env.BOOTSTRAP_ADMIN_USERNAME = val;
    else if (key === "country") process.env.BOOTSTRAP_ADMIN_COUNTRY = val;
    else if (key === "tier") process.env.BOOTSTRAP_ADMIN_TIER = val;
  }
}

async function main() {
  applyCliArgs();
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";
  const nameFromEnv = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
  const country = (process.env.BOOTSTRAP_ADMIN_COUNTRY as CountryCode) || "US";
  const tier = (process.env.BOOTSTRAP_ADMIN_TIER as TierCode) || "RN";
  const usernameRaw = process.env.BOOTSTRAP_ADMIN_USERNAME?.trim();
  const username = usernameRaw ? usernameRaw.toLowerCase() : null;

  if (!email || !email.includes("@")) {
    console.error("Set BOOTSTRAP_ADMIN_EMAIL to a valid email.");
    process.exit(1);
  }
  const pw = strongPasswordSchema.safeParse(password);
  if (!pw.success) {
    console.error(pw.error.issues[0]?.message ?? "Invalid BOOTSTRAP_ADMIN_PASSWORD.");
    process.exit(1);
  }

  if (username) {
    const holder = await prisma.user.findUnique({ where: { username }, select: { id: true, email: true } });
    if (holder && holder.email !== email) {
      console.error(`Username "${username}" is already taken by another account (${holder.email}).`);
      process.exit(1);
    }
  }

  const passwordHash = await hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  const updateData: Prisma.UserUpdateInput = {
    passwordHash,
    role: "ADMIN",
  };
  if (username !== null) {
    updateData.username = username;
  }
  if (nameFromEnv) {
    updateData.name = nameFromEnv;
  }

  const createData = {
    email,
    name: nameFromEnv || "Admin",
    passwordHash,
    role: "ADMIN" as const,
    country,
    tier,
    username: username ?? undefined,
  };

  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: updateData,
      })
    : await prisma.user.create({ data: createData });

  console.log("Admin user ready:", user.email, "username=", user.username ?? "(none)", "role=", user.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
