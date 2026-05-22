import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { AUTH_TRANSITION_I18N } from "./auth-transition-i18n-keys";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../..");

function loadJson(rel: string): Record<string, string> {
  return JSON.parse(readFileSync(join(repoRoot, rel), "utf8")) as Record<string, string>;
}

function collectTransitionKeys(obj: typeof AUTH_TRANSITION_I18N): string[] {
  const keys: string[] = [];
  const walk = (node: object) => {
    for (const v of Object.values(node)) {
      if (typeof v === "string") keys.push(v);
      else if (v && typeof v === "object") walk(v as object);
    }
  };
  walk(obj);
  return keys;
}

const REQUIRED_KEYS = collectTransitionKeys(AUTH_TRANSITION_I18N);

describe("auth.transition locale contract", () => {
  it("marketing-en.json contains all auth.transition keys with non-empty values", () => {
    const en = loadJson("tools/i18n/marketing/marketing-en.json");
    const missing: string[] = [];
    for (const key of REQUIRED_KEYS) {
      const v = en[key];
      if (typeof v !== "string" || v.trim().length === 0) missing.push(key);
    }
    assert.equal(missing.length, 0, `missing EN keys: ${missing.join(", ")}`);
  });

  for (const locale of ["fr", "es"] as const) {
    it(`${locale} locale overlay has auth.transition keys (no raw key leakage path)`, () => {
      const overlay = loadJson(`tools/i18n/marketing/locale/marketing-${locale}.json`);
      const en = loadJson("tools/i18n/marketing/marketing-en.json");
      const gaps: string[] = [];
      for (const key of REQUIRED_KEYS) {
        const v = overlay[key] ?? en[key];
        if (typeof v !== "string" || v.trim().length === 0) gaps.push(key);
        assert.ok(!v.startsWith("auth.transition."), `${locale} leaked raw key: ${key}`);
      }
      assert.equal(gaps.length, 0, `${locale} missing: ${gaps.slice(0, 5).join(", ")}`);
    });
  }
});
