import { describe, expect, it } from "vitest";

import {
  buildMarketingRouteBreadcrumbItems,
  marketingRouteBreadcrumbLabel,
} from "@/lib/seo/marketing-route-breadcrumbs";

describe("marketing route breadcrumb JSON-LD fallback", () => {
  it.each([
    ["/canada/rn/nclex-rn", ["Home", "Canada", "RN", "NCLEX-RN"]],
    ["/canada/pn/rex-pn/questions", ["Home", "Canada", "RPN", "REx-PN", "Practice Questions"]],
    ["/canada/np/cnple/simulation", ["Home", "Canada", "NP", "CNPLE", "Simulation"]],
    ["/allied-health/respiratory-therapy/question-bank", ["Home", "Allied Health", "Respiratory Therapy", "Question Bank"]],
    ["/advanced-ecg-nursing/12-lead-stemi", ["Home", "Advanced ECG Nursing", "12-Lead STEMI"]],
    ["/blog/rn/how-to-pass-nclex-rn", ["Home", "Blog", "RN", "How To Pass NCLEX RN"]],
    ["/ecg-interpretation", ["Home", "ECG Interpretation"]],
  ])("builds public marketing breadcrumbs for %s", (pathname, expectedLabels) => {
    const items = buildMarketingRouteBreadcrumbItems(pathname);

    expect(items.map((item) => item.name)).toEqual(expectedLabels);
    expect(items[0]).toEqual({ name: "Home", path: "/" });
    expect(items.at(-1)?.path).toBe(pathname);
  });

  it.each(["/", "/app/lessons", "/api/health", "/auth/signin", "/dashboard", "/sitemap.xml", "/robots.txt"])(
    "does not emit breadcrumb fallback for excluded route %s",
    (pathname) => {
      expect(buildMarketingRouteBreadcrumbItems(pathname)).toEqual([]);
    },
  );

  it("normalizes query strings, hashes, duplicate slashes, and trailing slashes", () => {
    expect(buildMarketingRouteBreadcrumbItems("//canada/rn/nclex-rn/?x=1#top")).toEqual([
      { name: "Home", path: "/" },
      { name: "Canada", path: "/canada" },
      { name: "RN", path: "/canada/rn" },
      { name: "NCLEX-RN", path: "/canada/rn/nclex-rn" },
    ]);
  });

  it("keeps important nursing and exam acronyms readable", () => {
    expect(marketingRouteBreadcrumbLabel("nclex-rn")).toBe("NCLEX-RN");
    expect(marketingRouteBreadcrumbLabel("rex-pn")).toBe("REx-PN");
    expect(marketingRouteBreadcrumbLabel("cnple")).toBe("CNPLE");
    expect(marketingRouteBreadcrumbLabel("ecg-interpretation")).toBe("ECG Interpretation");
  });
});
