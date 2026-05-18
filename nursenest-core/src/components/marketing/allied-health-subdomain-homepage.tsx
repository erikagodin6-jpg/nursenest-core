import Link from "next/link";
import { Activity, BookOpenCheck, ClipboardList, FlaskConical, HeartPulse, Layers3, Microscope, Radar, ScanLine, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import {
  ALLIED_HUB_CATEGORY_META,
  alliedProfessionTrackChipLabel,
  listAlliedProfessionsSorted,
  type AlliedHubCategoryId,
} from "@/lib/allied/allied-professions-registry";
import { buildAlliedOccupationMarketingHubPath } from "@/lib/allied/allied-global-pathway";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AlliedPathwayHubOverview } from "@/lib/marketing/allied-pathway-hub-overview";

const categoryIcon: Record<AlliedHubCategoryId, typeof Activity> = {
  therapy: HeartPulse,
  lab: Microscope,
  acute: Stethoscope,
  clinical: ClipboardList,
  support: ShieldCheck,
};

const featuredClusters = [
  {
    title: "Respiratory Therapy",
    description: "ABGs, oxygen delivery, ventilator logic, airway safety, and respiratory pharmacology.",
    href: buildAlliedOccupationMarketingHubPath("respiratory-therapy"),
    links: ["ABG interpretation", "Mechanical ventilation", "Oxygen delivery", "Respiratory medications"],
    icon: Activity,
  },
  {
    title: "Medical Laboratory Science",
    description: "CBC interpretation, hematology patterns, microbiology, clinical chemistry, and specimen safety.",
    href: buildAlliedOccupationMarketingHubPath("medical-laboratory-science"),
    links: ["CBC review", "WBC morphology", "Clinical chemistry", "Microbiology"],
    icon: FlaskConical,
  },
  {
    title: "Radiologic Technology",
    description: "Positioning, imaging physics, radiation safety, anatomy, and modality decision-making.",
    href: buildAlliedOccupationMarketingHubPath("radiologic-technology"),
    links: ["Imaging physics", "Positioning", "Radiation safety", "CT vs MRI"],
    icon: ScanLine,
  },
];

const freeTools = [
  "ABG interpretation guide",
  "Lab values flashcards",
  "Ventilator settings review",
  "CBC reference practice",
  "Dosage calculation drills",
  "ECG basics for allied learners",
];

const authorityArticles = [
  "How to interpret ABGs step by step",
  "CBC values explained for allied health students",
  "Ventilator modes simplified",
  "Radiology positioning principles",
  "MLS hematology basics",
  "How to study for an allied health certification exam",
];

export function AlliedHealthSubdomainHomepage({
  pathway,
  overview,
  pricingHref,
  lessonsHref,
  questionsHref,
  flashcardsHref,
}: {
  pathway: ExamPathwayDefinition;
  overview: AlliedPathwayHubOverview | null;
  pricingHref: string;
  lessonsHref: string;
  questionsHref: string;
  flashcardsHref: string;
}) {
  const professions = listAlliedProfessionsSorted();
  const lessonCount = overview?.lessonCount ?? null;
  const questionCount = overview?.questionSnapshot.status === "ok" ? overview.questionSnapshot.pathwayScopedCount : null;
  const flashcardDeckCount = overview?.flashcardDeckCount ?? null;

  return (
    <main className="nn-marketing-surface nn-allied-health-homepage space-y-16 pb-16" data-nn-allied-homepage="1">
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-8 lg:px-10 lg:py-14">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--semantic-info)_16%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--semantic-success)_12%,transparent),transparent_32%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="nn-premium-home-eyebrow">Dedicated Allied Health Learning Ecosystem</p>
            <h1 className="nn-marketing-h1 mt-4 max-w-3xl text-balance text-[var(--palette-heading)]">
              Allied Health Exam Prep Built for Clinical Careers
            </h1>
            <p className="nn-marketing-body mt-5 max-w-2xl text-pretty text-[var(--palette-text-muted)] sm:text-lg">
              Practice questions, flashcards, lessons, and simulation-style review for allied health students and professionals — built for profession-specific study, not generic memorization.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#allied-professions" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95">
                Explore Professions
              </Link>
              <Link href={questionsHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]">
                Start Free Practice Questions
              </Link>
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Practice</dt>
                <dd className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{questionCount ? `${questionCount}+` : "Pathway"}</dd>
              </div>
              <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Lessons</dt>
                <dd className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{lessonCount ? `${lessonCount}+` : "Clinical"}</dd>
              </div>
              <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Recall</dt>
                <dd className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">{flashcardDeckCount ? `${flashcardDeckCount} decks` : "Flashcards"}</dd>
              </div>
            </dl>
          </div>

          <div className="relative rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_86%,var(--semantic-panel-muted))] p-4 shadow-[var(--semantic-shadow-soft)]">
            <div className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">Allied dashboard preview</p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">Choose a clinical lane</h2>
                </div>
                <Radar className="h-8 w-8 text-[var(--semantic-info)]" aria-hidden />
              </div>
              <div className="mt-5 space-y-3">
                {["Respiratory waveform review", "MLS hematology drill", "Radiology positioning set"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</span>
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-success)]">Ready</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[var(--semantic-border-soft)]">
                      <div className="h-2 rounded-full bg-[var(--semantic-brand)]" style={{ width: `${68 + index * 8}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="allied-professions" aria-labelledby="allied-professions-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="nn-premium-home-eyebrow">Profession Explorer</p>
            <h2 id="allied-professions-heading" className="nn-marketing-h2 mt-2">Choose your allied health profession</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Each card opens a focused occupation hub with scoped lessons, practice questions, flashcards, and exam-style review.
            </p>
          </div>
          <Link href={pricingHref} className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">View Allied pricing →</Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {professions.map((profession) => {
            const Icon = categoryIcon[profession.hubCategory];
            return (
              <Link key={profession.professionKey} href={buildAlliedOccupationMarketingHubPath(profession.professionKey)} className="group rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition motion-safe:hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))]">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-brand)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                    {ALLIED_HUB_CATEGORY_META[profession.hubCategory].label}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--theme-heading-text)] group-hover:text-[var(--semantic-brand)]">
                  {alliedProfessionTrackChipLabel(profession)}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{profession.description}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-[var(--semantic-brand)]">Open study hub →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 sm:p-8" aria-labelledby="how-allied-works-heading">
        <p className="nn-premium-home-eyebrow">How NurseNest Works</p>
        <h2 id="how-allied-works-heading" className="nn-marketing-h2 mt-2">Learn, practice, then simulate</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[{ title: "Learn", body: "Clinical lessons explain concepts before you start drilling questions.", href: lessonsHref, icon: BookOpenCheck }, { title: "Practice", body: "Question banks reinforce safety, interpretation, prioritization, and scope.", href: questionsHref, icon: ClipboardList }, { title: "Remember", body: "Flashcards support rapid recall for lab values, terminology, and procedures.", href: flashcardsHref, icon: Layers3 }].map((step) => {
            const Icon = step.icon;
            return (
              <Link key={step.title} href={step.href} className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))]">
                <Icon className="h-7 w-7 text-[var(--semantic-brand)]" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-[var(--theme-heading-text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{step.body}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="featured-allied-clusters-heading">
        <p className="nn-premium-home-eyebrow">Authority Clusters</p>
        <h2 id="featured-allied-clusters-heading" className="nn-marketing-h2 mt-2">Deep review by clinical discipline</h2>
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {featuredClusters.map((cluster) => {
            const Icon = cluster.icon;
            return (
              <article key={cluster.title} className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
                <Icon className="h-8 w-8 text-[var(--semantic-info)]" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold text-[var(--theme-heading-text)]">{cluster.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{cluster.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cluster.links.map((link) => (
                    <span key={link} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)]">{link}</span>
                  ))}
                </div>
                <Link href={cluster.href} className="mt-5 inline-flex text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">Open cluster →</Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]" aria-labelledby="allied-tools-heading">
        <div className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-6">
          <Sparkles className="h-8 w-8 text-[var(--semantic-info)]" aria-hidden />
          <h2 id="allied-tools-heading" className="nn-marketing-h2 mt-4">Free clinical tools and study starters</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Build organic entry points with useful, indexable resources that lead into profession-specific study paths.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {freeTools.map((tool) => (
            <div key={tool} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{tool}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8" aria-labelledby="allied-content-heading">
        <p className="nn-premium-home-eyebrow">Allied Health Library</p>
        <h2 id="allied-content-heading" className="nn-marketing-h2 mt-2">Educational content that supports SEO and conversion</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {authorityArticles.map((article) => (
            <article key={article} className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{article}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">Connects free education to lessons, questions, flashcards, and allied profession hubs.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)] p-8 text-center" aria-labelledby="allied-final-cta-heading">
        <ShieldCheck className="mx-auto h-10 w-10 text-[var(--semantic-success)]" aria-hidden />
        <h2 id="allied-final-cta-heading" className="nn-marketing-h2 mt-4">Start building clinical confidence</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Access {pathway.shortName} profession pathways with clinical lessons, practice questions, flashcards, and readiness review.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={pricingHref} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--role-cta)] px-8 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_10px_22px_color-mix(in_srgb,var(--role-cta-shadow)_55%,transparent)] transition hover:bg-[var(--role-cta-hover)]">
            View Allied pricing
          </Link>
          <Link href="#allied-professions" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-8 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]">
            Choose a profession
          </Link>
        </div>
      </section>
    </main>
  );
}
