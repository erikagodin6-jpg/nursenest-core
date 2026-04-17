import { expect, test, type Page } from "@playwright/test";

const EXAM_HUB_PATH = "/us/rn/nclex-rn";
const MARKETING_ROUTES = ["/", "/blog", EXAM_HUB_PATH] as const;

type JsonLdNode = Record<string, unknown>;

function flattenJsonLd(value: unknown, out: JsonLdNode[] = []): JsonLdNode[] {
  if (Array.isArray(value)) {
    for (const item of value) flattenJsonLd(item, out);
    return out;
  }
  if (!value || typeof value !== "object") return out;
  const node = value as JsonLdNode;
  out.push(node);
  if (Array.isArray(node["@graph"])) {
    flattenJsonLd(node["@graph"], out);
  }
  return out;
}

function nodeTypes(node: JsonLdNode): string[] {
  const raw = node["@type"];
  if (Array.isArray(raw)) return raw.filter((value): value is string => typeof value === "string");
  return typeof raw === "string" ? [raw] : [];
}

async function collectRestrictedAnchors(page: Page): Promise<Array<{ href: string; text: string }>> {
  return page.evaluate(() => {
    const out: Array<{ href: string; text: string }> = [];
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = anchor.getAttribute("href")?.trim() ?? "";
      if (!href.startsWith("/")) continue;
      if (!/^\/(?:app|admin|api)(?:\/|$)/i.test(href)) continue;
      out.push({
        href,
        text: (anchor.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160) || "[no text]",
      });
    }
    return out;
  });
}

async function collectJsonLdNodes(page: Page): Promise<JsonLdNode[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes: JsonLdNode[] = [];
  for (const raw of scripts) {
    try {
      flattenJsonLd(JSON.parse(raw), nodes);
    } catch {
      /* ignore malformed JSON-LD in audit; assertions below will fail if key nodes are missing */
    }
  }
  return nodes;
}

async function collectBlogPostPaths(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const paths = new Set<string>();
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href^="/blog/"]')) {
      const href = anchor.getAttribute("href")?.trim() ?? "";
      if (!href.startsWith("/blog/")) continue;
      if (/^\/blog\/tag\//i.test(href)) continue;
      const clean = href.split("#")[0]?.split("?")[0] ?? href;
      const segments = clean.split("/").filter(Boolean);
      if (segments.length !== 2) continue;
      paths.add(clean);
    }
    return [...paths].slice(0, 8);
  });
}

async function collectStudyPlanLinks(page: Page): Promise<Array<{ href: string; text: string }>> {
  return page.evaluate(() => {
    const roots = Array.from(document.querySelectorAll("main, article"));
    const matches: Array<{ href: string; text: string }> = [];
    for (const root of roots) {
      for (const anchor of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        const text = (anchor.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!/study plan/i.test(text)) continue;
        matches.push({
          href: anchor.getAttribute("href")?.trim() ?? "",
          text: text.slice(0, 160),
        });
      }
    }
    return matches;
  });
}

async function hasVisibleFaqContent(page: Page): Promise<boolean> {
  const faqHeading = await page.getByRole("heading", { name: /faq/i }).count().catch(() => 0);
  if (faqHeading > 0) return true;
  const detailsCount = await page.locator("main details, article details").count().catch(() => 0);
  if (detailsCount >= 2) return true;
  const faqQuestionCount = await page.locator('main h2, main h3, article h2, article h3').evaluateAll((nodes) => {
    return nodes.filter((node) => /\?$/.test((node.textContent ?? "").trim())).length;
  }).catch(() => 0);
  return faqQuestionCount >= 2;
}

test.describe("SEO link integrity", () => {
  test("homepage, blog, and exam hub do not expose restricted marketing anchors", async ({ page }) => {
    for (const route of MARKETING_ROUTES) {
      const res = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.ok(), `expected 2xx for ${route}, got ${res?.status()}`).toBeTruthy();
      await page.locator("body").waitFor({ state: "visible", timeout: 30_000 });

      const restricted = await collectRestrictedAnchors(page);
      expect(
        restricted,
        `${route}: marketing HTML must not link into /app, /admin, or /api\n${JSON.stringify(restricted, null, 2)}`,
      ).toEqual([]);
    }
  });

  test("exam hub emits canonical-aligned WebPage JSON-LD and no hidden FAQPage schema", async ({ page, baseURL }) => {
    const res = await page.goto(EXAM_HUB_PATH, { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(res?.ok(), `expected 2xx for ${EXAM_HUB_PATH}, got ${res?.status()}`).toBeTruthy();

    const canonicalHref = await page.locator('link[rel="canonical"]').first().getAttribute("href");
    expect(canonicalHref, "exam hub canonical href should exist").toBeTruthy();

    const nodes = await collectJsonLdNodes(page);
    const webPageNodes = nodes.filter((node) => nodeTypes(node).includes("WebPage"));
    expect(webPageNodes.length, "exam hub should emit at least one WebPage JSON-LD node").toBeGreaterThan(0);

    const expectedCanonical = new URL(canonicalHref!, baseURL ?? "http://localhost:3000").href;
    const canonicalMatch = webPageNodes.some((node) => typeof node.url === "string" && node.url === expectedCanonical);
    expect(canonicalMatch, `expected a WebPage JSON-LD node with url=${expectedCanonical}`).toBe(true);

    const faqNodes = nodes.filter((node) => nodeTypes(node).includes("FAQPage"));
    if (faqNodes.length > 0) {
      const visibleFaq = await hasVisibleFaqContent(page);
      expect(visibleFaq, "FAQPage JSON-LD must only appear when visible FAQ content exists").toBe(true);
    }
  });

  test("blog study plan links stay on public lesson hubs, never /app/study-plan", async ({ page }) => {
    const blogRes = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 120_000 });
    expect(blogRes?.ok(), `expected 2xx for /blog, got ${blogRes?.status()}`).toBeTruthy();

    const blogPostPaths = await collectBlogPostPaths(page);
    expect(blogPostPaths.length, "blog index should expose at least one blog post path").toBeGreaterThan(0);

    let matchedPostPath: string | null = null;
    let studyPlanLinks: Array<{ href: string; text: string }> = [];

    for (const path of blogPostPaths) {
      const res = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.ok(), `expected 2xx for ${path}, got ${res?.status()}`).toBeTruthy();
      const links = await collectStudyPlanLinks(page);
      if (links.length === 0) continue;
      matchedPostPath = path;
      studyPlanLinks = links;
      break;
    }

    expect(matchedPostPath, "expected at least one sampled blog post to contain a study plan link").toBeTruthy();
    expect(studyPlanLinks.length, "study plan link set should not be empty once matched").toBeGreaterThan(0);

    for (const link of studyPlanLinks) {
      expect(link.href, `study plan link in ${matchedPostPath} must not point to /app/study-plan`).not.toMatch(/^\/app\/study-plan(?:\/|$|\?)/i);
      expect(
        link.href,
        `study plan link in ${matchedPostPath} should stay on a public lessons hub (got ${link.href})`,
      ).toMatch(/\/lessons(?:\/|$|\?)/i);
    }
  });
});
