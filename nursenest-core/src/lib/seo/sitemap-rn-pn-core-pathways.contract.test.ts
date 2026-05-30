/**
 * RN / PN marketing hubs must stay in the exam-pathway sitemap slice (G-009 SAFE_FOR_AI guard).
 */
import assert from "node:assert/strict";
import test from "node:test";

import { collectExamPathwayUrls } from "./sitemap-static-xml";

test("collectExamPathwayUrls includes US RN, CA RN, US NCLEX-PN, and CA REx-PN marketing roots", async () => {
  const origin = "https://www.example.test";
  const urls = await collectExamPathwayUrls(origin);
  const set = new Set(urls.map((url) => url.trim()));
  assert.ok(set.has(`${origin}/us/rn/nclex-rn`), "expected US RN hub");
  assert.ok(set.has(`${origin}/canada/rn/nclex-rn`), "expected CA RN hub");
  assert.ok(set.has(`${origin}/us/pn/nclex-pn`), "expected US PN / NCLEX-PN hub");
  assert.ok(set.has(`${origin}/canada/pn/rex-pn`), "expected CA REx-PN hub");
});
