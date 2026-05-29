"use client";

import { useState } from "react";
import {
  INTERVENTION_CATALOG,
  getInterventionsForCondition,
  type Intervention,
} from "@/lib/physiology-monitor/intervention-catalog";
import type { PhysiologyState } from "@/lib/physiology-monitor/physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InterventionPanelProps {
  state: PhysiologyState;
  onIntervene: (key: string) => { ok: boolean; message: string };
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<Intervention["category"], string> = {
  hemodynamic:    "Hemodynamic",
  respiratory:    "Respiratory",
  antiarrhythmic: "Antiarrhythmic",
  metabolic:      "Metabolic",
  neurologic:     "Neurologic",
  analgesic:      "Analgesic",
  resuscitation:  "Resuscitation",
};

const CATEGORY_COLOR: Record<Intervention["category"], string> = {
  hemodynamic:    "#40c4ff",
  respiratory:    "#00e5ff",
  antiarrhythmic: "#ea80fc",
  metabolic:      "#ffd740",
  neurologic:     "#ff9100",
  analgesic:      "#8fafc8",
  resuscitation:  "#ff1744",
};

// ─── Feedback toast ───────────────────────────────────────────────────────────

interface ToastEntry {
  id: number;
  message: string;
  ok: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InterventionPanel({ state, onIntervene }: InterventionPanelProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<Intervention["category"] | "all">("all");

  const indicatedInterventions = getInterventionsForCondition(state.activeConditionKey);
  const indicatedKeys = new Set(indicatedInterventions.map((i) => i.key));

  const allInterventions = INTERVENTION_CATALOG.filter((i) =>
    filterCategory === "all" ? true : i.category === filterCategory,
  );

  function fire(intervention: Intervention) {
    const result = onIntervene(intervention.key);

    const id = Date.now();
    setToasts((prev) => [...prev.slice(-3), { id, message: result.message, ok: result.ok }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);

    if (result.ok) {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(intervention.key);
        setTimeout(() => {
          setActiveKeys((s) => {
            const ns = new Set(s);
            ns.delete(intervention.key);
            return ns;
          });
        }, (intervention.effect.durationTicks * 2000) + 500);
        return next;
      });
    }
  }

  // All unique categories present in catalog
  const categories = Array.from(
    new Set(INTERVENTION_CATALOG.map((i) => i.category)),
  ) as Intervention["category"][];

  return (
    <div
      style={{ fontFamily: "var(--mon-font, monospace)", position: "relative" }}
      aria-label="Intervention panel"
    >
      {/* Header */}
      <div
        style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#4a6a88",
          marginBottom: 8,
        }}
      >
        Interventions
      </div>

      {/* Indicated callout */}
      {indicatedInterventions.length > 0 && (
        <div
          style={{
            background: "rgba(0,229,255,0.06)",
            border: "1px solid rgba(0,229,255,0.2)",
            borderRadius: 5,
            padding: "5px 8px",
            marginBottom: 8,
            fontSize: "8px",
            color: "#00e5ff",
          }}
        >
          <span style={{ fontWeight: 700 }}>Indicated: </span>
          {indicatedInterventions.map((i) => i.shortLabel).join(" · ")}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        <button
          type="button"
          data-nn-monitor-mode-pill=""
          aria-pressed={filterCategory === "all"}
          onClick={() => setFilterCategory("all")}
          style={{ fontSize: "8px", padding: "2px 6px" }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            data-nn-monitor-mode-pill=""
            aria-pressed={filterCategory === cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              fontSize: "8px",
              padding: "2px 6px",
              ...(filterCategory === cat
                ? { borderColor: CATEGORY_COLOR[cat], color: CATEGORY_COLOR[cat] }
                : {}),
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Intervention buttons */}
      <div className="flex flex-wrap gap-1.5">
        {allInterventions.map((intervention) => {
          const isActive = activeKeys.has(intervention.key);
          const isIndicated = indicatedKeys.has(intervention.key);

          return (
            <button
              key={intervention.key}
              type="button"
              data-nn-monitor-intervention-btn=""
              data-active={isActive ? "true" : "false"}
              onClick={() => fire(intervention)}
              title={intervention.description}
              style={{
                borderColor: isIndicated ? CATEGORY_COLOR[intervention.category] + "88" : undefined,
                boxShadow: isIndicated ? `0 0 6px ${CATEGORY_COLOR[intervention.category]}33` : undefined,
              }}
            >
              {isActive && (
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#00e5ff",
                    marginRight: 4,
                    verticalAlign: "middle",
                    animation: "mon-alarm-pulse-warning 1.5s ease-in-out infinite",
                  }}
                  aria-hidden
                />
              )}
              {intervention.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: -8,
            right: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 10,
          }}
          aria-live="polite"
          aria-atomic="false"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                background: t.ok ? "rgba(0,230,118,0.12)" : "rgba(255,23,68,0.12)",
                border: `1px solid ${t.ok ? "rgba(0,230,118,0.4)" : "rgba(255,23,68,0.4)"}`,
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: "9px",
                color: t.ok ? "#00e676" : "#ff6090",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
