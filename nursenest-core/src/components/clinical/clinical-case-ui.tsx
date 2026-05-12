"use client";

import type { ReactNode } from "react";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Clinical Case UI — reusable components for NP/CNPLE case-heavy presentations.
// Supports evolving patient scenarios, labs, diagnostics, medication lists,
// timelines, and follow-up updates.
//
// Compatible with all NurseNest themes (Blossom, Ocean, Midnight, Sunset, Aurora).
// Uses CSS semantic variables exclusively — no hardcoded colour values.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export type PatientDemographics = {
  name?: string;
  age: number | string;
  sex: string;
  pronouns?: string;
  setting?: string;
};

export type VitalSign = {
  label: string;
  value: string;
  unit?: string;
  flag?: "high" | "low" | "critical";
};

export type Allergy = {
  substance: string;
  reaction?: string;
  severity?: "mild" | "moderate" | "severe";
};

export type MedicationEntry = {
  name: string;
  dose?: string;
  route?: string;
  frequency?: string;
  indication?: string;
  flag?: "new" | "changed" | "discontinued" | "hold";
};

export type LabResult = {
  test: string;
  value: string;
  referenceRange?: string;
  unit?: string;
  flag?: "H" | "L" | "C";
  timestamp?: string;
};

export type TimelineEvent = {
  time: string;
  label: string;
  detail?: string;
  type?: "presentation" | "intervention" | "deterioration" | "improvement" | "note";
};

export type DiagnosticResult = {
  type: "imaging" | "ecg" | "spirometry" | "biopsy" | "other";
  name: string;
  finding: string;
  impression?: string;
  timestamp?: string;
};

// ── PatientSummaryPanel ───────────────────────────────────────────────────────

/**
 * Persistent patient context panel — shown in the CNPLE sim side panel or
 * as an expandable header on mobile. Presents demographics, vitals, allergies,
 * chief complaint, and PMHx at a glance.
 */
export function PatientSummaryPanel({
  patient,
  chiefComplaint,
  pmhx,
  vitals,
  allergies,
  compact = false,
}: {
  patient: PatientDemographics;
  chiefComplaint?: string;
  pmhx?: string[];
  vitals?: VitalSign[];
  allergies?: Allergy[];
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(!compact);
  const ageLabel = typeof patient.age === "number" ? `${patient.age}-year-old` : patient.age;
  const demographicLine = [ageLabel, patient.sex, patient.pronouns].filter(Boolean).join(" · ");

  return (
    <div
      className="patient-summary-panel rounded-xl border"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "var(--semantic-surface)",
      }}
      data-patient-summary="panel"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <div>
          {patient.name ? (
            <p className="text-[13px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {patient.name}
            </p>
          ) : null}
          <p className="text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
            {demographicLine}
            {patient.setting ? ` · ${patient.setting}` : ""}
          </p>
        </div>
        <ChevronDownIcon rotated={expanded} />
      </button>

      {expanded ? (
        <div className="space-y-4 border-t px-4 pb-4 pt-3" style={{ borderColor: "var(--semantic-border-soft)" }}>
          {chiefComplaint ? (
            <PanelSection label="Chief Complaint">
              <p className="text-[13px]" style={{ color: "var(--semantic-text-primary)" }}>
                {chiefComplaint}
              </p>
            </PanelSection>
          ) : null}

          {vitals && vitals.length > 0 ? (
            <PanelSection label="Vitals">
              <div className="grid grid-cols-2 gap-1.5">
                {vitals.map((v) => (
                  <VitalChip key={v.label} vital={v} />
                ))}
              </div>
            </PanelSection>
          ) : null}

          {allergies && allergies.length > 0 ? (
            <PanelSection label="Allergies">
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((a) => (
                  <AllergyTag key={a.substance} allergy={a} />
                ))}
              </div>
            </PanelSection>
          ) : null}

          {pmhx && pmhx.length > 0 ? (
            <PanelSection label="PMHx">
              <ul className="space-y-0.5">
                {pmhx.map((item) => (
                  <li key={item} className="text-[12px]" style={{ color: "var(--semantic-text-secondary)" }}>
                    · {item}
                  </li>
                ))}
              </ul>
            </PanelSection>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── ClinicalTimeline ──────────────────────────────────────────────────────────

/** Longitudinal event timeline for evolving patient scenarios */
export function ClinicalTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="clinical-timeline space-y-0" data-clinical-timeline="container">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        return (
          <div key={`${event.time}-${i}`} className="flex gap-3">
            {/* Time axis */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: timelineEventColor(event.type, "bg"),
                  color: timelineEventColor(event.type, "fg"),
                }}
              >
                <TimelineIcon type={event.type} />
              </div>
              {!isLast ? (
                <div
                  className="mt-1 w-px flex-1"
                  style={{ background: "var(--semantic-border-soft)", minHeight: "1.5rem" }}
                />
              ) : null}
            </div>

            {/* Content */}
            <div className={`pb-4 pt-0.5 ${isLast ? "" : "min-h-[2.5rem]"}`}>
              <div className="flex items-baseline gap-2">
                <span className="text-[12px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
                  {event.label}
                </span>
                <span className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
                  {event.time}
                </span>
              </div>
              {event.detail ? (
                <p className="mt-0.5 text-[12px]" style={{ color: "var(--semantic-text-secondary)" }}>
                  {event.detail}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MedicationListSurface ─────────────────────────────────────────────────────

export function MedicationListSurface({ medications }: { medications: MedicationEntry[] }) {
  return (
    <div
      className="medication-list overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--semantic-border-soft)" }}
      data-clinical="medication-list"
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))",
        }}
      >
        <PillIcon />
        <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          Medications
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--semantic-border-soft)" }}>
        {medications.map((med, i) => (
          <MedicationRow key={`${med.name}-${i}`} med={med} />
        ))}
      </div>
    </div>
  );
}

function MedicationRow({ med }: { med: MedicationEntry }) {
  const flagColor =
    med.flag === "new"
      ? "var(--semantic-success)"
      : med.flag === "changed"
        ? "var(--semantic-warning-contrast)"
        : med.flag === "discontinued" || med.flag === "hold"
          ? "var(--semantic-danger)"
          : null;

  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
            {med.name}
          </span>
          {med.flag ? (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{
                background: `color-mix(in srgb, ${flagColor} 14%, transparent)`,
                color: flagColor ?? "var(--semantic-text-muted)",
              }}
            >
              {med.flag}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
          {[med.dose, med.route, med.frequency].filter(Boolean).join(" · ")}
        </p>
        {med.indication ? (
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            For: {med.indication}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ── LabTrendTable ─────────────────────────────────────────────────────────────

export function LabTrendTable({ results }: { results: LabResult[] }) {
  return (
    <div
      className="lab-trend-table overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--semantic-border-soft)" }}
      data-clinical="lab-table"
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))",
        }}
      >
        <FlaskIcon />
        <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          Laboratory Results
        </span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ background: "color-mix(in srgb, var(--semantic-border-soft) 40%, transparent)" }}>
            <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
              Test
            </th>
            <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
              Result
            </th>
            <th className="hidden px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide sm:table-cell" style={{ color: "var(--semantic-text-muted)" }}>
              Reference
            </th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--semantic-border-soft)" }}>
          {results.map((r, i) => (
            <tr key={`${r.test}-${i}`}>
              <td className="px-4 py-2.5" style={{ color: "var(--semantic-text-secondary)" }}>
                {r.test}
                {r.timestamp ? (
                  <span className="ml-1.5 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
                    ({r.timestamp})
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-2.5 text-right">
                <span
                  className="font-semibold"
                  style={{
                    color:
                      r.flag === "C"
                        ? "var(--semantic-danger)"
                        : r.flag === "H" || r.flag === "L"
                          ? "var(--semantic-warning-contrast)"
                          : "var(--semantic-text-primary)",
                  }}
                >
                  {r.value}
                  {r.unit ? ` ${r.unit}` : ""}
                </span>
                {r.flag ? (
                  <span
                    className="ml-1.5 text-[11px] font-bold"
                    style={{
                      color: r.flag === "C" ? "var(--semantic-danger)" : "var(--semantic-warning-contrast)",
                    }}
                  >
                    {r.flag}
                  </span>
                ) : null}
              </td>
              <td className="hidden px-4 py-2.5 text-right text-[12px] sm:table-cell" style={{ color: "var(--semantic-text-muted)" }}>
                {r.referenceRange ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── DiagnosticResultCard ──────────────────────────────────────────────────────

export function DiagnosticResultCard({ result }: { result: DiagnosticResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="diagnostic-result-card overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--semantic-border-soft)" }}
      data-clinical="diagnostic-card"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <DiagnosticIcon type={result.type} />
          <div>
            <p className="text-[13px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
              {result.name}
            </p>
            {result.timestamp ? (
              <p className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
                {result.timestamp}
              </p>
            ) : null}
          </div>
        </div>
        <ChevronDownIcon rotated={expanded} />
      </button>

      {expanded ? (
        <div
          className="border-t px-4 py-3"
          style={{ borderColor: "var(--semantic-border-soft)", background: "color-mix(in srgb, var(--semantic-surface) 96%, var(--semantic-info) 4%)" }}
        >
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
              Finding:{" "}
            </span>
            {result.finding}
          </p>
          {result.impression ? (
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
              <span className="font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
                Impression:{" "}
              </span>
              {result.impression}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── FollowUpUpdateCard ────────────────────────────────────────────────────────

/** Evolving scenario update — presents new clinical information mid-case */
export function FollowUpUpdateCard({
  title,
  timestamp,
  children,
  variant = "default",
}: {
  title: string;
  timestamp?: string;
  children: ReactNode;
  variant?: "default" | "deterioration" | "improvement" | "critical";
}) {
  const borderColor =
    variant === "critical"
      ? "var(--semantic-danger)"
      : variant === "deterioration"
        ? "var(--semantic-warning-contrast)"
        : variant === "improvement"
          ? "var(--semantic-success)"
          : "var(--semantic-brand)";

  const bgColor =
    variant === "critical"
      ? "color-mix(in srgb, var(--semantic-danger) 6%, var(--semantic-surface))"
      : variant === "deterioration"
        ? "color-mix(in srgb, var(--semantic-warning) 6%, var(--semantic-surface))"
        : variant === "improvement"
          ? "color-mix(in srgb, var(--semantic-success) 6%, var(--semantic-surface))"
          : "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))";

  return (
    <div
      className="follow-up-update-card rounded-xl border-l-4 p-4"
      style={{ borderColor, background: bgColor }}
      data-clinical="followup-card"
      data-variant={variant}
    >
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          {title}
        </p>
        {timestamp ? (
          <span className="ml-3 shrink-0 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            {timestamp}
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

// ── ClinicalCaseHeader ────────────────────────────────────────────────────────

/** Optional case cluster header — groups related questions under a shared scenario */
export function ClinicalCaseHeader({
  caseNumber,
  caseTitle,
  questionCount,
}: {
  caseNumber?: number;
  caseTitle: string;
  questionCount?: number;
}) {
  return (
    <div
      className="mb-4 rounded-xl border px-5 py-3"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))",
      }}
    >
      <div className="flex items-baseline gap-3">
        {caseNumber != null ? (
          <span
            className="shrink-0 text-[11px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Case {caseNumber}
          </span>
        ) : null}
        <h3 className="text-[14px] font-bold" style={{ color: "var(--semantic-text-primary)" }}>
          {caseTitle}
        </h3>
        {questionCount != null ? (
          <span className="ml-auto shrink-0 text-[12px]" style={{ color: "var(--semantic-text-muted)" }}>
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function PanelSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function VitalChip({ vital }: { vital: VitalSign }) {
  const flagColor =
    vital.flag === "critical"
      ? "var(--semantic-danger)"
      : vital.flag
        ? "var(--semantic-warning-contrast)"
        : null;

  return (
    <div
      className="rounded-lg border px-2.5 py-1.5"
      style={{
        borderColor: flagColor
          ? `color-mix(in srgb, ${flagColor} 30%, transparent)`
          : "var(--semantic-border-soft)",
        background: flagColor
          ? `color-mix(in srgb, ${flagColor} 8%, var(--semantic-surface))`
          : "var(--semantic-surface)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--semantic-text-muted)" }}>
        {vital.label}
      </p>
      <p
        className="text-[13px] font-bold tabular-nums"
        style={{ color: flagColor ?? "var(--semantic-text-primary)" }}
      >
        {vital.value}
        {vital.unit ? (
          <span className="ml-0.5 text-[10px] font-medium">{vital.unit}</span>
        ) : null}
      </p>
    </div>
  );
}

function AllergyTag({ allergy }: { allergy: Allergy }) {
  const sevColor =
    allergy.severity === "severe"
      ? "var(--semantic-danger)"
      : allergy.severity === "moderate"
        ? "var(--semantic-warning-contrast)"
        : "var(--semantic-text-muted)";

  return (
    <span
      className="rounded-full border px-2.5 py-0.5 text-[12px] font-semibold"
      style={{
        borderColor: `color-mix(in srgb, ${sevColor} 30%, transparent)`,
        color: sevColor,
        background: `color-mix(in srgb, ${sevColor} 8%, transparent)`,
      }}
      title={allergy.reaction ? `Reaction: ${allergy.reaction}` : undefined}
    >
      {allergy.substance}
      {allergy.severity === "severe" ? " ⚠" : ""}
    </span>
  );
}

function timelineEventColor(type: TimelineEvent["type"], slot: "bg" | "fg"): string {
  switch (type) {
    case "deterioration":
      return slot === "bg"
        ? "color-mix(in srgb, var(--semantic-danger) 16%, transparent)"
        : "var(--semantic-danger)";
    case "improvement":
      return slot === "bg"
        ? "color-mix(in srgb, var(--semantic-success) 16%, transparent)"
        : "var(--semantic-success)";
    case "intervention":
      return slot === "bg"
        ? "color-mix(in srgb, var(--semantic-brand) 16%, transparent)"
        : "var(--semantic-brand)";
    default:
      return slot === "bg"
        ? "color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)"
        : "var(--semantic-text-muted)";
  }
}

// ── SVG icons ─────────────────────────────────────────────────────────────────

function ChevronDownIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform"
      style={{
        color: "var(--semantic-text-muted)",
        transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--semantic-brand)" }}>
      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M15.6 15.6 20.4 20.4" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--semantic-info)" }}>
      <path d="M9 3h6" />
      <path d="M9 3v8.5L5 20a1 1 0 0 0 .93 1.37h12.14A1 1 0 0 0 19 20l-4-8.5V3" />
      <line x1="6" y1="14" x2="18" y2="14" />
    </svg>
  );
}

function TimelineIcon({ type }: { type: TimelineEvent["type"] }) {
  if (type === "deterioration") {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    );
  }
  if (type === "improvement") {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M17 7L7 17M7 17h10M7 17V7" />
      </svg>
    );
  }
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function DiagnosticIcon({ type }: { type: DiagnosticResult["type"] }) {
  const color =
    type === "ecg"
      ? "var(--semantic-danger)"
      : type === "imaging"
        ? "var(--semantic-info)"
        : "var(--semantic-brand)";
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {type === "ecg" ? (
          <polyline points="2 12 5 12 8 4 11 20 14 9 17 15 20 12 22 12" />
        ) : type === "imaging" ? (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="12" r="4" />
          </>
        ) : (
          <>
            <path d="M9 3h6" />
            <path d="M9 3v8.5L5 20a1 1 0 0 0 .93 1.37h12.14A1 1 0 0 0 19 20l-4-8.5V3" />
          </>
        )}
      </svg>
    </div>
  );
}
