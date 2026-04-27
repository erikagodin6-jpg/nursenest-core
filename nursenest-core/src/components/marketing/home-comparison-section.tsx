"use client";

import { Activity, Route } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { safeHomepageMarketingCopy } from "@/lib/marketing/homepage-safe-copy";

const ROWS = ["clarity", "simplicity", "adaptive", "integrated", "guided", "readiness"] as const;
const HIGHLIGHT_ROWS = new Set<(typeof ROWS)[number]>(["guided", "readiness"]);

/** English fallbacks when marketing shard is unavailable (must never show raw keys). */
const COMPARISON_FB: Record<string, string> = {
  "home.comparison.title": "NurseNest vs. UWorld-style question banks",
  "home.comparison.sub":
    "UWorld, Archer, and similar banks excel at volume and rationales. NurseNest is organized differently: one pathway-scoped system where lessons, the bank, CAT or timed exams, and readiness views share the same scope—so you spend less time reconciling tabs and more time on decisions that match your license.",
  "home.comparison.highlightGuided":
    "Guided system: bank items → pathway lessons → practice exams, with miss patterns suggesting what to queue next.",
  "home.comparison.highlightReadiness":
    "Readiness: topic and category signals from graded work and practice exams—an internal index, not a pass guarantee.",
  "home.comparison.disclaimer":
    "We are not affiliated with UWorld, Archer, or other vendors; names refer to common product shapes. This compares how the app is organized, not item overlap or difficulty.",
  "home.comparison.colDimension": "Capability",
  "home.comparison.colTypical": "Typical volume bank (e.g. UWorld, Archer)",
  "home.comparison.colNn": "NurseNest",
  "home.comparison.row.clarity.label": "Clarity of scope",
  "home.comparison.row.clarity.typical":
    "Large pools rely on you to filter; mixing PN vs RN context or US vs Canada language is easy when materials come from several sources.",
  "home.comparison.row.clarity.nn":
    "Each hub fixes country and license (RN, PN, NP, allied); bank, lessons, and exams inherit that scope so wording and delegation rules stay consistent.",
  "home.comparison.row.simplicity.label": "Simplicity of workflow",
  "home.comparison.row.simplicity.typical":
    "Many candidates stack a bank, third-party videos, PDFs, and their own calendar; each layer adds switching cost.",
  "home.comparison.row.simplicity.nn":
    "One login holds bank, lessons, practice exams, and analytics for your track—fewer spreadsheets and fewer \"which app tonight?\" decisions.",
  "home.comparison.row.adaptive.label": "Adaptive exams",
  "home.comparison.row.adaptive.typical":
    "Timed quizzes are common; adaptive sessions that stay inside your license and share attempt history with the same bank are less typical.",
  "home.comparison.row.adaptive.nn":
    "CAT-style and timed practice exams use the same pathway filters and account history as the bank, so adaptive work is not a disconnected add-on.",
  "home.comparison.row.integrated.label": "Lessons + questions together",
  "home.comparison.row.integrated.typical":
    "Video courses and banks are frequently separate purchases; closing the loop means tab-hopping and manual note-taking.",
  "home.comparison.row.integrated.nn":
    "Lesson catalogs and items share pathway keys; cross-links and miss tags route you to the right lesson instead of a generic search.",
  "home.comparison.row.guided.label": "Guided study system",
  "home.comparison.row.guided.typical":
    "Volume and streaks are easy to measure; a built-in loop from items to remediation to exam rehearsal is less common.",
  "home.comparison.row.guided.nn":
    "The product is built around a repeatable loop—questions, then lessons on weak topics, then practice exams—with next steps informed by your recent misses.",
  "home.comparison.row.readiness.label": "Readiness tracking",
  "home.comparison.row.readiness.typical":
    "A single accuracy percent or hours studied is easy to show; tying numbers to which topic to study next is often still your own judgment call.",
  "home.comparison.row.readiness.nn":
    "You see category and topic load from graded sessions, plus a pathway readiness view derived from your work—we do not publish pass-rate claims.",
};

function cmp(
  t: ((k: string) => string) | undefined,
  key: string,
): string {
  return safeHomepageMarketingCopy(t, key, COMPARISON_FB[key] ?? "—");
}

export function HomeComparisonSection() {
  let t: ((k: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    t = ctx?.t;
  } catch {
    // fallback safe mode
  }

  return (
    <section
      className="nn-section-soft border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-comparison-heading"
      data-testid="section-home-comparison"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-3xl md:mb-10">
          <h2 id="home-comparison-heading" className="nn-marketing-h2 text-balance text-[var(--theme-heading-text)]">
            {cmp(t, "home.comparison.title")}
          </h2>

          <p className="nn-marketing-body mx-auto mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            {cmp(t, "home.comparison.sub")}
          </p>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-primary/25 bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))] px-4 py-3">
              <Route className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[var(--theme-body-text)]">{cmp(t, "home.comparison.highlightGuided")}</p>
            </div>

            <div className="flex gap-3 rounded-xl border border-primary/25 bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))] px-4 py-3">
              <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[var(--theme-body-text)]">{cmp(t, "home.comparison.highlightReadiness")}</p>
            </div>
          </div>

          <p className="mt-4 text-[var(--theme-muted-text)]">{cmp(t, "home.comparison.disclaimer")}</p>
        </header>

        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--border-medium)] bg-[var(--theme-card-bg)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3">{cmp(t, "home.comparison.colDimension")}</th>
                <th className="px-4 py-3">{cmp(t, "home.comparison.colTypical")}</th>
                <th className="px-4 py-3 text-primary">{cmp(t, "home.comparison.colNn")}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const hi = HIGHLIGHT_ROWS.has(row);
                return (
                  <tr key={row} className={hi ? "bg-primary/5" : ""}>
                    <th className="px-4 py-3">{cmp(t, `home.comparison.row.${row}.label`)}</th>
                    <td className="px-4 py-3">{cmp(t, `home.comparison.row.${row}.typical`)}</td>
                    <td className="px-4 py-3">{cmp(t, `home.comparison.row.${row}.nn`)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-4 md:hidden">
          {ROWS.map((row) => {
            const hi = HIGHLIGHT_ROWS.has(row);
            return (
              <li key={row} className={`rounded-2xl p-4 ${hi ? "bg-primary/5" : ""}`}>
                <p className="font-semibold">{cmp(t, `home.comparison.row.${row}.label`)}</p>
                <p className="mt-2 text-muted">{cmp(t, "home.comparison.colTypical")}</p>
                <p>{cmp(t, `home.comparison.row.${row}.typical`)}</p>
                <p className="mt-3 text-primary">{cmp(t, "home.comparison.colNn")}</p>
                <p>{cmp(t, `home.comparison.row.${row}.nn`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
