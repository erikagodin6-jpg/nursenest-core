/**
 * Central configuration for the aesthetic audit / visual regression engine.
 *
 * Adjust diff thresholds, severity gating, route-specific tolerances, and
 * the optional Figma parity map here. Everything below is opt-in via env
 * vars so the default behavior remains "capture + soft-warn" (matching the
 * pre-upgrade audit).
 *
 *   AESTHETIC_AUDIT_BASELINE_DIR    override baseline screenshot folder
 *   AESTHETIC_AUDIT_FIGMA_DIR       override Figma frame folder
 *   AESTHETIC_AUDIT_GATE            "off" | "warn" | "critical" | "major"
 *                                   default "warn" — aggregator never throws,
 *                                   "critical"/"major" sets non-zero exit code
 *   AESTHETIC_AUDIT_FIGMA_PARITY    "0" disables Figma parity comparison
 *
 * See docs/reports/aesthetic-visual-audit.md for the broader system overview.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** tests/e2e/helpers -> … -> nursenest-core app dir */
export const APP_ROOT = path.resolve(HERE, "..", "..", "..");
/** monorepo git root (one level above the Next app) */
export const REPO_ROOT = path.resolve(APP_ROOT, "..");

/** Severity classification used by every audit signal (heuristic / diff / token / Figma). */
export type Severity = "critical" | "major" | "moderate" | "cosmetic";

export const SEVERITY_ORDER: Record<Severity, number> = {
  cosmetic: 0,
  moderate: 1,
  major: 2,
  critical: 3,
};

export interface DiffThresholds {
  /** `% changed pixels` upper bound below which a diff is considered "cosmetic". */
  cosmetic: number;
  /** Below this bound -> "moderate". */
  moderate: number;
  /** Below this bound -> "major". Above -> "critical". */
  major: number;
}

/**
 * Default % changed-pixel thresholds. Conservative so theme-token tweaks and
 * font hinting do not flag every run; aggregate gates further filter noise.
 */
export const DEFAULT_DIFF_THRESHOLDS: DiffThresholds = {
  cosmetic: 0.5,
  moderate: 2.0,
  major: 6.0,
};

export type AestheticRouteId = string;
import type { AestheticThemeId } from "./aesthetic-audit-shared";
export type { AestheticThemeId };
export type ViewportId = "desktop" | "mobile";

export interface ThresholdOverrideKey {
  route?: AestheticRouteId;
  theme?: AestheticThemeId;
  viewport?: ViewportId;
}

/**
 * Route-specific tolerance overrides. Use sparingly — list reasons inline so
 * future maintainers know why a route is allowed to drift more than baseline.
 */
export const ROUTE_DIFF_OVERRIDES: Partial<Record<AestheticRouteId, Partial<DiffThresholds>>> = {
  /** blog article body is partially data-driven and dates shift over time */
  "public-blog-article": { cosmetic: 1.5, moderate: 5.0, major: 12.0 },
  /** blog index can reorder when content is published */
  "public-blog": { cosmetic: 1.0, moderate: 4.0, major: 10.0 },
};

/**
 * Theme-specific tolerance overrides. Midnight is darker so a flipped pixel
 * shows up in the diff but is rarely meaningful; allow a slightly wider band.
 */
export const THEME_DIFF_OVERRIDES: Partial<Record<AestheticThemeId, Partial<DiffThresholds>>> = {
  /** Dark surfaces — anti-aliasing noise reads as changed pixels more often. */
  midnight: { cosmetic: 0.8, moderate: 2.5, major: 7.0 },
  /** Warm gradients / dusk bands — slightly wider cosmetic band than Ocean; gate still catches layout breaks. */
  sunset: { cosmetic: 0.75, moderate: 2.4, major: 6.8 },
  /** Lilac/mint atmospheric glow — similar tolerance to Sunset for soft-edge variance. */
  aurora: { cosmetic: 0.75, moderate: 2.4, major: 6.8 },
};

export function resolveDiffThresholds(
  routeId: AestheticRouteId | undefined,
  theme: AestheticThemeId | undefined,
): DiffThresholds {
  const base = { ...DEFAULT_DIFF_THRESHOLDS };
  const r = routeId ? ROUTE_DIFF_OVERRIDES[routeId] : undefined;
  const t = theme ? THEME_DIFF_OVERRIDES[theme] : undefined;
  return { ...base, ...(r ?? {}), ...(t ?? {}) };
}

/** Classify a measured % changed pixel ratio into a severity. */
export function classifyDiffSeverity(percent: number, thresholds: DiffThresholds): Severity {
  if (percent < thresholds.cosmetic) return "cosmetic";
  if (percent < thresholds.moderate) return "moderate";
  if (percent < thresholds.major) return "major";
  return "critical";
}

/** Filesystem location for approved baseline PNGs (monorepo `docs/screenshots`). */
export const BASELINE_ROOT =
  process.env.AESTHETIC_AUDIT_BASELINE_DIR?.trim() ||
  path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026", "baselines");

/** Filesystem location for exported, approved Figma frames (PNG). Optional. */
export const FIGMA_BASELINE_ROOT =
  process.env.AESTHETIC_AUDIT_FIGMA_DIR?.trim() ||
  path.join(REPO_ROOT, "docs", "screenshots", "aesthetic-audit-2026", "figma");

/** Working folder for per-test shard JSON; the aggregator reads from here. */
export const SHARDS_DIR = path.join(APP_ROOT, ".aesthetic-audit", "shards");

/** Final report destinations. */
export const REPORT_MD_PATH = path.join(REPO_ROOT, "docs", "reports", "aesthetic-regression-report.md");
export const REPORT_JSON_PATH = path.join(REPO_ROOT, "docs", "reports", "aesthetic-regression-report.json");
export const INVENTORY_MD_PATH = path.join(REPO_ROOT, "docs", "reports", "ui-surface-inventory.md");

/**
 * Optional Figma frame map. Populate per route+theme+viewport when an
 * approved Figma export exists. PNG paths are resolved relative to
 * {@link FIGMA_BASELINE_ROOT}. Missing entries simply skip parity checks.
 */
export interface FigmaFrameRef {
  /** Path under FIGMA_BASELINE_ROOT (PNG). */
  png?: string;
  /** Optional Figma file/frame URL for the report. */
  url?: string;
}

export type FigmaFrameMapKey = `${AestheticRouteId}__${AestheticThemeId}__${ViewportId}`;

export const FIGMA_FRAME_MAP: Partial<Record<FigmaFrameMapKey, FigmaFrameRef>> = {
  // Example (kept commented — populate when frames are approved):
  // "public-home__ocean__desktop": { png: "public-home-ocean-desktop.png", url: "https://www.figma.com/..." },
};

export function figmaFrameKey(
  route: AestheticRouteId,
  theme: AestheticThemeId,
  viewport: ViewportId,
): FigmaFrameMapKey {
  return `${route}__${theme}__${viewport}`;
}

/** "off" disables all gating; tests only soft-warn. */
export type AuditGate = "off" | "warn" | "critical" | "major";

export function resolveAuditGate(): AuditGate {
  const raw = (process.env.AESTHETIC_AUDIT_GATE || "").trim().toLowerCase();
  if (raw === "off" || raw === "warn" || raw === "critical" || raw === "major") return raw;
  return "warn";
}

export function figmaParityEnabled(): boolean {
  const raw = (process.env.AESTHETIC_AUDIT_FIGMA_PARITY || "1").trim();
  return raw !== "0" && raw.toLowerCase() !== "false";
}

/**
 * Tap target minimum (CSS px) on mobile viewports. Apple HIG = 44; we set 40
 * as the strict gate to allow 4px line-height / vertical padding wiggle.
 */
export const MOBILE_TAP_TARGET_MIN_PX = 40;

/** Hard floor below which a row of buttons is treated as orphaned / dead. */
export const ORPHAN_BUTTON_VISIBILITY_PX = 8;

/** Cards in a balanced row should not differ in height by more than this ratio. */
export const CARD_HEIGHT_IMBALANCE_RATIO = 1.6;

/** Above this percentage of empty viewport vertical space we flag a layout gap. */
export const EMPTY_VERTICAL_GAP_RATIO = 0.45;
