import Link from "next/link";
import { ExamFamily } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

const US_NP_TRACK_ORDER = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
] as const;

const GENERIC_NP_DISCOVERY_SLUGS = new Set([
  "np-exam-practice-questions",
  "np-exam-prep",
  "np-clinical-cases",
  "cnple-practice-questions",
  "canada-np-exam-prep",
  "np-study-guide-canada",
]);

const CARD_COPY: Record<
  string,
  { eyebrow: string; summary: string; regionLabel: string }
> = {
  "us-np-fnp": {
    eyebrow: "Family primary care",
    summary: "Broad lifespan primary care, prevention, pharmacology, and outpatient management.",
    regionLabel: "US",
  },
  "us-np-agpcnp": {
    eyebrow: "Adult-gerontology primary care",
    summary: "Adult and older-adult care, multimorbidity, geriatrics, and chronic disease management.",
    regionLabel: "US",
  },
  "us-np-pmhnp": {
    eyebrow: "Psychiatric-mental health",
    summary: "Psychopharmacology, crisis safety, therapy boundaries, and mental health case reasoning.",
    regionLabel: "US",
  },
  "us-np-whnp": {
    eyebrow: "Women's health",
    summary: "Gynecology, prenatal and postpartum care, hormonal therapy, and preventive screening logic.",
    regionLabel: "US",
  },
  "us-np-pnp-pc": {
    eyebrow: "Pediatric primary care",
    summary: "Growth and development, immunizations, adolescent health, and pediatric triage decisions.",
    regionLabel: "US",
  },
  "ca-np-cnple": {
    eyebrow: "Canadian NP track",
    summary: "Canada-specific CNPLE discovery, clinical reasoning, and regulator-first prep guidance.",
    regionLabel: "Canada",
  },
};

function visibleNpTracks(marketingRegion: MarketingRegionToggle): ExamPathwayDefinition[] {
  const orderedIds =
    marketingRegion === "CA"
      ? (["ca-np-cnple", ...US_NP_TRACK_ORDER] as const)
      : ([...US_NP_TRACK_ORDER, "ca-np-cnple"] as const);

  return orderedIds
    .map((id) => EXAM_PATHWAYS.find((row) => row.id === id))
    .filter(
      (pathway): pathway is ExamPathwayDefinition =>
        pathway !== undefined &&
        pathway.examFamily === ExamFamily.NP &&
        isPathwayPublishedForPublicSite(pathway.id),
    );
}

function NpTrackCard({ pathway }: { pathway: ExamPathwayDefinition }) {
  const copy = CARD_COPY[pathway.id];
  if (!copy) return null;
  const waitlistOrUpcoming = pathway.acquisitionMode === "waitlist" || pathway.status === "upcoming";

  return (
    <li>
      <div className="h-full rounded-2xl border border-[var(--theme-card-border)] bg-[color-mix(in_srgb,var(--theme-card-bg)_88%,var(--semantic-panel-positive))] p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)] transition hover:border-primary/40">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-surface)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted-text)]">
            {copy.regionLabel}
          </span>
          {waitlistOrUpcoming ? (
            <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--theme-card-border))] bg-[color-mix(in_srgb,var(--semantic-warning)_14%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-heading-text)]">
              Rolling out
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{copy.eyebrow}</p>
        <h3 className="mt-2 text-base font-semibold text-[var(--theme-heading-text)]">{pathway.shortName}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--theme-muted-text)]">{copy.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={buildExamPathwayPath(pathway)} className="text-primary underline underline-offset-4 hover:no-underline">
            Open hub
          </Link>
          <Link
            href={buildExamPathwayPath(pathway, "questions")}
            className="text-[var(--theme-heading-text)]/90 underline underline-offset-4 hover:text-primary hover:no-underline"
          >
            Questions
          </Link>
          <Link
            href={buildExamPathwayPath(pathway, "cat")}
            className="text-[var(--theme-heading-text)]/90 underline underline-offset-4 hover:text-primary hover:no-underline"
          >
            CAT
          </Link>
          {waitlistOrUpcoming ? (
            <Link href="/signup" className="text-[var(--theme-heading-text)]/90 underline underline-offset-4 hover:text-primary hover:no-underline">
              Join waitlist
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/**
 * Surfaces specialty-first NP discovery on generic umbrella pages so users pick a track before entering
 * questions or CAT flows. URLs come from {@link EXAM_PATHWAYS} + {@link buildExamPathwayPath}.
 */
export function NpMarketingProductDiscovery({
  marketingRegion,
  slug,
}: {
  marketingRegion: MarketingRegionToggle;
  slug: string;
}) {
  if (!GENERIC_NP_DISCOVERY_SLUGS.has(slug)) {
    return null;
  }
  const tracks = visibleNpTracks(marketingRegion);
  if (tracks.length === 0) return null;
  const intro =
    marketingRegion === "CA"
      ? "Start with the Canadian NP track if that is your goal, then branch into US specialties only when you are intentionally comparing pathways."
      : "Choose the exact NP specialty first. Each hub keeps lessons, questions, CAT, and pricing pathway-scoped instead of defaulting generic NP traffic into FNP.";

  return (
    <section className="mt-10 border-t border-[var(--theme-card-border)] pt-10" aria-labelledby="np-specialty-discovery-heading">
      <h2 id="np-specialty-discovery-heading" className="nn-marketing-h3">
        Choose your NP specialty track
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-3xl text-[var(--theme-muted-text)]">{intro}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tracks.map((pathway) => (
          <NpTrackCard key={pathway.id} pathway={pathway} />
        ))}
      </ul>
    </section>
  );
}
