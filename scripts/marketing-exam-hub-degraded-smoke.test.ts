/**
 * HTTP smoke: degraded markers on marketing exam hubs (optional server).
 *   MARKETING_HUB_SMOKE_BASE=http://127.0.0.1:3000 npx tsx --test scripts/marketing-exam-hub-degraded-smoke.test.ts
 *
 * Asserts the page shell renders and either live inventory or the unavailable marker is present
 * (SSR includes client component boundaries; marker appears when snapshot status is not ok).
 */
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = (process.env.MARKETING_HUB_SMOKE_BASE ?? "http://127.0.0.1:3000").replace(/\/$/, "");

async function fetchText(path: string): Promise<{ status: number; text: string }> {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const text = await res.text();
  return { status: res.status, text };
}

test("exam hub degraded markers: 200, no 500 body, inventory or fallback marker", async (t) => {
  try {
    await fetchText("/");
  } catch (e) {
    t.skip(`No server at ${BASE} (${e instanceof Error ? e.message : String(e)})`);
    return;
  }

  const path = "/us/rn/nclex-rn";
  const { status, text } = await fetchText(path);
  assert.equal(status, 200, `expected 200 for ${path}`);
  assert.ok(!text.includes("Internal Server Error"), "unexpected 500 body");
  const hasLive = /data-nn-pathway-inventory|pathwayInventory|Published question/i.test(text);
  const hasUnavailable = text.includes("data-nn-pathway-inventory-unavailable");
  assert.ok(
    hasLive || hasUnavailable,
    "expected either live inventory copy or data-nn-pathway-inventory-unavailable in HTML",
  );
});

test("lessons hub shows zero-catalog panel or lesson list when server up", async (t) => {
  try {
    await fetchText("/");
  } catch (e) {
    t.skip(`No server at ${BASE} (${e instanceof Error ? e.message : String(e)})`);
    return;
  }

  const path = "/us/rn/nclex-rn/lessons";
  const { status, text } = await fetchText(path);
  assert.equal(status, 200);
  assert.ok(!text.includes("Internal Server Error"));
  const zeroPanel = text.includes("data-nn-hub-zero-lesson-catalog");
  const hasLessons = /data-nn-qa-primary-lesson|lesson hub|Lessons/i.test(text);
  assert.ok(zeroPanel || hasLessons, "expected zero-catalog marker or lesson hub content");
});
