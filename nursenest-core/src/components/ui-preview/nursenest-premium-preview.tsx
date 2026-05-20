"use client";

/**
 * NurseNest internal /preview surface entry point.
 *
 * Routes the noindex `/preview/[surface]` page to per-surface preview bodies.
 * Heavy homepage sections live in `homepage-premium-preview.tsx`; shared
 * primitives live in `_preview-shared.tsx`.
 *
 * NOT used by production marketing routes.
 */

import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  LineChart,
  ShieldAlert,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MetricCard,
  Pill,
  PreviewBrand,
  PreviewCard,
  ThemeSwitcher,
  cx,
  isPreviewTheme,
  semantic,
  themeVars,
  type PreviewTheme,
} from "./_preview-shared";
import { HomepagePreview } from "./homepage-premium-preview";
import type { PreviewKind, PreviewSurface } from "@/lib/ui-preview/preview-surfaces";

function SectionHeader({ surface }: { surface: PreviewSurface }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <Pill>{surface.eyebrow}</Pill>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-[var(--preview-text)] sm:text-5xl lg:text-6xl">
          {surface.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--preview-muted)] sm:text-lg">
          {surface.description}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button className="rounded-2xl">Start Preview</Button>
          <Button variant="outline" className="rounded-2xl border-[var(--preview-border)] bg-[var(--preview-surface)]">
            Review Design Notes
          </Button>
        </div>
      </div>
      <PreviewCard className="bg-[linear-gradient(135deg,var(--preview-accent-soft),var(--preview-surface))]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--preview-muted)]">Readiness</p>
            <p className="mt-2 text-4xl font-bold text-[var(--preview-text)]">82%</p>
          </div>
          <Gauge className="h-16 w-16 text-[var(--preview-accent)]" />
        </div>
        <Progress value={82} className="mt-6" />
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-[var(--preview-muted)]">
          <span>Study</span>
          <span>Practice</span>
          <span>Review</span>
        </div>
      </PreviewCard>
    </section>
  );
}

function StudyRail() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-8 space-y-4 rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/78 p-4 shadow-sm backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--preview-muted)]">On This Page</p>
        {Object.values(semantic).slice(0, 7).map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cx(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold",
                index === 0 ? "bg-[var(--preview-accent-soft)] text-[var(--preview-text)]" : "text-[var(--preview-muted)]",
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
        <div className="rounded-2xl bg-[var(--preview-surface-2)] p-3">
          <div className="flex justify-between text-xs font-bold text-[var(--preview-muted)]">
            <span>Lesson Progress</span>
            <span>64%</span>
          </div>
          <Progress value={64} className="mt-3" />
        </div>
      </div>
    </aside>
  );
}

function LessonPreview() {
  return (
    <div className="grid gap-6 xl:grid-cols-[230px_minmax(0,1fr)_280px]">
      <StudyRail />
      <main className="space-y-5">
        <PreviewCard className="bg-[linear-gradient(135deg,var(--preview-surface),var(--preview-accent-soft))]">
          <Pill tone="blue">Heart Failure Priorities</Pill>
          <h2 className="mt-4 text-3xl font-bold text-[var(--preview-text)]">Fluid overload, perfusion, and escalation cues</h2>
          <p className="mt-3 text-[var(--preview-muted)]">A guided workflow for clinical judgment, prioritization, and exam-ready recall.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {["Readiness", "Study", "Reinforce", "Mastered"].map((phase, index) => (
              <div key={phase} className="flex items-center gap-2 text-sm font-bold text-[var(--preview-muted)]">
                <span className={cx("grid h-8 w-8 place-items-center rounded-full border", index < 1 ? "bg-emerald-600 text-white" : index === 1 ? "border-[var(--preview-accent)] bg-[var(--preview-accent-soft)]" : "border-[var(--preview-border)]")}>
                  {index < 1 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                {phase}
              </div>
            ))}
          </div>
        </PreviewCard>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.values(semantic).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-3xl border p-5 shadow-sm"
                style={{
                  borderColor: `color-mix(in srgb, ${item.color} 40%, var(--preview-border))`,
                  background: `color-mix(in srgb, ${item.color} 10%, var(--preview-surface))`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl p-3 text-white" style={{ background: item.color }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-bold text-[var(--preview-text)]">{item.label}</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--preview-muted)]">
                  <li>Recognize priority cues before selecting an intervention.</li>
                  <li>Connect bedside assessment to exam-style judgment.</li>
                  <li>Use trend-based escalation rather than isolated numbers.</li>
                </ul>
              </div>
            );
          })}
        </div>
        <PreviewCard className="bg-[var(--preview-surface-2)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--preview-text)]">Quick Clinical Summary</h2>
              <p className="text-sm font-semibold text-[var(--preview-muted)]">Final rapid review before practice</p>
            </div>
            <Pill tone="green">Printable Cram Sheet</Pill>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Key Takeaways", "Red Flags", "Priority Interventions", "Exam Traps", "Must-Know Labs", "Escalation Cues"].map((title) => (
              <div key={title} className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)] p-4">
                <p className="font-bold text-[var(--preview-text)]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">Three dense bullets for final review and recall.</p>
              </div>
            ))}
          </div>
        </PreviewCard>
      </main>
      <aside className="hidden space-y-4 xl:block">
        <PreviewCard><Pill>Saved</Pill><p className="mt-3 text-sm text-[var(--preview-muted)]">Bookmark, study time, and recall status.</p></PreviewCard>
        <PreviewCard><Pill tone="green">Exam Ready</Pill><p className="mt-3 text-3xl font-bold text-[var(--preview-text)]">76%</p></PreviewCard>
        <PreviewCard><Button className="w-full rounded-2xl">Start Practice</Button></PreviewCard>
      </aside>
    </div>
  );
}

function DashboardPreview({ kind }: { kind: PreviewKind }) {
  const cards =
    kind === "admin"
      ? [
          ["QA Queue", "18", ClipboardCheck, "amber"],
          ["Content Health", "94%", BarChart3, "green"],
          ["Flagged Items", "7", ShieldAlert, "rose"],
        ] as const
      : [
          ["Readiness", "82%", Gauge, "blue"],
          ["Study Streak", "12d", TrendingUp, "green"],
          ["Weak Areas", "5", Target, "amber"],
        ] as const;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">{cards.map(([title, value, Icon, tone]) => <MetricCard key={title} title={title} value={value} icon={Icon} tone={tone} />)}</div>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <PreviewCard>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--preview-text)]">{kind === "admin" ? "Operational Workbench" : "Today's Study Plan"}</h2>
            <Pill tone="blue">Actionable</Pill>
          </div>
          <div className="mt-5 space-y-3">
            {["Review cardiac priority cues", "Complete mixed practice set", "Reinforce missed pharmacology cards", "Check readiness trend"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-elevated)] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--preview-accent-soft)] font-bold text-[var(--preview-accent)]">{index + 1}</span>
                  <span className="font-semibold text-[var(--preview-text)]">{item}</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Open</Button>
              </div>
            ))}
          </div>
        </PreviewCard>
        <PreviewCard>
          <h2 className="text-xl font-bold text-[var(--preview-text)]">Domain Mastery</h2>
          <div className="mt-5 space-y-4">
            {["Cardiac", "Pharmacology", "Maternal/Newborn", "Safety"].map((item, index) => (
              <div key={item}>
                <div className="mb-2 flex justify-between text-sm font-bold text-[var(--preview-muted)]">
                  <span>{item}</span>
                  <span>{72 - index * 8}%</span>
                </div>
                <Progress value={72 - index * 8} />
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function ExamPreview({ kind }: { kind: PreviewKind }) {
  const isCat = kind === "cat";
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <PreviewCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Pill tone={isCat ? "blue" : "green"}>{isCat ? "Adaptive CAT" : "Question 8 of 30"}</Pill>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--preview-muted)]">
            <Timer className="h-4 w-4" />
            54:12
          </div>
        </div>
        <h2 className="mt-5 text-2xl font-bold leading-tight text-[var(--preview-text)]">
          A client with heart failure reports new confusion and increasing dyspnea. Which action should the nurse take first?
        </h2>
        <div className="mt-6 space-y-3">
          {["Give scheduled diuretic and reassess later", "Raise the head of bed and assess oxygen saturation", "Offer oral fluids to improve perfusion", "Document the finding as expected fatigue"].map((answer, index) => (
            <button
              key={answer}
              type="button"
              className={cx(
                "w-full rounded-2xl border p-4 text-left font-semibold text-[var(--preview-text)]",
                index === 1 ? "border-[var(--preview-accent)] bg-[var(--preview-accent-soft)]" : "border-[var(--preview-border)] bg-[var(--preview-surface)]",
              )}
            >
              {answer}
            </button>
          ))}
        </div>
      </PreviewCard>
      <PreviewCard>
        <h3 className="font-bold text-[var(--preview-text)]">{isCat ? "CAT Rules" : "Rationale Panel"}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">
          {isCat ? "Rationales stay hidden until the adaptive session is complete." : "Rationale appears after answer submission with exam traps and next study links."}
        </p>
        <div className="mt-5 space-y-3">
          <Pill tone="amber">Priority Cue</Pill>
          <Pill tone="rose">Red Flag</Pill>
          <Pill tone="green">Next Step</Pill>
        </div>
      </PreviewCard>
    </div>
  );
}

function FlashcardPreview({ session = false }: { session?: boolean }) {
  if (session) {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <PreviewCard className="min-h-[420px] bg-[linear-gradient(135deg,var(--preview-surface),var(--preview-accent-soft))]">
          <Pill tone="purple">Clinical Recall</Pill>
          <h2 className="mt-8 text-4xl font-bold text-[var(--preview-text)]">What finding suggests worsening left-sided heart failure?</h2>
          <p className="mt-6 text-lg leading-8 text-[var(--preview-muted)]">Reveal answer, rate confidence, then reinforce with linked practice.</p>
        </PreviewCard>
        <PreviewCard>
          <h3 className="font-bold text-[var(--preview-text)]">Confidence</h3>
          <div className="mt-5 grid gap-3">
            {["Again", "Hard", "Good", "Easy"].map((item) => <Button key={item} variant="outline" className="rounded-2xl">{item}</Button>)}
          </div>
        </PreviewCard>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["Cardiac Priorities", "Labs and Diagnostics", "Medication Safety", "Exam Traps", "Patient Teaching", "Weak Areas"].map((deck, index) => (
        <PreviewCard key={deck}>
          <Pill tone={index % 2 === 0 ? "blue" : "green"}>{index + 18} Cards</Pill>
          <h3 className="mt-4 text-xl font-bold text-[var(--preview-text)]">{deck}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">Spaced review, confidence tracking, and linked rationale.</p>
          <Progress value={54 + index * 6} className="mt-5" />
        </PreviewCard>
      ))}
    </div>
  );
}

function MarketingPreview({ kind }: { kind: PreviewKind }) {
  const isPricing = kind === "pricing";
  const isFaq = kind === "faq";
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        {(isPricing ? ["Starter", "Pro", "Complete"] : isFaq ? ["Billing", "Exam Prep", "Account"] : ["RN", "RPN/PN", "NP"]).map((item, index) => (
          <PreviewCard key={item} className={index === 1 ? "ring-2 ring-[var(--preview-accent)]" : ""}>
            <Pill tone={index === 1 ? "green" : "blue"}>{isPricing ? "Plan" : "Pathway"}</Pill>
            <h3 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">Clinical study flow, semantic progress, and clear action hierarchy.</p>
            <Button className="mt-5 w-full rounded-2xl">{isPricing ? "Choose Plan" : isFaq ? "View Answer" : "Explore Pathway"}</Button>
          </PreviewCard>
        ))}
      </div>
      <PreviewCard className="bg-[linear-gradient(135deg,var(--preview-accent-soft),var(--preview-surface))]">
        <div className="grid gap-5 md:grid-cols-[1fr_240px]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--preview-text)]">High-trust clinical learning, without visual clutter</h2>
            <p className="mt-3 text-[var(--preview-muted)]">A richer medical SaaS direction using NurseNest's existing brand and typography.</p>
          </div>
          <div className="rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)] p-5">
            <LineChart className="h-16 w-16 text-[var(--preview-accent)]" />
          </div>
        </div>
      </PreviewCard>
    </div>
  );
}

function BlogPreview({ detail = false }: { detail?: boolean }) {
  return (
    <div className={cx("grid gap-5", detail && "lg:grid-cols-[220px_minmax(0,1fr)]")}>
      {detail ? <StudyRail /> : null}
      <div className="space-y-5">
        <PreviewCard>
          <Pill tone="blue">Clinical Article</Pill>
          <h2 className="mt-4 text-3xl font-bold text-[var(--preview-text)]">{detail ? "Metabolic Alkalosis and Hypokalemia" : "Clinical Learning Library"}</h2>
          <p className="mt-3 text-[var(--preview-muted)]">Readable, structured, clinically useful article surfaces with semantic callouts.</p>
        </PreviewCard>
        <div className="grid gap-4 md:grid-cols-3">
          {["Key Takeaways", "Clinical Pearl", "Exam Focus"].map((item, index) => (
            <PreviewCard key={item}>
              <Pill tone={index === 1 ? "blue" : index === 2 ? "amber" : "green"}>{item}</Pill>
              <p className="mt-4 text-sm leading-6 text-[var(--preview-muted)]">Concise article card or callout with internal study link.</p>
            </PreviewCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolPreview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <PreviewCard>
        <h2 className="text-xl font-bold text-[var(--preview-text)]">Dosage Calculator</h2>
        <div className="mt-5 space-y-3">
          {["Ordered dose", "Available dose", "Volume"].map((label) => (
            <div key={label} className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-elevated)] px-4 py-3 text-sm font-semibold text-[var(--preview-muted)]">{label}</div>
          ))}
        </div>
      </PreviewCard>
      <PreviewCard>
        <Pill tone="green">Result</Pill>
        <p className="mt-5 text-5xl font-bold text-[var(--preview-text)]">2.5 mL</p>
        <p className="mt-4 text-[var(--preview-muted)]">Includes unit check, safety explanation, and nursing considerations.</p>
      </PreviewCard>
    </div>
  );
}

function SurfaceBody({ surface }: { surface: PreviewSurface }) {
  const kind = surface.kind;
  if (surface.slug === "homepage") return <HomepagePreview />;
  if (kind === "lesson") return <LessonPreview />;
  if (kind === "dashboard" || kind === "admin" || kind === "report" || kind === "analytics" || kind === "pathway-hub") return <DashboardPreview kind={kind} />;
  if (kind === "flashcards") return <FlashcardPreview />;
  if (kind === "flashcard-session") return <FlashcardPreview session />;
  if (kind === "practice-builder" || kind === "practice-runner" || kind === "cat") return <ExamPreview kind={kind} />;
  if (kind === "blog-index") return <BlogPreview />;
  if (kind === "blog-detail") return <BlogPreview detail />;
  if (kind === "tools") return <ToolPreview />;
  return <MarketingPreview kind={kind} />;
}

export function NurseNestPremiumPreview({ surface }: { surface: PreviewSurface }) {
  const [theme, setTheme] = useState<PreviewTheme>("ocean");
  const style = useMemo(() => themeVars[theme] as CSSProperties, [theme]);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("theme");
    if (isPreviewTheme(requested)) setTheme(requested);
  }, []);

  return (
    <div
      style={style}
      data-preview-theme={theme}
      className="min-h-screen bg-[var(--preview-bg)] text-[var(--preview-text)]"
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--preview-accent)_18%,transparent),transparent_34rem),radial-gradient(circle_at_88%_8%,color-mix(in_srgb,var(--preview-accent-2)_15%,transparent),transparent_26rem)]" />
      <header className="relative z-10 border-b border-[var(--preview-border)] bg-[var(--preview-surface)]/84 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <PreviewBrand />
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="green">Noindex Preview</Pill>
            <Pill>Mock Data</Pill>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 pb-28 sm:px-6 lg:px-8">
        {surface.slug === "homepage" ? null : <SectionHeader surface={surface} />}
        <SurfaceBody surface={surface} />
      </main>
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </div>
  );
}
