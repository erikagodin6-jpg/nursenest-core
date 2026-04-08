/**
 * Ensures the marketing homepage stack does not regress to obsolete `home.gateway.*` keys.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILES = ["home-restored-client.tsx", "home-landing-sections.tsx"] as const;

describe("homepage marketing i18n key family", () => {
  for (const name of FILES) {
    it(`${name} must not reference home.gateway`, () => {
      const fp = path.join(__dirname, name);
      const src = fs.readFileSync(fp, "utf8");
      assert.ok(!src.includes("home.gateway"), `remove stale home.gateway usage from ${name}`);
    });
  }
});
