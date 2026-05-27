import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import { X, Brain, TrendingUp, TrendingDown, Target, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocaleLink } from "@/lib/LocaleLink";

// ── Excluded paths (CAT exams, mock exam sessions, qbank exam) ───────────────
// Patterns match against the raw browser path (may include locale prefix like /en/)

const EXCLUDED_PATTERNS = [
  /\/study\//,
  /\/qbank\/exam/,
  // mock-exams/:id session — not the /report suffix
  /\/mock-exams\/[^/]+(?<!\/report)$/,
  /\/readiness-report(?:\/|$)/,
];

function isExcluded(path: string): boolean {
  return EXCLUDED_PATTERNS.some((re) => re.test(path));
}

// ── Data helpers (mirrors readiness-report.tsx logic) ────────────────────────

type TestResult = { score: number; total: number; percentage: number };
type DomainData = { name: string; emoji: string; averageScore: number; questionCount: number };

const NCLEX_DOMAINS: { name: string; emoji: string; lessons: string[] }[] = [
  {
    name: "Safe & Effective Care",
    emoji: "🛡️",
    lessons: [
      "hand-hygiene", "ppe-basics", "isolation-precautions-rpn", "sterile-technique",
      "airborne-precautions", "droplet-precautions", "pacemaker-care",
      "infection-control", "cdiff-basics", "pertussis-basics",
    ],
  },
  {
    name: "Health Promotion",
    emoji: "🌱",
    lessons: [
      "prenatal-basics", "breastfeeding-basics", "newborn-reflexes",
      "diabetes-lifespan", "obesity-management", "cancer-screening",
      "immunizations-basics", "alcohol-withdrawal",
    ],
  },
  {
    name: "Psychosocial Integrity",
    emoji: "🧠",
    lessons: [
      "schizophrenia", "major-depressive-disorder", "ptsd", "panic-disorder",
      "antisocial-personality-disorder", "intimate-partner-violence",
      "postpartum-depression-care", "separation-anxiety", "insomnia",
    ],
  },
  {
    name: "Physiological Integrity",
    emoji: "💊",
    lessons: [
      "aki-management", "ckd-management", "copd-exacerbation", "asthma-emergency",
      "mi-acute", "heart-failure", "hypertension", "dka-hhns", "stroke",
      "siadh-di", "pharmacology", "fluid-electrolytes", "abg-basics",
    ],
  },
];

function readAllResults(): Record<string, TestResult> {
  const out: Record<string, TestResult> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const pre = key.match(/^nursenest-pretest-(.+)$/);
      const post = key.match(/^nursenest-posttest-(.+)$/);
      const match = post || pre;
      if (!match) continue;
      const slug = match[1];
      if (post && out[slug]) continue; // post wins over pre
      const raw = JSON.parse(localStorage.getItem(key) || "null");
      if (raw && typeof raw.score === "number" && typeof raw.total === "number" && raw.total > 0) {
        out[slug] = { score: raw.score, total: raw.total, percentage: Math.round((raw.score / raw.total) * 100) };
      }
    }
  } catch {}
  return out;
}

function computeDomains(results: Record<string, TestResult>): DomainData[] {
  return NCLEX_DOMAINS.map((d) => {
    const attempted = d.lessons.filter((l) => results[l]);
    if (!attempted.length) return { name: d.name, emoji: d.emoji, averageScore: 0, questionCount: 0 };
    const avg = Math.round(attempted.reduce((sum, l) => sum + results[l].percentage, 0) / attempted.length);
    const qCount = attempted.reduce((sum, l) => sum + results[l].total, 0);
    return { name: d.name, emoji: d.emoji, averageScore: avg, questionCount: qCount };
  });
}

function computeReadiness(domains: DomainData[]): number {
  const attempted = domains.filter((d) => d.questionCount > 0);
  if (!attempted.length) return 0;
  const weighted = attempted.reduce((sum, d) => sum + d.averageScore * d.questionCount, 0);
  const total = attempted.reduce((sum, d) => sum + d.questionCount, 0);
  return Math.round(weighted / total);
}

function passProbability(readiness: number): number {
  const x = (readiness - 68) / 8;
  return Math.min(99, Math.max(5, Math.round(50 + 45 * (1 / (1 + Math.exp(-x)) - 0.5) * 2)));
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  const d = Math.ceil(diff / 86400000);
  return d >= 0 ? d : null;
}

// ── Mini progress bar ────────────────────────────────────────────────────────

function MiniBar({ value, color = "var(--theme-primary)" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden flex-1">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function LearnerInsightsDrawer() {
  const [location] = useBrowserLocation();
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [examDate, setExamDate] = useState("");

  // close on route change
  useEffect(() => { setOpen(false); }, [location]);

  // read localStorage on open
  useEffect(() => {
    if (!open) return;
    setResults(readAllResults());
    setExamDate(localStorage.getItem("nursenest-exam-date") || "");
  }, [open]);

  // keyboard close
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const domains = useMemo(() => computeDomains(results), [results]);
  const readiness = useMemo(() => computeReadiness(domains), [domains]);
  const passProb = useMemo(() => passProbability(readiness), [readiness]);
  const hasData = domains.some((d) => d.questionCount > 0);

  const weakDomains = useMemo(
    () => domains.filter((d) => d.questionCount > 0).sort((a, b) => a.averageScore - b.averageScore).slice(0, 2),
    [domains],
  );
  const strongDomain = useMemo(
    () => domains.filter((d) => d.questionCount > 0).sort((a, b) => b.averageScore - a.averageScore)[0] ?? null,
    [domains],
  );
  const daysLeft = daysUntil(examDate);

  const totalQuestions = useMemo(() => Object.values(results).reduce((s, r) => s + r.total, 0), [results]);

  if (isExcluded(location)) return null;

  const readinessColor =
    readiness >= 80 ? "#22c55e" : readiness >= 65 ? "var(--theme-primary)" : "#f59e0b";

  const probColor =
    passProb >= 75 ? "#22c55e" : passProb >= 55 ? "var(--theme-primary)" : "#ef4444";

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open learner insights"
        className={cn(
          "fixed bottom-6 right-6 z-40 flex items-center justify-center",
          "w-11 h-11 rounded-full shadow-lg transition-all duration-200",
          "bg-[var(--theme-primary)] text-white hover:opacity-90 active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--theme-primary)]",
          open && "opacity-0 pointer-events-none",
        )}
      >
        <Brain className="w-5 h-5" />
      </button>

      {/* Drawer backdrop (subtle, non-blocking on desktop) */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:pointer-events-none"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Learner Insights"
        className={cn(
          "fixed z-50 bg-[var(--color-warmwhite,#fdfcfa)] border-l border-[var(--theme-border,#e9e2ff)] shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          // desktop: right side drawer
          "hidden sm:flex sm:flex-col",
          "sm:top-0 sm:right-0 sm:bottom-0 sm:w-80",
          open ? "sm:translate-x-0" : "sm:translate-x-full",
        )}
      >
        {/* Mobile bottom sheet (separate) is handled via the sm: hidden above and mobile div below */}
        <DrawerContent
          open={open}
          onClose={() => setOpen(false)}
          hasData={hasData}
          readiness={readiness}
          readinessColor={readinessColor}
          passProb={passProb}
          probColor={probColor}
          weakDomains={weakDomains}
          strongDomain={strongDomain}
          daysLeft={daysLeft}
          totalQuestions={totalQuestions}
        />
      </div>

      {/* Mobile bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Learner Insights"
        className={cn(
          "fixed z-50 bg-[var(--color-warmwhite,#fdfcfa)] border-t border-[var(--theme-border,#e9e2ff)] shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          "flex flex-col sm:hidden",
          "bottom-0 left-0 right-0 rounded-t-2xl max-h-[85dvh] overflow-y-auto",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <DrawerContent
          open={open}
          onClose={() => setOpen(false)}
          hasData={hasData}
          readiness={readiness}
          readinessColor={readinessColor}
          passProb={passProb}
          probColor={probColor}
          weakDomains={weakDomains}
          strongDomain={strongDomain}
          daysLeft={daysLeft}
          totalQuestions={totalQuestions}
        />
      </div>
    </>
  );
}

// ── Drawer inner content ──────────────────────────────────────────────────────

function DrawerContent({
  onClose, hasData, readiness, readinessColor, passProb, probColor,
  weakDomains, strongDomain, daysLeft, totalQuestions,
}: {
  open: boolean;
  onClose: () => void;
  hasData: boolean;
  readiness: number;
  readinessColor: string;
  passProb: number;
  probColor: string;
  weakDomains: DomainData[];
  strongDomain: DomainData | null;
  daysLeft: number | null;
  totalQuestions: number;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border,#e9e2ff)] shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[var(--theme-primary)]" />
          <span className="font-semibold text-sm text-gray-900">Learner Insights</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close insights panel"
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            {/* Exam countdown */}
            {daysLeft !== null && (
              <div className="rounded-xl bg-[var(--theme-primary)]/8 px-4 py-3 flex items-center gap-3">
                <span className="text-2xl font-black text-[var(--theme-primary)]">{daysLeft}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">days until your exam</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Stay consistent — you've got this</p>
                </div>
              </div>
            )}

            {/* Readiness snapshot */}
            <Section title="Readiness Snapshot">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#e9e2ff" strokeWidth="5" />
                    <circle
                      cx="28" cy="28" r="22" fill="none"
                      stroke={readinessColor} strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - readiness / 100)}`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-gray-900">
                    {readiness}%
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Pass Probability</span>
                      <span className="text-xs font-bold" style={{ color: probColor }}>{passProb}%</span>
                    </div>
                    <MiniBar value={passProb} color={probColor} />
                  </div>
                  <p className="text-[10px] text-gray-400">{totalQuestions} questions answered</p>
                </div>
              </div>
            </Section>

            {/* Weak areas */}
            {weakDomains.length > 0 && (
              <Section title="Focus Areas" icon={<TrendingDown className="w-3.5 h-3.5 text-amber-500" />}>
                <div className="space-y-2.5">
                  {weakDomains.map((d) => (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-700">{d.emoji} {d.name}</span>
                        <span className="text-xs font-semibold text-amber-600">{d.averageScore}%</span>
                      </div>
                      <MiniBar value={d.averageScore} color="#f59e0b" />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Recent strength */}
            {strongDomain && (
              <Section title="Your Strength" icon={<TrendingUp className="w-3.5 h-3.5 text-green-500" />}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">{strongDomain.emoji} {strongDomain.name}</span>
                    <span className="text-xs font-semibold text-green-600">{strongDomain.averageScore}%</span>
                  </div>
                  <MiniBar value={strongDomain.averageScore} color="#22c55e" />
                </div>
              </Section>
            )}

            {/* Recommended next action */}
            {weakDomains[0] && (
              <Section title="Recommended Next" icon={<Target className="w-3.5 h-3.5 text-[var(--theme-primary)]" />}>
                <LocaleLink
                  href="/lessons"
                  className="flex items-center justify-between rounded-lg bg-[var(--theme-primary)]/6 px-3 py-2.5 hover:bg-[var(--theme-primary)]/12 transition-colors group"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{weakDomains[0].emoji} {weakDomains[0].name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Review weak-area lessons</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--theme-primary)] group-hover:translate-x-0.5 transition-transform" />
                </LocaleLink>
              </Section>
            )}
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 border-t border-[var(--theme-border,#e9e2ff)] shrink-0">
        <LocaleLink
          href="/readiness-report"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-semibold text-[var(--theme-primary)] border border-[var(--theme-primary)]/25 hover:bg-[var(--theme-primary)]/6 transition-colors"
        >
          Full Readiness Report <ArrowRight className="w-3.5 h-3.5" />
        </LocaleLink>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</span>
      </div>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <Brain className="w-8 h-8 text-gray-200 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-500">No study data yet</p>
      <p className="text-xs text-gray-400 mt-1">Complete a lesson quiz to see your insights here.</p>
      <LocaleLink href="/lessons" className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-[var(--theme-primary)] hover:underline">
        Browse lessons <ArrowRight className="w-3 h-3" />
      </LocaleLink>
    </div>
  );
}
