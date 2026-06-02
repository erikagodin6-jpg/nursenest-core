import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const p = new PrismaClient({ log: [] });
const EMAIL = "cnple-e2e-test@nursenest-qa.internal";
const PASSWORD = "NurseNest_E2E_CNPLE_2026!";

const existing = await p.user.findUnique({ where: { email: EMAIL }, select: { id: true, tier: true, country: true } });
if (existing) {
  console.log(JSON.stringify({ action: "existing", id: existing.id.slice(0,8)+"...", tier: existing.tier, country: existing.country }));
  await p.$disconnect(); process.exit(0);
}

const passwordHash = await hash(PASSWORD, 12);
const user = await p.user.create({
  data: {
    email: EMAIL,
    name: "CNPLE E2E Test",
    password: passwordHash,
    tier: "NP",
    country: "CA",
    emailVerified: new Date(),
    role: "USER",
    onboardingComplete: true,
    subscriptions: {
      create: {
        status: "active",
        planCode: "NP_CA_ANNUAL",
        planTier: "NP",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365*24*60*60*1000),
        cancelAtPeriodEnd: false,
      }
    }
  },
  select: { id: true, tier: true, country: true }
});

console.log(JSON.stringify({ action: "created", id: user.id.slice(0,8)+"...", tier: user.tier, country: user.country }));
await p.$disconnect();
