"use client";

import type { VitalDisplayConfig } from "@/lib/physiology-monitor/profession-views";
import type { PhysiologyState, MonitorAlarm } from "@/lib/physiology-monitor/physiology-state";
import type { PhysiologySnapshot } from "@/lib/physiology-monitor/physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VitalTileProps {
  config: VitalDisplayConfig;
  state: PhysiologyState;
  history: PhysiologySnapshot[];
  alarm: MonitorAlarm | null;
  showSparkline?: boolean;
}

// ─── Value formatting ─────────────────────────────────────────────────────────

function formatValue(key: string, state: PhysiologyState): string {
  const raw = state[key as keyof PhysiologyState];
  if (typeof raw !== "number") return "—";

  switch (key) {
    case "systolicBP":
      return `${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)}`;
    case "map":
      return `(${Math.round(raw)})`;
    case "temperature":
      return raw.toFixed(1);
    case "lactate":
    case "cardiacOutput":
      return raw.toFixed(1);
    case "potassium":
      return raw.toFixed(1);
    case "spo2":
    case "heartRate":
    case "respiratoryRate":
    case "etco2":
    case "cvp":
    case "icp":
    case "urineOutputPerHour":
    case "painScore":
    case "gcs":
      return Math.round(raw).toString();
    default:
      return Math.round(raw).toString();
  }
}

// ─── Trend arrow from last two snapshots ─────────────────────────────────────

function deriveTrend(
  key: string,
  history: PhysiologySnapshot[],
  higherBetter: boolean,
): "↑" | "↓" | "→" | null {
  if (history.length < 2) return null;
  const prev = history[history.length - 2]!.state[key as keyof PhysiologyState];
  const curr = history[history.length - 1]!.state[key as keyof PhysiologyState];
  if (typeof prev !== "number" || typeof curr !== "number") return null;
  const delta = curr - prev;
  const threshold = Math.abs(prev) * 0.025;
  if (Math.abs(delta) < threshold) return "→";
  const improving = higherBetter ? delta > 0 : delta < 0;
  return improving ? "↑" : "↓";
}

const HIGHER_BETTER_KEYS = new Set(["spo2", "urineOutputPerHour", "cardiacOutput", "gcs"]);

// ─── Mini sparkline ───────────────────────────────────────────────────────────

function Sparkline({
  vitalKey,
  history,
  color,
}: {
  vitalKey: string;
  history: PhysiologySnapshot[];
  color: string;
}) {
  const W = 60;
  const H = 18;
  const pts = history
    .slice(-20)
    .map((s) => s.state[vitalKey as keyof PhysiologyState])
    .filter((v): v is number => typeof v === "number");

  if (pts.length < 2) return null;

  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const step = W / (pts.length - 1);

  const d = pts
    .map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden
      data-nn-monitor-sparkline=""
      className="absolute bottom-1.5 right-2 opacity-50"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
  green:  "#00e676",
  white:  "#e8edf2",
  cyan:   "#00e5ff",
  yellow: "#ffd740",
  orange: "#ff9100",
  purple: "#ea80fc",
  red:    "#ff1744",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function VitalTile({ config, state, history, alarm, showSparkline = true }: VitalTileProps) {
  const value = formatValue(config.key, state);
  const trend = config.showTrend
    ? deriveTrend(config.key, history, HIGHER_BETTER_KEYS.has(config.key))
    : null;

  const trendColor =
    trend === "↑" ? (HIGHER_BETTER_KEYS.has(config.key) ? "#00e676" : "#ff6090")
    : trend === "↓" ? (HIGHER_BETTER_KEYS.has(config.key) ? "#ff6090" : "#00e676")
    : "#4a6a88";

  return (
    <div
      data-nn-monitor-vital=""
      data-mon-color={config.colorFamily}
      data-alarm={alarm?.level ?? "none"}
      className="relative"
      role="status"
      aria-label={`${config.label}: ${value} ${config.unit}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div data-nn-monitor-vital-label="">{config.label}</div>

      <div className="flex items-baseline gap-0.5 mt-0.5">
        <span data-nn-monitor-vital-value="">{value}</span>
        {config.unit && config.key !== "systolicBP" && config.key !== "map" && (
          <span data-nn-monitor-vital-unit="">{config.unit}</span>
        )}
      </div>

      {trend && (
        <span
          data-nn-monitor-vital-trend=""
          aria-hidden
          style={{ color: trendColor }}
        >
          {trend}
        </span>
      )}

      {showSparkline && (
        <Sparkline
          vitalKey={config.key === "systolicBP" ? "systolicBP" : config.key}
          history={history}
          color={COLOR_HEX[config.colorFamily] ?? "#e8edf2"}
        />
      )}
    </div>
  );
}

// ─── BP tile is a 2-row compound tile ────────────────────────────────────────

export function BpTile({
  state,
  history,
  alarm,
}: {
  state: PhysiologyState;
  history: PhysiologySnapshot[];
  alarm: MonitorAlarm | null;
}) {
  const bpTrend = deriveTrend("systolicBP", history, false);
  const mapTrend = deriveTrend("map", history, false);

  const trendColor = (t: string | null) =>
    t === "↓" ? "#00e676" : t === "↑" ? "#ff6090" : "#4a6a88";

  return (
    <div
      data-nn-monitor-vital=""
      data-mon-color="white"
      data-alarm={alarm?.level ?? "none"}
      className="relative"
      role="status"
      aria-label={`Blood pressure: ${Math.round(state.systolicBP)}/${Math.round(state.diastolicBP)} mmHg, MAP ${Math.round(state.map)}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div data-nn-monitor-vital-label="">NIBP</div>

      <div className="flex items-baseline gap-0.5 mt-0.5">
        <span data-nn-monitor-vital-value="" style={{ fontSize: "30px" }}>
          {Math.round(state.systolicBP)}/{Math.round(state.diastolicBP)}
        </span>
        <span data-nn-monitor-vital-unit="">mmHg</span>
        {bpTrend && (
          <span style={{ fontSize: "11px", color: trendColor(bpTrend), marginLeft: 2 }} aria-hidden>
            {bpTrend}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mt-0.5">
        <span style={{ fontSize: "13px", color: "#8fafc8" }}>MAP</span>
        <span style={{ fontSize: "16px", color: "#e8edf2", fontVariantNumeric: "tabular-nums" }}>
          {Math.round(state.map)}
        </span>
        {mapTrend && (
          <span style={{ fontSize: "10px", color: trendColor(mapTrend) }} aria-hidden>
            {mapTrend}
          </span>
        )}
      </div>

      <Sparkline vitalKey="systolicBP" history={history} color="#e8edf2" />
    </div>
  );
}
