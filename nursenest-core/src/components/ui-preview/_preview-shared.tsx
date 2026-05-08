"use client";

/**
 * Shared primitives for the NurseNest internal /preview surfaces.
 *
 * Extracted from `nursenest-premium-preview.tsx` to keep individual surface
 * files (homepage, marketing, dashboard, etc.) under TS-server-friendly sizes.
 *
 * This file is ONLY consumed by `src/components/ui-preview/*` and the
 * noindex `/preview/[surface]` route. It is NOT used by production marketing
 * routes — preview surfaces are explicitly `robots: noindex,nofollow`.
 */

import {
  Activity,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  PillIcon,
  ShieldAlert,
  Stethoscope,
  Target,
} from "lucide-react";
import type { ComponentType } from "react";
import { BrandLeafIcon } from "@/components/brand/brand-leaf-icon";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Theme typing + palettes
// ---------------------------------------------------------------------------

export type PreviewTheme = "blossom" | "ocean" | "forest" | "midnight" | "apex";

export const themeLabels: Record<PreviewTheme, string> = {
  blossom: "Blossom",
  ocean: "Ocean",
  forest: "Forest",
  midnight: "Midnight",
  apex: "Apex",
};

export function isPreviewTheme(value: string | null): value is PreviewTheme {
  return (
    value === "blossom" ||
    value === "ocean" ||
    value === "forest" ||
    value === "midnight" ||
    value === "apex"
  );
}

export const themeVars: Record<PreviewTheme, Record<string, string>> = {
  blossom: {
    "--preview-bg": "#fef7fb",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#feeef7",
    "--preview-elevated": "#fffafd",
    "--preview-text": "#2d1020",
    "--preview-muted": "#7a546b",
    "--preview-border": "rgba(190, 90, 132, 0.22)",
    "--preview-accent": "#db2777",
    "--preview-accent-2": "#38bdf8",
    "--preview-accent-soft": "#fce7f3",
  },
  ocean: {
    "--preview-bg": "#f0faff",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#e3f5fb",
    "--preview-elevated": "#f7fdff",
    "--preview-text": "#0c2a38",
    "--preview-muted": "#446474",
    "--preview-border": "rgba(8, 145, 178, 0.22)",
    "--preview-accent": "#0891b2",
    "--preview-accent-2": "#2563eb",
    "--preview-accent-soft": "#cffafe",
  },
  forest: {
    "--preview-bg": "#f3faf2",
    "--preview-surface": "#ffffff",
    "--preview-surface-2": "#e8f7e6",
    "--preview-elevated": "#fafef9",
    "--preview-text": "#122e1d",
    "--preview-muted": "#4e6a58",
    "--preview-border": "rgba(5, 150, 105, 0.20)",
    "--preview-accent": "#059669",
    "--preview-accent-2": "#0f766e",
    "--preview-accent-soft": "#d1fae5",
  },
  midnight: {
    "--preview-bg": "#07101e",
    "--preview-surface": "#0f1929",
    "--preview-surface-2": "#121f34",
    "--preview-elevated": "#162240",
    "--preview-text": "#ecf5ff",
    "--preview-muted": "#93afc8",
    "--preview-border": "rgba(148, 163, 184, 0.26)",
    "--preview-accent": "#38bdf8",
    "--preview-accent-2": "#818cf8",
    "--preview-accent-soft": "rgba(56, 189, 248, 0.13)",
  },
  apex: {
    // Apex — premium clinical: deep navy + violet + warm-gold accent.
    "--preview-bg": "#0b0f1a",
    "--preview-surface": "#121828",
    "--preview-surface-2": "#19223a",
    "--preview-elevated": "#1d2848",
    "--preview-text": "#f4f1ff",
    "--preview-muted": "#a8b3d1",
    "--preview-border": "rgba(199, 178, 255, 0.22)",
    "--preview-accent": "#a78bfa",
    "--preview-accent-2": "#fbbf24",
    "--preview-accent-soft": "rgba(167, 139, 250, 0.16)",
  },
};

// ---------------------------------------------------------------------------
// Semantic clinical pill metadata
// ---------------------------------------------------------------------------

export const semantic = {
  patho: { label: "Pathophysiology", color: "#3730a3", icon: Activity },
  labs: { label: "Diagnostics & Labs", color: "#d97706", icon: FlaskConical },
  symptoms: { label: "Signs & Symptoms", color: "#ea580c", icon: HeartPulse },
  redFlags: { label: "Red Flags", color: "#e11d48", icon: ShieldAlert },
  interventions: { label: "Nursing Interventions", color: "#059669", icon: Stethoscope },
  teaching: { label: "Patient Teaching", color: "#0891b2", icon: GraduationCap },
  meds: { label: "Medications", color: "#db2777", icon: PillIcon },
  pearls: { label: "Clinical Pearls", color: "#7c3aed", icon: Lightbulb },
  exam: { label: "Exam Focus", color: "#2563eb", icon: Target },
} as const;

// ---------------------------------------------------------------------------
// Tiny utilities + atomic preview primitives
// ---------------------------------------------------------------------------

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function PreviewBrand() {
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

export function ThemeSwitcher({
  theme,
  setTheme,
}: {
  theme: PreviewTheme;
  setTheme: (theme: PreviewTheme) => void;
}) {
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

export function Pill({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "green" | "amber" | "rose" | "blue" | "purple" | "teal";
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
              : tone === "teal"
                ? "#0891b2"
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

export function PreviewCard({
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

export function MetricCard({
  title,
  value,
  icon: Icon,
  tone = "blue",
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "blue" | "green" | "amber" | "rose" | "purple";
}) {
  const color =
    tone === "green"
      ? "#059669"
      : tone === "amber"
        ? "#d97706"
        : tone === "rose"
          ? "#e11d48"
          : tone === "purple"
            ? "#7c3aed"
            : "#2563eb";
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
        <div
          className="h-full w-2/3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, var(--preview-accent-2))` }}
        />
      </div>
    </PreviewCard>
  );
}
