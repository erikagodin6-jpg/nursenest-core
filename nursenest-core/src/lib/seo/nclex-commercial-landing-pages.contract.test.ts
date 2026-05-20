import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  buildNclexCommercialBreadcrumbJsonLd,
  buildNclexCommercialFaqJsonLd,
  listNclexCommercialLandingPages,
  listPublishedNclexCommercialLandingPaths,
} from "@/lib/seo/nclex-commercial-landing-pages";
import { collectNclexCommercialLandingUrls } from "@/lib/seo/sitemap-static-xml";

const pages = listNclexCommercialLandingPages();
const appRoot = join(process.cwd(), "src", "app", "(marketing)", "(default)");

test("NCLEX commercial landing registry has the planned 13 unique pages", () => {
  assert.equal(pages.length, 13);
  assert.equal(new Set(pages.map((page) => page.slug)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
  assert.equal(new Set(pages.map((page) => page.metaDescription)).size, pages.length);
  assert.deepEqual(
    pages.map((page) => page.path),
    listPublishedNclexCommercialLandingPaths(),
  );
});

test("each NCLEX commercial page has complete SEO and conversion content", () => {
  for (const page of pages) {
    assert.equal(page.status, "published");
    assert.ok(page.title.includes("NurseNest"), `${page.slug} title must include brand`);
    assert.ok(page.metaDescription.length >= 120, `${page.slug} description is too thin`);
    assert.ok(page.h1.length >= 24, `${page.slug} h1 is too thin`);
    assert.ok(page.targetQueries.length >= 3, `${page.slug} needs query coverage`);
    assert.ok(page.intent.length >= 2, `${page.slug} needs mixed intent coverage`);
    assert.ok(page.heroLead.length >= 160, `${page.slug} hero lead is too thin`);
    assert.ok(page.primaryCta.href.startsWith("/"), `${page.slug} primary CTA must be internal`);
    assert.ok(page.secondaryCta.href.startsWith("/"), `${page.slug} secondary CTA must be internal`);
    assert.ok(page.sections.length >= 3, `${page.slug} needs reusable module coverage`);
    assert.ok(page.faqs.length >= 2, `${page.slug} needs FAQ schema coverage`);
    assert.ok(page.internalLinks.length >= 4, `${page.slug} needs ecosystem links`);
  }
});

test("NCLEX commercial pages avoid unsupported filler and fake proof", () => {
  const banned = [/lorem/i, /placeholder/i, /testimonial from/i, /guaranteed pass/i, /100% pass/i];
  for (const page of pages) {
    const text = JSON.stringify(page);
    for (const pattern of banned) {
      assert.doesNotMatch(text, pattern, `${page.slug} contains disallowed filler or unsupported proof`);
    }
  }
});

test("NCLEX commercial JSON-LD emits valid breadcrumb and FAQ structures", () => {
  for (const page of pages) {
    const breadcrumb = buildNclexCommercialBreadcrumbJsonLd(page) as {
      "@type": string;
      itemListElement: Array<{ position: number; name: string; item: string }>;
    };
    assert.equal(breadcrumb["@type"], "BreadcrumbList");
    assert.equal(breadcrumb.itemListElement.length, 3);
    assert.equal(breadcrumb.itemListElement[2]?.item.endsWith(page.path), true);

    const faq = buildNclexCommercialFaqJsonLd(page) as {
      "@type": string;
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    assert.equal(faq["@type"], "FAQPage");
    assert.equal(faq.mainEntity.length, page.faqs.length);
    assert.ok(faq.mainEntity.every((item) => item.name && item.acceptedAnswer.text));
  }
});

test("NCLEX commercial landing routes exist for every published path", () => {
  for (const page of pages) {
    const routePath = join(appRoot, page.slug, "page.tsx");
    assert.ok(existsSync(routePath), `${page.slug} route file is missing`);
  }
});

test("NCLEX commercial sitemap collector emits canonical absolute URLs", () => {
  const origin = "https://nursenest.ca";
  const urls = collectNclexCommercialLandingUrls(origin);
  assert.equal(urls.length, pages.length);
  for (const page of pages) {
    assert.ok(urls.includes(`${origin}${page.path}`), `${page.path} missing from sitemap collector`);
  }
});
