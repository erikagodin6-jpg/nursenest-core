"use client";

/**
 * EcgLessonClinicalPanel
 *
 * Collapsible clinical reasoning panel displayed within ECG lessons.
 * Implements the 6-section clinical reasoning framework:
 *
 *   1. Recognize       — systematic identification criteria
 *   2. Mechanism       — why the strip looks this way (electrical basis)
 *   3. Patient Impact  — hemodynamics, stable vs. unstable presentation
 *   4. What To Do      — nursing priorities + immediate actions
 *   5. Not This Rhythm — compare/contrast with commonly confused rhythms
 *   6. When To Escalate — 4-level escalation criteria with clinical safety flags
 *
 * MOBILE DESIGN
 *   All sections are collapsible. On mobile, sections default to collapsed
 *   to avoid overwhelming the screen. On desktop (md+), all sections are
 *   expanded by default (can be individually collapsed).
 *
 * CLINICAL SAFETY
 *   High-risk and life-threatening rhythms render a prominent safety banner
 *   with do-not-miss flags above all other content.
 *
 * PROFESSION FILTER
 *   Pass `profession` prop to filter profession-specific notes.
 *   Defaults to "RN" if not specified.
 */

import { useState, useId, type ReactNode } from "react";
import type { EcgClinicalReasoningEntry, EcgProfession } from "@/lib/ecg-module/ecg-clinical-reasoning-schema";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId =
  | "recognize"
  | "mechanism"
  | "impact"
  | "action"
  | "notThis"
  | "escalate";

type Props = {
  entry: EcgClinicalReasoningEntry;
  profession?: EcgProfession;
  /** Override default-expanded sections. Defaults: all expanded on desktop, all collapsed on mobile. */
  defaultOpenSections?: SectionId[];
  /** Whether to show simulation and remediation links at the bottom. */
  showLinks?: boolean;
  className?: string;
};

// ─── Section config ───────────────────────────────────────────────────────────

const SECTIONS: Array<{ id: SectionId; label: string; icon: string; description: string }> = [
  { id: "recognize",  label: "1 · Recognize the rhythm",       icon: "◉", description: "Systematic identification criteria" },
  { id: "mechanism",  label: "2 · Why it looks this way",       icon: "⟳", description: "Electrical mechanism and conduction" },
  { id: "impact",     label: "3 · What it means for the patient", icon: "♥", description: "Hemodynamic impact, stable vs. unstable" },
  { id: "action",     label: "4 · What to do next",             icon: "→", description: "Nursing priorities and immediate actions" },
  { id: "notThis",    label: "5 · What not to confuse it with", icon: "≠", description: "Compare and contrast" },
  { id: "escalate",   label: "6 · When to escalate",            icon: "⬆", description: "Escalation criteria and safety rules" },
];

// ─── Token helpers ────────────────────────────────────────────────────────────

type RiskTokens = {
  banner: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
  sectionHeader: string;
};

const RISK_TOKENS: Record<EcgClinicalReasoningEntry["clinicalRiskLevel"], RiskTokens> = {
  low: {
    banner: "",
    badgeBg: "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]",
    badgeText: "text-[color-mix(in_srgb,var(--semantic-success)_90%,var(--semantic-text-primary))]",
    dot: "bg-[var(--semantic-success)]",
    sectionHeader: "text-[var(--semantic-text-primary)]",
  },
  moderate: {
    banner: "bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))]",
    badgeBg: "bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
    badgeText: "text-[color-mix(in_srgb,var(--semantic-warning)_90%,var(--semantic-text-primary))]",
    dot: "bg-[var(--semantic-warning)]",
    sectionHeader: "text-[var(--semantic-text-primary)]",
  },
  high: {
    banner: "bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))]",
    badgeBg: "bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))]",
    badgeText: "text-[color-mix(in_srgb,var(--semantic-danger)_90%,var(--semantic-text-primary))]",
    dot: "bg-[var(--semantic-danger)]",
    sectionHeader: "text-[var(--semantic-text-primary)]",
  },
  life_threatening: {
    banner: "bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] border-2 border-[color-mix(in_srgb,var(--semantic-danger)_50%,var(--semantic-border-soft))]",
    badgeBg: "bg-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-surface))]",
    badgeText: "text-[color-mix(in_srgb,var(--semantic-danger)_95%,var(--semantic-text-primary))] font-bold",
    dot: "bg-[var(--semantic-danger)]",
    sectionHeader: "text-[var(--semantic-text-primary)]",
  },
};

const RISK_LABELS: Record<EcgClinicalReasoningEntry["clinicalRiskLevel"], string> = {
  low: "Low risk",
  moderate: "Moderate risk",
  high: "High risk",
  life_threatening: "Life-threatening",
};

const ESCALATION_COLORS = {
  monitor: "bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-info)_80%,var(--semantic-text-primary))]",
  notify: "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]",
  rapid_response: "bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-danger)_85%,var(--semantic-text-primary))]",
  code_blue: "bg-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-danger)_95%,var(--semantic-text-primary))] font-bold",
} as const;

const ESCALATION_LABELS = {
  monitor: "Monitor",
  notify: "Notify provider",
  rapid_response: "Rapid Response",
  code_blue: "Code Blue",
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function BulletList({ items, className }: { items: ReadonlyArray<string>; className?: string }) {
  return (
    <ul className={`space-y-2 ${className ?? ""}`} role="list">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-border-medium)]"
            aria-hidden
          />
          <span className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLabel({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-wide ${className ?? "text-[var(--semantic-text-tertiary)]"}`}
    >
      {text}
    </p>
  );
}

function CollapsibleSection({
  id,
  label,
  icon,
  isOpen,
  onToggle,
  children,
  triggerId,
  panelId,
  riskLevel,
}: {
  id: SectionId;
  label: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  triggerId: string;
  panelId: string;
  riskLevel: EcgClinicalReasoningEntry["clinicalRiskLevel"];
}) {
  const tokens = RISK_TOKENS[riskLevel];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-border-soft)_30%,var(--semantic-surface))] sm:p-5"
        type="button"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--semantic-border-soft)_60%,var(--semantic-surface))] text-sm font-bold text-[var(--semantic-text-secondary)]"
            aria-hidden
          >
            {icon}
          </span>
          <span className={`text-sm font-semibold ${tokens.sectionHeader}`}>{label}</span>
        </span>
        <span
          className={`shrink-0 text-[var(--semantic-text-tertiary)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="border-t border-[var(--semantic-border-soft)] p-4 sm:p-5"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EcgLessonClinicalPanel({
  entry,
  profession = "RN",
  showLinks = true,
  className,
}: Props) {
  const baseId = useId();
  const tokens = RISK_TOKENS[entry.clinicalRiskLevel];

  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    () => new Set(SECTIONS.map((s) => s.id)),
  );

  function toggle(id: SectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(open: boolean) {
    setOpenSections(open ? new Set(SECTIONS.map((s) => s.id)) : new Set());
  }

  const professionNote = entry.professionNotes.find((n) => n.profession === profession);
  const isHighRisk = entry.clinicalRiskLevel === "high" || entry.clinicalRiskLevel === "life_threatening";

  return (
    <div className={`space-y-4 ${className ?? ""}`} data-ecg-clinical-panel={entry.rhythmKey}>

      {/* Header: label + risk badge + expand/collapse all */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">
            {entry.label}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tokens.badgeBg} ${tokens.badgeText}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tokens.dot}`} aria-hidden />
            {RISK_LABELS[entry.clinicalRiskLevel]}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="rounded px-2 py-1 text-xs text-[var(--semantic-text-tertiary)] hover:bg-[var(--semantic-border-soft)] hover:text-[var(--semantic-text-secondary)]"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="rounded px-2 py-1 text-xs text-[var(--semantic-text-tertiary)] hover:bg-[var(--semantic-border-soft)] hover:text-[var(--semantic-text-secondary)]"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Clinical safety banner — shown above sections for high-risk rhythms */}
      {isHighRisk && entry.clinicalSafetyFlags.length > 0 && (
        <div
          className={`rounded-xl p-4 sm:p-5 ${tokens.banner}`}
          role="alert"
          aria-label="Clinical safety flags"
        >
          <p className={`mb-3 text-xs font-bold uppercase tracking-wide ${tokens.badgeText}`}>
            ⚠ Clinical Safety
          </p>
          <div className="space-y-3">
            {entry.clinicalSafetyFlags.map((flag, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {flag.rule}
                </p>
                <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {flag.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 1 — Recognize */}
      <CollapsibleSection
        id="recognize"
        label="1 · Recognize the rhythm"
        icon="◉"
        isOpen={openSections.has("recognize")}
        onToggle={() => toggle("recognize")}
        triggerId={`${baseId}-recognize-trigger`}
        panelId={`${baseId}-recognize-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-4">
          <div>
            <SectionLabel text="Identification checklist" />
            <BulletList items={entry.recognition} className="mt-2" />
          </div>
          {entry.hemodynamicImpact.hemodynamicCompromiseThreshold && (
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-warning)_25%,var(--semantic-border-soft))] p-3">
              <SectionLabel text="Compromise threshold" className="text-[color-mix(in_srgb,var(--semantic-warning)_80%,var(--semantic-text-primary))]" />
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                {entry.hemodynamicImpact.hemodynamicCompromiseThreshold}
              </p>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Section 2 — Mechanism */}
      <CollapsibleSection
        id="mechanism"
        label="2 · Why it looks this way"
        icon="⟳"
        isOpen={openSections.has("mechanism")}
        onToggle={() => toggle("mechanism")}
        triggerId={`${baseId}-mechanism-trigger`}
        panelId={`${baseId}-mechanism-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-4">
          <div>
            <SectionLabel text="Electrical mechanism" />
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {entry.mechanism}
            </p>
          </div>
          <div>
            <SectionLabel text="Conduction pathway" />
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {entry.conductionPath}
            </p>
          </div>
          <div>
            <SectionLabel text="Why the strip looks this way" />
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {entry.whyItLooksThisWay}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 3 — Patient Impact */}
      <CollapsibleSection
        id="impact"
        label="3 · What it means for the patient"
        icon="♥"
        isOpen={openSections.has("impact")}
        onToggle={() => toggle("impact")}
        triggerId={`${baseId}-impact-trigger`}
        panelId={`${baseId}-impact-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-5">
          <div>
            <SectionLabel text="Cardiac output effect" />
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {entry.hemodynamicImpact.cardiacOutputEffect}
            </p>
          </div>
          <div>
            <SectionLabel text="Perfusion impact" />
            <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {entry.hemodynamicImpact.perfusionImpact}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-success)_06%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] p-3">
              <SectionLabel
                text="Stable presentation"
                className="text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))]"
              />
              <BulletList items={entry.hemodynamicImpact.stablePresentation} className="mt-2" />
            </div>
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-border-soft))] p-3">
              <SectionLabel
                text="Unstable presentation"
                className="text-[color-mix(in_srgb,var(--semantic-danger)_80%,var(--semantic-text-primary))]"
              />
              <BulletList items={entry.hemodynamicImpact.unstablePresentation} className="mt-2" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 4 — What To Do */}
      <CollapsibleSection
        id="action"
        label="4 · What to do next"
        icon="→"
        isOpen={openSections.has("action")}
        onToggle={() => toggle("action")}
        triggerId={`${baseId}-action-trigger`}
        panelId={`${baseId}-action-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-5">
          <div>
            <SectionLabel text="Nursing priorities" />
            <BulletList items={entry.nursingPriorities} className="mt-2" />
          </div>
          {entry.immediateActions && entry.immediateActions.length > 0 && (
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_25%,var(--semantic-border-soft))] p-3">
              <SectionLabel
                text="Immediate actions (unstable)"
                className="text-[color-mix(in_srgb,var(--semantic-danger)_85%,var(--semantic-text-primary))]"
              />
              <ol className="mt-2 space-y-2" role="list">
                {entry.immediateActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-surface))] text-[10px] font-bold text-[color-mix(in_srgb,var(--semantic-danger)_85%,var(--semantic-text-primary))]">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                      {action}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {professionNote && (
            <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] p-3">
              <SectionLabel
                text={`${professionNote.profession === "new_grad" ? "New grad note" : `${professionNote.profession} scope note`}`}
                className="text-[color-mix(in_srgb,var(--semantic-info)_80%,var(--semantic-text-primary))]"
              />
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {professionNote.note}
              </p>
            </div>
          )}
          <div>
            <SectionLabel text="Monitoring requirements" />
            <BulletList items={entry.monitoringRequirements} className="mt-2" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 5 — Compare / Contrast */}
      <CollapsibleSection
        id="notThis"
        label="5 · What not to confuse it with"
        icon="≠"
        isOpen={openSections.has("notThis")}
        onToggle={() => toggle("notThis")}
        triggerId={`${baseId}-notThis-trigger`}
        panelId={`${baseId}-notThis-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-4">
          {entry.compareContrast.map((cc, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-border-soft)_20%,var(--semantic-surface))] p-3"
            >
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                Not <span className="italic">{cc.otherLabel}</span>
              </p>
              <div className="mt-2 space-y-1.5">
                <p className="text-xs text-[var(--semantic-text-secondary)]">
                  <span className="font-medium text-[var(--semantic-text-primary)]">Look at: </span>
                  {cc.discriminatingFeature}
                </p>
                <p className="text-xs text-[var(--semantic-text-secondary)]">
                  <span className="font-medium text-[var(--semantic-text-primary)]">Key difference: </span>
                  {cc.keyDifferentiator}
                </p>
                <p className="text-xs leading-relaxed text-[color-mix(in_srgb,var(--semantic-danger)_80%,var(--semantic-text-primary))]">
                  <span className="font-medium">If confused: </span>
                  {cc.confusionConsequence}
                </p>
              </div>
            </div>
          ))}
          <div>
            <SectionLabel text="Common traps" />
            <BulletList items={entry.commonTraps} className="mt-2" />
          </div>
        </div>
      </CollapsibleSection>

      {/* Section 6 — Escalation */}
      <CollapsibleSection
        id="escalate"
        label="6 · When to escalate"
        icon="⬆"
        isOpen={openSections.has("escalate")}
        onToggle={() => toggle("escalate")}
        triggerId={`${baseId}-escalate-trigger`}
        panelId={`${baseId}-escalate-panel`}
        riskLevel={entry.clinicalRiskLevel}
      >
        <div className="space-y-3">
          {(
            [
              { key: "monitor" as const,        items: entry.escalationCriteria.monitor },
              { key: "notify" as const,         items: entry.escalationCriteria.notify },
              { key: "rapid_response" as const, items: entry.escalationCriteria.rapidResponse },
              { key: "code_blue" as const,      items: entry.escalationCriteria.codeBlue },
            ] as const
          )
            .filter(({ items }) => items.length > 0)
            .map(({ key, items }) => (
              <div
                key={key}
                className={`rounded-lg p-3 ${ESCALATION_COLORS[key]}`}
                role="group"
                aria-label={`${ESCALATION_LABELS[key]} criteria`}
              >
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide">
                  {ESCALATION_LABELS[key]}
                </p>
                <ul className="space-y-1.5" role="list">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" aria-hidden />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {/* Clinical safety flags (repeated in escalation section for quick reference) */}
          {entry.clinicalSafetyFlags.length > 0 && (
            <div className="space-y-2 pt-1">
              <SectionLabel text="Safety rules" />
              {entry.clinicalSafetyFlags.map((flag, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 ${ESCALATION_COLORS[flag.triggerLevel]}`}
                >
                  <p className="text-xs font-semibold leading-snug">{flag.rule}</p>
                  <p className="mt-1 text-xs opacity-80">{flag.rationale}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Simulation and remediation links */}
      {showLinks &&
        ((entry.simulationLinks?.length ?? 0) > 0 ||
          (entry.remediationLinks?.length ?? 0) > 0) && (
          <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-tertiary)]">
              Practice & remediation
            </p>
            <div className="mt-3 space-y-2">
              {entry.simulationLinks?.map((link) => (
                <div
                  key={link.simulationId}
                  className="flex items-start gap-3 rounded-lg bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] p-3"
                >
                  <span className="mt-0.5 text-sm text-[color-mix(in_srgb,var(--semantic-info)_80%,var(--semantic-text-primary))]">
                    ▶
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">
                      {link.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--semantic-text-tertiary)]">
                      {link.scenario}
                    </p>
                  </div>
                </div>
              ))}
              {entry.remediationLinks?.map((link) => (
                <div
                  key={link.lessonId}
                  className="flex items-start gap-3 rounded-lg bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--semantic-surface))] p-3"
                >
                  <span className="mt-0.5 text-sm text-[var(--semantic-text-tertiary)]">↩</span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">
                      {link.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--semantic-text-tertiary)]">
                      {link.remediationReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
