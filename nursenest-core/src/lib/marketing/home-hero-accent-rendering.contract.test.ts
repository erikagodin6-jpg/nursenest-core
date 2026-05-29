import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const heroCss = readFileSync("src/app/styles/marketing/hero.css", "utf8");
const themeOverridesCss = readFileSync(
  "src/app/styles/marketing/theme-overrides.css",
  "utf8",
);
const readabilityCss = readFileSync(
  "src/app/styles/marketing/readability-theme-hotfix.css",
  "utf8",
);
const combinedCss = [heroCss, themeOverridesCss, readabilityCss].join("\n");

const requiredThemeIds = [
  "ocean",
  "blossom",
  "midnight",
  "aurora",
  "sunset",
] as const;
const requiredTokens = [
  "--hero-accent-start",
  "--hero-accent-middle",
  "--hero-accent-end",
  "--hero-accent-solid-fallback",
] as const;

function themeBlocks(themeId: string): string[] {
  const selectorRe = new RegExp(
    `html\\[data-theme="${themeId}"\\][^{]*\\.nn-home-marketing-rich-hero\\s*\\{`,
    "g",
  );
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = selectorRe.exec(combinedCss))) {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = combinedCss.indexOf("\n}", bodyStart);
    if (bodyEnd !== -1) blocks.push(combinedCss.slice(bodyStart, bodyEnd));
  }
  return blocks;
}

function mergedThemeBlock(themeId: string): string {
  return themeBlocks(themeId).join("\n");
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(channelToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenHex(
  block: string,
  token: (typeof requiredTokens)[number],
): string {
  const match = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})\\b`).exec(block);
  if (match) return match[1];
  const varMatch = new RegExp(`${token}:\\s*var\\((--[a-zA-Z0-9-]+)\\)`).exec(
    block,
  );
  if (varMatch) {
    const resolved = new RegExp(
      `${varMatch[1]}:\\s*(#[0-9a-fA-F]{6})\\b`,
    ).exec(block);
    assert.ok(resolved, `missing resolved ${varMatch[1]} for ${token}`);
    return resolved[1];
  }
  assert.fail(`missing ${token}`);
}

describe("homepage hero accent rendering", () => {
  it("defines dedicated hero accent tokens for every public marketing theme", () => {
    for (const themeId of requiredThemeIds) {
      const block = mergedThemeBlock(themeId);
      assert.ok(block, `${themeId} must define a homepage hero block`);
      for (const token of requiredTokens) {
        assert.match(
          block,
          new RegExp(`${token}:\\s*#[0-9a-fA-F]{6}\\b`),
          `${themeId} missing ${token}`,
        );
      }
    }
  });

  it("keeps accent token colors readable on light and dark hero backgrounds", () => {
    const lightThemes = ["ocean", "blossom", "aurora", "sunset"] as const;
    for (const themeId of lightThemes) {
      const block = mergedThemeBlock(themeId);
      for (const token of requiredTokens) {
        const ratio = contrastRatio(tokenHex(block, token), "#ffffff");
        assert.ok(
          ratio >= 4.5,
          `${themeId} ${token} contrast ${ratio.toFixed(2)} must be >= 4.5 on light hero`,
        );
      }
    }

    const midnightBlock = mergedThemeBlock("midnight");
    for (const token of requiredTokens) {
      const ratio = contrastRatio(tokenHex(midnightBlock, token), "#020617");
      assert.ok(
        ratio >= 4.5,
        `midnight ${token} contrast ${ratio.toFixed(2)} must be >= 4.5 on dark hero`,
      );
    }
  });

  it("uses darker Blossom theme-owned accent variables with a pink to lavender to sky progression", () => {
    const block = mergedThemeBlock("blossom");
    assert.match(block, /--blossom-hero-accent-pink:\s*#[0-9a-fA-F]{6}\b/);
    assert.match(
      block,
      /--blossom-hero-accent-lavender:\s*#[0-9a-fA-F]{6}\b/,
    );
    assert.match(block, /--blossom-hero-accent-sky:\s*#[0-9a-fA-F]{6}\b/);
    assert.match(
      block,
      /--hero-accent-start:\s*var\(--blossom-hero-accent-pink\)/,
    );
    assert.match(
      block,
      /--hero-accent-middle:\s*var\(--blossom-hero-accent-lavender\)/,
    );
    assert.match(
      block,
      /--hero-accent-end:\s*var\(--blossom-hero-accent-sky\)/,
    );
    for (const token of requiredTokens) {
      const ratio = contrastRatio(tokenHex(block, token), "#fff9fb");
      assert.ok(
        ratio >= 4.5,
        `blossom ${token} contrast ${ratio.toFixed(2)} must remain readable on Blossom paper`,
      );
    }
  });

  it("keeps accent words crisp without glow, shadow, blend, or opacity tricks", () => {
    const accentRule =
      /\.nn-home-marketing-rich-hero \.nn-hero-headline-emphasis,[\s\S]*?\.nn-home-marketing-rich-hero \.nn-blossom-hero-gradient-copy\s*\{([\s\S]*?)\n\}/.exec(
        heroCss,
      );
    assert.ok(accentRule, "missing homepage accent rule");
    const body = accentRule[1];
    assert.match(body, /text-shadow:\s*none/);
    assert.match(body, /filter:\s*none/);
    assert.match(body, /mix-blend-mode:\s*normal/);
    assert.match(body, /opacity:\s*1/);
    assert.doesNotMatch(body, /drop-shadow|blur\(|0 0 \d/i);
  });

  it("keeps readable solid color fallback before clipped gradient support", () => {
    const accentRule =
      /\.nn-home-marketing-rich-hero \.nn-hero-headline-emphasis,[\s\S]*?\.nn-home-marketing-rich-hero \.nn-blossom-hero-gradient-copy\s*\{([\s\S]*?)\n\}/.exec(
        heroCss,
      );
    assert.ok(accentRule, "missing homepage accent rule");
    assert.match(accentRule[1], /color:\s*var\(--hero-accent-solid-fallback\)/);
    assert.match(
      accentRule[1],
      /-webkit-text-fill-color:\s*var\(--hero-accent-solid-fallback\)/,
    );
    assert.match(
      heroCss,
      /@supports \(\(background-clip:\s*text\) or \(-webkit-background-clip:\s*text\)\)/,
    );
  });

  it("reduces local visual noise directly behind the headline", () => {
    assert.match(
      heroCss,
      /\.nn-home-marketing-rich-hero \.nn-hero-headline-visual::before\s*\{[\s\S]*opacity:\s*0\.24/s,
    );
    assert.match(heroCss, /filter:\s*none;\n\s*will-change:\s*auto;/);
    assert.doesNotMatch(
      heroCss,
      /\.nn-home-marketing-rich-hero \.nn-hero-headline-visual::before\s*\{[\s\S]*filter:\s*blur\(34px\)/,
    );
  });

  it("does not reintroduce accent glow through the readability hotfix", () => {
    const hotfixAccentRule =
      /\.nn-home-marketing-rich-hero \.nn-hero-headline-emphasis,[\s\S]*?\.nn-home-marketing-rich-hero \.nn-blossom-hero-gradient-copy\s*\{([\s\S]*?)\n\}/.exec(
        readabilityCss,
      );
    assert.ok(hotfixAccentRule, "missing readability hotfix accent rule");
    assert.doesNotMatch(readabilityCss, /font-size:\s*clamp\(3rem/);
    assert.doesNotMatch(
      readabilityCss,
      /background-image:\s*none\s*!important/,
    );
    assert.doesNotMatch(hotfixAccentRule[1], /drop-shadow/);
    assert.match(hotfixAccentRule[1], /text-shadow:\s*none\s*!important/);
    assert.match(hotfixAccentRule[1], /filter:\s*none\s*!important/);
  });
});
