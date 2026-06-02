import Link from "next/link";
import { notFound } from "next/navigation";
import { loadAcademicTopicHub } from "@/lib/academic-content-graph/topic-hub.server";

type PageProps = {
  params: Promise<{ topicKey: string }>;
};

export default async function AcademicTopicHubPage({ params }: PageProps) {
  const { topicKey } = await params;
  const hub = await loadAcademicTopicHub(decodeURIComponent(topicKey));

  if (!hub) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="nn-learner-page-hero">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-tertiary)]">
          Master Topic
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
              {hub.displayName}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              One topic hub connects lessons, flashcards, questions, adaptive assessment, simulation, skills,
              medications, interpretation, remediation, and analytics through the NurseNest academic content graph.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-tertiary)]">
              Mastery Coverage
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--semantic-text-primary)]">
              {hub.overallMasteryCoverage}%
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">
          {hub.bodySystem ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1">
              {hub.bodySystem}
            </span>
          ) : null}
          {hub.clinicalCategory ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1">
              {hub.clinicalCategory}
            </span>
          ) : null}
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1">
            {hub.topicKey}
          </span>
        </div>
      </section>

      <section aria-labelledby="topic-activities-heading" className="space-y-3">
        <div>
          <h2 id="topic-activities-heading" className="text-lg font-bold text-[var(--semantic-text-primary)]">
            Topic Learning Activities
          </h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Activities become launchable when content is mapped to this master topic.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {hub.activities.map((activity) => {
            const content = (
              <div className="h-full rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition hover:border-[var(--semantic-border-strong)]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-tertiary)]">
                  {activity.label}
                </p>
                <h3 className="mt-2 text-base font-bold text-[var(--semantic-text-primary)]">
                  {activity.intent}
                </h3>
                <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
                  {activity.count > 0 ? `${activity.count} mapped assets` : "No mapped assets yet"}
                </p>
              </div>
            );

            return activity.href ? (
              <Link key={activity.key} href={activity.href} className="block focus:outline-none focus:ring-2 focus:ring-[var(--semantic-focus-ring)]">
                {content}
              </Link>
            ) : (
              <div key={activity.key} aria-disabled="true" className="opacity-70">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {hub.gaps.length ? (
        <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Coverage Gaps</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Missing mapped coverage: {hub.gaps.join(", ")}.
          </p>
        </section>
      ) : null}
    </main>
  );
}
