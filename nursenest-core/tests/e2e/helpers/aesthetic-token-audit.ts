/**
 * Token consistency audit — runs alongside the layout heuristics.
 *
 * Catches the classes of drift `.cursor/rules/semantic-color-guardrails.mdc`
 * cares about:
 *   - hardcoded hex/rgb on production learner/marketing surfaces
 *   - semantic-token vs primary-only collapse on data UI
 *   - inconsistent spacing scales (raw px outside the 4-step rhythm)
 *   - theme palette leakage (Ocean tokens visible while Midnight is active)
 *   - dark-mode incompatibilities (light backgrounds left behind on Midnight)
 *
 * These are *signals*, not regressions on their own. Severity is mapped via
 * {@link TOKEN_SEVERITY}; the aggregator applies the configured gate.
 */
import type { Page } from "@playwright/test";
import {
  type AestheticThemeId,
  type Severity,
} from "./aesthetic-audit-config";
import { AestheticIssueCollector } from "./aesthetic-regression";

interface HardcodedColorHit {
  selector: string;
  property: string;
  value: string;
}

interface RawSpacingHit {
  selector: string;
  property: string;
  value: string;
}

interface ThemeLeakageHit {
  property: string;
  expected: string;
  actual: string;
}

interface DarkModeIncompatHit {
  selector: string;
  background: string;
  luminance: number;
}

interface SingleHueDataHit {
  region: string;
  uniqueBrandFills: number;
  semanticHuesUsed: number;
}

export interface TokenAuditResults {
  hardcodedColors: HardcodedColorHit[];
  rawSpacing: RawSpacingHit[];
  themeLeakage: ThemeLeakageHit[];
  darkModeIncompat: DarkModeIncompatHit[];
  singleHueDataUI: SingleHueDataHit[];
}

const TOKEN_SEVERITY: Record<string, Severity> = {
  "hardcoded-color": "moderate",
  "raw-spacing": "cosmetic",
  "theme-leakage": "major",
  "dark-mode-incompat": "critical",
  "single-hue-data-ui": "major",
};

/**
 * Allowed CSS-color keywords that don't need to come from a token. Mostly
 * structural defaults; product UI shouldn't ship these on visual surfaces.
 */
const COLOR_TOKEN_ALLOWLIST = new Set([
  "transparent",
  "currentcolor",
  "currentColor",
  "inherit",
  "initial",
  "unset",
  "none",
  "rgba(0, 0, 0, 0)",
  "rgb(0, 0, 0)", // pure black — almost always intentional shadow / SVG glyph
  "rgb(255, 255, 255)", // pure white — chrome / overlays
]);

/**
 * Light heuristic — does the inline style or computed value look "raw"?
 * Strings produced from CSS custom properties have already been resolved by
 * the browser, so we look for very-specific palette values that should never
 * appear on product surfaces (saturated brand pinks, accent neons, etc.).
 */
const FORBIDDEN_HEX_TOKENS = [
  "#ff00ff",
  "#00ffff",
  "#39ff14",
  "#ff1493",
];

export async function collectTokenAudit(page: Page, theme: AestheticThemeId): Promise<TokenAuditResults> {
  const data = await page.evaluate(
    ({ allow, forbidden, theme }) => {
      const allowSet = new Set(allow);
      const forbiddenSet = new Set(forbidden);

      const cssSelectorFor = (el: Element): string => {
        if (!(el instanceof HTMLElement)) return el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls = el.classList[0] ? `.${el.classList[0]}` : "";
        return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 100);
      };

      const isVisible = (el: HTMLElement): boolean => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 1 && r.height > 1;
      };

      // 1) Hardcoded colors via inline styles (computed colors are already resolved,
      //    so we focus on `style` attributes which often carry hand-typed hex).
      const hardcodedColors: HardcodedColorHit[] = [];
      const styled = document.querySelectorAll<HTMLElement>("[style]");
      styled.forEach((el) => {
        const styleAttr = el.getAttribute("style") || "";
        if (!styleAttr) return;
        const hexMatches = styleAttr.match(/#[0-9a-fA-F]{3,8}\b/g);
        if (hexMatches && hexMatches.length > 0) {
          hardcodedColors.push({
            selector: cssSelectorFor(el),
            property: "style",
            value: hexMatches.slice(0, 3).join(", "),
          });
        }
        // raw rgb() in inline styles (computed colors don't count — they may originate from tokens)
        const rgbMatches = styleAttr.match(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)/g);
        if (rgbMatches && rgbMatches.length > 0) {
          for (const v of rgbMatches.slice(0, 2)) {
            if (allowSet.has(v) || allowSet.has(v.toLowerCase())) continue;
            hardcodedColors.push({
              selector: cssSelectorFor(el),
              property: "style",
              value: v,
            });
          }
        }
      });

      // Scan for forbidden palette tokens anywhere in computed background colors.
      const allEls = Array.from(document.querySelectorAll<HTMLElement>("body *")).slice(0, 2000);
      const forbiddenHits = new Set<string>();
      for (const el of allEls) {
        if (!isVisible(el)) continue;
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        // Convert rgb back to hex for forbidden check
        const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (m) {
          const hex = "#" + [m[1], m[2], m[3]].map((c) => Number(c).toString(16).padStart(2, "0")).join("");
          if (forbiddenSet.has(hex.toLowerCase()) && !forbiddenHits.has(hex)) {
            forbiddenHits.add(hex);
            hardcodedColors.push({
              selector: cssSelectorFor(el),
              property: "backgroundColor",
              value: hex,
            });
          }
        }
      }

      // 2) Raw spacing scale — flag inline-style padding/margin that doesn't
      //    align to the 4px rhythm. Computed values often come from tailwind
      //    which is already aligned; we focus on inline style strings.
      const rawSpacing: RawSpacingHit[] = [];
      styled.forEach((el) => {
        const styleAttr = el.getAttribute("style") || "";
        if (!styleAttr) return;
        const props = styleAttr.split(";").map((s) => s.trim()).filter(Boolean);
        for (const p of props) {
          const [name, valRaw] = p.split(":").map((s) => s.trim());
          if (!name || !valRaw) continue;
          if (!/^(padding|margin|gap|top|left|right|bottom)(-(top|right|bottom|left))?$/.test(name)) continue;
          const pxMatch = valRaw.match(/(-?\d+(?:\.\d+)?)px/);
          if (!pxMatch) continue;
          const px = Math.abs(Number(pxMatch[1]));
          if (px === 0 || px === 1) continue;
          if (px % 4 !== 0 && px % 2 !== 0) {
            rawSpacing.push({ selector: cssSelectorFor(el), property: name, value: valRaw });
          }
        }
      });

      // 3) Theme leakage — does `[data-theme]` match what we think we set?
      //    If a learner page is supposed to be Midnight but the root token
      //    `--theme-surface` reads the Ocean value, something is mounting old
      //    chrome on top of the new theme.
      const themeLeakage: ThemeLeakageHit[] = [];
      const rootStyle = getComputedStyle(document.documentElement);
      const activeTheme = document.documentElement.getAttribute("data-theme") || "";
      if (activeTheme && theme && activeTheme !== theme) {
        themeLeakage.push({
          property: "data-theme",
          expected: theme,
          actual: activeTheme,
        });
      }
      // sanity-check that the brand token resolves to something theme-shaped
      const brand = rootStyle.getPropertyValue("--theme-primary").trim() ||
        rootStyle.getPropertyValue("--semantic-brand").trim();
      if (theme === "midnight") {
        // midnight background should be dark — if --semantic-bg-base is near-white, leak
        const bg = rootStyle.getPropertyValue("--semantic-bg-base").trim();
        if (/^#[fF]{3,6}/.test(bg) || /(255,\s*255,\s*255)/.test(bg)) {
          themeLeakage.push({
            property: "--semantic-bg-base",
            expected: "dark midnight surface",
            actual: bg || "(empty)",
          });
        }
      }

      // 4) Dark-mode incompat — if Midnight is active and large surfaces are
      //    rendering near-white backgrounds, they likely lack dark-mode tokens.
      const darkModeIncompat: DarkModeIncompatHit[] = [];
      if (theme === "midnight" || activeTheme === "midnight") {
        const surfaces = Array.from(document.querySelectorAll<HTMLElement>(
          "main section, [data-nn-section], .nn-section, article",
        )).filter(isVisible).slice(0, 60);
        for (const el of surfaces) {
          const bg = getComputedStyle(el).backgroundColor;
          const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
          if (!m) continue;
          const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          if (lum > 0.8) {
            darkModeIncompat.push({
              selector: cssSelectorFor(el),
              background: `rgb(${r},${g},${b})`,
              luminance: lum,
            });
          }
        }
      }

      // 5) Single-hue data UI — does the page have a dashboard / readiness /
      //    chart-shaped region where every fill is the same color? Picks up
      //    monochrome violations from semantic-color-guardrails.
      const singleHueDataUI: SingleHueDataHit[] = [];
      const dataRegions = Array.from(document.querySelectorAll<HTMLElement>(
        "[data-nn-dashboard], [data-nn-readiness], [data-nn-chart], [class*='Dashboard'], [class*='readiness']",
      ));
      for (const region of dataRegions) {
        const fills = new Set<string>();
        const bars = region.querySelectorAll<HTMLElement>(
          "[class*='progress'], [class*='bar'], [class*='fill'], [data-nn-progress-fill]",
        );
        for (const b of bars) {
          if (!isVisible(b)) continue;
          const bg = getComputedStyle(b).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            fills.add(bg);
          }
        }
        if (bars.length >= 4 && fills.size <= 1) {
          singleHueDataUI.push({
            region: cssSelectorFor(region),
            uniqueBrandFills: fills.size,
            semanticHuesUsed: fills.size,
          });
        }
      }

      return {
        hardcodedColors,
        rawSpacing,
        themeLeakage,
        darkModeIncompat,
        singleHueDataUI,
      };
    },
    {
      allow: Array.from(COLOR_TOKEN_ALLOWLIST),
      forbidden: FORBIDDEN_HEX_TOKENS,
      theme,
    },
  );

  return data as TokenAuditResults;
}

export function attachTokenAuditToCollector(
  collector: AestheticIssueCollector,
  results: TokenAuditResults,
): void {
  for (const hit of results.hardcodedColors.slice(0, 30)) {
    collector.recordTokenViolation(
      "hardcoded-color",
      TOKEN_SEVERITY["hardcoded-color"]!,
      `Hardcoded color ${hit.value} on ${hit.selector} (${hit.property})`,
      hit,
    );
  }
  for (const hit of results.rawSpacing.slice(0, 30)) {
    collector.recordTokenViolation(
      "raw-spacing",
      TOKEN_SEVERITY["raw-spacing"]!,
      `Raw spacing ${hit.value} on ${hit.selector} (${hit.property})`,
      hit,
    );
  }
  for (const hit of results.themeLeakage) {
    collector.recordTokenViolation(
      "theme-leakage",
      TOKEN_SEVERITY["theme-leakage"]!,
      `Theme token leakage: ${hit.property} expected "${hit.expected}", got "${hit.actual}"`,
      hit,
    );
  }
  for (const hit of results.darkModeIncompat.slice(0, 20)) {
    collector.recordTokenViolation(
      "dark-mode-incompat",
      TOKEN_SEVERITY["dark-mode-incompat"]!,
      `Light surface on Midnight: ${hit.selector} (${hit.background}, luminance ${hit.luminance.toFixed(2)})`,
      hit,
    );
  }
  for (const hit of results.singleHueDataUI) {
    collector.recordTokenViolation(
      "single-hue-data-ui",
      TOKEN_SEVERITY["single-hue-data-ui"]!,
      `Data region ${hit.region} uses a single fill across ${hit.uniqueBrandFills} bar(s) (semantic-color-guardrails)`,
      hit,
    );
  }
}
