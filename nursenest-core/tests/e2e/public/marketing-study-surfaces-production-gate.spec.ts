/**
 * Manual / production verification: blog index, public flashcard tags + hub, Canada RN lessons hub.
 *
 * Skipped unless `MARKETING_STUDY_SMOKE_BASE_URL` is set (no trailing slash).
 *
 * Pathophysiology blog links: require ≥1 `href` containing `/blog/pp-` unless
 * `MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0`.
 *
 * Run:
 *   cd nursenest-core && npm run qa:marketing-study-production-smoke
 *   (BASE_URL must match the smoke origin so Playwright does not start a local webServer; use
 *   MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0 when production has no /blog/pp-* links yet.)
 *
 * CI: workflow `marketing-study-production-smoke.yml` (workflow_dispatch only).
 */
import { expect, test } from "@playwright/test";

const base = process.env.MARKETING_STUDY_SMOKE_BASE_URL?.trim().replace(/\/$/, "") ?? "";
const rawRequirePp = process.env.MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS?.trim().toLowerCase() ?? "";
const requirePpBlog = rawRequirePp !== "0" && rawRequirePp !== "false";

function printMarketingSmokeReport(
  surface: string,
  row: { routeUrl: string; counts: Record<string, number | string>; firstHrefs: string[] },
): void {
  /* Playwright / CI: stdout is the contract for manual production verification. */
  console.log(`\n[MARKETING_STUDY_SMOKE] ${surface}`);
  console.log("  route URL:", row.routeUrl);
  console.log("  observed counts:", JSON.stringify(row.counts, null, 2));
  console.log(
    "  first 3 hrefs:",
    row.firstHrefs.length ? row.firstHrefs.slice(0, 3).join(" | ") : "(none)",
  );
}

function normalizeHref(h: string, origin: string): string {
  const t = h.trim();
  if (t.startsWith("http")) return t;
  if (t.startsWith("//")) return `https:${t}`;
  return `${origin}${t.startsWith("/") ? "" : "/"}${t}`;
}

test.describe("Marketing study surfaces (env-gated)", () => {
  test.beforeEach(({}, testInfo) => {
    testInfo.skip(!base, "Set MARKETING_STUDY_SMOKE_BASE_URL (e.g. https://www.nursenest.ca)");
  });

  test("blog index — article links, no list error, optional pp-*", async ({ request }) => {
    const routeUrl = `${base}/blog`;
    const res = await request.get(routeUrl, { timeout: 60_000 });
    expect(res.ok(), `GET /blog ${res.status()}`).toBeTruthy();
    const html = await res.text();
    expect(html.length, "blog HTML body").toBeGreaterThan(10_000);
    expect(html, 'must not render "Blog list could not load"').not.toMatch(/Blog list could not load/i);

    const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
      .map((m) => m[1])
      .filter(
        (h) =>
          h.startsWith("/blog/") &&
          !h.startsWith("/blog/tag") &&
          h !== "/blog" &&
          !h.startsWith("/blog?") &&
          h.length > "/blog/x".length,
      );
    const unique = [...new Set(hrefs)];
    expect(unique.length, "distinct marketing blog article hrefs").toBeGreaterThanOrEqual(8);

    const pp = unique.filter((h) => /\/blog\/pp-/i.test(h));
    if (requirePpBlog) {
      expect(pp.length, "expected ≥1 /blog/pp-* href (set MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0 to skip)").toBeGreaterThanOrEqual(1);
    }

    printMarketingSmokeReport("blog", {
      routeUrl,
      counts: {
        httpStatus: res.status(),
        articleHrefCount: unique.length,
        ppHrefCount: pp.length,
        htmlBytes: html.length,
        requirePpBlog: requirePpBlog ? "yes" : "no",
      },
      firstHrefs: unique.slice(0, 3).map((h) => normalizeHref(h, base)),
    });

    for (const h of unique.slice(0, 3)) {
      const detailUrl = normalizeHref(h, base);
      const dr = await request.get(detailUrl, { timeout: 60_000 });
      expect(dr.status(), `blog detail must be <400: ${detailUrl}`).toBeLessThan(400);
    }
  });

  test("flashcards — API tags non-empty + hub has deck/category navigation", async ({ request, page }) => {
    const apiUrl = `${base}/api/public/flashcard-tags`;
    const res = await request.get(apiUrl, { timeout: 45_000 });
    expect(
      res.ok(),
      `GET flashcard-tags ${res.status()} (503 DATA_UNAVAILABLE means empty inventory — fix data or cache)`,
    ).toBeTruthy();
    const ct = res.headers()["content-type"] ?? "";
    expect(ct, "content-type should be JSON").toMatch(/application\/json/i);
    const body = (await res.json()) as { tags?: Array<{ slug: string; name: string }> };
    expect(Array.isArray(body.tags), "`tags` must be an array").toBe(true);
    expect(body.tags!.length, "tags.length must be ≥1 after cache purge / deploy").toBeGreaterThanOrEqual(1);

    const tagHrefs = body.tags!.slice(0, 3).map((t) => `${base}/flashcards/${encodeURIComponent(t.slug)}`);

    printMarketingSmokeReport("flashcard-tags-api", {
      routeUrl: apiUrl,
      counts: {
        httpStatus: res.status(),
        tagCount: body.tags!.length,
      },
      firstHrefs: tagHrefs,
    });

    for (const u of tagHrefs) {
      const tr = await request.get(u, { timeout: 60_000 });
      expect(tr.status(), `flashcard tag surface must be <400: ${u}`).toBeLessThan(400);
    }

    const pageUrl = `${base}/flashcards`;
    const nav = await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(nav?.ok(), `GET /flashcards ${nav?.status()}`).toBeTruthy();
    await expect(page.locator("main")).toBeVisible({ timeout: 30_000 });
    try {
      await page.waitForLoadState("networkidle", { timeout: 45_000 });
    } catch {
      /* streaming/marketing shell may not reach full idle */
    }

    const mainHtml = await page.locator("main").innerHTML();
    const deckish = [
      ...mainHtml.matchAll(/href="([^"]*\/flashcards\/[a-z0-9][^"?#]*)"/gi),
    ].map((m) => m[1]);
    const normalized = [...new Set(deckish.map((h) => h.replace(/&amp;/g, "&")))].filter(
      (h) => h.length > 0 && !/\/flashcards\/?$/i.test(h.replace(base, "")),
    );
    expect(
      normalized.length,
      "expected ≥1 main link to a deck/topic under /flashcards/… (not hub root only)",
    ).toBeGreaterThanOrEqual(1);

    printMarketingSmokeReport("flashcards-page", {
      routeUrl: pageUrl,
      counts: {
        httpStatus: nav?.status() ?? 0,
        deckOrCategoryLinkCandidates: normalized.length,
      },
      firstHrefs: normalized.slice(0, 3).map((h) => normalizeHref(h, base)),
    });
  });

  test("Canada RN lessons hub — ≥12 links, no error shell, detail <400", async ({ page }) => {
    const routeUrl = `${base}/canada/rn/nclex-rn/lessons`;
    const r = await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();

    await expect(page.locator("#pathway-lesson-library")).toBeVisible({ timeout: 90_000 });

    const bodyText = (await page.locator("body").innerText()).toLowerCase();
    expect(bodyText, "must not show lessons hub retry/error copy").not.toContain("lessons temporarily unavailable");
    expect(bodyText, "must not show DB outage body copy").not.toContain("we could not load the lesson library");
    await expect(page.getByTestId("marketing-hub-load-error")).toHaveCount(0);
    await expect(page.locator('[data-nn-empty="curriculum-hub-empty"]')).toHaveCount(0);

    const lessonLinks = page.locator('#pathway-lesson-library a[href*="/lessons/"]');
    await expect(lessonLinks.first()).toBeVisible({ timeout: 60_000 });
    const n = await lessonLinks.count();
    expect(n, "expected ≥12 public lesson links when production inventory is healthy").toBeGreaterThanOrEqual(12);

    const hrefs: string[] = [];
    for (let i = 0; i < Math.min(3, n); i += 1) {
      const h = (await lessonLinks.nth(i).getAttribute("href"))?.trim();
      if (h) hrefs.push(normalizeHref(h, base));
    }

    const detailStatuses: number[] = [];
    for (let i = 0; i < Math.min(3, n); i += 1) {
      const raw = (await lessonLinks.nth(i).getAttribute("href"))?.trim();
      expect(raw).toBeTruthy();
      const detail = await page.goto(raw!.startsWith("http") ? raw! : `${base}${raw}`, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      expect(detail?.ok(), `lesson detail ${raw}`).toBeTruthy();
      expect(detail?.status() ?? 0, `lesson detail status for ${raw}`).toBeLessThan(400);
      detailStatuses.push(detail?.status() ?? 0);
    }

    printMarketingSmokeReport("canada-rn-lessons-hub", {
      routeUrl,
      counts: {
        httpStatus: r?.status() ?? 0,
        lessonLinkCount: n,
        firstThreeDetailHttpStatuses: detailStatuses.join(","),
      },
      firstHrefs: hrefs,
    });
  });
});
