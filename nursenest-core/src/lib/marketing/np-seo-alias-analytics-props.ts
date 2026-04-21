import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";

/** Shared PostHog dimensions for NP SEO alias landings (additive; keeps existing keys for dashboards). */
export function npSeoAliasContextProps(
  pathway: ExamPathwayDefinition,
  aliasSegment: string,
): Record<string, string | boolean> {
  return {
    np_alias_slug: aliasSegment,
    np_seo_alias_segment: aliasSegment,
    from_np_seo_alias: true,
    pathway_id: pathway.id,
    canonical_pathway_hub_path: buildExamPathwayPath(pathway),
    pathway_country_slug: pathway.countrySlug,
    exam_family: String(pathway.examFamily),
  };
}

/**
 * Base props for every `marketing_pathway_hub_cta` link on pathway hubs: explicit alias dimensions when on an NP
 * keyword URL; otherwise stable `from_np_seo_alias: false` for dashboards.
 */
export function pathwayMarketingHubLinkContext(
  pathway: ExamPathwayDefinition,
  npSeoAliasSegment: string | undefined,
): Record<string, string | boolean> {
  if (npSeoAliasSegment) {
    return npSeoAliasContextProps(pathway, npSeoAliasSegment);
  }
  return {
    pathway_id: pathway.id,
    from_np_seo_alias: false,
    np_seo_alias_segment: "",
    canonical_pathway_hub_path: buildExamPathwayPath(pathway),
    pathway_country_slug: pathway.countrySlug,
    exam_family: String(pathway.examFamily),
  };
}

export type PathwayMarketingHubLinkContext = ReturnType<typeof pathwayMarketingHubLinkContext>;

/** Pathway dimensions for programmatic SEO → board-named NP alias URL clicks (no `from_np_seo_alias`). */
const NP_BOARD_CROSSLINK_DIMS: Record<
  string,
  { canonical_pathway_hub_path: string; pathway_country_slug: string; exam_family: string }
> = {
  "us-np-fnp": { canonical_pathway_hub_path: "/us/np/fnp", pathway_country_slug: "us", exam_family: "NP" },
  "us-np-agpcnp": { canonical_pathway_hub_path: "/us/np/agpcnp", pathway_country_slug: "us", exam_family: "NP" },
  "us-np-pmhnp": { canonical_pathway_hub_path: "/us/np/pmhnp", pathway_country_slug: "us", exam_family: "NP" },
  "us-np-whnp": { canonical_pathway_hub_path: "/us/np/whnp", pathway_country_slug: "us", exam_family: "NP" },
  "us-np-pnp-pc": { canonical_pathway_hub_path: "/us/np/pnp-pc", pathway_country_slug: "us", exam_family: "NP" },
  "ca-np-cnple": { canonical_pathway_hub_path: "/canada/np/cnple", pathway_country_slug: "canada", exam_family: "NP" },
};

export function npBoardAliasCrosslinkProps(pathwayId: string): Record<string, string> {
  const dims = NP_BOARD_CROSSLINK_DIMS[pathwayId];
  return {
    destination_type: "np_alias_landing_link",
    ...(dims ?? {}),
  };
}
