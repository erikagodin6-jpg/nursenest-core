#!/usr/bin/env node
/**
 * Phase 6B — production stability env audit (no secret values printed).
 *
 * - Reports PASS / WARN / FAIL sections.
 * - Exit 1 only when `AUDIT_PRODUCTION_STABILITY_STRICT=1` and at least one FAIL item exists.
 * - Self-check: `node scripts/audit-production-stability.mjs --self-check` (internal assertions).
 *
 * See `src/lib/ops/PHASE6B-PRODUCTION-STABILITY.md` for env matrix + Phase 6 hooks.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const strict = /^(1|true|yes)$/i.test(String(process.env.AUDIT_PRODUCTION_STABILITY_STRICT ?? "").trim());

/** @param {string | undefined} v */
function truthy(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function productionLike() {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NURSE_NEST_ENFORCE_CRON_SECRET === "1"
  );
}

function billingSurfaceEnabled() {
  return truthy(process.env.STRIPE_SECRET_KEY) || truthy(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

/** @param {string} name @returns {{ present: boolean }} */
function presenceOnly(name) {
  return { present: truthy(process.env[name]) };
}

/** @returns {{ ok: boolean, reason?: string }} */
function databaseUrlCheck() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return { ok: false, reason: "missing" };
  try {
    const u = new URL(raw);
    const scheme = u.protocol.replace(":", "").toLowerCase();
    if (scheme !== "postgresql" && scheme !== "postgres") {
      return { ok: false, reason: `invalid scheme (${scheme})` };
    }
  } catch {
    return { ok: false, reason: "unparseable URL" };
  }
  return { ok: true };
}

function directUrlPresent() {
  return truthy(process.env.DIRECT_URL) || truthy(process.env.DATABASE_DIRECT_URL);
}

function sessionSigningPresent() {
  return truthy(process.env.AUTH_SECRET) || truthy(process.env.NEXTAUTH_SECRET);
}

function authPublicOriginPresent() {
  return truthy(process.env.AUTH_URL) || truthy(process.env.NEXTAUTH_URL);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--self-check")) {
    runSelfCheck();
    return;
  }

  const pass = [];
  const warn = [];
  /** @type {{ code: string; detail: string }[]} */
  const fail = [];

  const db = databaseUrlCheck();
  if (db.ok) pass.push("DATABASE_URL present and postgres-scheme");
  else fail.push({ code: "database_url", detail: db.reason ?? "invalid" });

  if (sessionSigningPresent()) {
    pass.push("Session signing secret (AUTH_SECRET or NEXTAUTH_SECRET) present");
  } else {
    fail.push({ code: "session_signing", detail: "AUTH_SECRET and NEXTAUTH_SECRET both missing" });
  }

  if (directUrlPresent()) {
    pass.push("DIRECT_URL or DATABASE_DIRECT_URL present (Prisma directUrl / migrate)");
  } else {
    warn.push(
      "DIRECT_URL unset — Prisma schema expects directUrl; env-bootstrap may synthesize from pooled DATABASE_URL; set explicitly for migrate CLI safety",
    );
  }

  const prodish = productionLike();
  if (prodish) {
    if (truthy(process.env.NEXT_PUBLIC_APP_URL)) {
      pass.push("NEXT_PUBLIC_APP_URL present (billing / callbacks)");
    } else {
      warn.push("NEXT_PUBLIC_APP_URL unset — Stripe return URLs and production guards need a public https origin");
    }

    if (truthy(process.env.CRON_SECRET)) {
      pass.push("CRON_SECRET present (POST /api/cron/* bearer)");
    } else {
      warn.push("CRON_SECRET unset — cron routes use bearer auth in production-like envs (see enforce-cron-secret)");
    }

    if (authPublicOriginPresent()) {
      pass.push("AUTH_URL or NEXTAUTH_URL present");
    } else {
      fail.push({ code: "auth_public_origin", detail: "AUTH_URL and NEXTAUTH_URL both missing (Auth.js public origin)" });
    }
  } else {
    if (!authPublicOriginPresent()) {
      warn.push("AUTH_URL / NEXTAUTH_URL unset — required for real sessions in deployed environments");
    } else {
      pass.push("AUTH_URL or NEXTAUTH_URL present");
    }
    if (!truthy(process.env.NEXT_PUBLIC_APP_URL)) {
      warn.push("NEXT_PUBLIC_APP_URL unset — optional locally; required for production billing surfaces");
    }
    if (!truthy(process.env.CRON_SECRET)) {
      warn.push("CRON_SECRET unset — ok for local dev; required for secured cron in production-like envs");
    }
  }

  if (billingSurfaceEnabled()) {
    pass.push("Billing surface indicators present (STRIPE_SECRET_KEY and/or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)");
    if (!truthy(process.env.STRIPE_WEBHOOK_SECRET)) {
      warn.push("STRIPE_WEBHOOK_SECRET missing — Stripe webhooks will reject signatures");
    }
    if (!truthy(process.env.STRIPE_SECRET_KEY) && truthy(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)) {
      warn.push("Publishable Stripe key set without STRIPE_SECRET_KEY — server billing actions unavailable");
    }
  } else {
    warn.push("No Stripe keys detected — billing webhooks/checkout not configured (expected for non-billing envs)");
  }

  if (truthy(process.env.PLAYWRIGHT_BASE_URL)) {
    pass.push("PLAYWRIGHT_BASE_URL present");
  } else {
    warn.push("PLAYWRIGHT_BASE_URL unset — needed for Playwright configs only");
  }

  // Informational: never print values
  console.log("[audit:production-stability] NurseNest production stability env audit\n");
  console.log(`package root: ${pkgRoot}`);
  console.log(`strict (AUDIT_PRODUCTION_STABILITY_STRICT): ${strict ? "1" : "0"}`);
  console.log(`productionLike: ${prodish}\n`);

  console.log("--- Secret / connection vars (presence or length bucket only, never values) ---");
  const dbp = presenceOnly("DATABASE_URL");
  console.log(`  DATABASE_URL: ${dbp.present ? "present" : "missing"}`);
  console.log(`  DIRECT_URL: ${presenceOnly("DIRECT_URL").present ? "present" : "missing"}`);
  console.log(`  DATABASE_DIRECT_URL: ${presenceOnly("DATABASE_DIRECT_URL").present ? "present" : "missing"}`);
  console.log(`  AUTH_SECRET: ${presenceOnly("AUTH_SECRET").present ? "present" : "missing"}`);
  console.log(`  NEXTAUTH_SECRET: ${presenceOnly("NEXTAUTH_SECRET").present ? "present" : "missing"}`);
  const auth = process.env.AUTH_SECRET?.trim();
  const next = process.env.NEXTAUTH_SECRET?.trim();
  const chosen = auth || next;
  if (chosen) {
    const len = chosen.length;
    const bucket = len >= 32 ? ">=32 chars" : len >= 16 ? "16-31 chars" : "<16 chars";
    console.log(`  resolved signing material: length bucket ${bucket} (value not printed)`);
  } else {
    console.log(`  resolved signing material: none`);
  }
  console.log(`  STRIPE_SECRET_KEY: ${presenceOnly("STRIPE_SECRET_KEY").present ? "present" : "missing"}`);
  console.log(`  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${presenceOnly("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY").present ? "present" : "missing"}`);
  console.log(`  STRIPE_WEBHOOK_SECRET: ${presenceOnly("STRIPE_WEBHOOK_SECRET").present ? "present" : "missing"}`);
  console.log(`  NEXT_PUBLIC_APP_URL: ${presenceOnly("NEXT_PUBLIC_APP_URL").present ? "present" : "missing"}`);
  console.log(`  AUTH_URL: ${presenceOnly("AUTH_URL").present ? "present" : "missing"}`);
  console.log(`  NEXTAUTH_URL: ${presenceOnly("NEXTAUTH_URL").present ? "present" : "missing"}`);
  console.log(`  CRON_SECRET: ${presenceOnly("CRON_SECRET").present ? "present" : "missing"}`);
  console.log(`  PLAYWRIGHT_BASE_URL: ${presenceOnly("PLAYWRIGHT_BASE_URL").present ? "present" : "missing"}\n`);

  console.log("=== PASS ===");
  if (pass.length === 0) console.log("  (none)");
  else for (const p of pass) console.log(`  ✓ ${p}`);

  console.log("\n=== WARN ===");
  if (warn.length === 0) console.log("  (none)");
  else for (const w of warn) console.log(`  ! ${w}`);

  console.log("\n=== FAIL (hard production blockers) ===");
  if (fail.length === 0) console.log("  (none)");
  else for (const f of fail) console.log(`  ✗ [${f.code}] ${f.detail}`);

  console.log(
    `\nSummary: ${pass.length} pass row(s), ${warn.length} warn(s), ${fail.length} fail(s). ` +
      (strict ? "STRICT=1 → exit 1 if any FAIL." : "STRICT unset → exit 0 even when FAIL listed (set AUDIT_PRODUCTION_STABILITY_STRICT=1 for predeploy gate)."),
  );
  console.log(`\nSee src/lib/ops/PHASE6B-PRODUCTION-STABILITY.md\n`);

  if (strict && fail.length > 0) {
    process.exit(1);
  }
}

function runSelfCheck() {
  const here = fileURLToPath(import.meta.url);
  const secret = "x".repeat(40);
  const r1 = spawnSync(process.execPath, [here], {
    encoding: "utf8",
    env: {
      ...process.env,
      AUDIT_PRODUCTION_STABILITY_STRICT: "1",
      DATABASE_URL: "",
      AUTH_SECRET: secret,
      NEXTAUTH_SECRET: "",
      NODE_ENV: "development",
      DIRECT_URL: "postgresql://u:p@localhost:5432/db",
    },
  });
  if (r1.status !== 1) {
    console.error("[self-check] expected exit 1 when DATABASE_URL missing under STRICT");
    process.exit(1);
  }
  if (r1.stdout.includes(secret)) {
    console.error("[self-check] secret leaked to stdout");
    process.exit(1);
  }
  const r2 = spawnSync(process.execPath, [here], {
    encoding: "utf8",
    env: {
      ...process.env,
      AUDIT_PRODUCTION_STABILITY_STRICT: "",
      DATABASE_URL: "",
      AUTH_SECRET: secret,
      NODE_ENV: "development",
    },
  });
  if (r2.status !== 0) {
    console.error("[self-check] expected exit 0 when not strict");
    process.exit(1);
  }
  if (r2.stdout.includes(secret)) {
    console.error("[self-check] secret leaked (non-strict run)");
    process.exit(1);
  }
  console.log("[audit:production-stability] --self-check ok");
  process.exit(0);
}

main();
