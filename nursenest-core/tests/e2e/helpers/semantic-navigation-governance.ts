/**
 * Playwright helpers for semantic navigation release gate.
 */

import type { Page } from "@playwright/test";
import { ACADEMY_PATHNAME_REGISTRY, normalizeEducationalPathname } from "@/lib/breadcrumbs/pathname-normalization";

export function countBreadcrumbListInHtml(html: string): number {
  return html.match(/"@type"\s*:\s*"BreadcrumbList"/g)?.length ?? 0;
}

export async function captureBreadcrumbGovernanceSnapshot(page: Page, pathname: string) {
  const html = await page.content();
  const trailLabels = await page
    .locator('[aria-label="Breadcrumb"] a, [aria-label="Breadcrumb"] span')
    .allTextContents()
    .catch(() => [] as string[]);
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleLogs.push(msg.text().slice(0, 200));
    }
  });
  return {
    pathname: normalizeEducationalPathname(pathname),
    breadcrumbListCount: countBreadcrumbListInHtml(html),
    trailLabels: trailLabels.map((t) => t.trim()).filter(Boolean),
    registryMatch: pathname in ACADEMY_PATHNAME_REGISTRY,
    consoleLogs,
    htmlSnippet: html.slice(0, 4000),
  };
}

export async function assertIndexableBreadcrumbSchema(page: Page, pathname: string) {
  const snapshot = await captureBreadcrumbGovernanceSnapshot(page, pathname);
  if (snapshot.breadcrumbListCount > 1) {
    throw new Error(
      `BreadcrumbList violation on ${pathname}: count=${snapshot.breadcrumbListCount}`,
    );
  }
  return snapshot;
}

export async function assertLearnerNoBreadcrumbSchema(page: Page, pathname: string) {
  const snapshot = await captureBreadcrumbGovernanceSnapshot(page, pathname);
  if (snapshot.breadcrumbListCount > 0) {
    throw new Error(`Learner schema leakage on ${pathname}: count=${snapshot.breadcrumbListCount}`);
  }
  return snapshot;
}
