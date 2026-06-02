import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { IntlRnHubSectionCopy } from "@/lib/marketing/intl-rn-pathway-hub-copy";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

function ProseBlocks({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\n\n/).filter((p) => p.trim().length > 0);
  return (
    <div className={className}>
      {parts.map((p, i) => (
        <p key={i} className="nn-marketing-body mt-3 text-[var(--theme-body-text)] first:mt-0">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export function InternationalRnHubSections({
  pathway,
  copy,
  disclaimer,
}: {
  pathway: ExamPathwayDefinition;
  copy: IntlRnHubSectionCopy;
  disclaimer: string;
}) {
  const lessonsHref = buildExamPathwayPath(pathway, "lessons");
  const osceHref = pathway.countrySlug === "uk" ? buildExamPathwayPath(pathway, "osce") : null;

  return (
    <div className="mt-10 space-y-10">
      <aside
        className="rounded-2xl border border-[var(--semantic-border-soft)] p-5 sm:p-6"
        style={{ background: "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))" }}
      >
        <p className="nn-marketing-body-sm text-[var(--theme-body-text)]">{disclaimer}</p>
      </aside>

      <section aria-labelledby="intl-rn-overview">
        <h2 id="intl-rn-overview" className="nn-marketing-h3">
          Exam overview
        </h2>
        <ProseBlocks text={copy.overview} />
      </section>

      <section aria-labelledby="intl-rn-study">
        <h2 id="intl-rn-study" className="nn-marketing-h3">
          What you&apos;ll study
        </h2>
        <ProseBlocks text={copy.whatYouStudy} />
      </section>

      <section aria-labelledby="intl-rn-practice">
        <h2 id="intl-rn-practice" className="nn-marketing-h3">
          Practice questions preview
        </h2>
        <ProseBlocks text={copy.practicePreview} />
        <p className="mt-4">
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={buildExamPathwayPath(pathway, "questions")}>
            Open practice questions for this pathway
          </Link>
        </p>
      </section>

      <section aria-labelledby="intl-rn-flash">
        <h2 id="intl-rn-flash" className="nn-marketing-h3">
          Flashcards preview
        </h2>
        <ProseBlocks text={copy.flashcardsPreview} />
        <p className="mt-4">
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={buildExamPathwayPath(pathway, "flashcards")}>
            Open public flashcards for this pathway
          </Link>
        </p>
      </section>

      <section aria-labelledby="intl-rn-cat">
        <h2 id="intl-rn-cat" className="nn-marketing-h3">
          Adaptive practice (optional)
        </h2>
        <ProseBlocks text={copy.catNote} />
        <p className="mt-4">
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={buildExamPathwayPath(pathway, "cat")}>
            View adaptive session entry
          </Link>
        </p>
      </section>

      {osceHref ? (
        <section aria-labelledby="intl-rn-osce">
          <h2 id="intl-rn-osce" className="nn-marketing-h3">
            OSCE orientation
          </h2>
          <p className="nn-marketing-body text-[var(--theme-body-text)]">
            NurseNest ships an OSCE prep surface for skills and communication rehearsal. It does not replace live NMC station
            briefings or test-centre rules.
          </p>
          <p className="mt-3">
            <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={osceHref}>
              Open OSCE prep for this pathway
            </Link>
          </p>
        </section>
      ) : null}

      <section aria-labelledby="intl-rn-links">
        <h2 id="intl-rn-links" className="nn-marketing-h3">
          Guides & lesson hub
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 nn-marketing-body text-[var(--theme-body-text)]">
          <li>
            <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={copy.regionalHubHref}>
              {copy.regionalHubLabel}
            </Link>
          </li>
          <li>
            <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={lessonsHref}>
              Pathway lesson hub
            </Link>
          </li>
          {copy.showPricingCta ? (
            <li>
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={HUB.pricing}>
                Pricing
              </Link>
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
