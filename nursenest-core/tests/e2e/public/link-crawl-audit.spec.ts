/**
 * Crawl important public pages and flag broken internal links, bad redirects,
 * dead hash targets, and visibly inert buttons.
 *
 * Run: `PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/link-crawl-audit.spec.ts --project=chromium`
 *
 * Output: `test-results/link-crawl-audit/link-crawl-audit-report.{json,md}`
 */
import { test, type APIRequestContext, type Page } from "@playwright/test";
import { LESSON_FLOW_PATHWAY_QA } from "../../../src/lib/qa/lesson-flow-pathways";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  absoluteFromSeed,
  captureLinkIssueShot,
  fetchInternalUrl,
  isInternalHref,
  normalizePathname,
  runWithConcurrency,
  writeLinkCrawlReport,
  type FetchHeadResult,
  type LinkCrawlRow,
} from "../helpers/link-crawl-audit";

const base = getE2eBaseURL();

const rows: LinkCrawlRow[] = [];

function pushRow(r: LinkCrawlRow) {
  rows.push(r);
}

async function dismissScrims(page: Page) {
  for (let i = 0; i < 5; i++) await page.keyboard.press("Escape");
}

function resultForFetch(reqUrl: string, fr: FetchHeadResult): string {
  if (fr.status === 0) return "NETWORK_OR_REQUEST_ERROR";
  if (fr.status === 404) return "HTTP_404";
  if (fr.status >= 500) return `HTTP_${fr.status}`;
  if (fr.status >= 400) return `HTTP_${fr.status}`;
  const npReq = normalizePathname(new URL(reqUrl).pathname);
  const npFin = normalizePathname(new URL(fr.finalUrl).pathname);
  if (npReq !== npFin && fr.status < 400) {
    if (npReq.replace(/\/$/, "") === npFin.replace(/\/$/, "")) return "OK_REDIRECT_TRAILING_SLASH_ONLY";
    /** Unauthenticated `request.get` hits /app/* → /login — not a broken public link. */
    if (npReq.startsWith("/app") && npFin.startsWith("/login")) return "OK_AUTH_REQUIRED_REDIRECT";
    return `REDIRECT ${npReq} → ${npFin}`;
  }
  return "OK_200";
}

async function auditLinksOnOpenPage(page: Page, request: APIRequestContext, origin: string) {
  await dismissScrims(page);
  await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });
  const currentUrl = page.url();

  const hashChecks = await page.evaluate(() => {
    const out: { href: string; hash: string }[] = [];
    for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const raw = a.getAttribute("href") || "";
      if (!raw.startsWith("#") && !raw.includes("#")) continue;
      let hash = "";
      try {
        const u = new URL(a.href, window.location.href);
        if (u.pathname !== window.location.pathname) continue;
        hash = u.hash;
      } catch {
        continue;
      }
      if (!hash || hash === "#") {
        out.push({ href: a.href, hash: "" });
        continue;
      }
      out.push({ href: a.href, hash });
    }
    return out;
  });

  for (const h of hashChecks) {
    if (h.hash === "") {
      pushRow({
        sourcePage: currentUrl,
        linkText: "[hash link]",
        href: h.href,
        requestUrl: h.href,
        resultStatus: "EMPTY_OR_INVALID_HASH",
        httpStatus: null,
        finalUrlAfterRedirects: null,
        kind: "anchor",
        screenshotPath: await captureLinkIssueShot(page, "empty-hash"),
      });
      continue;
    }
    const ok = await page.evaluate((hash) => {
      const id = decodeURIComponent(hash.slice(1));
      if (!id) return false;
      if (document.getElementById(id)) return true;
      try {
        return Boolean(document.querySelector(`[name="${CSS.escape(id)}"]`));
      } catch {
        return Boolean(document.querySelector(`[name="${id.replace(/"/g, "")}"]`));
      }
    }, h.hash);
    const st = ok ? "OK_ANCHOR_TARGET" : "ANCHOR_TARGET_NOT_FOUND";
    const shot = ok ? undefined : await captureLinkIssueShot(page, "bad-anchor");
    pushRow({
      sourcePage: currentUrl,
      linkText: "[in-page]",
      href: h.href,
      requestUrl: h.href,
      resultStatus: st,
      httpStatus: null,
      finalUrlAfterRedirects: null,
      kind: "anchor",
      screenshotPath: shot,
    });
  }

  const deadPointer = await page.evaluate(() => {
    const out: { text: string }[] = [];
    for (const el of document.querySelectorAll("button, [role='button']")) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (r.bottom < 0 || r.top > window.innerHeight + 400) continue;
      const pe = getComputedStyle(el).pointerEvents;
      if (pe === "none") {
        out.push({ text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160) || "[button]" });
      }
    }
    return out;
  });
  let pointerShot: string | undefined;
  if (deadPointer.length > 0) {
    pointerShot = await captureLinkIssueShot(page, "pointer-events-none");
  }
  for (const d of deadPointer) {
    pushRow({
      sourcePage: currentUrl,
      linkText: d.text,
      href: "[button]",
      requestUrl: currentUrl,
      resultStatus: "BUTTON_POINTER_EVENTS_NONE",
      httpStatus: null,
      finalUrlAfterRedirects: null,
      kind: "button",
      screenshotPath: pointerShot,
    });
  }

  const extracted = await page.evaluate((o) => {
    const out: { text: string; href: string }[] = [];
    for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const hrefAttr = a.getAttribute("href");
      if (!hrefAttr || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) continue;
      let abs: string;
      try {
        abs = new URL(hrefAttr, o).href;
      } catch {
        continue;
      }
      const text = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 300);
      out.push({ text: text || "[no text]", href: abs });
    }
    return out;
  }, origin);

  const httpItems: { text: string; href: string; reqUrl: string }[] = [];
  for (const ex of extracted.slice(0, 80)) {
    if (!isInternalHref(ex.href, origin)) continue;
    let u: URL;
    try {
      u = new URL(ex.href);
    } catch {
      continue;
    }
    const pathOnly = `${u.pathname}${u.search}`;
    const reqUrl = `${origin}${pathOnly}`;
    if (normalizePathname(u.pathname) === normalizePathname(new URL(currentUrl).pathname) && u.hash) continue;
    httpItems.push({ text: ex.text, href: ex.href, reqUrl });
  }

  await runWithConcurrency(httpItems, 5, async (item) => {
    let fr = await fetchInternalUrl(request, item.reqUrl);
    if (fr.status === 0) {
      await new Promise((r) => setTimeout(r, 400));
      fr = await fetchInternalUrl(request, item.reqUrl);
    }
    const rs = resultForFetch(item.reqUrl, fr);
    pushRow({
      sourcePage: currentUrl,
      linkText: item.text,
      href: item.href,
      requestUrl: item.reqUrl,
      resultStatus: rs,
      httpStatus: fr.status,
      finalUrlAfterRedirects: fr.finalUrl,
      kind: "http",
      screenshotPath: undefined,
    });
  });
}

test.describe.configure({ mode: "serial", timeout: 900_000 });

test("link crawl — public pages", async ({ page, request }) => {
  test.setTimeout(900_000);
  const origin = new URL(base).origin;

  try {
  const seedPaths = new Set<string>([
    "/",
    "/pricing",
    "/faq",
    "/blog",
    "/lessons",
    "/question-bank",
    "/for-institutions",
    "/flashcards",
    "/practice-exams",
    "/pre-nursing",
  ]);

  const pathwaySample = LESSON_FLOW_PATHWAY_QA.slice(0, 2);
  for (const p of pathwaySample) {
    seedPaths.add(p.hubPath);
    seedPaths.add(p.lessonsPath);
  }

  const primary = pathwaySample[0];
  let skipPrimaryLessonsInLoop = false;
  if (primary) {
    const lessonsAbs = absoluteFromSeed(primary.lessonsPath, base);
    try {
      const r = await page.goto(lessonsAbs, { waitUntil: "load", timeout: 240_000 });
      if (r?.ok()) {
        await auditLinksOnOpenPage(page, request, origin);
        skipPrimaryLessonsInLoop = true;
        const lessonHref = await page.evaluate(() => {
          const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href*="/lessons/"]')];
          for (const a of links) {
            const u = new URL(a.href, window.location.href);
            const segs = u.pathname.split("/").filter(Boolean);
            const li = segs.indexOf("lessons");
            if (li >= 0 && segs.length > li + 1) return u.pathname + u.search;
          }
          return null;
        });
        if (lessonHref) seedPaths.add(lessonHref);
      }
    } catch {
      /* fall through — main loop may still load lessons hub */
    }
  }

  const seedList = [...seedPaths].sort();

  for (const path of seedList) {
    if (skipPrimaryLessonsInLoop && primary && path === primary.lessonsPath) {
      continue;
    }

    const sourceAbs = absoluteFromSeed(path, base);
    let r: Awaited<ReturnType<Page["goto"]>> | null = null;
    try {
      r = await page.goto(sourceAbs, { waitUntil: "load", timeout: 240_000 });
    } catch {
      pushRow({
        sourcePage: sourceAbs,
        linkText: "[page load]",
        href: sourceAbs,
        requestUrl: sourceAbs,
        resultStatus: "SEED_PAGE_GOTO_TIMEOUT",
        httpStatus: null,
        finalUrlAfterRedirects: page.url(),
        kind: "http",
        screenshotPath: await captureLinkIssueShot(page, `seed-timeout-${path}`),
      });
      continue;
    }
    if (!r?.ok()) {
      pushRow({
        sourcePage: sourceAbs,
        linkText: "[page load]",
        href: sourceAbs,
        requestUrl: sourceAbs,
        resultStatus: `SEED_PAGE_HTTP_${r?.status() ?? "?"}`,
        httpStatus: r?.status() ?? null,
        finalUrlAfterRedirects: page.url(),
        kind: "http",
        screenshotPath: await captureLinkIssueShot(page, `seed-fail-${path}`),
      });
      continue;
    }

    await auditLinksOnOpenPage(page, request, origin);
  }

  await page.goto(absoluteFromSeed("/", base), { waitUntil: "load", timeout: 120_000 });
  await dismissScrims(page);
  const homeUrl = page.url();
  const navFooter = await page.evaluate((o) => {
    const sel = [
      "footer a[href]",
      '[data-nn-nav-mode="public"] a[href]',
      ".nn-header-desktop-grid a[href]",
      ".nn-header-nav-row a[href]",
    ].join(", ");
    const out: { text: string; href: string }[] = [];
    for (const a of document.querySelectorAll<HTMLAnchorElement>(sel)) {
      const hrefAttr = a.getAttribute("href");
      if (!hrefAttr) continue;
      try {
        const abs = new URL(hrefAttr, o).href;
        const text = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 300);
        out.push({ text: text || "[no text]", href: abs });
      } catch {
        /* skip */
      }
    }
    return out;
  }, origin);

  for (const ex of navFooter) {
    if (!isInternalHref(ex.href, origin)) continue;
    const u = new URL(ex.href);
    const reqUrl = `${origin}${u.pathname}${u.search}`;
    const fr = await fetchInternalUrl(request, reqUrl);
    const rs = resultForFetch(reqUrl, fr);
    let shot: string | undefined;
    if (!rs.startsWith("OK")) {
      shot = await captureLinkIssueShot(page, "nav-footer");
    }
    pushRow({
      sourcePage: `${homeUrl} [nav/footer pass]`,
      linkText: ex.text,
      href: ex.href,
      requestUrl: reqUrl,
      resultStatus: rs,
      httpStatus: fr.status,
      finalUrlAfterRedirects: fr.finalUrl,
      kind: "http",
      screenshotPath: shot,
    });
  }

  } finally {
    await writeLinkCrawlReport(rows, base);
  }
});
