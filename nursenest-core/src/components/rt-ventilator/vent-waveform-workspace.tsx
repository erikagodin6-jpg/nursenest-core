"use client";

/**
 * VentWaveformWorkspace — the full interactive waveform learning environment.
 *
 * Combines:
 *   - Category tabs (Normal Modes / Conditions / Asynchrony)
 *   - Template selector grid
 *   - Full lesson view (waveform + interpretation panel)
 *   - Settings impact visualizer
 *
 * Server page imports this as the single client root — keeps the server component
 * shell clean while the interactivity lives here.
 */

import { useState, useMemo } from "react";
import { VentWaveformLesson } from "@/components/rt-ventilator/vent-waveform-lesson";
import { VentSettingsVisualizer } from "@/components/rt-ventilator/vent-settings-visualizer";
import {
  VENT_TEMPLATE_REGISTRY,
  getVentTemplatesByCategory,
  VENT_CATEGORY_LABELS,
  VENT_URGENCY_LABELS,
  type VentTemplate,
  type VentTemplateCategory,
} from "@/lib/rt-ventilator/vent-waveform-templates";

// ─── Category tab bar ─────────────────────────────────────────────────────────

const CATEGORIES: VentTemplateCategory[] = ["normal_mode", "condition", "asynchrony"];

const CATEGORY_ICONS: Record<VentTemplateCategory, string> = {
  normal_mode: "📊",
  condition: "⚠",
  asynchrony: "↔",
};

const URGENCY_DOT: Record<VentTemplate["urgency"], string> = {
  routine: "bg-[var(--semantic-info)]",
  monitor: "bg-[var(--semantic-brand)]",
  act_now: "bg-[var(--semantic-warning)]",
  emergency: "bg-[var(--semantic-error)]",
};

// ─── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: VentTemplate;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-xl border px-3 py-2.5 text-left transition ${
        selected
          ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:bg-[var(--semantic-surface-alt)]"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-1.5">
        <p className={`text-xs font-semibold leading-snug ${selected ? "text-[var(--semantic-brand)]" : "text-[var(--semantic-text-primary)]"}`}>
          {template.label}
        </p>
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT[template.urgency]}`} aria-label={VENT_URGENCY_LABELS[template.urgency]} />
      </div>
      <p className="mt-1 text-[10px] leading-snug text-[var(--semantic-text-muted)] line-clamp-2">
        {template.summary.split(" — ")[1] ?? template.summary.slice(0, 60)}
      </p>
    </button>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

type Tab = "library" | "visualizer";

export function VentWaveformWorkspace() {
  const [activeTab, setActiveTab] = useState<Tab>("library");
  const [category, setCategory] = useState<VentTemplateCategory>("normal_mode");
  const [selectedKey, setSelectedKey] = useState<string>("vc_square_normal");

  const templates = useMemo(() => getVentTemplatesByCategory(category), [category]);
  const selectedTemplate = VENT_TEMPLATE_REGISTRY.find((t) => t.key === selectedKey);

  // If selected template is not in current category, switch to first in category
  const displayTemplate =
    selectedTemplate && selectedTemplate.category === category
      ? selectedTemplate
      : templates[0];

  function handleCategoryChange(cat: VentTemplateCategory) {
    setCategory(cat);
    const first = getVentTemplatesByCategory(cat)[0];
    if (first) setSelectedKey(first.key);
  }

  return (
    <div className="space-y-6" data-nn-vent-workspace="">
      {/* Top tab bar: Library vs Visualizer */}
      <div className="flex gap-1 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-1">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            activeTab === "library"
              ? "bg-[var(--semantic-brand)] text-white shadow-sm"
              : "text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
          }`}
        >
          Waveform Library
        </button>
        <button
          onClick={() => setActiveTab("visualizer")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
            activeTab === "visualizer"
              ? "bg-[var(--semantic-brand)] text-white shadow-sm"
              : "text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
          }`}
        >
          Settings Visualizer
        </button>
      </div>

      {activeTab === "visualizer" && (
        <VentSettingsVisualizer />
      )}

      {activeTab === "library" && (
        <div className="space-y-4">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === cat
                    ? "border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-info)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
                }`}
              >
                <span aria-hidden className="mr-1">{CATEGORY_ICONS[cat]}</span>
                {VENT_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
            {/* Template picker */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)]">
                {templates.length} scenarios
              </p>
              <div className="flex flex-col gap-1.5">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.key}
                    template={t}
                    selected={t.key === (displayTemplate?.key ?? "")}
                    onSelect={() => setSelectedKey(t.key)}
                  />
                ))}
              </div>
            </div>

            {/* Lesson view */}
            <div className="min-w-0">
              {displayTemplate ? (
                <VentWaveformLesson
                  template={displayTemplate}
                  breathCount={4}
                  showExamTraps
                  showInterventions
                />
              ) : (
                <p className="text-sm text-[var(--semantic-text-muted)]">Select a scenario to begin.</p>
              )}
            </div>
          </div>

          {/* Urgency legend */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Urgency key</p>
            {(["routine", "monitor", "act_now", "emergency"] as const).map((u) => (
              <div key={u} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${URGENCY_DOT[u]}`} aria-hidden />
                <span className="text-xs text-[var(--semantic-text-secondary)]">{VENT_URGENCY_LABELS[u]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
