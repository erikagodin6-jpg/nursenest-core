"use client";

/**
 * Scalar waveform preview — intentionally SVG/CSS-variable based for Midnight readability.
 * Pressure vs time + flow vs time (same timeline). Not a physiological simulator.
 */
export function MechanicalVentWaveformPanel({
  label = "Illustrative scalar waveforms",
}: {
  label?: string;
}) {
  const w = 420;
  const h = 220;
  const mid = h / 2;
  /** Pressure envelope (arbitrary units): inhale peak ~mid-trace */
  const pressurePoints = [
    [0, mid + 40],
    [40, mid + 38],
    [70, mid - 55],
    [120, mid - 52],
    [160, mid + 35],
    [200, mid + 34],
    [240, mid - 48],
    [290, mid - 46],
    [340, mid + 36],
    [420, mid + 40],
  ];
  const flowPoints = [
    [0, mid],
    [55, mid],
    [70, mid - 62],
    [120, mid - 60],
    [140, mid],
    [200, mid],
    [240, mid - 58],
    [300, mid - 56],
    [320, mid],
    [420, mid],
  ];
  const toPoints = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");
  return (
    <div
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]"
      data-nn-rt-vent-waveform-panel=""
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
        <ul className="flex flex-wrap gap-3 text-[10px] font-semibold text-[var(--semantic-text-secondary)]">
          <li className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-6 rounded-full bg-[var(--semantic-info)]" aria-hidden />
            Pressure
          </li>
          <li className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-6 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
            Flow
          </li>
        </ul>
      </div>
      <svg
        className="mt-3 w-full max-w-full"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Illustrative ventilator pressure and flow scalars over time"
      >
        <title>Ventilator scalar waveforms preview</title>
        <line x1="0" y1={mid} x2={w} y2={mid} stroke="var(--semantic-border-soft)" strokeWidth="1" />
        <polyline
          fill="none"
          stroke="var(--semantic-info)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={toPoints(pressurePoints)}
        />
        <polyline
          fill="none"
          stroke="var(--semantic-chart-3)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={toPoints(flowPoints)}
        />
      </svg>
      <p className="mt-2 text-[11px] leading-snug text-[var(--semantic-text-muted)]">
        Loops (pressure–volume, flow–volume) ship as layered SVG snapshots alongside scalars — reuse this rail for teach mode
        overlays without Canvas locks.
      </p>
    </div>
  );
}
