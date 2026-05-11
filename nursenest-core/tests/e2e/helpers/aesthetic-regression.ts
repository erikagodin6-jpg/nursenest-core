/**
 * Visual regression engine — pixel diff, severity scoring, and per-test shard
 * collector that the aggregator (scripts/aesthetic-audit-aggregate-report.mjs)
 * stitches into docs/reports/aesthetic-regression-report.{md,json}.
 *
 * Diffs are computed with `pngjs` (already a dependency); no `pixelmatch`
 * import to avoid adding a top-level package. The metric is a simple
 * per-pixel-channel delta with an anti-aliasing tolerance — sufficient for
 * "did the layout / palette change materially" not full perceptual diffing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
// `pngjs` ships no .d.ts; tests/e2e is excluded from the main tsconfig so this
// `any` import is invisible to typecheck:critical. The shape we use is tiny —
// see {@link PngImage}.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import pngjs from "pngjs";
import {
  classifyDiffSeverity,
  DEFAULT_DIFF_THRESHOLDS,
  resolveDiffThresholds,
  SEVERITY_ORDER,
  SHARDS_DIR,
  type AestheticRouteId,
  type AestheticThemeId,
  type DiffThresholds,
  type Severity,
  type ViewportId,
} from "./aesthetic-audit-config";

export interface DiffMetrics {
  /** Width × height of the compared region (intersection of both images). */
  totalPixels: number;
  /** Pixels whose channel delta exceeds the threshold. */
  changedPixels: number;
  /** Convenience: 100 * changedPixels / totalPixels. */
  changedPercent: number;
  /** Coarse bounding boxes (grid cells) where most change concentrated. */
  hotspots: HotspotRect[];
  /** Width / height of each compared image, for the report. */
  baseline: { width: number; height: number };
  current: { width: number; height: number };
}

export interface HotspotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Fraction of changed pixels inside this hotspot relative to its area. */
  density: number;
}

const CHANNEL_DELTA_THRESHOLD = 32; // 0..255 per channel — fairly forgiving
const HOTSPOT_GRID = 16; // 16×16 coarse grid for hotspot bucketing
const MAX_HOTSPOTS_REPORTED = 6;

interface PngImage {
  width: number;
  height: number;
  data: Uint8Array | Buffer;
}

interface PngModule {
  sync: { read(buf: Buffer): PngImage };
}

const PNG = (pngjs as unknown as { PNG: PngModule }).PNG;

function loadPng(filePath: string): PngImage | null {
  if (!existsSync(filePath)) return null;
  try {
    const buf = readFileSync(filePath);
    return PNG.sync.read(buf);
  } catch {
    return null;
  }
}

/**
 * Per-pixel channel delta diff between two PNGs. Tolerant of small antialiasing
 * differences via {@link CHANNEL_DELTA_THRESHOLD}. Compares the intersection
 * area; mismatched dimensions are surfaced via `baseline` vs `current` sizes.
 */
export function diffPngFiles(
  baselinePath: string,
  currentPath: string,
): DiffMetrics | null {
  const baseline: PngImage | null = loadPng(baselinePath);
  const current: PngImage | null = loadPng(currentPath);
  if (!baseline || !current) return null;

  const w = Math.min(baseline.width, current.width);
  const h = Math.min(baseline.height, current.height);
  const totalPixels = w * h;
  if (totalPixels === 0) {
    return {
      totalPixels: 0,
      changedPixels: 0,
      changedPercent: 0,
      hotspots: [],
      baseline: { width: baseline.width, height: baseline.height },
      current: { width: current.width, height: current.height },
    };
  }

  const cellsX = Math.max(1, Math.ceil(w / HOTSPOT_GRID));
  const cellsY = Math.max(1, Math.ceil(h / HOTSPOT_GRID));
  const grid = new Uint32Array(cellsX * cellsY);

  let changed = 0;
  for (let y = 0; y < h; y++) {
    const baseRow = y * baseline.width * 4;
    const curRow = y * current.width * 4;
    for (let x = 0; x < w; x++) {
      const bi = baseRow + x * 4;
      const ci = curRow + x * 4;
      const dr = Math.abs(baseline.data[bi] - current.data[ci]);
      const dg = Math.abs(baseline.data[bi + 1] - current.data[ci + 1]);
      const db = Math.abs(baseline.data[bi + 2] - current.data[ci + 2]);
      // alpha is ignored — Playwright always emits opaque PNGs from page.screenshot()
      if (dr + dg + db > CHANNEL_DELTA_THRESHOLD * 3) {
        changed++;
        const cx = Math.floor(x / HOTSPOT_GRID);
        const cy = Math.floor(y / HOTSPOT_GRID);
        grid[cy * cellsX + cx]++;
      }
    }
  }

  const hotspots: HotspotRect[] = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === 0) continue;
    const cx = i % cellsX;
    const cy = Math.floor(i / cellsX);
    const cellW = Math.min(HOTSPOT_GRID, w - cx * HOTSPOT_GRID);
    const cellH = Math.min(HOTSPOT_GRID, h - cy * HOTSPOT_GRID);
    const area = cellW * cellH || 1;
    hotspots.push({
      x: cx * HOTSPOT_GRID,
      y: cy * HOTSPOT_GRID,
      w: cellW,
      h: cellH,
      density: grid[i]! / area,
    });
  }
  hotspots.sort((a, b) => b.density - a.density);

  return {
    totalPixels,
    changedPixels: changed,
    changedPercent: (changed / totalPixels) * 100,
    hotspots: hotspots.slice(0, MAX_HOTSPOTS_REPORTED),
    baseline: { width: baseline.width, height: baseline.height },
    current: { width: current.width, height: current.height },
  };
}

export type IssueCategory =
  | "baseline-diff"
  | "figma-drift"
  | "layout-heuristic"
  | "token-violation"
  | "contrast"
  | "stability";

export interface AuditIssue {
  category: IssueCategory;
  severity: Severity;
  /** Short stable identifier (e.g. "horizontal-overflow", "card-height-imbalance"). */
  ruleId: string;
  message: string;
  /** Arbitrary structured detail surfaced verbatim in the JSON report. */
  detail?: Record<string, unknown>;
}

export interface ShardRecord {
  route: AestheticRouteId;
  theme: AestheticThemeId;
  viewport: ViewportId;
  /** Capture status — useful when downstream skipped a route. */
  status: "captured" | "skipped";
  /** Screenshot path relative to the monorepo root. */
  screenshotRelPath: string;
  /** Baseline path if one existed at run time. */
  baselineRelPath?: string;
  /** Figma export path if Figma parity ran. */
  figmaRelPath?: string;
  /** Diff vs baseline (null = no baseline yet). */
  baselineDiff: DiffMetrics | null;
  /** Diff vs Figma export (null = no Figma frame mapped or parity disabled). */
  figmaDiff: DiffMetrics | null;
  /** Effective % thresholds (after route/theme overrides). */
  thresholds: DiffThresholds;
  /** Heuristic + token issues collected during the test run. */
  issues: AuditIssue[];
  /** ISO timestamp. */
  capturedAt: string;
}

/**
 * Per-test collector. One instance per Playwright test (route × theme × viewport).
 * Tests call the typed `record*` helpers then `flush()` after the screenshot is on disk.
 */
export class AestheticIssueCollector {
  readonly route: AestheticRouteId;
  readonly theme: AestheticThemeId;
  readonly viewport: ViewportId;
  private readonly issues: AuditIssue[] = [];
  private baselineDiff: DiffMetrics | null = null;
  private figmaDiff: DiffMetrics | null = null;
  private baselineRelPath: string | undefined;
  private figmaRelPath: string | undefined;

  constructor(route: AestheticRouteId, theme: AestheticThemeId, viewport: ViewportId) {
    this.route = route;
    this.theme = theme;
    this.viewport = viewport;
  }

  recordIssue(issue: AuditIssue): void {
    this.issues.push(issue);
  }

  recordHeuristic(ruleId: string, severity: Severity, message: string, detail?: Record<string, unknown>): void {
    this.issues.push({ category: "layout-heuristic", ruleId, severity, message, detail });
  }

  recordTokenViolation(ruleId: string, severity: Severity, message: string, detail?: Record<string, unknown>): void {
    this.issues.push({ category: "token-violation", ruleId, severity, message, detail });
  }

  recordContrast(severity: Severity, message: string, detail?: Record<string, unknown>): void {
    this.issues.push({ category: "contrast", ruleId: "low-contrast", severity, message, detail });
  }

  recordStability(ruleId: string, severity: Severity, message: string, detail?: Record<string, unknown>): void {
    this.issues.push({ category: "stability", ruleId, severity, message, detail });
  }

  /** Run after the latest screenshot is on disk and a baseline exists. */
  attachBaselineDiff(
    metrics: DiffMetrics | null,
    relBaselinePath: string,
  ): void {
    this.baselineDiff = metrics;
    this.baselineRelPath = relBaselinePath;
    if (!metrics) return;
    const thresholds = resolveDiffThresholds(this.route, this.theme);
    const severity = classifyDiffSeverity(metrics.changedPercent, thresholds);
    if (severity !== "cosmetic" || metrics.changedPercent >= thresholds.cosmetic / 2) {
      this.issues.push({
        category: "baseline-diff",
        ruleId: "pixel-diff",
        severity,
        message: `Baseline pixel diff ${metrics.changedPercent.toFixed(2)}% (${metrics.changedPixels}/${metrics.totalPixels} px)`,
        detail: {
          changedPercent: metrics.changedPercent,
          hotspots: metrics.hotspots,
          baselineDim: metrics.baseline,
          currentDim: metrics.current,
          thresholds,
        },
      });
    }
  }

  /** Optional Figma parity drift — never auto-fixes; reports only. */
  attachFigmaDrift(metrics: DiffMetrics | null, relFigmaPath: string): void {
    this.figmaDiff = metrics;
    this.figmaRelPath = relFigmaPath;
    if (!metrics) return;
    const thresholds = resolveDiffThresholds(this.route, this.theme);
    // Figma parity uses a slightly more permissive band (export pipelines vary)
    const fThresholds: DiffThresholds = {
      cosmetic: thresholds.cosmetic * 2,
      moderate: thresholds.moderate * 2,
      major: thresholds.major * 1.5,
    };
    const severity = classifyDiffSeverity(metrics.changedPercent, fThresholds);
    this.issues.push({
      category: "figma-drift",
      ruleId: "figma-parity",
      severity,
      message: `Figma parity drift ${metrics.changedPercent.toFixed(2)}% — visual mismatch vs approved frame`,
      detail: {
        changedPercent: metrics.changedPercent,
        hotspots: metrics.hotspots,
        baselineDim: metrics.baseline,
        currentDim: metrics.current,
        thresholds: fThresholds,
      },
    });
  }

  /** Maximum severity across all issues recorded so far. */
  maxSeverity(): Severity | null {
    if (this.issues.length === 0) return null;
    let max: Severity = "cosmetic";
    for (const i of this.issues) {
      if (SEVERITY_ORDER[i.severity] > SEVERITY_ORDER[max]) max = i.severity;
    }
    return max;
  }

  /**
   * Write the shard to {@link SHARDS_DIR}. Tests should call once per case.
   * Filename is deterministic so repeat runs overwrite cleanly.
   */
  flush(args: {
    screenshotAbsPath: string;
    repoRoot: string;
    status?: "captured" | "skipped";
  }): void {
    mkdirSync(SHARDS_DIR, { recursive: true });
    const filename = `${this.route}__${this.theme}__${this.viewport}.json`.replace(/[^a-zA-Z0-9_.-]+/g, "-");
    const record: ShardRecord = {
      route: this.route,
      theme: this.theme,
      viewport: this.viewport,
      status: args.status ?? "captured",
      screenshotRelPath: path.relative(args.repoRoot, args.screenshotAbsPath).split(path.sep).join("/"),
      baselineRelPath: this.baselineRelPath,
      figmaRelPath: this.figmaRelPath,
      baselineDiff: this.baselineDiff,
      figmaDiff: this.figmaDiff,
      thresholds: resolveDiffThresholds(this.route, this.theme),
      issues: this.issues,
      capturedAt: new Date().toISOString(),
    };
    writeFileSync(path.join(SHARDS_DIR, filename), JSON.stringify(record, null, 2));
  }
}

/**
 * Convenience: locate the baseline PNG for a given screenshot file. Baselines
 * mirror the screenshot folder structure under {@link BASELINE_ROOT}, keyed by
 * filename. Returns `undefined` when no baseline is approved yet.
 */
export function resolveBaselinePath(
  screenshotAbsPath: string,
  baselineRoot: string,
): string | undefined {
  const filename = path.basename(screenshotAbsPath);
  const candidate = path.join(baselineRoot, filename);
  return existsSync(candidate) ? candidate : undefined;
}

export { DEFAULT_DIFF_THRESHOLDS };
