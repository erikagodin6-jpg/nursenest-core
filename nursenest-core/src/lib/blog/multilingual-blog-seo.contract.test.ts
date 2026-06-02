import assert from "node:assert/strict";
import test from "node:test";
import { countWordsFromHtmlApproximate } from "@/lib/blog/blog-word-count";
import {
  MULTILINGUAL_BLOG_INDEX_MIN_WORDS,
  MULTILINGUAL_BLOG_INDEX_MIN_WORDS_ES,
  multilingualBlogIndexMinWordsForLocale,
} from "@/lib/blog/multilingual-blog-seo-constants";
import {
  evaluateMultilingualBlogIndexability,
  multilingualBlogShouldEmitHreflang,
} from "@/lib/blog/multilingual-blog-seo-gates";
import {
  getMultilingualBlogEntryByLocalizedSlug,
  listMultilingualBlogRegistryEntries,
} from "@/lib/blog/multilingual-blog-seo-registry";
import type { MultilingualBlogRegistryEntry } from "@/lib/blog/multilingual-blog-seo-types";
import { listMultilingualBlogSitemapEntriesForLocale } from "@/lib/seo/sitemap-multilingual-blog-xml";

test("draft localized posts are never indexable", () => {
  const draft = listMultilingualBlogRegistryEntries().find((e) => e.status === "draft");
  assert.ok(draft);
  const idx = evaluateMultilingualBlogIndexability({
    entry: draft,
    englishSourceVisible: true,
  });
  assert.equal(idx.indexable, false);
});

test("French tier partial prevents indexing even when content hypothetically passes gates", () => {
  const base = listMultilingualBlogRegistryEntries().find((e) => e.locale === "fr");
  assert.ok(base);
  const thickBody = `<p>${"mot ".repeat(900)}</p>`;
  const hypothetical: MultilingualBlogRegistryEntry = {
    ...base,
    status: "published",
    qualityReviewed: true,
    localizedBodyHtml: thickBody,
    wordCount: countWordsFromHtmlApproximate(thickBody),
  };
  const idx = evaluateMultilingualBlogIndexability({
    entry: hypothetical,
    englishSourceVisible: true,
  });
  assert.equal(idx.reason, "locale_not_seo_indexable");
  assert.equal(idx.indexable, false);
});

test("Spanish synthetic entry can be indexable when gates pass", () => {
  const base = listMultilingualBlogRegistryEntries().find((e) => e.locale === "es");
  assert.ok(base);
  const thickBody = `<p>${"palabra ".repeat(1100)}</p>`;
  const hypothetical: MultilingualBlogRegistryEntry = {
    ...base,
    status: "published",
    qualityReviewed: true,
    localizedBodyHtml: thickBody,
    wordCount: countWordsFromHtmlApproximate(thickBody),
  };
  const idx = evaluateMultilingualBlogIndexability({
    entry: hypothetical,
    englishSourceVisible: true,
  });
  assert.equal(idx.indexable, true);
  assert.equal(idx.reason, "ok");
});

test("Spanish entries below the ES word threshold are not indexable", () => {
  const base = listMultilingualBlogRegistryEntries().find((e) => e.locale === "es");
  assert.ok(base);
  const thinBody = `<p>${"palabra ".repeat(400)}</p>`;
  const hypothetical: MultilingualBlogRegistryEntry = {
    ...base,
    status: "published",
    qualityReviewed: true,
    localizedBodyHtml: thinBody,
    wordCount: countWordsFromHtmlApproximate(thinBody),
  };
  const idx = evaluateMultilingualBlogIndexability({
    entry: hypothetical,
    englishSourceVisible: true,
  });
  assert.equal(idx.indexable, false);
  assert.equal(idx.reason, "word_count_below_threshold");
});

test("localized slug is required for indexability", () => {
  const base = listMultilingualBlogRegistryEntries()[0];
  const broken = { ...base, localizedSlug: "  " };
  const idx = evaluateMultilingualBlogIndexability({
    entry: broken,
    englishSourceVisible: true,
  });
  assert.equal(idx.reason, "missing_localized_slug");
});

test("hreflang emission helper rejects drafts", () => {
  const draft = listMultilingualBlogRegistryEntries().find((e) => e.status === "draft");
  assert.ok(draft);
  assert.equal(multilingualBlogShouldEmitHreflang(draft), false);
});

test("Spanish marketing sitemap lists only gated published ES posts", async () => {
  const es = await listMultilingualBlogSitemapEntriesForLocale("es");
  const localizedPosts = es.filter((e) => new URL(e.loc).pathname.startsWith("/es/blog/"));
  assert.ok(localizedPosts.length >= 2);
  const paths = localizedPosts.map((e) => new URL(e.loc).pathname);
  assert.ok(paths.some((p) => p.endsWith("/es/blog/cambios-ecg-hiperpotasemia")));
  assert.ok(paths.some((p) => p.endsWith("/es/blog/interpretacion-gases-arteriales")));
});

test("registry resolves native SEO slug for hyperkalemia FR example", () => {
  const fr = getMultilingualBlogEntryByLocalizedSlug("fr", "modifications-ecg-hyperkaliemie");
  assert.ok(fr);
  assert.equal(fr.sourceEnglishSlug, "tl-intl-electrolyte-k-safety-intl-topic-114");
  assert.match(fr.localizedTitle.toLowerCase(), /hyperkali|hyperkali/i);
});

test("minimum word threshold stays aligned with long-form blog expectations", () => {
  assert.ok(MULTILINGUAL_BLOG_INDEX_MIN_WORDS >= 800);
  assert.ok(MULTILINGUAL_BLOG_INDEX_MIN_WORDS_ES >= 1000);
  assert.equal(multilingualBlogIndexMinWordsForLocale("es"), MULTILINGUAL_BLOG_INDEX_MIN_WORDS_ES);
  assert.equal(multilingualBlogIndexMinWordsForLocale("fr"), MULTILINGUAL_BLOG_INDEX_MIN_WORDS);
});
