import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isIntlRnFoundationPathwayId } from "@/lib/navigation/country-exam-launch-readiness";
import { MARKET_READINESS } from "@/lib/navigation/market-readiness-data";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

export type IntlRnHubSectionCopy = {
  /** Plain text; paragraphs separated by `\n\n` for rendering. */
  overview: string;
  whatYouStudy: string;
  practicePreview: string;
  flashcardsPreview: string;
  catNote: string;
  regionalHubHref: string;
  regionalHubLabel: string;
  showPricingCta: boolean;
};

function regionForPathway(pathway: ExamPathwayDefinition): GlobalRegionSlug | null {
  if (pathway.countrySlug === "uk") return "uk";
  if (pathway.countrySlug === "australia") return "aus";
  if (pathway.countrySlug === "philippines") return "philippines";
  if (pathway.countrySlug === "india") return "india";
  if (pathway.countrySlug === "nigeria") return "nigeria";
  if (pathway.countrySlug === "saudi-arabia") return "saudi-arabia";
  return null;
}

function keyPrefixForPathway(pathway: ExamPathwayDefinition): string | null {
  if (pathway.id === "uk-rn-nmc-test-of-competence") return "intlNursing.intlRn.uk";
  if (pathway.id === "au-rn-iqnm-pathway") return "intlNursing.intlRn.au";
  if (pathway.id === "ph-rn-prc-pnle") return "intlNursing.intlRn.ph";
  if (pathway.id === "in-rn-state-nursing-council-registration") return "intlNursing.intlRn.in";
  if (pathway.id === "ng-rn-nmcn-licensure") return "intlNursing.intlRn.ng";
  if (pathway.id === "sa-rn-scfhs-licensure") return "intlNursing.intlRn.sa";
  return null;
}

function pick(messages: Record<string, string>, key: string, fallback: string): string {
  const v = messages[key]?.trim();
  return v && v.length > 0 ? v : fallback;
}

/**
 * Long-form marketing sections for international RN foundation hubs.
 * Copy is sourced from the `marketing` shard (`intlNursing.intlRn.*` keys) with safe English fallbacks.
 */
export function resolveIntlRnHubSectionCopy(
  pathway: ExamPathwayDefinition,
  messages: Record<string, string>,
): IntlRnHubSectionCopy | null {
  if (!isIntlRnFoundationPathwayId(pathway.id)) return null;
  const prefix = keyPrefixForPathway(pathway);
  if (!prefix) return null;

  const r = regionForPathway(pathway);
  const mr = r ? MARKET_READINESS[r] : undefined;
  const showPricingCta = Boolean(
    mr?.pricingConfigured && mr?.conversionFunnelReady && mr?.supportTier === "full",
  );

  const regionalHubHref =
    pathway.countrySlug === "uk"
      ? "/exams/uk"
      : pathway.countrySlug === "australia"
        ? "/exams/australia"
        : pathway.countrySlug === "philippines"
          ? "/exams/philippines"
          : pathway.countrySlug === "india"
            ? "/exams/india"
            : pathway.countrySlug === "nigeria"
              ? "/exams/nigeria"
              : "/exams/middle-east";

  const regionalHubLabel = pick(messages, `${prefix}.regionalHubLabel`, "Regional licensing guide");

  return {
    overview: pick(messages, `${prefix}.overview`, "Overview copy is loading."),
    whatYouStudy: pick(messages, `${prefix}.whatYouStudy`, "Study overview copy is loading."),
    practicePreview: pick(messages, `${prefix}.practicePreview`, "Practice preview copy is loading."),
    flashcardsPreview: pick(messages, `${prefix}.flashcardsPreview`, "Flashcards preview copy is loading."),
    catNote: pick(messages, `${prefix}.catNote`, "Adaptive practice uses NCLEX-style formats for cognitive rehearsal only."),
    regionalHubHref,
    regionalHubLabel,
    showPricingCta,
  };
}

export function intlRnRegulatorDisclaimerText(messages: Record<string, string>): string {
  return pick(
    messages,
    "intlNursing.intlRn.disclaimer",
    "NurseNest is an independent exam preparation platform and is not affiliated with NMC, AHPRA/NMBA, PRC, NCSBN, or any regulator. Always verify current requirements with the official regulator.",
  );
}
