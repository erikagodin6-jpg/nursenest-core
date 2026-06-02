#!/usr/bin/env npx tsx
import "@/lib/db/script-env-bootstrap";
import { PrismaClient } from "@prisma/client";

const PLACEHOLDER_TOKENS = ["USER","PASSWORD","HOST","PORT","DATABASE","localhost","127.0.0.1","example","changeme"];

type Check = { name: string; pass: boolean; detail: string };
const results: Check[] = [];

function check(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
  const icon = pass ? "PASS" : "FAIL";
  console.log(`[preflight] ${icon}  ${name.padEnd(35)} ${detail}`);
}

async function main() {
  const started = Date.now();

  // 1. Env var presence + placeholder scan
  for (const varName of ["DATABASE_URL", "DIRECT_URL"]) {
    const val = process.env[varName] ?? "";
    if (!val.trim()) { check(varName, false, "not set"); continue; }
    const hits = PLACEHOLDER_TOKENS.filter(t => val.includes(t));
    if (hits.length) { check(varName, false, `placeholder token(s): ${hits.join(", ")}`); continue; }
    try {
      const u = new URL(val);
      if (!/^postgre/.test(u.protocol)) { check(varName, false, `wrong protocol: ${u.protocol}`); continue; }
      if (!u.port || !/^\d+$/.test(u.port)) { check(varName, false, `invalid port: "${u.port}"`); continue; }
      check(varName, true, `valid postgresql URL · port ${u.port} · host ${u.hostname.slice(0,40)}`);
    } catch { check(varName, false, "not a parseable URL"); }
  }

  if (results.some(r => !r.pass)) {
    console.log(`\n[preflight] ABORT — env check failed. Fix DATABASE_URL / DIRECT_URL before publishing.`);
    process.exit(1);
  }

  // 2. Prisma connect
  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$connect();
    check("prisma_connect", true, "connected");
  } catch (e) {
    check("prisma_connect", false, e instanceof Error ? e.message.slice(0,200) : String(e));
    process.exit(1);
  }

  // 3. Read probes
  const readProbes: [string, () => Promise<number>][] = [
    ["read:ExamQuestion", () => prisma.examQuestion.count()],
    ["read:Flashcard", () => prisma.flashcard.count()],
    ["read:PathwayLesson", () => prisma.pathwayLesson.count()],
    ["read:FlashcardDeck", () => prisma.flashcardDeck.count()],
    ["read:Category", () => prisma.category.count()],
  ];
  for (const [name, fn] of readProbes) {
    try { const n = await fn(); check(name, true, `${n} rows`); }
    catch (e) { check(name, false, e instanceof Error ? e.message.slice(0,150) : "error"); }
  }

  // 4. Write probe (transaction rollback)
  try {
    await prisma.$transaction(async tx => {
      await tx.category.upsert({
        where: { slug: "__preflight_canary__" },
        update: { name: "__preflight_canary__" },
        create: { slug: "__preflight_canary__", name: "__preflight_canary__", topicCode: "__preflight_canary__" },
      });
      throw new Error("__preflight_rollback__");
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    check("write_probe", msg === "__preflight_rollback__", msg === "__preflight_rollback__" ? "write + rollback OK" : msg.slice(0,200));
  }

  await prisma.$disconnect().catch(() => {});

  const allPass = results.every(r => r.pass);
  const elapsed = Date.now() - started;
  console.log(`\n[preflight] ${allPass ? "ALL CHECKS PASSED" : "CHECKS FAILED"} (${elapsed}ms)`);
  console.log(JSON.stringify({ pass: allPass, checks: results.length, failed: results.filter(r=>!r.pass).length, elapsedMs: elapsed }));
  process.exit(allPass ? 0 : 1);
}

main().catch(e => { console.error("[preflight] FATAL:", e.message); process.exit(1); });
