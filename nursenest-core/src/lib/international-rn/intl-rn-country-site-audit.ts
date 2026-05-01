import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwayFromMarketingHubSegment } from "@/lib/exam-pathways/exam-product-registry";
import { buildNursingTierHubContent, nursingTierMarketingHeadline } from "@/lib/marketing/nursing-tier-hub-content";
import { intlRnRegulatorDisclaimerText, resolveIntlRnHubSectionCopy } from "@/lib/marketing/intl-rn-pathway-hub-copy";
import { INTL_RN_COUNTRY_SITE_MATRIX, type IntlRnCountrySiteMatrixRow } from "@/lib/international-rn/intl-rn-country-site-matrix";
import { lintIntlRnMarketCorpus } from "@/lib/international-rn/intl-rn-content-lint";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { isGlobalRegionListedInCountrySwitcher } from "@/lib/navigation/market-readiness-country-switcher";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

export type IntlRnAuditFinding = {
  level: "error" | "warn";
  code: string;
  message: string;
  pathwayId?: string;
  detail?: string;
};

const PLACEHOLDER_RE = /\b(coming soon|lorem ipsum|tbd|placeholder text|overview copy is loading)\b/i;

function marketingEnPath(): string {
  const here = fileURLToPath(new URL(".", import.meta.url));
  return join(here, "../../../public/i18n/en/marketing.json");
}

function loadEnMarketing(): Record<string, string> {
  return JSON.parse(readFileSync(marketingEnPath(), "utf8")) as Record<string, string>;
}

function regionSlugForRow(row: IntlRnCountrySiteMatrixRow): GlobalRegionSlug {
  if (row.countrySlug === "uk") return "uk";
  if (row.countrySlug === "australia") return "aus";
  if (row.countrySlug === "philippines") return "philippines";
  if (row.countrySlug === "india") return "india";
  if (row.countrySlug === "nigeria") return "nigeria";
  return "saudi-arabia";
}

/**
 * Static audit for international RN foundation hubs (no HTTP, no browser).
 * Used by CI script and contract tests.
 */
export function auditInternationalRnCountrySites(): { errors: IntlRnAuditFinding[]; warnings: IntlRnAuditFinding[] } {
  const errors: IntlRnAuditFinding[] = [];
  const warnings: IntlRnAuditFinding[] = [];
  const messages = loadEnMarketing();
  const canonicals = new Set<string>();

  for (const row of INTL_RN_COUNTRY_SITE_MATRIX) {
    const pathway = EXAM_PATHWAYS.find((p) => p.id === row.pathwayId);
    if (!pathway) {
      errors.push({
        level: "error",
        code: "pathway.missing",
        message: `Pathway ${row.pathwayId} not found in EXAM_PATHWAYS`,
        pathwayId: row.pathwayId,
      });
      continue;
    }

    const resolved = resolveExamPathwayFromMarketingHubSegment(row.countrySlug, "rn", pathway.examCode);
    if (!resolved || resolved.id !== row.pathwayId) {
      errors.push({
        level: "error",
        code: "route.resolve",
        message: `Marketing route ${row.countrySlug}/rn/${pathway.examCode} does not resolve to ${row.pathwayId}`,
        pathwayId: row.pathwayId,
      });
    }

    const expectedTitle = `${row.titlePhrase} | NurseNest`;
    if (pathway.seoTitle !== expectedTitle) {
      errors.push({
        level: "error",
        code: "seo.title.matrix",
        message: `seoTitle must match matrix titlePhrase + brand suffix`,
        pathwayId: row.pathwayId,
        detail: `expected ${JSON.stringify(expectedTitle)}, got ${JSON.stringify(pathway.seoTitle)}`,
      });
    }

    const h1 = nursingTierMarketingHeadline(pathway);
    if (h1 !== row.h1Phrase) {
      errors.push({
        level: "error",
        code: "hub.h1.matrix",
        message: `Hub H1 must match matrix h1Phrase`,
        pathwayId: row.pathwayId,
        detail: `expected ${JSON.stringify(row.h1Phrase)}, got ${JSON.stringify(h1)}`,
      });
    }

    if (/\bNCLEX-RN\b/i.test(pathway.seoTitle)) {
      errors.push({
        level: "error",
        code: "seo.title.nclex-rn",
        message: "International RN foundation seoTitle must not use NCLEX-RN",
        pathwayId: row.pathwayId,
      });
    }

    const corePath = buildExamPathwayPath(pathway);
    canonicals.add(corePath);
    if (!corePath.startsWith(`/${row.countrySlug}/`)) {
      errors.push({
        level: "error",
        code: "route.base",
        message: "buildExamPathwayPath must start with country slug",
        pathwayId: row.pathwayId,
        detail: corePath,
      });
    }

    const hub = buildNursingTierHubContent(pathway);
    const hubCorpus = [
      hub.title,
      hub.intro,
      hub.description,
      hub.includedNote,
      hub.startHere,
      hub.differenceHeading,
      hub.differenceBody,
      ...hub.actions.map((a) => `${a.label} ${a.description} ${a.disabledNote ?? ""}`),
    ].join("\n");

    for (const hit of lintIntlRnMarketCorpus(row.lintMarket, hubCorpus)) {
      errors.push({
        level: "error",
        code: `lint.hub.${hit.ruleId}`,
        message: `Hub content failed ${hit.ruleId} lint`,
        pathwayId: row.pathwayId,
        detail: hit.excerpt,
      });
    }

    const copy = resolveIntlRnHubSectionCopy(pathway, messages);
    if (!copy) {
      errors.push({
        level: "error",
        code: "intl.copy.missing",
        message: "resolveIntlRnHubSectionCopy returned null",
        pathwayId: row.pathwayId,
      });
    } else {
      const sectionCorpus = [
        copy.overview,
        copy.whatYouStudy,
        copy.practicePreview,
        copy.flashcardsPreview,
        copy.catNote,
        copy.regionalHubLabel,
      ].join("\n\n");
      for (const hit of lintIntlRnMarketCorpus(row.lintMarket, sectionCorpus)) {
        errors.push({
          level: "error",
          code: `lint.i18n.${hit.ruleId}`,
          message: `Intl shard copy failed ${hit.ruleId} lint`,
          pathwayId: row.pathwayId,
          detail: hit.excerpt,
        });
      }
    }

    const disclaimer = intlRnRegulatorDisclaimerText(messages);
    if (!/not affiliated/i.test(disclaimer) || !/official regulator/i.test(disclaimer)) {
      errors.push({
        level: "error",
        code: "intl.disclaimer.shape",
        message: "Regulator disclaimer must mention non-affiliation and official regulator",
        pathwayId: row.pathwayId,
      });
    }

    for (const key of row.requiredMarketingKeys) {
      const v = messages[key]?.trim() ?? "";
      if (!v) {
        errors.push({
          level: "error",
          code: "i18n.missing",
          message: `Missing marketing key ${key}`,
          pathwayId: row.pathwayId,
        });
      } else if (PLACEHOLDER_RE.test(v)) {
        errors.push({
          level: "error",
          code: "i18n.placeholder",
          message: `Marketing key ${key} looks like placeholder copy`,
          pathwayId: row.pathwayId,
        });
      }
    }

    if (isPathwayPublishedForPublicSite(row.pathwayId)) {
      warnings.push({
        level: "warn",
        code: "sitemap.published",
        message: `Pathway ${row.pathwayId} is published for public site — confirm intentional launch`,
        pathwayId: row.pathwayId,
      });
    }

    const listed = isGlobalRegionListedInCountrySwitcher(regionSlugForRow(row));
    if (!listed) {
      warnings.push({
        level: "warn",
        code: "nav.country-switcher",
        message: `Region ${regionSlugForRow(row)} is not listed in public country switcher (readiness / hub gate)`,
        pathwayId: row.pathwayId,
      });
    }
  }

  if (canonicals.size !== INTL_RN_COUNTRY_SITE_MATRIX.length) {
    errors.push({
      level: "error",
      code: "seo.canonical.dup",
      message: "International RN foundation hubs must use distinct canonical base paths",
      detail: [...canonicals].join(", "),
    });
  }

  warnings.push({
    level: "warn",
    code: "blog.global-teaser",
    message:
      "Exam hub uses MarketingBlogLatestLinks (newest posts globally). Confirm featured titles stay regulator-neutral for intl audiences; pathway-scoped blog filters are not applied here.",
  });

  return { errors, warnings };
}

export function formatInternationalRnAuditReport(result: ReturnType<typeof auditInternationalRnCountrySites>): string {
  const lines: string[] = [];
  lines.push(`International RN country site audit`);
  lines.push(`Errors: ${result.errors.length} | Warnings: ${result.warnings.length}`);
  for (const e of result.errors) {
    lines.push(`[ERROR] ${e.code}: ${e.message}${e.pathwayId ? ` (${e.pathwayId})` : ""}${e.detail ? ` — ${e.detail}` : ""}`);
  }
  for (const w of result.warnings) {
    lines.push(`[WARN] ${w.code}: ${w.message}${w.pathwayId ? ` (${w.pathwayId})` : ""}${w.detail ? ` — ${w.detail}` : ""}`);
  }
  return lines.join("\n");
}
