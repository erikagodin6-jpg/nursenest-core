"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, ZoomIn } from "lucide-react";
import { generateEcgWaveform, type EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";

export type EcgLiveStripProps = {
  config: EcgStripMediaConfig;
  mode?: "static" | "live";
  className?: string;
  title?: string;
  /** Show measurement callouts: rate, QRS width, QT behavior */
  showMeasurements?: boolean;
  /** Caliper overlay: marks fixed-distance interval markers on the strip */
  showCaliper?: boolean;
  /** Show lead label (e.g. "Lead II") in corner of strip */
  leadLabel?: string;
  /** Zoom controls — allows 1x / 1.5x / 2x scale */
  zoomable?: boolean;
};

function formatQrsWidth(w: number): string {
  return `${Math.round(w * 1000)} ms`;
}

function formatRate(r: number): string {
  return r === 0 ? "—" : `${r} bpm`;
}

/** Caliper lines — two vertical tick marks with distance label */
function CaliperOverlay({ viewBox, width }: { viewBox: string; width: number }) {
  const vbParts = viewBox.split(" ");
  const vbH = Number(vbParts[3] ?? 220);
  const x1 = width * 0.22;
  const x2 = width * 0.58;
  const mid = (x1 + x2) / 2;
  return (
    <g aria-label="Caliper measurement overlay">
      <line x1={x1} y1={4} x2={x1} y2={vbH - 4} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <line x1={x2} y1={4} x2={x2} y2={vbH - 4} stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <line x1={x1} y1={vbH / 2} x2={x2} y2={vbH / 2} stroke="#2563eb" strokeWidth="1" opacity="0.5" />
      <rect x={mid - 26} y={vbH / 2 - 9} width="52" height="16" rx="4" fill="white" opacity="0.9" />
      <text x={mid} y={vbH / 2 + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">
        ← interval →
      </text>
    </g>
  );
}

export function EcgLiveStrip({
  config,
  mode = "static",
  className = "",
  title = "ECG strip",
  showMeasurements = false,
  showCaliper = false,
  leadLabel,
  zoomable = false,
}: EcgLiveStripProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(mode === "static");
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState<1 | 1.5 | 2>(1);
  const waveform = useMemo(() => generateEcgWaveform(config), [config]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      rootMargin: "160px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  const animate = mode === "live" && visible && !paused;

  function cycleZoom() {
    setZoom((z) => (z === 1 ? 1.5 : z === 1.5 ? 2 : 1));
  }

  const vbParts = waveform.viewBox.split(" ");
  const svgWidth = Number(vbParts[2] ?? 720);

  return (
    <div ref={rootRef} className={className} data-testid="ecg-live-strip" data-lazy-visible={visible ? "true" : "false"}>
      {/* header bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="m-0 text-xs font-semibold text-[var(--semantic-text-muted)]">{title}</p>
          {leadLabel ? (
            <span className="rounded border border-[var(--semantic-border-soft)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              {leadLabel}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {zoomable ? (
            <button
              type="button"
              onClick={cycleZoom}
              className="flex items-center gap-1 rounded-md border border-[var(--semantic-border-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)] transition"
              aria-label={`Zoom: ${zoom}×`}
              title="Cycle zoom level"
            >
              <ZoomIn className="h-3 w-3" aria-hidden />
              {zoom}×
            </button>
          ) : null}
          {mode === "live" ? (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="rounded-md border border-[var(--semantic-border-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)] transition"
              aria-pressed={paused}
            >
              {paused ? "Resume" : "Pause"}
            </button>
          ) : null}
        </div>
      </div>

      {/* strip */}
      {visible ? (
        <div
          className="mt-2 overflow-hidden rounded-md border border-[var(--semantic-border-soft)]"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: zoom !== 1 ? `${100 / zoom}%` : "100%" }}
        >
          <svg
            className="aspect-[18/5] w-full bg-white"
            viewBox={waveform.viewBox}
            role="img"
            aria-label={`${title}: ${config.rhythmKey.replace(/_/g, " ")}`}
          >
            <defs>
              <pattern id={`ecg-minor-${config.rhythmKey}`} width={waveform.grid.minor} height={waveform.grid.minor} patternUnits="userSpaceOnUse">
                <path d={`M ${waveform.grid.minor} 0 L 0 0 0 ${waveform.grid.minor}`} fill="none" stroke="#f7b4b4" strokeWidth="0.6" />
              </pattern>
              <pattern id={`ecg-major-${config.rhythmKey}`} width={waveform.grid.major} height={waveform.grid.major} patternUnits="userSpaceOnUse">
                <rect width={waveform.grid.major} height={waveform.grid.major} fill={`url(#ecg-minor-${config.rhythmKey})`} />
                <path d={`M ${waveform.grid.major} 0 L 0 0 0 ${waveform.grid.major}`} fill="none" stroke="#ee7777" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#ecg-major-${config.rhythmKey})`} />

            {/* waveform */}
            <g className={animate ? "animate-[ecg-scroll_2.8s_linear_infinite]" : ""}>
              <path d={waveform.path} fill="none" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
              {animate ? (
                <path
                  d={waveform.path}
                  transform="translate(720 0)"
                  fill="none"
                  stroke="#111827"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                />
              ) : null}
            </g>

            {/* caliper overlay */}
            {showCaliper ? <CaliperOverlay viewBox={waveform.viewBox} width={svgWidth} /> : null}

            {/* lead label in strip corner */}
            {leadLabel ? (
              <text x="8" y="16" fontSize="10" fontWeight="700" fill="#374151" opacity="0.7">
                {leadLabel}
              </text>
            ) : null}

            <style>{`@keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-720px); } }`}</style>
          </svg>
        </div>
      ) : (
        <div className="mt-2 aspect-[18/5] w-full animate-pulse rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]" />
      )}

      {/* measurement callouts */}
      {showMeasurements && visible ? (
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {[
            { term: "Rate", value: formatRate(config.rate) },
            { term: "QRS", value: formatQrsWidth(config.qrsWidth) },
            { term: "Rhythm", value: config.regularity.replace(/_/g, " ") },
            ...(config.qtBehavior && config.qtBehavior !== "normal"
              ? [{ term: "QT", value: config.qtBehavior }]
              : []),
          ].map(({ term, value }) => (
            <div key={term} className="flex items-baseline gap-1">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{term}</dt>
              <dd className="text-[11px] font-semibold tabular-nums text-[var(--semantic-text-primary)]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/* ── compact zoom controls (standalone, for use inside question layouts) ── */

export function EcgStripZoomControls({
  zoom,
  onZoom,
}: {
  zoom: number;
  onZoom: (delta: 1 | -1) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1">
      <button
        type="button"
        onClick={() => onZoom(-1)}
        disabled={zoom <= 1}
        className="flex h-5 w-5 items-center justify-center rounded text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-primary)] disabled:opacity-40"
        aria-label="Zoom out"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-[2rem] text-center text-[10px] font-bold tabular-nums text-[var(--semantic-text-secondary)]">
        {zoom}×
      </span>
      <button
        type="button"
        onClick={() => onZoom(1)}
        disabled={zoom >= 2}
        className="flex h-5 w-5 items-center justify-center rounded text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-primary)] disabled:opacity-40"
        aria-label="Zoom in"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
