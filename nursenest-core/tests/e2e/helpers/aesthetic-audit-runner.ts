/**
 * Per-test runner — orchestrates heuristics + token audit + baseline diff +
 * Figma parity and writes the shard. Specs call {@link runAestheticAudit}
 * once after the page is fully settled and the latest screenshot is on disk.
 *
 * Keeps the spec body small and the policy in one place.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import {
  BASELINE_ROOT,
  FIGMA_BASELINE_ROOT,
  FIGMA_FRAME_MAP,
  REPO_ROOT,
  figmaFrameKey,
  figmaParityEnabled,
  type AestheticRouteId,
  type AestheticThemeId,
  type ViewportId,
} from "./aesthetic-audit-config";
import {
  attachHeuristicsToCollector,
  collectHeuristics,
} from "./aesthetic-layout-heuristics";
import {
  attachTokenAuditToCollector,
  collectTokenAudit,
} from "./aesthetic-token-audit";
import {
  AestheticIssueCollector,
  defaultDiffOverlayPathForScreenshot,
  diffPngFiles,
  resolveBaselinePath,
  writeBaselineDiffOverlayPng,
} from "./aesthetic-regression";

export interface RunAestheticAuditArgs {
  page: Page;
  /** Stable route identifier (e.g. "public-home", "auth-dashboard"). */
  route: AestheticRouteId;
  theme: AestheticThemeId;
  viewport: ViewportId;
  /** Absolute path of the screenshot just captured by Playwright. */
  screenshotPath: string;
  /** Toggle heuristics off for specific specs that target chrome-only. */
  skipHeuristics?: boolean;
  /** Toggle token audit off for marketing routes where copy is data-driven. */
  skipTokenAudit?: boolean;
}

export async function runAestheticAudit(args: RunAestheticAuditArgs): Promise<void> {
  const collector = new AestheticIssueCollector(args.route, args.theme, args.viewport);

  if (!args.skipHeuristics) {
    try {
      const h = await collectHeuristics(args.page, args.viewport);
      attachHeuristicsToCollector(collector, h);
    } catch (err) {
      collector.recordStability(
        "heuristics-error",
        "cosmetic",
        `Heuristics collection failed: ${(err as Error).message}`,
      );
    }
  }

  if (!args.skipTokenAudit) {
    try {
      const t = await collectTokenAudit(args.page, args.theme);
      attachTokenAuditToCollector(collector, t);
    } catch (err) {
      collector.recordStability(
        "token-audit-error",
        "cosmetic",
        `Token audit failed: ${(err as Error).message}`,
      );
    }
  }

  // Baseline diff — only runs when an approved baseline file exists. The
  // first run after introducing a route therefore stays diff-clean.
  const baselinePath = resolveBaselinePath(args.screenshotPath, BASELINE_ROOT);
  if (baselinePath) {
    const metrics = diffPngFiles(baselinePath, args.screenshotPath);
    collector.attachBaselineDiff(
      metrics,
      path.relative(REPO_ROOT, baselinePath).split(path.sep).join("/"),
    );
    const writeDiff = process.env.AESTHETIC_AUDIT_WRITE_DIFF_PNG?.trim();
    if (writeDiff === "1" || writeDiff?.toLowerCase() === "true") {
      const diffAbs = defaultDiffOverlayPathForScreenshot(args.screenshotPath);
      if (writeBaselineDiffOverlayPng(baselinePath, args.screenshotPath, diffAbs)) {
        collector.setDiffOverlayRelPath(path.relative(REPO_ROOT, diffAbs).split(path.sep).join("/"));
      }
    }
  }

  // Figma parity — opt-in via FIGMA_FRAME_MAP entries.
  if (figmaParityEnabled()) {
    const key = figmaFrameKey(args.route, args.theme, args.viewport);
    const frame = FIGMA_FRAME_MAP[key];
    if (frame?.png) {
      const figmaPath = path.join(FIGMA_BASELINE_ROOT, frame.png);
      if (existsSync(figmaPath)) {
        const metrics = diffPngFiles(figmaPath, args.screenshotPath);
        collector.attachFigmaDrift(
          metrics,
          path.relative(REPO_ROOT, figmaPath).split(path.sep).join("/"),
        );
      }
    }
  }

  collector.flush({
    screenshotAbsPath: args.screenshotPath,
    repoRoot: REPO_ROOT,
  });
}
