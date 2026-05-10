import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPlaceholderFallbackAudit,
  shouldFailPlaceholderFallbackThresholds,
  type PlaceholderFallbackReport,
} from "./i18n-report-placeholder-fallbacks";

const report: PlaceholderFallbackReport = {
  generatedAt: "2026-05-10T12:00:00.000Z",
  totalFallbacks: 4,
  byLocale: {
    es: 2,
    fr: 2,
  },
  events: [
    {
      locale: "es",
      key: "learner.practiceTests.examFirst.heroTitle",
      localizedValue: "Titulo {{count}}",
      englishValue: "Hero {{total}}",
      placeholdersInEnglish: ["total"],
      placeholdersInLocalized: ["count"],
    },
    {
      locale: "es",
      key: "hub.rn.heroTitle",
      localizedValue: "Titulo {{count}}",
      englishValue: "Hero {{total}}",
      placeholdersInEnglish: ["total"],
      placeholdersInLocalized: ["count"],
    },
    {
      locale: "fr",
      key: "public.marketing.cardLabel",
      localizedValue: "Carte {{count}}",
      englishValue: "Card {{total}}",
      placeholdersInEnglish: ["total"],
      placeholdersInLocalized: ["count"],
    },
    {
      locale: "fr",
      key: "settings.internal.debugLabel",
      localizedValue: "Debug {{count}}",
      englishValue: "Debug {{total}}",
      placeholdersInEnglish: ["total"],
      placeholdersInLocalized: ["count"],
    },
  ],
};

test("buildPlaceholderFallbackAudit categorizes learner and SEO-sensitive fallback leakage", () => {
  const audit = buildPlaceholderFallbackAudit(report);

  assert.equal(audit.totalFallbacks, 4);
  assert.equal(audit.categories.criticalSeoLeakage.count, 2);
  assert.equal(audit.categories.blockedLocaleCandidate.count, 1);
  assert.equal(audit.categories.acceptableFallback.count, 1);
  assert.deepEqual(audit.blockedLocaleCandidates, ["es"]);
});

test("shouldFailPlaceholderFallbackThresholds respects total and SEO thresholds", () => {
  const audit = buildPlaceholderFallbackAudit(report);

  assert.equal(shouldFailPlaceholderFallbackThresholds(audit, { total: 5, seo: 2 }).failed, false);
  assert.deepEqual(shouldFailPlaceholderFallbackThresholds(audit, { total: 3, seo: 2 }), {
    failed: true,
    reasons: ["totalFallbacks 4 exceeded NN_I18N_PLACEHOLDER_FAIL_THRESHOLD 3"],
  });
  assert.deepEqual(shouldFailPlaceholderFallbackThresholds(audit, { total: 5, seo: 0 }), {
    failed: true,
    reasons: ["criticalSeoLeakage 2 exceeded NN_I18N_PLACEHOLDER_SEO_FAIL_THRESHOLD 0"],
  });
});
