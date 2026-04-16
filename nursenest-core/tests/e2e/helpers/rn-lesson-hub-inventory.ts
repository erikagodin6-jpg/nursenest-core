import { expect, type Page } from "@playwright/test";
import { learnerAppMainLandmark, waitForAuthenticatedLearnerShell } from "./paid-learner-shell";

/** Matches {@link LESSON_API_OFFSET_LIMIT.max} — fewer hub round-trips for full inventory. */
export const RN_LESSON_HUB_PAGE_LIMIT_MAX = 50;

const LESSON_DETAIL_PATH = /^\/app\/lessons\/[^/]+$/;

export type HubLessonLinkRow = {
  pathname: string;
  href: string;
  /** First chip text on the card (topic / category), if any. */
  categoryLabel: string | null;
  hubPage: number;
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

/**
 * Scroll the virtualized lesson list until href count stabilizes, then collect unique lesson detail links + optional category chips.
 */
export async function scrollVirtualListAndCollectLessonRows(page: Page, hubPage: number): Promise<HubLessonLinkRow[]> {
  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  const scrollBox = main.locator("div.overflow-auto.rounded-xl").first();
  await expect(scrollBox).toBeVisible({ timeout: 60_000 });

  let stable = 0;
  let lastSize = -1;
  for (let i = 0; i < 100; i++) {
    await scrollBox.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(100);
    const n = await page.evaluate(() => {
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
    });
    if (n === lastSize) {
      stable += 1;
      if (stable >= 4 && n > 0) break;
      if (stable >= 12 && n === 0) break;
    } else {
      stable = 0;
      lastSize = n;
    }
  }

  const rows = await page.evaluate((hubPageNum) => {
    const out: { pathname: string; href: string; categoryLabel: string | null; hubPage: number }[] = [];
    const seen = new Set<string>();
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
      if (seen.has(path)) continue;
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
    return out;
  }, hubPage);

  return rows;
}

export type RnLessonInventory = {
  pathwayId: string;
  limit: number;
  totalReported: number | null;
  pageCount: number;
  /** Unique lesson pathnames → metadata (merged across hub pages). */
  byPath: Map<string, HubLessonLinkRow>;
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

  const firstUrl = buildLessonsHubUrl({ pathwayId, page: 1, limit });
  await page.goto(firstUrl, { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);

  const total = await parseHubLessonTotal(page);
  const pageCount =
    total != null ? Math.max(1, Math.ceil(total / limit)) : (await parseHubPageCountFromNav(page)) ?? 1;

  const mergeRows = (rows: HubLessonLinkRow[]) => {
    for (const row of rows) {
      if (!byPath.has(row.pathname)) {
        byPath.set(row.pathname, row);
      }
    }
  };

  mergeRows(await scrollVirtualListAndCollectLessonRows(page, 1));

  for (let p = 2; p <= pageCount; p++) {
    const url = buildLessonsHubUrl({ pathwayId, page: p, limit });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page);
    mergeRows(await scrollVirtualListAndCollectLessonRows(page, p));
  }

  return {
    pathwayId,
    limit,
    totalReported: total,
    pageCount,
    byPath,
  };
}

export function inventoryToSerializable(inv: RnLessonInventory): {
  pathwayId: string;
  limit: number;
  totalReported: number | null;
  pageCount: number;
  uniqueCount: number;
  lessons: HubLessonLinkRow[];
} {
  const lessons = [...inv.byPath.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
  return {
    pathwayId: inv.pathwayId,
    limit: inv.limit,
    totalReported: inv.totalReported,
    pageCount: inv.pageCount,
    uniqueCount: lessons.length,
    lessons,
  };
}

export { buildLessonsHubUrl };
