import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode } from "@prisma/client";
import {
  BLOG_SEO_BUNDLE_VERSION,
  resolveBlogOgImageAbsolute,
  type BlogSeoBundle,
} from "@/lib/blog/blog-seo-automation";
import {
  buildSeoBundleForSimpleAiDraft,
  clampSerpDescription,
  clampSerpTitle,
  rebuildSeoBundleFromStoredBlogPost,
} from "@/lib/blog/blog-seo-package";

describe("clampSerpTitle", () => {
  it("trims and caps length", () => {
    const long = `${"word ".repeat(30)}tail`;
    assert.ok(clampSerpTitle(long, 70).length <= 70);
    assert.equal(clampSerpTitle("  hello  ", 70), "hello");
  });
});

describe("clampSerpDescription", () => {
  it("pads short descriptions and caps long ones", () => {
    const short = "Short.";
    const out = clampSerpDescription(short, 120, 155);
    assert.ok(out.length <= 155);
    assert.ok(out.length > short.length);
    const long = `${"paragraph ".repeat(40)}end`;
    assert.ok(clampSerpDescription(long, 120, 155).length <= 155);
  });
});

describe("buildSeoBundleForSimpleAiDraft", () => {
  it("sets canonical to /blog/{slug}", () => {
    const b = buildSeoBundleForSimpleAiDraft({
      slug: "fluid-balance-nclex",
      h1: "Fluid balance on the NCLEX",
      seoTitle: "Fluid balance NCLEX tips | NurseNest",
      seoDescription: "Prioritize intake/output cues and safety-first sequencing for fluid overload and deficit items.",
      excerpt: "A concise excerpt for cards.",
      tags: ["fluid balance", "NCLEX"],
      primaryKeyword: "fluid balance NCLEX",
      emitFaqSchema: false,
    });
    assert.equal(b.canonicalPath, "/blog/fluid-balance-nclex");
    assert.ok(b.normalizedBreadcrumbs.length >= 3);
  });
});

describe("rebuildSeoBundleFromStoredBlogPost", () => {
  const baseRow = {
    slug: "sample-post",
    title: "Sample nursing post title",
    excerpt: "This excerpt is long enough to satisfy downstream previews without padding edge cases in tests.",
    seoTitle: "Custom meta title",
    seoDescription: "Custom meta description that is long enough to pass minimum length rules when clamped.",
    tags: ["tag-one"],
    category: "Exam strategy",
    exam: "NCLEX-RN",
    countryTarget: CountryCode.US,
    coverImage: null,
    targetKeyword: "sample keyword",
    faqItemCount: 0,
  };

  it("respects stored meta when ignoreStoredMeta is false", () => {
    const b = rebuildSeoBundleFromStoredBlogPost(baseRow);
    assert.equal(b.openGraphTitle, "Custom meta title");
  });

  it("replaces meta strings when ignoreStoredMeta is true", () => {
    const b = rebuildSeoBundleFromStoredBlogPost(baseRow, { ignoreStoredMeta: true });
    assert.notEqual(b.openGraphTitle, "Custom meta title");
    assert.ok((b.openGraphTitle ?? "").length >= 3);
  });
});

describe("resolveBlogOgImageAbsolute", () => {
  it("returns undefined for empty input", () => {
    assert.equal(resolveBlogOgImageAbsolute(null, null), undefined);
  });

  it("passes through valid https URLs from bundle", () => {
    const u = "https://cdn.example.com/hero.jpg";
    const bundle: BlogSeoBundle = {
      version: BLOG_SEO_BUNDLE_VERSION,
      normalizedBreadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "P", href: "/blog/p" },
      ],
      openGraphImageUrl: u,
      suggestedExcerpt: "Excerpt for schema bundle test.",
      emitFaqSchema: false,
      focusKeywords: ["nursing"],
      imageAlts: [],
    };
    assert.equal(resolveBlogOgImageAbsolute(bundle, null), u);
  });
});
