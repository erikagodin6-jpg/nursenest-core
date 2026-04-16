import { expect, type Page } from "@playwright/test";
import { learnerAppMainLandmark, waitForAuthenticatedLearnerShell } from "./paid-learner-shell";

/** Matches {@link LESSON_API_OFFSET_LIMIT.max} — fewer hub round-trips for full inventory. */
export const RN_LESSON_HUB_PAGE_LIMIT_MAX = 50;

/**
 * Virtualized RN lesson list scrollport: the overflow region inside learner `<main>`.
 * Scoped under `#nn-learner-main` via {@link learnerAppMainLandmark}; uses layout classes
 * (`overflow-auto` + `rounded-xl`). Prefer a `data-nn-*` hook on the hub if one is added later.
 */
export const RN_HUB_LESSON_LIST_SCROLLPORT = "div.overflow-auto.rounded-xl";

/** Hard cap on scroll iterations per hub page (pathological virtual list / runaway loop). */
export const RN_HUB_VIRTUAL_LIST_MAX_SCROLL_ITERATIONS = 120;
/** Require this many consecutive iterations with unchanged unique count before treating the list as settled. */
export const RN_HUB_VIRTUAL_LIST_STABLE_ROUNDS_REQUIRED = 4;
/** If unique count fails to increase this many times in a row (while not yet stable), abort with diagnostics. */
export const RN_HUB_VIRTUAL_LIST_MAX_NO_GROWTH_ITERATIONS = 40;

const LESSON_DETAIL_PATH = /^\/app\/lessons\/[^/]+$/;

export type HubLessonLinkRow = {
  pathname: string;
  href: string;
  /** First chip text on the card (topic / category), if any. */
  categoryLabel: string | null;
  hubPage: number;
};

export type VirtualListScrollDiagnostics = {
  hubPage: number;
  scrollIterations: number;
  stabilized: boolean;
  finalDomUniqueLessonCount: number;
  noGrowthStreakMax: number;
  abortedReason?: "max_iterations" | "no_growth_without_stability";
};

function buildLessonsHubUrl(opts: {
  pathwayId: string;
  page?: number;
  limit?: number;
}): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", opts.pathwayId.trim());
  if (opts.limit != null && opts.limit !== 20) qs.set("limit", String(opts.limit));
  if (opts.page != null && opts.page > 1) qs.set("page", String(opts.page));
  const q = qs.toString();
  return `/app/lessons?${q}`;
}

/**
 * Parse "Showing a–b of n lessons" from hub main (works when pagination nav is omitted for single-page hubs).
 */
export async function parseHubLessonTotal(page: Page): Promise<number | null> {
  const main = learnerAppMainLandmark(page);
  const text = await main.innerText().catch(() => "");
  const m = text.match(/of\s+(\d+)\s+lessons/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/** When total text is missing, derive max page from pagination number links (preserves `page=` query). */
export async function parseHubPageCountFromNav(page: Page): Promise<number | null> {
  const nav = page.getByRole("navigation", { name: "Lesson list pages" });
  if ((await nav.count()) === 0) return null;
  let max = 1;
  const links = nav.locator('a[href*="page="]');
  const n = await links.count();
  for (let i = 0; i < n; i++) {
    const h = await links.nth(i).getAttribute("href");
    const m = h?.match(/[?&]page=(\d+)/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return Number.isFinite(max) ? max : null;
}

function countLessonLinksInDom(): number {
  const seen = new Set<string>();
  for (const a of document.querySelectorAll('#nn-learner-main a[href^="/app/lessons/"]')) {
    const href = a.getAttribute("href");
    if (!href) continue;
    let path = "";
    try {
      path = new URL(href, window.location.origin).pathname;
    } catch {
      continue;
    }
    if (!LESSON_DETAIL_PATH.test(path)) continue;
    seen.add(path);
  }
  return seen.size;
}

/**
 * Scroll the virtualized lesson list until href count stabilizes, then collect unique lesson detail links + optional category chips.
 */
export async function scrollVirtualListAndCollectLessonRows(
  page: Page,
  hubPage: number,
): Promise<{ rows: HubLessonLinkRow[]; diagnostics: VirtualListScrollDiagnostics; domDuplicateHints: number }> {
  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  const scrollBox = main.locator(RN_HUB_LESSON_LIST_SCROLLPORT).first();
  await expect(scrollBox).toBeVisible({ timeout: 60_000 });

  let stable = 0;
  let lastSize = -1;
  let noGrowthStreak = 0;
  let noGrowthStreakMax = 0;
  let scrollIterations = 0;
  let abortedReason: VirtualListScrollDiagnostics["abortedReason"];

  for (; scrollIterations < RN_HUB_VIRTUAL_LIST_MAX_SCROLL_ITERATIONS; scrollIterations++) {
    await scrollBox.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(80);
    const n = await page.evaluate(countLessonLinksInDom);

    if (n === lastSize) {
      stable += 1;
      noGrowthStreak += 1;
      noGrowthStreakMax = Math.max(noGrowthStreakMax, noGrowthStreak);
      if (stable >= RN_HUB_VIRTUAL_LIST_STABLE_ROUNDS_REQUIRED && n > 0) {
        break;
      }
      if (stable >= 12 && n === 0) {
        break;
      }
      if (
        noGrowthStreak >= RN_HUB_VIRTUAL_LIST_MAX_NO_GROWTH_ITERATIONS &&
        n > 0 &&
        stable < RN_HUB_VIRTUAL_LIST_STABLE_ROUNDS_REQUIRED
      ) {
        abortedReason = "no_growth_without_stability";
        break;
      }
    } else {
      stable = 0;
      noGrowthStreak = 0;
      lastSize = n;
    }
  }

  if (scrollIterations >= RN_HUB_VIRTUAL_LIST_MAX_SCROLL_ITERATIONS && abortedReason == null) {
    abortedReason = "max_iterations";
  }

  const finalDomUnique = await page.evaluate(countLessonLinksInDom);
  const stabilized =
    stable >= RN_HUB_VIRTUAL_LIST_STABLE_ROUNDS_REQUIRED && finalDomUnique > 0 && abortedReason == null;

  if (!stabilized && finalDomUnique > 0 && abortedReason != null) {
    throw new Error(
      `[rn-lesson-hub] hubPage=${hubPage} virtual list did not stabilize: ${abortedReason} ` +
        `(domUnique=${finalDomUnique}, scrollIterations=${scrollIterations}, stableStreak=${stable})`,
    );
  }

  const collect = await page.evaluate((hubPageNum) => {
    const out: { pathname: string; href: string; categoryLabel: string | null; hubPage: number }[] = [];
    const seen = new Set<string>();
    let domDuplicateHints = 0;
    for (const a of document.querySelectorAll('#nn-learner-main a[href^="/app/lessons/"]')) {
      const raw = a.getAttribute("href");
      if (!raw) continue;
      let path = "";
      try {
        path = new URL(raw, window.location.origin).pathname;
      } catch {
        continue;
      }
      if (!/^\/app\/lessons\/[^/]+$/.test(path)) continue;
      if (seen.has(path)) {
        domDuplicateHints += 1;
        continue;
      }
      seen.add(path);
      const art = a.closest("article");
      let categoryLabel: string | null = null;
      if (art) {
        const chips = art.querySelectorAll("span");
        for (const span of chips) {
          const cls = span.className ?? "";
          if (typeof cls === "string" && cls.includes("uppercase") && cls.includes("tracking-wide")) {
            const t = span.textContent?.trim();
            if (t) {
              categoryLabel = t;
              break;
            }
          }
        }
      }
      out.push({
        pathname: path,
        href: path,
        categoryLabel,
        hubPage: hubPageNum,
      });
    }
    return { rows: out, domDuplicateHints };
  }, hubPage);

  return {
    rows: collect.rows,
    domDuplicateHints: collect.domDuplicateHints,
    diagnostics: {
      hubPage,
      scrollIterations,
      stabilized,
      finalDomUniqueLessonCount: finalDomUnique,
      noGrowthStreakMax,
      abortedReason,
    },
  };
}

export type RnLessonInventory = {
  pathwayId: string;
  limit: number;
  totalReported: number | null;
  pageCount: number;
  /** Unique lesson pathnames → metadata (merged across hub pages). */
  byPath: Map<string, HubLessonLinkRow>;
  /** When the same pathname is collected again on a later hub page (unexpected overlap). */
  duplicatePathsAcrossPages: number;
  /** Raw DOM duplicate href hints summed per page (cards rendered twice in virtual window). */
  domDuplicateHintsTotal: number;
  /** Pagination / total text consistency checks. */
  paginationAudit: {
    totalFromText: number | null;
    pageCountFromNav: number | null;
    pageCountDerivedFromTotal: number | null;
    pageCountUsed: number;
    inconsistent: boolean;
    inconsistencyDetail?: string;
  };
  perPage: {
    hubPage: number;
    newUniqueThisPage: number;
    cumulativeUnique: number;
    scrollIterations: number;
    virtualListStabilized: boolean;
    domDuplicateHintsOnPage: number;
  }[];
};

/**
 * Walk every paginated hub view for the pathway, scroll each virtual list, merge unique `/app/lessons/:id` rows.
 */
export async function discoverAllRnLessonLinksFromHub(
  page: Page,
  pathwayId: string,
  limit: number = RN_LESSON_HUB_PAGE_LIMIT_MAX,
): Promise<RnLessonInventory> {
  const byPath = new Map<string, HubLessonLinkRow>();
  let duplicatePathsAcrossPages = 0;
  let domDuplicateHintsTotal = 0;
  const perPage: RnLessonInventory["perPage"] = [];

  const firstUrl = buildLessonsHubUrl({ pathwayId, page: 1, limit });
  await page.goto(firstUrl, { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);

  const total = await parseHubLessonTotal(page);
  const pageCountFromNav = await parseHubPageCountFromNav(page);
  const pageCountDerivedFromTotal = total != null ? Math.max(1, Math.ceil(total / limit)) : null;

  let pageCountUsed: number;
  let inconsistent = false;
  let inconsistencyDetail: string | undefined;

  if (pageCountDerivedFromTotal != null && pageCountFromNav != null && pageCountDerivedFromTotal !== pageCountFromNav) {
    inconsistent = true;
    inconsistencyDetail = `total→pages=${pageCountDerivedFromTotal} vs nav pages=${pageCountFromNav}`;
    pageCountUsed = Math.max(pageCountDerivedFromTotal, pageCountFromNav);
  } else if (pageCountDerivedFromTotal != null) {
    pageCountUsed = pageCountDerivedFromTotal;
  } else if (pageCountFromNav != null) {
    pageCountUsed = pageCountFromNav;
  } else {
    pageCountUsed = 1;
  }

  if (inconsistent) {
    throw new Error(`[rn-lesson-hub] pagination inconsistent: ${inconsistencyDetail}`);
  }

  const mergeRows = (rows: HubLessonLinkRow[]) => {
    for (const row of rows) {
      if (!byPath.has(row.pathname)) {
        byPath.set(row.pathname, row);
      } else {
        duplicatePathsAcrossPages += 1;
      }
    }
  };

  const runPage = async (hubPage: number) => {
    const before = byPath.size;
    const { rows, diagnostics, domDuplicateHints } = await scrollVirtualListAndCollectLessonRows(page, hubPage);
    domDuplicateHintsTotal += domDuplicateHints;
    mergeRows(rows);
    const after = byPath.size;
    perPage.push({
      hubPage,
      newUniqueThisPage: after - before,
      cumulativeUnique: after,
      scrollIterations: diagnostics.scrollIterations,
      virtualListStabilized: diagnostics.stabilized,
      domDuplicateHintsOnPage: domDuplicateHints,
    });
  };

  await runPage(1);

  for (let p = 2; p <= pageCountUsed; p++) {
    const url = buildLessonsHubUrl({ pathwayId, page: p, limit });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    await runPage(p);
  }

  return {
    pathwayId,
    limit,
    totalReported: total,
    pageCount: pageCountUsed,
    byPath,
    duplicatePathsAcrossPages,
    domDuplicateHintsTotal,
    paginationAudit: {
      totalFromText: total,
      pageCountFromNav,
      pageCountDerivedFromTotal,
      pageCountUsed,
      inconsistent,
      inconsistencyDetail,
    },
    perPage,
  };
}

export type RnLessonInventoryAuditJson = {
  pathwayId: string;
  limit: number;
  totalReported: number | null;
  totalCollected: number;
  pageCountDetected: number;
  perPageCounts: RnLessonInventory["perPage"];
  duplicatePathCountAcrossPages: number;
  domDuplicateHintsTotal: number;
  uncategorizedCount: number;
  uniqueCount: number;
  lessons: HubLessonLinkRow[];
  paginationAudit: RnLessonInventory["paginationAudit"];
};

export function inventoryToSerializable(inv: RnLessonInventory): RnLessonInventoryAuditJson {
  const lessons = [...inv.byPath.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
  const uncategorizedCount = lessons.filter((r) => !r.categoryLabel?.trim()).length;
  return {
    pathwayId: inv.pathwayId,
    limit: inv.limit,
    totalReported: inv.totalReported,
    totalCollected: lessons.length,
    pageCountDetected: inv.pageCount,
    perPageCounts: inv.perPage,
    duplicatePathCountAcrossPages: inv.duplicatePathsAcrossPages,
    domDuplicateHintsTotal: inv.domDuplicateHintsTotal,
    uncategorizedCount,
    uniqueCount: lessons.length,
    lessons,
    paginationAudit: inv.paginationAudit,
  };
}

export { buildLessonsHubUrl };
