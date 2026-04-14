/**
 * HTTP smoke tests for marketing exam hub routes. Point at a running server:
 *   MARKETING_HUB_SMOKE_BASE=http://127.0.0.1:3000 npx tsx --test scripts/marketing-exam-hub-smoke.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = (process.env.MARKETING_HUB_SMOKE_BASE ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const HUB_CASES = [
  { path: "/us/rn/nclex-rn", headingIncludes: "NCLEX-RN" },
  { path: "/us/lpn/nclex-pn", headingIncludes: "NCLEX-PN" },
  { path: "/us/np/fnp", headingIncludes: "FNP" },
  { path: "/us/allied/allied-health", headingIncludes: "Allied health" },
  { path: "/canada/rn/nclex-rn", headingIncludes: "NCLEX-RN" },
  { path: "/canada/rpn/rex-pn", headingIncludes: "REx-PN" },
  { path: "/canada/np/cnple", headingIncludes: "CNPLE" },
  { path: "/canada/allied/allied-health", headingIncludes: "Allied health" },
  { path: "/fr/canada/rpn/rex-pn", headingIncludes: "REx-PN" },
] as const;

async function fetchText(path: string): Promise<{ status: number; text: string }> {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const text = await res.text();
  return { status: res.status, text };
}

test("marketing exam hub routes return 200 and no 500 body", async (t) => {
  let firstErr: unknown;
  try {
    await fetchText("/");
  } catch (e) {
    firstErr = e;
  }
  if (firstErr) {
    t.skip(
      `No server at ${BASE} (${firstErr instanceof Error ? firstErr.message : String(firstErr)}). Set MARKETING_HUB_SMOKE_BASE and run again.`,
    );
    return;
  }

  for (const { path, headingIncludes } of HUB_CASES) {
    const { status, text } = await fetchText(path);
    assert.equal(status, 200, `expected 200 for ${path}, got ${status}`);
    assert.match(text, /nn-marketing-h1|text-3xl.*font-extrabold/i, `expected a hub heading marker in HTML for ${path}`);
    assert.ok(
      !text.includes("Internal Server Error"),
      `unexpected 500 body text for ${path}`,
    );
    assert.ok(
      text.toLowerCase().includes(headingIncludes.toLowerCase()),
      `expected "${headingIncludes}" in HTML for ${path}`,
    );
  }
});
