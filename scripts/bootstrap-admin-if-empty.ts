#!/usr/bin/env npx tsx
/**
 * Creates the first ADMIN user only when the User table has zero rows.
 * Safe to run on deploy: no-op if any user exists.
 *
 *   cd nursenest-core
 *   BOOTSTRAP_ADMIN_EMAIL=you@example.com BOOTSTRAP_ADMIN_PASSWORD='…' npm run db:bootstrap-if-empty
 *
 * Optional: BOOTSTRAP_ADMIN_USERNAME=handle BOOTSTRAP_ADMIN_NAME="Site Admin"
 */
import "../src/lib/db/env-bootstrap";
import { hash } from "bcryptjs";
import { PrismaClient, type CountryCode, type TierCode } from "@prisma/client";
import { strongPasswordSchema } from "../src/lib/auth/password-policy";
import { validateUsernameForSignup } from "../src/lib/auth/username-rules";

const prisma = new PrismaClient();

async function main() {
  let n = 0;
  try {
    n = await prisma.user.count();
  } catch (e) {
    console.error(
      "Cannot count users (migrations missing or DB unreachable):",
      e instanceof Error ? e.message : e,
    );
    process.exit(1);
  }

  if (n > 0) {
    console.log(`db:bootstrap-if-empty: ${n} user(s) already exist — skipping.`);
    return;
  }

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";
  const nameFromEnv = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Admin";
  const country = (process.env.BOOTSTRAP_ADMIN_COUNTRY as CountryCode) || "US";
  const tier = (process.env.BOOTSTRAP_ADMIN_TIER as TierCode) || "RN";
  const usernameRaw = process.env.BOOTSTRAP_ADMIN_USERNAME?.trim();

  if (!email?.includes("@")) {
    console.error("Set BOOTSTRAP_ADMIN_EMAIL to a valid email.");
    process.exit(1);
  }

  const pw = strongPasswordSchema.safeParse(password);
  if (!pw.success) {
    console.error(pw.error.issues[0]?.message ?? "Invalid password.");
    process.exit(1);
  }

  let normalizedUsername: string | undefined;
  if (usernameRaw) {
    const u = validateUsernameForSignup(usernameRaw);
    if (!u.ok) {
      console.error("Invalid BOOTSTRAP_ADMIN_USERNAME.");
      process.exit(1);
    }
    normalizedUsername = u.normalized;
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name: nameFromEnv,
      passwordHash,
      role: "ADMIN",
      country,
      tier,
      ...(normalizedUsername ? { username: normalizedUsername } : {}),
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        created: true,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
