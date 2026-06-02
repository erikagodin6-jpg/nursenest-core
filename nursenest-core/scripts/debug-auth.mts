import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const p = new PrismaClient({ log: [] });
const EMAIL = "cnple-e2e-test@nursenest-qa.internal";
const PASSWORD = "NurseNest_E2E_CNPLE_2026!";

const user = await p.user.findFirst({
  where: { OR: [{ email: { equals: EMAIL, mode: "insensitive" } }] },
  select: { id: true, email: true, passwordHash: true, tier: true, country: true, emailVerified: true }
});

if (!user) { console.log("USER NOT FOUND"); process.exit(1); }
console.log("User found:", { id: user.id.slice(0,8)+"...", tier: user.tier, country: user.country, emailVerified: user.emailVerified, hashLen: user.passwordHash?.length });

if (user.passwordHash) {
  const ok = await compare(PASSWORD, user.passwordHash);
  console.log("Password match:", ok);
} else {
  console.log("NO PASSWORD HASH");
}

// Check subscriptions
const sub = await p.subscription.findFirst({ where: { userId: user.id }, select: { status: true, planTier: true, currentPeriodEnd: true } });
console.log("Subscription:", JSON.stringify(sub));

await p.$disconnect();
