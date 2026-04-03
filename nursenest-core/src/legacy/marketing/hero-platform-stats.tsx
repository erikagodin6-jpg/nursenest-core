"use client";

import { useEffect, useState } from "react";
import {
  HelpCircle,
  Layers,
  BookOpen,
  Stethoscope,
  Globe,
  Languages,
  ClipboardCheck,
  Users,
} from "lucide-react";

type HomeStatsPayload = {
  totalLessons: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  scenarioCount?: number;
  registeredLearners?: number;
};

function formatStat(n: number | undefined): string {
  if (n === undefined || n <= 0) return "N/A";
  return Math.floor(n).toLocaleString("en-US");
}

/**
 * Live counts from `GET /api/public/home-stats` (aggregate, paywall-safe).
 */
export default function HeroPlatformStats() {
  const [stats, setStats] = useState<HomeStatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (!cancelled && d) setStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = [
    { icon: HelpCircle, label: "Practice questions", value: formatStat(stats?.questionCount) },
    { icon: Layers, label: "Flashcards", value: formatStat(stats?.totalFlashcards) },
    { icon: BookOpen, label: "Lessons", value: formatStat(stats?.totalLessons) },
    { icon: ClipboardCheck, label: "Study decks", value: formatStat(stats?.totalDecks) },
    { icon: Stethoscope, label: "Clinical scenarios", value: formatStat(stats?.scenarioCount) },
    { icon: Users, label: "Learners", value: formatStat(stats?.registeredLearners) },
    { icon: Globe, label: "Regions", value: "US & CA" },
    { icon: Languages, label: "Languages", value: "20+" },
  ];

  return (
    <section
      className="border-y border-[var(--theme-card-border)] bg-gradient-to-b from-[var(--theme-muted-surface)] to-[var(--theme-card-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-platform-stats"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2
            className="mb-2 font-bold text-[var(--theme-heading-text)]"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-platform-stats-heading"
          >
            Your Complete Healthcare Exam Preparation Platform
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[var(--theme-muted-text)] lg:text-lg">
            Everything you need to pass your nursing, NP, or allied health exam: built by educators, backed by evidence.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {rows.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-5 text-center shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className="mb-1 text-2xl font-extrabold tabular-nums text-[var(--theme-heading-text)] sm:text-3xl"
                data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium text-[var(--theme-muted-text)] sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
