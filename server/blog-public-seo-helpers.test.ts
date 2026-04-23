import { describe, expect, it } from "vitest";
import { CountryCode } from "../nursenest-core/node_modules/@prisma/client";
import {
  blogBrowserTitleForLocalizedEnPost,
  blogBrowserTitleForPublicPost,
  blogExamFramingHtml,
  blogKeywordStemFromTitles,
  mergeBlogFaqItemsForPublicPage,
  stripBlogPipeBrand,
} from "@/lib/blog/blog-public-seo-helpers";
import { blogCountryFromRegionSlug } from "@/lib/blog/blog-study-cta";

describe("blog-public-seo-helpers", () => {
  it("stripBlogPipeBrand removes trailing NurseNest suffix", () => {
    expect(stripBlogPipeBrand("Topic | NurseNest")).toBe("Topic");
  });

  it("blogBrowserTitleForPublicPost uses long-tail + exam geo + brand", () => {
    const t = blogBrowserTitleForPublicPost({
      seoTitle: null,
      title: "End-of-Dose Wearing Off Parkinson’s NCLEX Question",
      exam: "NCLEX-RN",
      countryTarget: CountryCode.CA,
    });
    expect(t).toContain("End-of-Dose Wearing Off");
    expect(t).toContain("NCLEX-RN (Canada)");
    expect(t).toMatch(/\|\s*NurseNest$/);
  });

  it("blogBrowserTitleForLocalizedEnPost returns null for non-English locales", () => {
    expect(
      blogBrowserTitleForLocalizedEnPost({
        localizedMetaTitle: null,
        localizedTitle: "Topic",
        regionSlug: "canada",
        exam: "nclex-rn",
        locale: "fr",
      }),
    ).toBeNull();
  });

  it("blogBrowserTitleForLocalizedEnPost formats English Canada RN titles", () => {
    const t = blogBrowserTitleForLocalizedEnPost({
      localizedMetaTitle: null,
      localizedTitle: "Topic",
      regionSlug: "canada",
      exam: "nclex-rn",
      locale: "en",
    });
    expect(t).toContain("Topic");
    expect(t).toContain("NCLEX-RN (Canada)");
  });

  it("blogKeywordStemFromTitles strips vague tail words", () => {
    expect(blogKeywordStemFromTitles(null, "Topic Guide")).toBe("Topic");
  });

  it("mergeBlogFaqItemsForPublicPage fills to at least three items", () => {
    const merged = mergeBlogFaqItemsForPublicPage(
      [{ q: "Custom?", a: "Yes." }],
      { keywordStem: "Topic", examPlain: "NCLEX-RN", countryWord: "Canada" },
    );
    expect(merged.length).toBeGreaterThanOrEqual(3);
    expect(merged[0]?.q).toBe("Custom?");
  });

  it("blogExamFramingHtml returns null when body is already substantial", () => {
    const long = "<p>" + Array.from({ length: 900 }, () => "word").join(" ") + "</p>";
    expect(
      blogExamFramingHtml({
        keywordStem: "x",
        examGeo: "NCLEX-RN (Canada)",
        examPlain: "NCLEX-RN",
        bodyHtml: long,
      }),
    ).toBeNull();
  });

  it("blogCountryFromRegionSlug maps canada and us", () => {
    expect(blogCountryFromRegionSlug("canada")).toBe("CA");
    expect(blogCountryFromRegionSlug("us")).toBe("US");
  });
});
