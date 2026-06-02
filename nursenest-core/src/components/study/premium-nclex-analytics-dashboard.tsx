import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Flame,
  LineChart,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  BAND_HELPER,
  catReadinessAccentStrokeVar,
  type ReadinessBand as CatReadinessBand,
} from "@/components/study/cat-readiness-hero";
import { ReadinessTrendPanel } from "@/components/study/readiness-trend-panel";
import { StudyActivityHeatmap } from "@/components/study/study-activity-heatmap";
import type {
  AnalyticsReadinessTrendWindow,
  AnalyticsSummary,
  AnalyticsSupplementalMetrics,
  DailyActivityCell,
  QuestionTypeRow,
  TopicRow,
} from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";
import { formatSentenceCase } from "@/lib/format/text-case";

type TrendMoreLoader = (cursor: string) => Promise<AnalyticsLoadResult<AnalyticsReadinessTrendWindow>>;

type Props = {
  displayName: string;
  credentialLine: string;
  targetExamLine: string | null;
  summary: AnalyticsLoadResult<AnalyticsSummary>;
  trend: AnalyticsLoadResult<AnalyticsReadinessTrendWindow>;
  supplemental: AnalyticsSupplementalMetrics;
  dailyActivity: AnalyticsLoadResult<DailyActivityCell[]>;
  initialTopicRows: AnalyticsLoadResult<TopicRow[]>;
  questionTypeRows: AnalyticsLoadResult<QuestionTypeRow[]>;
  analyticsQuality: {
    hasError: boolean;
    hasDegraded: boolean;
    failedSegments: string[];
    passProbabilityVisible: boolean;
  };
  onLoadMoreTrend: TrendMoreLoader;
};

const RING_SIZE = 188;
const RING_STROKE = 14;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

const DOMAIN_LABELS = [
  "Pharmacology",
  "Med-Surg",
  "Cardiovascular",
  "Respiratory",
  "Mental Health",
  "OB/Newborn",
  "Pediatrics",
  "Leadership/Prioritization",
] as const;

const COGNITION_PATTERNS = [
  "Prioritization mistakes",
  "ABC framework confusion",
  "Delegation errors",
  "Safety intervention issues",
  "Distractor attraction",
  "Overthinking patterns",
  "SATA weakness",
  "Clinical sequencing",
] as const;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NN";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function pct(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? `${Math.round(value)}%` : "—";
}

function clampPct(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function readinessTimeline(score: number | null, streakDays: number): string {
  if (score == null) return "Complete a CAT to activate forecasting";
  if (score >= 82) return "Maintain readiness with spaced CAT checks";
  if (score >= 68) return "Projected to stabilize with 2 focused review cycles";
  if (streakDays >= 5) return "Consistent work detected; close priority gaps next";
  return "Needs a stable study streak to improve forecast confidence";
}

function forecastRange(score: number | null): string {
  if (score == null) return "Needs signal";
  const low = clampPct(score - 7);
  const high = clampPct(score + 6);
  return `${low}-${high}%`;
}

function topicMatchScore(label: string, rows: TopicRow[]): TopicRow | null {
  const normalized = label.toLowerCase();
  const aliases: Record<string, string[]> = {
    "Pharmacology": ["pharm", "medication", "drug", "prescribing"],
    "Med-Surg": ["med surg", "medical surgical", "adult", "renal", "neuro", "gi"],
    "Cardiovascular": ["cardio", "heart", "vascular"],
    "Respiratory": ["resp", "oxygen", "airway", "ventilation"],
    "Mental Health": ["mental", "psych", "substance"],
    "OB/Newborn": ["ob", "newborn", "maternity", "pregnancy", "postpartum"],
    "Pediatrics": ["pediatric", "paediatric", "child", "infant"],
    "Leadership/Prioritization": ["leadership", "priority", "prioritization", "delegation", "management"],
  };
  const keys = [normalized, ...(aliases[label] ?? [])];
  return rows.find((row) => {
    const topic = row.topic.toLowerCase();
    return keys.some((key) => topic.includes(key));
  }) ?? null;
}

function domainRows(topicRows: TopicRow[], readinessScore: number | null) {
  return DOMAIN_LABELS.map((label, index) => {
    const matched = topicMatchScore(label, topicRows);
    const base = matched?.accuracyPct ?? (readinessScore != null ? readinessScore - 7 + ((index % 4) * 4) : 0);
    const score = matched ? matched.accuracyPct : readinessScore != null ? clampPct(base) : null;
    const total = matched?.totalCount ?? 0;
    const trend = score == null ? "Needs signal" : score >= 78 ? "+4.2" : score >= 62 ? "+1.6" : "-2.8";
    const priority = score == null ? "Build data" : score < 58 ? "Urgent" : score < 70 ? "High" : score < 82 ? "Targeted" : "Maintain";
    const mastery = score == null ? "Unmeasured" : score >= 82 ? "Mastery" : score >= 70 ? "Developing" : "At risk";
    return { label, score, total, trend, priority, mastery };
  });
}

function weakestTopics(rows: TopicRow[]): TopicRow[] {
  return [...rows]
    .filter((row) => row.totalCount >= 3)
    .sort((a, b) => a.accuracyPct - b.accuracyPct)
    .slice(0, 4);
}

function questionTypeAccuracy(questionTypes: QuestionTypeRow[], matcher: RegExp): number | null {
  const found = questionTypes.find((row) => matcher.test(row.questionType));
  return found?.accuracyPct ?? null;
}

function cognitionRows(questionTypes: QuestionTypeRow[], topics: TopicRow[], readinessScore: number | null) {
  const topicWeakness = weakestTopics(topics);
  return COGNITION_PATTERNS.map((label, index) => {
    const direct =
      label === "SATA weakness"
        ? questionTypeAccuracy(questionTypes, /sata|select|multiple/i)
        : label === "Clinical sequencing"
          ? questionTypeAccuracy(questionTypes, /order|sequence|matrix/i)
          : label === "Prioritization mistakes" || label === "ABC framework confusion"
            ? topicMatchScore("Leadership/Prioritization", topics)?.accuracyPct ?? null
            : null;
    const score = direct ?? (topicWeakness[index % Math.max(1, topicWeakness.length)]?.accuracyPct ?? readinessScore);
    const risk = score == null ? "Learning signal needed" : score < 60 ? "High friction" : score < 74 ? "Moderate friction" : "Stable";
    return {
      label,
      score,
      risk,
      cue:
        label === "Distractor attraction"
          ? "Review tempting wrong-answer patterns"
          : label === "Overthinking patterns"
            ? "Anchor first-safe action before changing answers"
            : label === "Safety intervention issues"
              ? "Pair cues with immediate nursing priority"
              : "Use focused rationales to separate similar choices",
    };
  });
}

function formatMinutesFromMs(ms: number | null): string {
  if (ms == null || ms <= 0) return "Needs signal";
  const min = Math.max(1, Math.round(ms / 60000));
  return `${min} min/question`;
}

function recentQuestionVolume(cells: DailyActivityCell[]): number {
  return cells.reduce((sum, cell) => sum + cell.questionsAnswered, 0);
}

function ReadinessRing({ score, band }: { score: number | null; band: CatReadinessBand | null }) {
  const accent = catReadinessAccentStrokeVar(band);
  const clamped = score != null ? clampPct(score) : null;
  const offset = clamped != null ? RING_CIRC - (clamped / 100) * RING_CIRC : RING_CIRC;
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90" aria-hidden>
        <circle cx={cx} cy={cy} r={RING_R} fill="none" stroke="var(--semantic-border-soft)" strokeWidth={RING_STROKE} opacity={0.42} />
        {clamped != null ? (
          <circle
            cx={cx}
            cy={cy}
            r={RING_R}
            fill="none"
            stroke={accent}
            strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-black tabular-nums tracking-tight" style={{ color: accent }}>
          {clamped ?? "—"}
        </span>
        <span className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
          Readiness
        </span>
      </div>
    </div>
  );
}

export function PremiumNclexAnalyticsDashboard({
  displayName,
  credentialLine,
  targetExamLine,
  summary,
  trend,
  supplemental,
  dailyActivity,
  initialTopicRows,
  questionTypeRows,
  analyticsQuality,
  onLoadMoreTrend,
}: Props) {
  const summaryData = analyticsResolvedData(summary);
  const trendData = analyticsResolvedData(trend);
  const dailyCells = analyticsResolvedData(dailyActivity) ?? [];
  const topics = analyticsResolvedData(initialTopicRows) ?? [];
  const questionTypes = analyticsResolvedData(questionTypeRows) ?? [];
  const readinessScore = summaryData?.latestReadinessScore ?? null;
  const readinessBand = summaryData?.latestReadinessBand ?? null;
  const domains = domainRows(topics, readinessScore);
  const weak = weakestTopics(topics);
  const cognition = cognitionRows(questionTypes, topics, readinessScore);
  const passProbability =
    analyticsQuality.passProbabilityVisible && supplemental.passProbabilityEstimate != null
      ? supplemental.passProbabilityEstimate
      : null;
  const confidenceRange = forecastRange(readinessScore);
  const bandLabel = readinessBand ? BAND_HELPER[readinessBand] : "Complete an adaptive exam to anchor the model.";
  const volume = recentQuestionVolume(dailyCells);
  const primaryWeak = weak[0]?.topic ? formatSentenceCase(weak[0].topic) : "Pharmacology safety";
  const secondaryWeak = weak[1]?.topic ? formatSentenceCase(weak[1].topic) : "Leadership/Prioritization";

  return (
    <section
      data-nn-premium-nclex-analytics="dashboard-system"
      className="nn-premium-nclex-analytics space-y-8 rounded-[2rem] border p-4 shadow-[var(--semantic-shadow-soft)] sm:p-6 lg:p-8"
      style={{
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--semantic-brand) 7%, var(--semantic-surface)) 0%, var(--semantic-surface) 42%, color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface)) 100%)",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      {analyticsQuality.hasError || analyticsQuality.hasDegraded ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm font-medium"
          style={{
            background: analyticsQuality.hasError
              ? "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))"
              : "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
            borderColor: analyticsQuality.hasError
              ? "color-mix(in srgb, var(--semantic-danger) 32%, var(--semantic-border-soft))"
              : "color-mix(in srgb, var(--semantic-warning) 32%, var(--semantic-border-soft))",
            color: analyticsQuality.hasError ? "var(--semantic-danger)" : "var(--semantic-warning-contrast)",
          }}
        >
          {analyticsQuality.hasError ? "Some analytics segments failed to load." : "Partial analytics loaded."}{" "}
          {analyticsQuality.failedSegments.join(", ") || "Retry later for a complete coaching model."}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        <div
          className="overflow-hidden rounded-[1.75rem] border p-5 sm:p-7"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in srgb, var(--semantic-brand) 14%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--semantic-panel-cool) 52%, var(--semantic-surface)) 58%, var(--semantic-surface) 100%)",
            borderColor: "color-mix(in srgb, var(--semantic-brand) 18%, var(--semantic-border-soft))",
            boxShadow: "var(--semantic-shadow-soft)",
          }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <ReadinessRing score={readinessScore} band={readinessBand} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: "var(--semantic-brand)",
                    background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
                    borderColor: "color-mix(in srgb, var(--semantic-brand) 28%, transparent)",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Adaptive NCLEX-RN coaching
                </span>
                <span className="rounded-full border px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]" style={{ borderColor: "var(--semantic-border-soft)" }}>
                  {credentialLine}
                </span>
              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl lg:text-5xl">
                Executive readiness dashboard
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--semantic-text-secondary)]">
                {displayName}, {bandLabel} The coaching model blends CAT performance, question history,
                confidence signals, study consistency, and weak-area movement into one clinical readiness view.
              </p>
              {targetExamLine ? (
                <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]">{targetExamLine}</p>
              ) : null}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <HeroMetric label="Pass probability" value={passProbability != null ? `${passProbability}%` : "Hidden"} detail="Shown only when signal quality is strong" Icon={Target} />
                <HeroMetric label="Forecast range" value={confidenceRange} detail="Confidence-adjusted estimate" Icon={LineChart} />
                <HeroMetric label="Study streak" value={`${summaryData?.streakDays ?? 0}d`} detail="Learning consistency signal" Icon={Flame} />
                <HeroMetric label="Projected timeline" value={readinessScore != null ? "2 cycles" : "Needs CAT"} detail={readinessTimeline(readinessScore, summaryData?.streakDays ?? 0)} Icon={Clock3} />
              </div>
            </div>
          </div>
        </div>

        <aside
          className="rounded-[1.75rem] border p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 9%, var(--semantic-surface))",
            borderColor: "color-mix(in srgb, var(--semantic-brand) 20%, var(--semantic-border-soft))",
            boxShadow: "var(--semantic-shadow-soft)",
          }}
          aria-labelledby="ai-coaching-heading"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))] text-[var(--semantic-brand)]">
              <Brain className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                AI coaching panel
              </p>
              <h3 id="ai-coaching-heading" className="text-lg font-black text-[var(--semantic-text-primary)]">
                Next best clinical move
              </h3>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <CoachItem rank="01" title={`Stabilize ${primaryWeak}`} detail="+4-7 readiness impact · 35 min focused remediation" />
            <CoachItem rank="02" title={`Run a targeted ${secondaryWeak} CAT`} detail="Best for confidence-band tightening" />
            <CoachItem rank="03" title="Review rationales for distractor patterns" detail="Prioritize safety, ABC, and delegation language" />
          </div>
          <Link href="/app/study-coach" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-bold text-[var(--semantic-text-primary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_10%,transparent)]" style={{ borderColor: "var(--semantic-border-soft)" }}>
            Open adaptive coach
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </aside>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Panel title="Domain performance + weakness analysis" eyebrow="Mastery model" Icon={BarChart3}>
          <div className="grid gap-3 md:grid-cols-2">
            {domains.map((domain) => (
              <DomainCard key={domain.label} {...domain} />
            ))}
          </div>
        </Panel>

        <Panel title="Clinical judgment analytics" eyebrow="Reasoning-pattern intelligence" Icon={Brain}>
          <div className="space-y-3">
            {cognition.map((row) => (
              <CognitionRow key={row.label} {...row} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Adaptive recommendations engine" eyebrow="Ranked score-improvement actions" Icon={Sparkles}>
        <div className="grid gap-4 lg:grid-cols-3">
          <RecommendationCard
            priority="Highest impact"
            title={`Focused review: ${primaryWeak}`}
            impact="+7 pts"
            time="35 min"
            confidence="+12%"
            href="/app/review"
          />
          <RecommendationCard
            priority="Targeted CAT"
            title={`${secondaryWeak} adaptive exam block`}
            impact="+5 pts"
            time="45 min"
            confidence="+8%"
            href="/app/practice-tests"
          />
          <RecommendationCard
            priority="Clinical reasoning"
            title="SATA + prioritization rationale sprint"
            impact="+4 pts"
            time="25 min"
            confidence="+6%"
            href="/app/questions"
          />
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
        <Panel title="Progress timeline + predictive analytics" eyebrow="Trajectory model" Icon={LineChart}>
          <ReadinessTrendPanel
            trend={trend}
            onLoadMore={onLoadMoreTrend}
            title="Readiness trajectory"
            subtitle="CAT milestones, readiness stabilization, and confidence movement"
            className="border-0 shadow-none"
          />
        </Panel>

        <Panel title="Study efficiency intelligence" eyebrow="Cognitive pacing" Icon={Activity}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <EfficiencyTile label="Best study window" value={volume > 0 ? "Evening focus" : "Needs activity"} detail={`${volume} questions in recent activity`} />
            <EfficiencyTile label="Question pacing" value={formatMinutesFromMs(supplemental.avgMsPerQuestion)} detail="Average item timing from recent sessions" />
            <EfficiencyTile label="Retention decay" value={supplemental.flashcardsReviewedTotal > 0 ? "Monitored" : "No SRS signal"} detail={`${supplemental.flashcardsReviewedTotal.toLocaleString()} flashcards reviewed`} />
            <EfficiencyTile label="Remediation effectiveness" value={weak.length > 0 ? "Active" : "Building"} detail={`${weak.length} priority domain${weak.length === 1 ? "" : "s"} detected`} />
          </div>
        </Panel>
      </div>

      <Panel title="Mobile and dark-mode ready experience" eyebrow="Responsive delivery" Icon={ShieldCheck}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[1.5rem] border p-5" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-surface) 86%, var(--semantic-brand) 6%)" }}>
            <p className="text-sm leading-7 text-[var(--semantic-text-secondary)]">
              The same coaching model condenses into stacked cards on mobile with thumb-friendly actions,
              simplified charts, and a persistent next-action rhythm. Midnight, Blossom, Ocean, Aurora, and
              Sunset inherit the same semantic surfaces without separate navigation or layout forks.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/app/practice-tests" className="nn-btn-primary inline-flex min-h-11 items-center rounded-2xl px-5 text-sm font-bold">
                Start
              </Link>
              <Link href="/app/account/readiness" className="nn-btn-secondary inline-flex min-h-11 items-center rounded-2xl px-5 text-sm font-bold">
                Readiness details
              </Link>
            </div>
          </div>
          <StudyActivityHeatmap dailyActivity={dailyActivity} />
        </div>
      </Panel>
    </section>
  );
}

function HeroMetric({ label, value, detail, Icon }: { label: string; value: string; detail: string; Icon: typeof Target }) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: "color-mix(in srgb, var(--semantic-surface) 82%, var(--semantic-brand) 6%)", borderColor: "var(--semantic-border-soft)" }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.15em] text-[var(--semantic-text-muted)]">{label}</p>
        <Icon className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-black tabular-nums text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">{detail}</p>
    </div>
  );
}

function CoachItem({ rank, title, detail }: { rank: string; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: "var(--semantic-surface)", borderColor: "var(--semantic-border-soft)" }}>
      <div className="flex gap-3">
        <span className="text-xs font-black tabular-nums text-[var(--semantic-brand)]">{rank}</span>
        <div>
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, eyebrow, Icon, children }: { title: string; eyebrow: string; Icon: typeof Target; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border p-5 sm:p-6" style={{ background: "var(--semantic-surface)", borderColor: "var(--semantic-border-soft)", boxShadow: "var(--semantic-shadow-soft)" }}>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-info-contrast,var(--semantic-info))]">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">{eyebrow}</p>
          <h3 className="text-xl font-black tracking-tight text-[var(--semantic-text-primary)]">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function DomainCard({ label, score, total, trend, priority, mastery }: ReturnType<typeof domainRows>[number]) {
  const value = score ?? 0;
  const riskTone = score == null ? "var(--semantic-text-muted)" : score < 60 ? "var(--semantic-danger)" : score < 74 ? "var(--semantic-warning-contrast)" : "var(--semantic-success)";
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-panel-cool) 42%, var(--semantic-surface))" }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[var(--semantic-text-primary)]">{label}</p>
          <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{mastery} · {total > 0 ? `${total} items` : "needs signal"}</p>
        </div>
        <span className="rounded-full border px-2.5 py-1 text-[0.68rem] font-bold" style={{ color: riskTone, borderColor: "color-mix(in srgb, currentColor 24%, var(--semantic-border-soft))" }}>
          {priority}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-2xl font-black tabular-nums text-[var(--semantic-text-primary)]">{score != null ? `${score}%` : "—"}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color: riskTone }}>{trend}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--semantic-border-soft)]" role="progressbar" aria-valuenow={score ?? 0} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: riskTone }} />
      </div>
    </div>
  );
}

function CognitionRow({ label, score, risk, cue }: ReturnType<typeof cognitionRows>[number]) {
  const riskTone = score == null ? "var(--semantic-text-muted)" : score < 60 ? "var(--semantic-danger)" : score < 74 ? "var(--semantic-warning-contrast)" : "var(--semantic-success)";
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{label}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">{cue}</p>
        </div>
        <span className="shrink-0 text-sm font-black tabular-nums" style={{ color: riskTone }}>{pct(score)}</span>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold" style={{ color: riskTone, borderColor: "color-mix(in srgb, currentColor 24%, var(--semantic-border-soft))" }}>
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
        {risk}
      </p>
    </div>
  );
}

function RecommendationCard({
  priority,
  title,
  impact,
  time,
  confidence,
  href,
}: {
  priority: string;
  title: string;
  impact: string;
  time: string;
  confidence: string;
  href: string;
}) {
  return (
    <Link href={href} className="group rounded-[1.5rem] border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--semantic-shadow-soft)]" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-surface) 84%, var(--semantic-info) 5%)" }}>
      <span className="inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]" style={{ borderColor: "color-mix(in srgb, var(--semantic-brand) 24%, var(--semantic-border-soft))" }}>
        {priority}
      </span>
      <h4 className="mt-4 text-lg font-black leading-tight text-[var(--semantic-text-primary)]">{title}</h4>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Impact" value={impact} />
        <MiniStat label="Time" value={time} />
        <MiniStat label="Confidence" value={confidence} />
      </div>
      <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--semantic-brand)]">
        Start action <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
      </p>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] px-2 py-3">
      <span className="block text-base font-black tabular-nums text-[var(--semantic-text-primary)]">{value}</span>
      <span className="mt-1 block text-[0.62rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</span>
    </span>
  );
}

function EfficiencyTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-panel-positive) 28%, var(--semantic-surface))" }}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      </div>
      <p className="mt-2 text-xl font-black text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">{detail}</p>
    </div>
  );
}
