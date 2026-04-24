/**
 * Manual / production verification: blog index, public flashcard tags + hub, marketing lesson hubs (matrix).
 *
 * Skipped unless `MARKETING_STUDY_SMOKE_BASE_URL` is set (no trailing slash).
 *
 * Pathophysiology blog links: require ≥1 `href` containing `/blog/pp-` unless
 * `MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0`.
 *
 * Lesson hubs: default matrix covers CA RN, CA PN, US RN, US NP FNP, US allied, US new-grad.
 * Override with `MARKETING_STUDY_LESSON_HUB_PATHS=/us/rn/nclex-rn/lessons|12,/us/np/fnp/lessons|1` (comma-separated;
 * optional `|minLinks` after each path).
 *
 * Run:
 *   cd nursenest-core && npm run qa:marketing-study-production-smoke
 *   (BASE_URL must match the smoke origin so Playwright does not start a local webServer; use
 *   MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0 when production has no /blog/pp-* links yet.)
 *
 * CI: workflow `marketing-study-production-smoke.yml` (workflow_dispatch only).
 */
import { expect, test } from "@playwright/test";
import { readMarketingHubSmokeDiagnostics } from "../helpers/marketing-hub-smoke-diagnostics";

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
    const ct = res.headers()["content-type"] ?? "";
    expect(ct, "content-type should be JSON").toMatch(/application\/json/i);
    const body = (await res.json()) as {
      tags?: Array<{ slug: string; name: string }>;
      contractVersion?: string;
      source?: string;
      tagCount?: number;
      error?: string;
      code?: string;
    };

    if (res.status() === 200 && Array.isArray(body.tags) && body.tags.length === 0) {
      expect(
        false,
        `STALE_ROUTE_OR_CDN: flashcard-tags returned 200 with tags:[] — old safeJsonReadRoute/degraded handler or CDN may still be live. Full body (truncated): ${JSON.stringify(body).slice(0, 600)}`,
      ).toBeTruthy();
    }

    expect(
      res.ok() && Array.isArray(body.tags) && body.tags.length > 0,
      `flashcard-tags must return 200 with a non-empty tags list when production inventory is healthy. status=${res.status()} source=${body.source ?? ""} error=${body.error ?? ""} code=${body.code ?? ""} body=${JSON.stringify(body).slice(0, 900)}`,
    ).toBeTruthy();

    expect(body.contractVersion, "contractVersion flashcard-tags-v3 proves current handler is deployed").toBe("flashcard-tags-v3");
    expect(
      body.source === "db" || body.source === "fallback" || body.source === "cache",
      "branch source db|fallback|cache",
    ).toBeTruthy();
    expect(body.tagCount, "tagCount mirrors tags.length").toBe(body.tags!.length);

    const tagHrefs = body.tags!.slice(0, 3).map((t) => `${base}/flashcards/${encodeURIComponent(t.slug)}`);

    printMarketingSmokeReport("flashcard-tags-api", {
      routeUrl: apiUrl,
      counts: {
        httpStatus: res.status(),
        tagCount: body.tags!.length,
        contractVersion: body.contractVersion ?? "(missing)",
        branchSource: body.source ?? "(missing)",
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

  const DEFAULT_LESSON_HUB_ROUTES: Array<{ path: string; minLessonLinks: number }> = [
    { path: "/canada/rn/nclex-rn/lessons", minLessonLinks: 12 },
    { path: "/canada/pn/rex-pn/lessons", minLessonLinks: 12 },
    { path: "/us/rn/nclex-rn/lessons", minLessonLinks: 12 },
    { path: "/us/np/fnp/lessons", minLessonLinks: 1 },
    { path: "/us/allied/allied-health/lessons", minLessonLinks: 1 },
    { path: "/us/rn/new-grad-transition/lessons", minLessonLinks: 1 },
  ];

  function parseLessonHubMatrixFromEnv(): Array<{ path: string; minLessonLinks: number }> {
    const raw = process.env.MARKETING_STUDY_LESSON_HUB_PATHS?.trim();
    if (!raw) return DEFAULT_LESSON_HUB_ROUTES;
    return raw.split(",").map((segment) => {
      const [pathPart, minPart] = segment.split("|").map((s) => s.trim());
      const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
      const minLessonLinks = Math.max(1, Number(minPart || "12") || 12);
      return { path, minLessonLinks };
    });
  }

  for (const hub of parseLessonHubMatrixFromEnv()) {
    test(`lessons hub ${hub.path} — status, no unavailable copy, links, detail <400`, async ({ page, request }, testInfo) => {
      const routeUrl = `${base}${hub.path}`;
      const head = await request.get(routeUrl, { timeout: 60_000 });
      if (head.status() === 404) {
        testInfo.skip();
        return;
      }
      expect(head.ok(), `GET ${hub.path} ${head.status()}`).toBeTruthy();

      const r = await page.goto(routeUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
      expect(r?.ok(), `HTTP ${r?.status()}`).toBeTruthy();

      const bodyText = (await page.locator("body").innerText()).toLowerCase();
      expect(bodyText, "must not show lessons hub retry/error copy").not.toContain("lessons temporarily unavailable");
      expect(bodyText, "must not show DB outage body copy").not.toContain("we could not load the lesson library");

      const lessonLibrary = page.locator("#pathway-lesson-library");
      if (hub.minLessonLinks >= 12) {
        try {
          await lessonLibrary.waitFor({ state: "visible", timeout: 90_000 });
        } catch {
          const diag = await readMarketingHubSmokeDiagnostics(page);
          const errShell = await page.getByTestId("marketing-hub-load-error").count();
          throw new Error(
            `${hub.path}: #pathway-lesson-library not visible in 90s; marketing-hub-load-error=${errShell}; diag=${JSON.stringify(diag).slice(0, 1200)}`,
          );
        }
      }

      const libVisible = await lessonLibrary.isVisible().catch(() => false);
      const errCount = await page.getByTestId("marketing-hub-load-error").count();
      if (libVisible) {
        await expect(page.getByTestId("marketing-hub-load-error")).toHaveCount(0);
        const lessonLinks = page.locator('#pathway-lesson-library a[href*="/lessons/"]');
        const n = await lessonLinks.count();
        if (hub.minLessonLinks <= 1 && n === 0) {
          testInfo.skip();
          return;
        }
        expect(n, `expected ≥1 lesson link on ${hub.path}`).toBeGreaterThanOrEqual(1);
        if (hub.minLessonLinks > 1) {
          expect(n, `expected ≥${hub.minLessonLinks} links on ${hub.path}`).toBeGreaterThanOrEqual(hub.minLessonLinks);
        }
        const detailStatuses: number[] = [];
        for (let i = 0; i < Math.min(5, n); i += 1) {
          const raw = (await lessonLinks.nth(i).getAttribute("href"))?.trim();
          expect(raw).toBeTruthy();
          const detail = await request.get(normalizeHref(raw!, base), { timeout: 60_000 });
          expect(detail.status(), `lesson detail ${raw}`).toBeLessThan(400);
          detailStatuses.push(detail.status());
        }
        printMarketingSmokeReport(`lessons-hub:${hub.path}`, {
          routeUrl,
          counts: {
            httpStatus: r?.status() ?? 0,
            lessonLinkCount: n,
            firstFiveDetailStatuses: detailStatuses.join(","),
            minConfigured: hub.minLessonLinks,
          },
          firstHrefs: [],
        });
        return;
      }

      if (errCount > 0) {
        const diag = await readMarketingHubSmokeDiagnostics(page);
        printMarketingSmokeReport(`lessons-hub-error:${hub.path}`, {
          routeUrl,
          counts: { httpStatus: r?.status() ?? 0, marketingHubLoadError: errCount },
          firstHrefs: [],
        });
        expect(
          false,
          `Hub ${hub.path} shows error shell without #pathway-lesson-library — diagnostics: ${JSON.stringify(diag).slice(0, 1200)}`,
        ).toBeTruthy();
      }

      const zeroCopy = await page.getByText(/no lessons are indexed|no lessons match/i).count();
      expect(zeroCopy >= 1 || (await page.content()).includes("pathway-lesson-library")).toBeTruthy();
    });
  }
});
