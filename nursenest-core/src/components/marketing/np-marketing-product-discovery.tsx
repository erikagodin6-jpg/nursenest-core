import Link from "next/link";
import { ExamFamily } from "@prisma/client";
import { buildExamPathwayPath, EXAM_PATHWAYS, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

const US_NP_TRACK_ORDER = ["us-np-fnp", "us-np-agpcnp", "us-np-pmhnp"] as const;

function CaNpCnmpleSection() {
  const ca = getExamPathwayById("ca-np-cnple");
  if (!ca) return null;
  const waitlistOrUpcoming = ca.acquisitionMode === "waitlist" || ca.status === "upcoming";

  return (
    <section className="mt-10 border-t border-[var(--theme-card-border)] pt-10" aria-labelledby="np-ca-cnmple-heading">
      <h2 id="np-ca-cnmple-heading" className="text-xl font-semibold text-[var(--theme-heading-text)]">
        Canadian Nurse Practitioner (CNPLE)
      </h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        {waitlistOrUpcoming ? (
          <>
            This track is <strong className="text-[var(--theme-heading-text)]">coming online</strong> as national requirements
            stabilize. Join the waitlist for updates—lessons and questions ramp with the pathway; checkout opens when the
            offering is active.
          </>
        ) : (
          <>Pathway-scoped lessons, questions, and practice modes aligned to Canadian advanced practice expectations.</>
        )}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={buildExamPathwayPath(ca)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {waitlistOrUpcoming ? "CNPLE hub (status & waitlist) →" : "Open Canadian NP hub →"}
        </Link>
        {waitlistOrUpcoming ? (
          <Link
            href="/signup"
            className="text-sm font-semibold text-primary underline underline-offset-4 hover:no-underline"
          >
            Join waitlist
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function UsNpTracksSection() {
  const tracks = US_NP_TRACK_ORDER.map((id) => EXAM_PATHWAYS.find((row) => row.id === id)).filter(
    (p): p is ExamPathwayDefinition =>
      p !== undefined &&
      p.examFamily === ExamFamily.NP &&
      p.countrySlug === "us" &&
      p.status === "active",
  );

  return (
    <section className="mt-10 border-t border-[var(--theme-card-border)] pt-10" aria-labelledby="np-us-tracks-heading">
      <h2 id="np-us-tracks-heading" className="text-xl font-semibold text-[var(--theme-heading-text)]">
        US NP certification tracks
      </h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Each specialty has its own hub—Family NP (FNP), Adult-Gerontology Primary Care NP (AGPCNP), and Psychiatric-Mental
        Health NP (PMHNP). Boards and item styles differ; content never mixes between tracks.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {tracks.map((p) => (
          <li key={p.id}>
            <Link
              href={buildExamPathwayPath(p)}
              className="block rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 transition hover:border-primary/40"
            >
              <p className="text-sm font-semibold text-primary">{p.shortName}</p>
              <p className="mt-1 text-sm text-[var(--theme-muted-text)]">{p.boardLabel ?? p.displayName}</p>
              <span className="mt-3 inline-flex text-sm font-semibold text-primary">Open hub →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Surfaces all US NP products on the programmatic umbrella page, and Canadian CNPLE on CA-focused NP pages.
 * URLs come from {@link EXAM_PATHWAYS} + {@link buildExamPathwayPath}.
 */
export function NpMarketingProductDiscovery({
  marketingRegion,
  slug,
}: {
  marketingRegion: MarketingRegionToggle;
  slug: string;
}) {
  if (slug === "cnple-practice-questions") {
    return <CaNpCnmpleSection />;
  }
  if (slug !== "np-exam-practice-questions") {
    return null;
  }
  if (marketingRegion === "US") {
    return <UsNpTracksSection />;
  }
  return <CaNpCnmpleSection />;
}
