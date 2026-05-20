#!/usr/bin/env node
/**
 * Static audit: critical `EXACT` entries in legacy-marketing-routes must not send exam intent to pricing.
 * Run: `node nursenest-core/scripts/audit-critical-marketing-hrefs.mjs` from repo root, or from nursenest-core/.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const loaderPath = join(__dirname, "../src/lib/legacy-marketing-routes.ts");
const src = readFileSync(loaderPath, "utf8");

const checks = [
  { re: /["']\/exam-prep["']\s*:\s*["']\/lessons["']/, msg: "/exam-prep must map to /lessons" },
  { re: /["']\/nclex-rn["']\s*:\s*["']\/lessons["']/, msg: "/nclex-rn must map to /lessons" },
  { re: /["']\/rex-pn["']\s*:\s*["']\/canada\/rpn\/rex-pn["']/, msg: "/rex-pn must map to /canada/rpn/rex-pn" },
  { re: /["']\/exam-prep["']\s*:\s*["']\/pricing["']/, msg: "/exam-prep must NOT map to /pricing", invert: true },
];

let failed = false;
for (const c of checks) {
  const hit = c.re.test(src);
  const ok = c.invert ? !hit : hit;
  if (!ok) {
    console.error("FAIL:", c.msg);
    failed = true;
  }
}

if (failed) {
  console.error("\n[audit-critical-marketing-hrefs] FAILED");
  process.exit(1);
}
console.log("[audit-critical-marketing-hrefs] OK —", checks.filter((c) => !c.invert).length, "positive checks + pricing regression guard");
