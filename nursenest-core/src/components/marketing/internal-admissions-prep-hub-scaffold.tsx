import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getAdmissionsPrepTaxonomyForPathwayId } from "@/lib/exam-pathways/admissions-prep-taxonomy";

type Props = {
  pathway: ExamPathwayDefinition;
  hubPath: string;
};

/**
 * Internal QA shell for hidden admissions-prep pathways (HESI / TEAS).
 * Does not import NCLEX hub modules, Stripe, or checkout — info-only placeholders until public launch.
 */
export function InternalAdmissionsPrepHubScaffold({ pathway, hubPath }: Props) {
  const canonical = buildExamPathwayPath(pathway);
  const tax = getAdmissionsPrepTaxonomyForPathwayId(pathway.id);

  return (
    <div
      className="space-y-8"
      data-nn-qa-internal-admissions-hub-scaffold="true"
      data-pathway-id={pathway.id}
    >
      <section
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))] px-5 py-8 sm:px-8"
        data-nn-qa-admissions-section="banner"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
          Internal QA only — not indexed, not purchasable
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--theme-heading-text)]">{pathway.displayName}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--theme-body-text)]">
          Info-only architecture preview. Production learners do not see this surface until product removes{" "}
          <span className="font-mono text-xs">hidden</span> status and completes launch governance (nav, sitemap,
          entitlements, Figma).
        </p>
        <dl className="mt-6 grid gap-3 text-sm text-[var(--theme-muted-text)] sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[var(--theme-heading-text)]">Pathway id</dt>
            <dd className="font-mono text-xs">{pathway.id}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--theme-heading-text)]">Exam key</dt>
            <dd className="font-mono text-xs">{pathway.examKey}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--theme-heading-text)]">Marketing base</dt>
            <dd className="font-mono text-xs">{canonical}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--theme-heading-text)]">Resolved path</dt>
            <dd className="font-mono text-xs">{hubPath}</dd>
          </div>
        </dl>
      </section>

      {tax ? (
        <>
          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="overview"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Exam overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">{tax.examOverview}</p>
          </section>

          <section
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="domains"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              Subjects / domains (taxonomy)
            </h2>
            <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
              Future lesson categories and pools — IDs are stable placeholders for imports.
            </p>
            <ul className="mt-5 space-y-4">
              {tax.subjectsOrDomains.map((row) => (
                <li
                  key={row.slug}
                  className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_15%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_6%,transparent)] px-4 py-3"
                >
                  <div className="font-medium text-[var(--theme-heading-text)]">{row.label}</div>
                  <dl className="mt-2 grid gap-1 font-mono text-[11px] leading-snug text-[var(--theme-muted-text)] sm:grid-cols-3">
                    <div>
                      <dt className="text-[var(--theme-heading-text)]">Lesson category id</dt>
                      <dd className="break-all">{row.lessonCategoryId}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--theme-heading-text)]">Practice pool id</dt>
                      <dd className="break-all">{row.practicePoolId}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--theme-heading-text)]">Flashcard pool id</dt>
                      <dd className="break-all">{row.flashcardPoolId}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="question-formats"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              Question format expectations
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--theme-body-text)]">
              {tax.questionFormatExpectations.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_8%,var(--semantic-surface))] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="study-plan-preview"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Study plan preview (planned)</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--theme-body-text)]">
              {tax.studyPlanPreviewBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="future-hooks"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              Practice, CAT & flashcards (future hooks)
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-dashed border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,transparent)] px-4 py-3 text-sm text-[var(--theme-body-text)]">
                <div className="font-semibold text-[var(--theme-heading-text)]">Adaptive / CAT</div>
                <p className="mt-2 text-[var(--theme-muted-text)]">
                  Eligibility flag (planned):{" "}
                  <span className="font-mono text-xs">{tax.futureCatEligible ? "yes" : "no"}</span>. Not wired until
                  pools and pathway readiness config are approved.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,transparent)] px-4 py-3 text-sm text-[var(--theme-body-text)]">
                <div className="font-semibold text-[var(--theme-heading-text)]">Flashcards</div>
                <p className="mt-2 text-[var(--theme-muted-text)]">
                  Deck generation will map to flashcard pool IDs above. No learner decks ship in this phase.
                </p>
              </div>
            </div>
          </section>

          <section
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="free-vs-premium"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
              Free vs premium (placeholder — not enforced here)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--semantic-border-soft)]">
                    <th className="py-2 pr-4 font-semibold text-[var(--theme-heading-text)]">Surface</th>
                    <th className="py-2 pr-4 font-semibold text-[color-mix(in_srgb,var(--semantic-info)_70%,var(--theme-heading-text))]">
                      Free (planned)
                    </th>
                    <th className="py-2 font-semibold text-[color-mix(in_srgb,var(--semantic-brand)_65%,var(--theme-heading-text))]">
                      Premium (planned)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[var(--theme-body-text)]">
                  <tr className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)]">
                    <td className="py-2 pr-4">Core lessons & drills</td>
                    <td className="py-2 pr-4">Baseline tracks</td>
                    <td className="py-2">Expanded banks & analytics</td>
                  </tr>
                  <tr className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)]">
                    <td className="py-2 pr-4">Mini quizzes</td>
                    <td className="py-2 pr-4">Limited</td>
                    <td className="py-2">Full timed modes</td>
                  </tr>
                  <tr className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)]">
                    <td className="py-2 pr-4">CAT / adaptive</td>
                    <td className="py-2 pr-4">Not included</td>
                    <td className="py-2">Included when eligible</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Stripe / checkout</td>
                    <td className="py-2 pr-4" colSpan={2}>
                      <span className="text-[var(--semantic-warning)]">
                        Not linked on this scaffold — future phase only.
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_12%,var(--semantic-surface))] px-5 py-7 sm:px-8"
            data-nn-qa-admissions-section="staff-notes"
          >
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Staff preview notes</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">{tax.staffPreviewNotes}</p>
          </section>
        </>
      ) : (
        <p className="text-sm text-[var(--semantic-danger)]">Taxonomy missing for pathway — check registry mapping.</p>
      )}
    </div>
  );
}
