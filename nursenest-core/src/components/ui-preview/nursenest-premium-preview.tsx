"use client";

import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gauge,
  GraduationCap,
  HeartPulse,
  Layers3,
  Lightbulb,
  LineChart,
  Lock,
  NotebookTabs,
  PillIcon,
  Play,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type CSSProperties } from "react";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PreviewKind, PreviewSurface } from "@/lib/ui-preview/preview-surfaces";

type PreviewTheme = "blossom" | "ocean" | "forest" | "midnight";

const themeLabels: Record<PreviewTheme, string> = {
  blossom: "Blossom",
  ocean: "Ocean",
  forest: "Forest",
  midnight: "Midnight",
};

function isPreviewTheme(value: string | null): value is PreviewTheme {
  return value === "blossom" || value === "ocean" || value === "forest" || value === "midnight";
}

const themeVars: Record<PreviewTheme, Record<string, string>> = {
  blossom: {
    "--preview-bg": "#fff7fb",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#fff0f7",
    "--preview-elevated": "#fffafd",
    "--preview-text": "#341827",
    "--preview-muted": "#7b5a6c",
    "--preview-border": "rgba(190, 90, 132, 0.24)",
    "--preview-accent": "#db2777",
    "--preview-accent-2": "#38bdf8",
    "--preview-accent-soft": "#fce7f3",
  },
  ocean: {
    "--preview-bg": "#f3fbff",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#e6f7fb",
    "--preview-elevated": "#f8fdff",
    "--preview-text": "#0f2d3a",
    "--preview-muted": "#486978",
    "--preview-border": "rgba(8, 145, 178, 0.24)",
    "--preview-accent": "#0891b2",
    "--preview-accent-2": "#2563eb",
    "--preview-accent-soft": "#cffafe",
  },
  forest: {
    "--preview-bg": "#f6fbf5",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#edf7ec",
    "--preview-elevated": "#fbfefb",
    "--preview-text": "#163321",
    "--preview-muted": "#526d5d",
    "--preview-border": "rgba(5, 150, 105, 0.22)",
    "--preview-accent": "#059669",
    "--preview-accent-2": "#0f766e",
    "--preview-accent-soft": "#d1fae5",
  },
  midnight: {
    "--preview-bg": "#08111f",
    "--preview-surface": "#101a2b",
    "--preview-surface-2": "#132238",
    "--preview-elevated": "#17243a",
    "--preview-text": "#edf7ff",
    "--preview-muted": "#9fb5cc",
    "--preview-border": "rgba(148, 163, 184, 0.28)",
    "--preview-accent": "#38bdf8",
    "--preview-accent-2": "#818cf8",
    "--preview-accent-soft": "rgba(56, 189, 248, 0.14)",
  },
};

const semantic = {
  patho: { label: "Pathophysiology", color: "#3730a3", icon: Activity },
  labs: { label: "Diagnostics & Labs", color: "#d97706", icon: FlaskConical },
  symptoms: { label: "Signs & Symptoms", color: "#ea580c", icon: HeartPulse },
  redFlags: { label: "Red Flags", color: "#e11d48", icon: ShieldAlert },
  interventions: { label: "Nursing Interventions", color: "#059669", icon: Stethoscope },
  teaching: { label: "Patient Teaching", color: "#0891b2", icon: GraduationCap },
  meds: { label: "Medications", color: "#db2777", icon: PillIcon },
  pearls: { label: "Clinical Pearls", color: "#7c3aed", icon: Lightbulb },
  exam: { label: "Exam Focus", color: "#2563eb", icon: Target },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function PreviewBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-[var(--preview-border)]">
        <BrandLeafIcon size={34} />
      </span>
      <div>
        <div className="text-lg font-bold tracking-tight text-[var(--preview-text)]">NurseNest</div>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--preview-muted)]">
          UI Preview
        </div>
      </div>
    </div>
  );
}

function ThemeSwitcher({ theme, setTheme }: { theme: PreviewTheme; setTheme: (theme: PreviewTheme) => void }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-full border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      {(Object.keys(themeLabels) as PreviewTheme[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => setTheme(key)}
          className={cx(
            "rounded-full px-3 py-2 text-xs font-bold transition",
            theme === key
              ? "bg-[var(--preview-accent)] text-white shadow-sm"
              : "text-[var(--preview-muted)] hover:bg-[var(--preview-accent-soft)] hover:text-[var(--preview-text)]",
          )}
        >
          {themeLabels[key]}
        </button>
      ))}
    </div>
  );
}

function Pill({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "green" | "amber" | "rose" | "blue" | "purple";
}) {
  const color =
    tone === "green"
      ? "#059669"
      : tone === "amber"
        ? "#d97706"
        : tone === "rose"
          ? "#e11d48"
          : tone === "blue"
            ? "#2563eb"
            : tone === "purple"
              ? "#7c3aed"
              : "var(--preview-accent)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 34%, var(--preview-border))`,
        background: `color-mix(in srgb, ${color} 10%, var(--preview-surface))`,
      }}
    >
      {children}
    </span>
  );
}

function PreviewCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cx(
        "rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/88 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur",
        className,
      )}
    >
      {children}
    </Card>
  );
}

function MetricCard({ title, value, icon: Icon, tone = "blue" }: { title: string; value: string; icon: ComponentType<{ className?: string }>; tone?: "blue" | "green" | "amber" | "rose" | "purple" }) {
  const color = tone === "green" ? "#059669" : tone === "amber" ? "#d97706" : tone === "rose" ? "#e11d48" : tone === "purple" ? "#7c3aed" : "#2563eb";
  return (
    <PreviewCard className="min-h-[150px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--preview-muted)]">{title}</p>
          <p className="mt-3 text-3xl font-bold text-[var(--preview-text)]">{value}</p>
        </div>
        <span className="rounded-2xl p-3 text-white" style={{ background: color }}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 h-2 rounded-full bg-[var(--preview-surface-2)]">
        <div className="h-full w-2/3 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, var(--preview-accent-2))` }} />
      </div>
    </PreviewCard>
  );
}

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
            {["Key Takeaways", "Red Flags", "Priority Interventions", "Exam Traps", "Must-Know Labs", "Escalation Cues"].map((title, index) => (
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
            <h2 className="text-xl font-bold text-[var(--preview-text)]">{kind === "admin" ? "Operational Workbench" : "Today’s Study Plan"}</h2>
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
            <p className="mt-3 text-[var(--preview-muted)]">A richer medical SaaS direction using NurseNest’s existing brand and typography.</p>
          </div>
          <div className="rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)] p-5">
            <LineChart className="h-16 w-16 text-[var(--preview-accent)]" />
          </div>
        </div>
      </PreviewCard>
    </div>
  );
}

const pathwayCards = [
  {
    title: "RN",
    subtitle: "NCLEX systems mastery",
    copy: "Systems-based med-surg, pharmacology, prioritization, and bedside urgency for high-stakes RN judgment.",
    icon: Stethoscope,
    tone: "#2563eb",
    bullets: ["Med-surg systems", "NCLEX priority cues", "Pharmacology safety"],
  },
  {
    title: "RPN / PN",
    subtitle: "Practical bedside confidence",
    copy: "Workflow-first learning for safety, delegation boundaries, common meds, and escalation with clear nursing actions.",
    icon: ClipboardCheck,
    tone: "#059669",
    bullets: ["Practical workflow", "Safety and prioritization", "Confident escalation"],
  },
  {
    title: "NP",
    subtitle: "Advanced clinical reasoning",
    copy: "Diagnostics, prescribing logic, differential thinking, and specialty-domain review for primary care and advanced practice.",
    icon: Brain,
    tone: "#7c3aed",
    bullets: ["Diagnostics", "Prescribing safety", "Specialty domains"],
  },
  {
    title: "Pre-Nursing",
    subtitle: "Roadmap to readiness",
    copy: "Prerequisite planning, science refreshers, application confidence, and a motivating path into nursing school.",
    icon: GraduationCap,
    tone: "#d97706",
    bullets: ["Prereq roadmap", "Study foundations", "Application momentum"],
  },
  {
    title: "Allied Health",
    subtitle: "Profession-specific prep",
    copy: "Targeted learning for allied roles with modality-aware practice, clinical vocabulary, and exam-aligned study flow.",
    icon: Layers3,
    tone: "#0891b2",
    bullets: ["Occupation identity", "Modality-aware tools", "Clinical vocabulary"],
  },
] as const;

function ClinicalHeroVisual() {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-[var(--preview-border)] bg-[linear-gradient(145deg,var(--preview-surface),var(--preview-accent-soft)_58%,var(--preview-surface-2))] p-5 shadow-[0_34px_90px_rgba(15,23,42,0.18)]">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[var(--preview-accent)] opacity-10 blur-3xl" />
      <div className="absolute -bottom-20 left-4 h-72 w-72 rounded-full bg-[var(--preview-accent-2)] opacity-10 blur-3xl" />
      <div className="relative grid gap-4">
        <div className="rounded-[1.6rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/82 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <Pill tone="rose">Red Flag</Pill>
            <span className="text-xs font-bold text-[var(--preview-muted)]">HF + ACS review</span>
          </div>
          <img
            src="/clinical-illustrations/cardiovascular/heart-failure.svg"
            alt="Heart failure clinical illustration"
            loading="lazy"
            decoding="async"
            className="mt-4 aspect-[16/9] w-full rounded-3xl object-cover shadow-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_0.82fr]">
          <div className="rounded-[1.5rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between">
              <Pill tone="blue">ECG Strip</Pill>
              <HeartPulse className="h-5 w-5 text-[var(--preview-accent)]" />
            </div>
            <svg viewBox="0 0 460 120" className="mt-4 h-24 w-full overflow-visible">
              <path d="M0 74 H42 L54 38 L69 98 L84 58 H128 L142 72 L154 46 L170 92 L184 64 H232 L246 74 L258 42 L272 100 L289 60 H338 L354 72 L366 48 L381 94 L397 63 H460" fill="none" stroke="var(--preview-accent)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 74 H460" stroke="var(--preview-border)" strokeWidth="2" strokeDasharray="4 12" />
            </svg>
            <p className="text-sm font-semibold text-[var(--preview-muted)]">Rhythm cues linked to priority actions, not memorized in isolation.</p>
          </div>

          <div className="space-y-3">
            {[
              ["Troponin", "rising", "rose"],
              ["K+", "3.1", "amber"],
              ["Readiness", "84%", "green"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/92 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[var(--preview-muted)]">{label}</span>
                  <Pill tone={tone as "rose" | "amber" | "green"}>{value}</Pill>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {["Lessons", "Flashcards", "CAT Exam"].map((label, index) => (
            <div key={label} className="rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 p-4">
              <p className="text-xl font-bold text-[var(--preview-text)]">{index === 0 ? "420+" : index === 1 ? "2.8k" : "Adaptive"}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--preview-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomepageHero() {
  return (
    <section className="grid items-center gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)]">
      <div className="space-y-7">
        <div className="flex flex-wrap gap-2">
          <Pill tone="blue">Premium Nursing Exam Prep</Pill>
          <Pill tone="green">Clinical Judgment First</Pill>
          <Pill tone="purple">RN · RPN/PN · NP · Allied</Pill>
        </div>
        <div>
          <h1 className="max-w-4xl text-5xl font-bold leading-[0.96] tracking-tight text-[var(--preview-text)] sm:text-6xl lg:text-7xl">
            Study like a nurse who can see the whole patient.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--preview-muted)]">
            NurseNest turns long study hours into a clinical learning ecosystem: visual lessons, adaptive practice, flashcards,
            readiness tracking, and exam pathways built around real nursing judgment.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="h-12 rounded-2xl px-6 text-base">Start Free</Button>
          <Button variant="outline" className="h-12 rounded-2xl border-[var(--preview-border)] bg-[var(--preview-surface)] px-6 text-base">
            Explore Pathways
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["94%", "felt more clinically organized"],
            ["4 phases", "readiness to mastery"],
            ["24/7", "focused study cockpit"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/78 p-4 shadow-sm backdrop-blur">
              <p className="text-2xl font-bold text-[var(--preview-text)]">{value}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-[var(--preview-muted)]">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <ClinicalHeroVisual />
    </section>
  );
}

function PathwayDifferentiation() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Pill>Pathway Intelligence</Pill>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--preview-text)] sm:text-4xl">
            Different learners need different clinical scaffolds.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[var(--preview-muted)]">
          Each path has its own rhythm, scope, and exam pressure. The homepage should make that depth visible immediately.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {pathwayCards.slice(0, 4).map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={cx("rounded-[1.75rem] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]", index === 0 && "sm:row-span-2")}
                style={{
                  borderColor: `color-mix(in srgb, ${card.tone} 34%, var(--preview-border))`,
                  background: `linear-gradient(145deg, color-mix(in srgb, ${card.tone} 12%, var(--preview-surface)), var(--preview-surface))`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-3xl p-3 text-white shadow-sm" style={{ background: card.tone }}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--preview-muted)]">{card.subtitle}</span>
                </div>
                <h3 className="mt-6 text-3xl font-bold text-[var(--preview-text)]">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">{card.copy}</p>
                <div className="mt-5 grid gap-2">
                  {card.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-sm font-bold text-[var(--preview-text)]">
                      <CheckCircle2 className="h-4 w-4" style={{ color: card.tone }} />
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid gap-4">
          <div className="rounded-[1.75rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/88 p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]">
            <div className="flex items-center justify-between">
              <Pill tone="blue">Allied</Pill>
              <Layers3 className="h-6 w-6 text-[var(--preview-accent)]" />
            </div>
            <h3 className="mt-5 text-3xl font-bold text-[var(--preview-text)]">Profession-aware clinical prep</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">{pathwayCards[4].copy}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Paramedic", "MLT", "Imaging", "RRT"].map((role) => (
                <div key={role} className="rounded-2xl bg-[var(--preview-surface-2)] px-4 py-3 text-sm font-bold text-[var(--preview-text)]">
                  {role}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--preview-border)] bg-[linear-gradient(145deg,var(--preview-accent-soft),var(--preview-surface))] p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]">
            <Pill tone="amber">Pre-Nursing</Pill>
            <h3 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">From prerequisites to purpose.</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">
              A calmer roadmap for applicants who need structure, encouragement, and science confidence before the first clinical day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemPreview() {
  const modules = [
    { title: "Clinical Lesson Cockpit", icon: BookOpen, tone: "blue", copy: "Sticky study rail, semantic section cards, rapid review, and visual anchors." },
    { title: "Adaptive CAT Engine", icon: Gauge, tone: "green", copy: "Readiness phases, exam pacing, and performance signals without noisy gamification." },
    { title: "Flashcard Recall", icon: Brain, tone: "purple", copy: "Confidence ratings, rationale links, and spaced reinforcement after missed concepts." },
    { title: "Practice Test Studio", icon: Target, tone: "amber", copy: "Topic filters, clinical judgment items, rationales, and next-step recommendations." },
  ] as const;

  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <PreviewCard className="bg-[linear-gradient(155deg,var(--preview-surface),var(--preview-surface-2))]">
        <Pill tone="green">Study Ecosystem</Pill>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--preview-text)]">Orient, study, reinforce, review.</h2>
        <p className="mt-4 text-base leading-7 text-[var(--preview-muted)]">
          The homepage should show that NurseNest is not a pile of content. It is a guided clinical operating system for exam prep.
        </p>
        <div className="mt-6 space-y-4">
          {["Readiness", "Study", "Reinforce", "Mastered"].map((phase, index) => (
            <div key={phase}>
              <div className="mb-2 flex justify-between text-sm font-bold text-[var(--preview-muted)]">
                <span>{phase}</span>
                <span>{[92, 78, 64, 41][index]}%</span>
              </div>
              <Progress value={[92, 78, 64, 41][index]} />
            </div>
          ))}
        </div>
      </PreviewCard>
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <PreviewCard key={module.title}>
              <div className="flex items-center justify-between gap-3">
                <Pill tone={module.tone}>{module.title.split(" ")[0]}</Pill>
                <Icon className="h-6 w-6 text-[var(--preview-accent)]" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[var(--preview-text)]">{module.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">{module.copy}</p>
            </PreviewCard>
          );
        })}
      </div>
    </section>
  );
}

function ClinicalDepthBand() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/86 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[1.6rem] bg-[linear-gradient(145deg,var(--preview-accent-soft),var(--preview-surface-2))] p-5">
          <Pill tone="rose">Clinical Immersion</Pill>
          <h2 className="mt-4 text-3xl font-bold text-[var(--preview-text)]">Medical visuals that make the platform feel serious.</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">
            Anatomy, ECG strips, labs, meds, and bedside cues create memory hooks before a learner reads a single paragraph.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Anatomy", HeartPulse, "heart failure and perfusion"],
            ["Labs", FlaskConical, "troponin, K+, ABGs"],
            ["Meds", PillIcon, "rate, rhythm, preload"],
          ].map(([title, Icon, copy]) => (
            <div key={title as string} className="rounded-[1.5rem] border border-[var(--preview-border)] bg-[var(--preview-elevated)] p-5">
              <Icon className="h-8 w-8 text-[var(--preview-accent)]" />
              <h3 className="mt-5 text-xl font-bold text-[var(--preview-text)]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustAndConversion() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <PreviewCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill tone="green">Passing Readiness</Pill>
            <h2 className="mt-4 text-3xl font-bold text-[var(--preview-text)]">Know what to study next.</h2>
          </div>
          <p className="text-5xl font-bold text-[var(--preview-text)]">84%</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {["Cardiac Priority", "Medication Safety", "Clinical Judgment"].map((item, index) => (
            <div key={item} className="rounded-3xl bg-[var(--preview-surface-2)] p-4">
              <p className="text-sm font-bold text-[var(--preview-muted)]">{item}</p>
              <Progress value={[78, 69, 86][index]} className="mt-3" />
            </div>
          ))}
        </div>
      </PreviewCard>
      <PreviewCard className="bg-[linear-gradient(145deg,var(--preview-accent-soft),var(--preview-surface))]">
        <Sparkles className="h-8 w-8 text-[var(--preview-accent)]" />
        <blockquote className="mt-5 text-xl font-bold leading-8 text-[var(--preview-text)]">
          "It finally felt like studying connected to actual nursing judgment, not just memorizing random facts."
        </blockquote>
        <p className="mt-4 text-sm font-semibold text-[var(--preview-muted)]">Preview testimonial concept</p>
      </PreviewCard>
    </section>
  );
}

function HomepagePreview() {
  return (
    <div className="space-y-8">
      <HomepageHero />
      <PathwayDifferentiation />
      <ClinicalDepthBand />
      <EcosystemPreview />
      <TrustAndConversion />
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
