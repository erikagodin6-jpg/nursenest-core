/**
 * Contract checks for premium clinical launch palettes (Blossom, Midnight, Ocean, Forest).
 *
 * Run: `npx tsx --test src/lib/theme/premium-palettes.contract.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_OPTIONS } from "./theme-registry";

const HERE = dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = resolve(HERE, "../../app/theme-palettes.css");
const css = readFileSync(PALETTES_PATH, "utf-8");

const PREMIUM_IDS = ["blossom", "midnight", "ocean", "forest"] as const;
const USER_LABELS = ["Blossom", "Midnight", "Ocean", "Forest"] as const;

/** Harsh / neon pinks disallowed as primary swatch on these themes */
const BANNED_PRIMARY_HEX = [/^#ff1493/i, /^#ff00/i, /^#ff2d/i, /^#ec4899/i];

function blockFor(themeId: string): string | null {
  const re = new RegExp(
    `\\[data-theme="${themeId}"\\]\\s*\\{([\\s\\S]*?)\\n\\}`,
    "gm",
  );
  const matches = [...css.matchAll(re)].map((m) => m[0]);
  return matches.find((block) => /--theme-page-bg:/i.test(block)) ?? matches[0] ?? null;
}

describe("premium palette registry", () => {
  it("defines all four premium theme ids with user-facing labels", () => {
    for (let i = 0; i < PREMIUM_IDS.length; i++) {
      const id = PREMIUM_IDS[i];
      const label = USER_LABELS[i];
      const opt = THEME_OPTIONS.find((t) => t.id === id);
      assert.ok(opt, `missing THEME_OPTIONS entry for ${id}`);
      assert.equal(opt?.label, label);
      assert.equal(opt?.named, true);
      assert.equal(opt?.group, id === "midnight" ? "dark" : "light");
    }
  });

  it("theme picker featured list includes Blossom, Midnight, Ocean, Forest labels in order", () => {
    const named = THEME_OPTIONS.filter((o) => o.named);
    const labels = named.map((o) => o.label);
    for (const L of USER_LABELS) {
      assert.ok(
        labels.includes(L),
        `named theme list should include label "${L}" — got: ${labels.slice(0, 25).join(", ")}…`,
      );
    }
    const idx = (L: string) => labels.indexOf(L);
    assert.ok(idx("Blossom") < idx("Midnight"), "Blossom should appear before Midnight in featured order");
    assert.ok(idx("Midnight") < idx("Ocean"), "Midnight should appear before Ocean");
    assert.ok(idx("Ocean") < idx("Forest"), "Ocean should appear before Forest");
  });

  it("does not use banned neon/hot-pink hex values as primary swatch color", () => {
    for (const id of PREMIUM_IDS) {
      const opt = THEME_OPTIONS.find((t) => t.id === id);
      const hex = opt?.color ?? "";
      for (const banned of BANNED_PRIMARY_HEX) {
        assert.ok(
          !banned.test(hex),
          `${id} primary swatch ${hex} matches disallowed pattern ${banned}`,
        );
      }
    }
  });

  it("optional secondary/accent swatches are set for premium themes", () => {
    for (const id of PREMIUM_IDS) {
      const opt = THEME_OPTIONS.find((t) => t.id === id);
      assert.ok(opt?.swatchSecondary && opt?.swatchAccent, `${id} should define swatchSecondary and swatchAccent`);
    }
  });
});

describe("premium palette CSS", () => {
  for (const id of PREMIUM_IDS) {
    it(`${id} has a complete palette block in theme-palettes.css`, () => {
      const block = blockFor(id);
      assert.ok(block, `missing [data-theme="${id}"] block`);
      assert.match(block, /--theme-page-bg:\s*#/i, `${id} should set --theme-page-bg`);
      assert.match(block, /--theme-primary:\s*#/i, `${id} should set --theme-primary`);
    });

    it(`${id} keeps readable card surfaces in the identity block`, () => {
      const block = blockFor(id);
      assert.ok(block);
      if (id !== "midnight" && /--theme-card-bg:/i.test(block)) {
        assert.match(block, /--theme-card-bg:\s*(#fff\b|#ffffff\b)/i, `${id}: light cards should stay white`);
      }
      if (id === "midnight") {
        assert.match(block, /color-scheme:\s*dark/i, "midnight should opt into dark color scheme");
        assert.match(block, /--theme-card-bg:\s*#/i, "midnight should define a dark card surface");
      }
    });
  }
});
