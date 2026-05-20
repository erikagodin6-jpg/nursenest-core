/**
 * Ensures the marketing homepage stack does not regress to obsolete `home.gateway.*` keys.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILES = [
  "home-restored-client.tsx",
  "home-landing-sections.tsx",
  "home-how-it-works-section.tsx",
] as const;

describe("homepage marketing i18n key family", () => {
  for (const name of FILES) {
    it(`${name} must not reference obsolete home.gateway keys`, () => {
      const fp = path.join(__dirname, name);

      assert.ok(fs.existsSync(fp), `expected homepage file to exist: ${name}`);

      const src = fs.readFileSync(fp, "utf8");

      assert.ok(
        !/\bhome\.gateway\b/.test(src),
        `remove stale home.gateway usage from ${name}`,
      );
    });
  }
});