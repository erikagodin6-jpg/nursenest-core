import assert from "node:assert/strict";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import { filterIndexablePublicUrls, isValidPublicUrl } from "@/lib/seo/public-url-validator";

const origin = CANONICAL_PRODUCTION_ORIGIN;

test("isValidPublicUrl rejects auth noindex paths", () => {
  const r = isValidPublicUrl(`${origin}/login`, { origin });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "auth_noindex_path");
});

test("isValidPublicUrl rejects /seo rewrite surface", () => {
  const r = isValidPublicUrl(`${origin}/seo/nclex-rn-exam-prep`, { origin });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "blocked_system_prefix");
});

test("isValidPublicUrl rejects query strings (non-canonical)", () => {
  const r = isValidPublicUrl(`${origin}/pricing?utm=1`, { origin });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "has_query_or_hash");
});

test("isValidPublicUrl rejects locale + exam country pattern", () => {
  const r = isValidPublicUrl(`${origin}/fr/us/np/fnp`, { origin });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "disallowed_locale_regional_shape");
});

test("isValidPublicUrl rejects locale + default-only expansion exam hub", () => {
  const r = isValidPublicUrl(`${origin}/fr/exams/philippines`, { origin });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "disallowed_locale_regional_shape");
});

test("filterIndexablePublicUrls drops bad URLs", () => {
  const out = filterIndexablePublicUrls(
    [`${origin}/pricing`, `${origin}/login`, `${origin}/blog`],
    "test",
    "test_reject",
    origin,
  );
  assert.deepEqual(out, [`${origin}/pricing`, `${origin}/blog`]);
});
