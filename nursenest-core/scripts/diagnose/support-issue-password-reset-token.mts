/**
 * Create a password reset token for a user (same semantics as forgot-password, no email send).
 * Requires DATABASE_URL and server access — never expose via HTTP.
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/diagnose/support-issue-password-reset-token.mts "user@example.com"
 *
 * Prints one reset URL line for support to share through an authenticated channel.
 */
import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { PASSWORD_RESET_TOKEN_TTL_MS } from "../../src/lib/auth/password-reset-constants";
import { generatePasswordResetRawToken, hashPasswordResetToken } from "../../src/lib/password-reset-crypto";
import { buildPasswordResetUrl } from "../../src/lib/send-password-reset-email";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const emailArg = process.argv[2]?.trim() ?? "";
  if (!emailArg.includes("@")) {
    console.error('Usage: npx tsx scripts/diagnose/support-issue-password-reset-token.mts "user@example.com"');
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: emailArg, mode: "insensitive" } },
    select: { id: true, email: true, passwordHash: true, isDemoUser: true },
  });
  if (!user) {
    console.error("No user found for that email.");
    process.exit(1);
  }
  if (!user.passwordHash) {
    console.error("User has no password hash — password reset link is not applicable.");
    process.exit(1);
  }
  if (user.isDemoUser) {
    console.error("Refusing demo user.");
    process.exit(1);
  }

  const now = new Date();
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, expiresAt: { lt: now } },
  });

  const rawToken = generatePasswordResetRawToken();
  const tokenHash = hashPasswordResetToken(rawToken);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  const url = buildPasswordResetUrl(rawToken);
  console.log(`OK user=${user.email}`);
  console.log("Reset URL (treat as sensitive; single-use):");
  console.log(url);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
