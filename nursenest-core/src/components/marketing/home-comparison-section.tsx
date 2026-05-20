"use client";

import { Activity, Route } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const ROWS = ["clarity", "simplicity", "adaptive", "integrated", "guided", "readiness"] as const;
const HIGHLIGHT_ROWS = new Set<(typeof ROWS)[number]>(["guided", "readiness"]);

function safeT(t: (k: string) => string, key: string): string {
  try {
    const v = t(key);
    return typeof v === "string" && v.trim() ? v : key;
  } catch {
    return key;
  }
}

export function HomeComparisonSection() {
  let t: (k: string) => string = (k) => k;

  try {
    const ctx = useMarketingI18n();
    t = ctx?.t ?? t;
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
            {safeT(t, "home.comparison.title")}
          </h2>

          <p className="nn-marketing-body mx-auto mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            {safeT(t, "home.comparison.sub")}
          </p>

          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl border border-primary/25 bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))] px-4 py-3">
              <Route className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[var(--theme-body-text)]">
                {safeT(t, "home.comparison.highlightGuided")}
              </p>
            </div>

            <div className="flex gap-3 rounded-xl border border-primary/25 bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))] px-4 py-3">
              <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[var(--theme-body-text)]">
                {safeT(t, "home.comparison.highlightReadiness")}
              </p>
            </div>
          </div>

          <p className="mt-4 text-[var(--theme-muted-text)]">
            {safeT(t, "home.comparison.disclaimer")}
          </p>
        </header>

        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--border-medium)] bg-[var(--theme-card-bg)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3">{safeT(t, "home.comparison.colDimension")}</th>
                <th className="px-4 py-3">{safeT(t, "home.comparison.colTypical")}</th>
                <th className="px-4 py-3 text-primary">{safeT(t, "home.comparison.colNn")}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const hi = HIGHLIGHT_ROWS.has(row);
                return (
                  <tr key={row} className={hi ? "bg-primary/5" : ""}>
                    <th className="px-4 py-3">
                      {safeT(t, `home.comparison.row.${row}.label`)}
                    </th>
                    <td className="px-4 py-3">
                      {safeT(t, `home.comparison.row.${row}.typical`)}
                    </td>
                    <td className="px-4 py-3">
                      {safeT(t, `home.comparison.row.${row}.nn`)}
                    </td>
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
                <p className="font-semibold">
                  {safeT(t, `home.comparison.row.${row}.label`)}
                </p>
                <p className="mt-2 text-muted">
                  {safeT(t, "home.comparison.colTypical")}
                </p>
                <p>{safeT(t, `home.comparison.row.${row}.typical`)}</p>
                <p className="mt-3 text-primary">
                  {safeT(t, "home.comparison.colNn")}
                </p>
                <p>{safeT(t, `home.comparison.row.${row}.nn`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}