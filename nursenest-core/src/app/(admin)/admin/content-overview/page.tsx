import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadAdminContentModuleOverview,
  type ContentModuleOverviewCard,
  type AlliedProfessionOverview,
} from "@/lib/admin/admin-content-module-overview";

export const dynamic = "force-dynamic";

export default async function AdminContentOverviewPage() {
  await requireAdmin();
  const overview = await loadAdminContentModuleOverview();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-content-module-overview">
      <header className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">Platform governance</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          Platform Content &amp; Module Visibility
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Admin-only inventory of major content surfaces, launch state, tier access, and readiness warnings.
        </p>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Overview summary">
        <Metric label="Total surfaces" value={overview.summary.totalCards} />
        <Metric label="Live" value={overview.summary.live} />
        <Metric label="Hidden / admin-only" value={overview.summary.hiddenOrAdminOnly} />
        <Metric label="Needs attention" value={overview.summary.needsAttention} />
      </section>

      <section className="mt-6 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 text-sm">
        <div className="grid gap-2 md:grid-cols-2">
          <FlagRow label="ENABLE_ECG_MODULE" enabled={overview.featureFlags.enableEcgModule} />
          <FlagRow label="ENABLE_LAB_VALUES_MODULE" enabled={overview.featureFlags.enableLabValuesModule} />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader title="Major Modules & Content Pools" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {overview.modules.map((module) => (
            <ModuleCard key={module.key} module={module} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader title="Allied Health Pathways" />
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          <div className="grid grid-cols-[minmax(13rem,1.2fr)_repeat(5,minmax(5rem,.55fr))_minmax(11rem,.9fr)] gap-3 border-b border-[var(--semantic-border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            <span>Profession</span>
            <span>Lessons</span>
            <span>Cards</span>
            <span>Practice</span>
            <span>CAT</span>
            <span>Status</span>
            <span>Warnings</span>
          </div>
          {overview.alliedProfessions.map((profession) => (
            <AlliedRow key={profession.key} profession={profession} />
          ))}
        </div>
      </section>

      {overview.diagnostics.length > 0 ? (
        <section className="mt-10 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <h2 className="font-semibold">Defensive loader diagnostics</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {overview.diagnostics.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--semantic-text-primary)]">{value}</p>
    </div>
  );
}

function FlagRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="font-mono text-xs text-[var(--semantic-text-secondary)]">{label}</span>
      <span className={enabled ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900" : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800"}>
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{title}</h2>;
}

function ModuleCard({ module }: { module: ContentModuleOverviewCard }) {
  return (
    <article className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">{module.title}</h3>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">Readiness: {module.readiness}</p>
        </div>
        <span className="rounded-full bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]">
          {module.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {module.badges.map((badge) => (
          <span key={badge} className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
            {badge}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-[var(--semantic-text-secondary)] sm:grid-cols-2">
        <Count label="Lessons" value={module.counts.lessons} detail={module.counts.publishedLessons != null ? `${module.counts.publishedLessons} published` : undefined} />
        <Count label="Flashcards" value={module.counts.flashcards} detail={module.counts.publishedFlashcards != null ? `${module.counts.publishedFlashcards} published` : undefined} />
        <Count label="Practice questions" value={module.counts.practiceQuestions} detail={module.counts.publishedPracticeQuestions != null ? `${module.counts.publishedPracticeQuestions} published` : undefined} />
        <Count label="CAT questions" value={module.counts.catQuestions} detail={module.counts.publishedCatQuestions != null ? `${module.counts.publishedCatQuestions} published` : undefined} />
        <Count label="Clinical scenarios" value={module.counts.clinicalScenarios} detail={module.counts.publishedClinicalScenarios != null ? `${module.counts.publishedClinicalScenarios} approved` : undefined} />
        <Count label="Blog posts" value={module.counts.blogPosts} detail={module.counts.publishedBlogPosts != null ? `${module.counts.publishedBlogPosts} published` : undefined} />
      </dl>

      <div className="mt-4 text-sm">
        <p className="font-semibold text-[var(--semantic-text-primary)]">Tier access</p>
        <p className="mt-1 text-[var(--semantic-text-secondary)]">
          {Object.entries(module.tierAccess)
            .map(([tier, allowed]) => `${tier}: ${allowed ? "yes" : "blocked"}`)
            .join(" · ")}
        </p>
      </div>

      {module.warnings.length > 0 ? (
        <ul className="mt-4 grid gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
          {module.warnings.slice(0, 4).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {module.adminHref ? <ActionLink href={module.adminHref} label="Run readiness audit" /> : null}
        {module.learnerHref ? <ActionLink href={module.learnerHref} label="Open learner page" /> : null}
        {module.publicHref ? <ActionLink href={module.publicHref} label="Open public page" /> : null}
        {module.key === "ecg-module" ? (
          <Link
            href="/admin/modules/ecg"
            aria-disabled={!module.canPublish}
            className={
              module.canPublish
                ? "inline-flex min-h-[36px] items-center rounded-md bg-[var(--semantic-brand)] px-3 text-sm font-semibold nn-text-on-solid-fill"
                : "inline-flex min-h-[36px] cursor-not-allowed items-center rounded-md bg-slate-200 px-3 text-sm font-semibold text-slate-600"
            }
          >
            {module.canPublish ? "Open publish control" : "Publishing blocked"}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function Count({ label, value, detail }: { label: string; value: number | undefined; detail?: string }) {
  if (value == null) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</dt>
      <dd className="mt-1 font-semibold text-[var(--semantic-text-primary)]">
        {value}
        {detail ? <span className="ml-2 font-normal text-[var(--semantic-text-secondary)]">{detail}</span> : null}
      </dd>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex min-h-[36px] items-center rounded-md border border-[var(--semantic-border-soft)] px-3 text-sm font-semibold text-[var(--semantic-text-primary)]">
      {label}
    </Link>
  );
}

function AlliedRow({ profession }: { profession: AlliedProfessionOverview }) {
  const warningText = profession.warnings.length > 0 ? profession.warnings.slice(0, 2).join(" ") : "None";
  return (
    <div className="grid grid-cols-[minmax(13rem,1.2fr)_repeat(5,minmax(5rem,.55fr))_minmax(11rem,.9fr)] gap-3 border-b border-[var(--semantic-border-soft)] px-4 py-3 text-sm last:border-b-0">
      <div>
        <p className="font-semibold text-[var(--semantic-text-primary)]">{profession.professionLabel}</p>
        <p className="text-xs text-[var(--semantic-text-secondary)]">{profession.professionKey}</p>
      </div>
      <span>{profession.counts.lessons ?? 0}</span>
      <span>{profession.counts.flashcards ?? 0}</span>
      <span>{profession.counts.practiceQuestions ?? 0}</span>
      <span>{profession.counts.catQuestions ?? 0}</span>
      <span>{profession.readiness}</span>
      <span className="text-xs text-[var(--semantic-text-secondary)]">{warningText}</span>
    </div>
  );
}
