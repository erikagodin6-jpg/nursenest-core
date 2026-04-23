import assert from "node:assert/strict";
import test from "node:test";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

test("localizeBreadcrumbResolution falls back to structural crumb name when i18n resolves empty", () => {
  const crumbs = [{ name: "Lessons", href: "/lessons", i18nKey: "breadcrumbs.lessons" }];
  const primary: MarketingMessages = {};
  const fallback: MarketingMessages = {};
  const loc = localizeBreadcrumbResolution({ crumbs, schemaItems: [] }, primary, fallback);
  assert.equal(loc.crumbs[0]?.name, "Lessons");
});

test("localizeBreadcrumbResolution applies i18nKey crumbs using primary bundle", () => {
  const caRn = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(caRn);
  const raw = pathwayLessonsHubBreadcrumbs(caRn!);
  const primary: MarketingMessages = {
    "breadcrumbs.home": "Inicio",
    "breadcrumbs.lessons": "Lecciones",
  };
  const fallback: MarketingMessages = {
    "breadcrumbs.home": "Home",
    "breadcrumbs.lessons": "Lessons",
  };
  const loc = localizeBreadcrumbResolution(raw, primary, fallback);
  assert.equal(loc.crumbs[0]?.name, "Inicio");
  assert.equal(loc.crumbs[loc.crumbs.length - 1]?.name, "Lecciones");
  assert.equal(loc.schemaItems[0]?.name, "Inicio");
});
