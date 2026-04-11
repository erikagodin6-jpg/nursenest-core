"use client";

import Link from "next/link";
import { trackClientEvent } from "@/lib/observability/posthog-client";

export type HeatmapTopic = {
  topic: string;
  missRate: number;
  attempted: number;
};

const HEAT_COLORS = [
  { max: 0.2, bg: "var(--semantic-success)", label: "Strong" },
  { max: 0.35, bg: "var(--semantic-info)", label: "Moderate" },
  { max: 0.5, bg: "var(--semantic-warning)", label: "Needs work" },
  { max: 1.0, bg: "var(--semantic-danger)", label: "Weak" },
];

function heatColor(missRate: number): string {
  for (const h of HEAT_COLORS) {
    if (missRate <= h.max) return h.bg;
  }
  return "var(--semantic-danger)";
}

/**
 * WeaknessHeatmap — visual grid of topics coloured by weakness intensity.
 * Each cell is clickable and links to the question bank for that topic.
 */
export function WeaknessHeatmap({
  topics,
  maxTopics = 12,
}: {
  topics: HeatmapTopic[];
  maxTopics?: number;
}) {
  if (topics.length === 0) return null;

  const visible = topics.slice(0, maxTopics);

  return (
    <div className="nn-heatmap-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[0.9375rem] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          Topic Strength Map
        </h3>
        <div className="flex items-center gap-3">
          {HEAT_COLORS.map((h) => (
            <div key={h.label} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: h.bg }}
              />
              <span className="text-[0.6875rem] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
                {h.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((t) => {
          const color = heatColor(t.missRate);
          const pct = Math.round((1 - t.missRate) * 100);
          return (
            <Link
              key={t.topic}
              href="/app/questions"
              onClick={() =>
                trackClientEvent("heatmap_topic_clicked", {
                  topic: t.topic,
                  miss_rate: t.missRate,
                })
              }
              className="nn-heatmap-cell group"
              style={{
                borderColor: `color-mix(in srgb, ${color} 30%, var(--semantic-border-soft))`,
              }}
            >
              <div
                className="nn-heatmap-cell__bar"
                style={{
                  width: `${Math.max(8, pct)}%`,
                  background: `color-mix(in srgb, ${color} 15%, transparent)`,
                }}
              />
              <div className="relative z-10">
                <p
                  className="text-[0.8125rem] font-semibold leading-snug"
                  style={{ color: "var(--semantic-text-primary)" }}
                >
                  {t.topic}
                </p>
                <p className="mt-1 text-[0.6875rem] font-medium" style={{ color }}>
                  {pct}% accuracy · {t.attempted} Q
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
