import assert from "node:assert/strict";
import test from "node:test";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayOverviewBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

test("localizeBreadcrumbResolution applies i18nKey crumbs using primary bundle", () => {
  const caRn = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(caRn);
  const unmapped = { ...caRn, id: "__breadcrumb_i18n_test_unmapped__" };
  const raw = pathwayOverviewBreadcrumbs(unmapped);
  const primary: MarketingMessages = {
    "breadcrumbs.home": "Inicio",
    "breadcrumbs.examLessonsIndex": "Lecciones por examen",
  };
  const fallback: MarketingMessages = {
    "breadcrumbs.home": "Home",
    "breadcrumbs.examLessonsIndex": "Lessons by exam pathway",
  };
  const loc = localizeBreadcrumbResolution(raw, primary, fallback);
  assert.equal(loc.crumbs[0]?.name, "Inicio");
  assert.equal(loc.crumbs[1]?.name, "Lecciones por examen");
  assert.equal(loc.schemaItems[0]?.name, "Inicio");
  assert.equal(loc.schemaItems[1]?.name, "Lecciones por examen");
});
