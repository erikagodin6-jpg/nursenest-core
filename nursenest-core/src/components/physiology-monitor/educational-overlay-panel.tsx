"use client";

import { useState } from "react";
import { buildMonitorOverlay } from "@/lib/physiology-monitor/educational-overlay";
import type { PhysiologyState } from "@/lib/physiology-monitor/physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EducationalOverlayPanelProps {
  state: PhysiologyState;
  priorState?: Readonly<PhysiologyState>;
  /** Start expanded. */
  defaultOpen?: boolean;
}

// ─── Urgency indicator ────────────────────────────────────────────────────────

function UrgencyDot({ urgency }: { urgency: string | null }) {
  if (!urgency) return null;
  const color = urgency === "critical" ? "#ff1744" : "#ff9100";
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        marginTop: 3,
      }}
      aria-hidden
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EducationalOverlayPanel({
  state,
  priorState,
  defaultOpen = false,
}: EducationalOverlayPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const overlay = buildMonitorOverlay(state, priorState);

  return (
    <div style={{ fontFamily: "var(--mon-font, monospace)" }}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: open ? "#00e5ff" : "#4a6a88",
          background: "none",
          border: `1px solid ${open ? "#00e5ff44" : "#1e3450"}`,
          borderRadius: 4,
          padding: "4px 10px",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "color 0.15s, border-color 0.15s",
        }}
        aria-expanded={open}
        aria-controls="mon-overlay-content"
      >
        <span aria-hidden style={{ fontSize: 10 }}>{open ? "▾" : "▸"}</span>
        Explain Changes
      </button>

      {/* Content */}
      {open && (
        <div
          id="mon-overlay-content"
          data-nn-monitor-overlay=""
          style={{ marginTop: 8 }}
          role="region"
          aria-label="Clinical explanation overlay"
        >
          {/* Condition summary */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#4a6a88",
                marginBottom: 3,
              }}
            >
              Condition
            </div>
            <p style={{ fontSize: "10px", color: "#8fafc8", margin: 0, lineHeight: 1.5 }}>
              {overlay.conditionSummary}
            </p>
          </div>

          {/* Stage description */}
          <div
            style={{
              borderLeft: "3px solid #2a4a6e",
              paddingLeft: 8,
              marginBottom: 10,
            }}
          >
            <p style={{ fontSize: "10px", color: "#e8edf2", margin: 0, lineHeight: 1.55 }}>
              {overlay.stageDescription}
            </p>
          </div>

          {/* Vital entries */}
          <div
            style={{
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a6a88",
              marginBottom: 6,
            }}
          >
            Monitor Readings
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {overlay.entries.map((entry) => (
              <div
                key={entry.vital}
                data-nn-monitor-overlay-entry=""
                data-urgency={entry.urgency ?? "none"}
                style={{ display: "flex", gap: 6, alignItems: "flex-start" }}
              >
                <UrgencyDot urgency={entry.urgency} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: entry.urgency === "critical" ? "#ff6090"
                            : entry.urgency === "warning" ? "#ff9100"
                            : "#8fafc8",
                      marginBottom: 1,
                    }}
                  >
                    {entry.vital}{" "}
                    <span style={{ fontWeight: 400, color: "#e8edf2" }}>{entry.value}</span>
                  </div>
                  <p style={{ fontSize: "9px", color: "#8fafc8", margin: 0, lineHeight: 1.5 }}>
                    {entry.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ECG explanation */}
          <div style={{ marginTop: 10, borderTop: "1px solid #1e3450", paddingTop: 8 }}>
            <div
              style={{
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#00e676",
                opacity: 0.7,
                marginBottom: 4,
              }}
            >
              ECG
            </div>
            <p style={{ fontSize: "9px", color: "#8fafc8", margin: 0, lineHeight: 1.5 }}>
              {overlay.ecgExplanation}
            </p>
          </div>

          {/* Clinical action */}
          <div style={{ marginTop: 10, borderTop: "1px solid #1e3450", paddingTop: 8 }}>
            <div
              style={{
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#4a6a88",
                marginBottom: 4,
              }}
            >
              Clinical Action
            </div>
            <p style={{ fontSize: "9px", color: "#e8edf2", margin: 0, lineHeight: 1.55 }}>
              {overlay.clinicalAction}
            </p>
          </div>

          {/* Intervention hint */}
          {overlay.interventionHint && (
            <div
              style={{
                marginTop: 10,
                background: "rgba(255,23,68,0.08)",
                border: "1px solid rgba(255,23,68,0.3)",
                borderRadius: 5,
                padding: "6px 10px",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#ff6090",
                  marginBottom: 3,
                }}
              >
                Immediate Action Required
              </div>
              <p style={{ fontSize: "9px", color: "#e8edf2", margin: 0, lineHeight: 1.55, fontWeight: 600 }}>
                {overlay.interventionHint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
