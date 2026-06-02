/**
 * Architecture contract: PremiumHomepageHero is a server component.
 * It must not contain React hooks or the "use client" directive.
 * Hooks were removed when the hero was converted to an RSC island
 * to eliminate above-fold client hydration cost.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const HERO_PATH = path.resolve(
  process.cwd(),
  "src/components/marketing/home/premium-homepage-hero.tsx",
);

describe("PremiumHomepageHero server-component contract", () => {
  it("does not contain 'use client' directive (server component)", () => {
    const src = fs.readFileSync(HERO_PATH, "utf8");
    // A directive must appear as a standalone string expression at the top of the file.
    // Comments containing the text are allowed.
    const hasDirective = /^['"]use client['"];?\s*$/m.test(src);
    assert.ok(!hasDirective, "'use client' directive must not appear in PremiumHomepageHero");
  });

  it("does not call useMarketingI18n or useNursenestRegion hooks", () => {
    const src = fs.readFileSync(HERO_PATH, "utf8");
    assert.ok(
      !src.includes("useMarketingI18n("),
      "useMarketingI18n hook must not be called in the server component hero",
    );
    assert.ok(
      !src.includes("useNursenestRegion("),
      "useNursenestRegion hook must not be called in the server component hero",
    );
  });

  it("does not import the hook modules from the client i18n / region providers", () => {
    const src = fs.readFileSync(HERO_PATH, "utf8");
    // Strip comment lines before checking for imports so that historical references
    // in JSDoc/inline comments don't trigger false failures.
    const codeOnly = src.split("\n").filter((l) => !l.trimStart().startsWith("*") && !l.trimStart().startsWith("//")).join("\n");
    assert.ok(
      !codeOnly.includes("useMarketingI18n"),
      "useMarketingI18n hook must not be imported or called in the server component hero",
    );
    assert.ok(
      !codeOnly.includes("useNursenestRegion"),
      "useNursenestRegion hook must not be imported or called in the server component hero",
    );
  });
});
