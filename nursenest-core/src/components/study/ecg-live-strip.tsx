"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, SkipBack, SkipForward, ZoomIn } from "lucide-react";
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
  /** Playback speed selector (live mode) */
  playbackSpeeds?: boolean;
  /** Frame-by-frame scrub when paused (live mode) */
  frameStep?: boolean;
  /** Use semantic tokens for grid/waveform (theme-aware monitor) */
  themeAwareGrid?: boolean;
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
      <line x1={x1} y1={4} x2={x1} y2={vbH - 4} stroke="var(--semantic-info)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <line x1={x2} y1={4} x2={x2} y2={vbH - 4} stroke="var(--semantic-info)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <line x1={x1} y1={vbH / 2} x2={x2} y2={vbH / 2} stroke="var(--semantic-info)" strokeWidth="1" opacity="0.5" />
      <rect x={mid - 26} y={vbH / 2 - 9} width="52" height="16" rx="4" fill="var(--semantic-surface)" opacity="0.92" />
      <text x={mid} y={vbH / 2 + 4} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--semantic-info)">
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
  playbackSpeeds = false,
  frameStep = false,
  themeAwareGrid = false,
}: EcgLiveStripProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(mode === "static");
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState<1 | 1.5 | 2>(1);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5 | 2>(1);
  const [scrollOffset, setScrollOffset] = useState(0);
  const waveform = useMemo(() => generateEcgWaveform(config), [config]);
  const instanceId = useId().replace(/:/g, "");
  const minorPatternId = `ecg-minor-${instanceId}-${config.rhythmKey}`;
  const majorPatternId = `ecg-major-${instanceId}-${config.rhythmKey}`;

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
  const animationDurationSec = 2.8 / speed;
  const gridMinor = themeAwareGrid ? "var(--semantic-danger)" : "#f7b4b4";
  const gridMajor = themeAwareGrid ? "color-mix(in srgb, var(--semantic-danger) 85%, var(--semantic-border-soft))" : "#ee7777";
  const waveStroke = themeAwareGrid ? "var(--semantic-text-primary)" : "#111827";
  const stripBg = themeAwareGrid ? "color-mix(in srgb, var(--semantic-panel-cool) 35%, var(--semantic-surface))" : "white";

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
          {playbackSpeeds && mode === "live" ? (
            <div className="flex rounded-md border border-[var(--semantic-border-soft)] p-0.5">
              {([0.5, 1, 1.5, 2] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold tabular-nums ${speed === s ? "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]" : "text-[var(--semantic-text-muted)]"}`}
                  aria-pressed={speed === s}
                >
                  {s}×
                </button>
              ))}
            </div>
          ) : null}
          {frameStep && mode === "live" && paused ? (
            <>
              <button
                type="button"
                onClick={() => setScrollOffset((o) => Math.max(0, o - 36))}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]"
                aria-label="Previous frame"
              >
                <SkipBack className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setScrollOffset((o) => o + 36)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] text-[var(--semantic-text-muted)]"
                aria-label="Next frame"
              >
                <SkipForward className="h-3 w-3" />
              </button>
            </>
          ) : null}
          {mode === "live" ? (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--semantic-border-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)] transition"
              aria-pressed={paused}
            >
              {paused ? <Play className="h-3 w-3" aria-hidden /> : <Pause className="h-3 w-3" aria-hidden />}
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
            className="aspect-[18/5] w-full"
            style={{ background: stripBg }}
            viewBox={waveform.viewBox}
            role="img"
            aria-label={`${title}: ${config.rhythmKey.replace(/_/g, " ")}`}
          >
            <defs>
              <pattern id={minorPatternId} width={waveform.grid.minor} height={waveform.grid.minor} patternUnits="userSpaceOnUse">
                <path d={`M ${waveform.grid.minor} 0 L 0 0 0 ${waveform.grid.minor}`} fill="none" stroke={gridMinor} strokeWidth="0.6" opacity={themeAwareGrid ? 0.45 : 1} />
              </pattern>
              <pattern id={majorPatternId} width={waveform.grid.major} height={waveform.grid.major} patternUnits="userSpaceOnUse">
                <rect width={waveform.grid.major} height={waveform.grid.major} fill={`url(#${minorPatternId})`} />
                <path d={`M ${waveform.grid.major} 0 L 0 0 0 ${waveform.grid.major}`} fill="none" stroke={gridMajor} strokeWidth="1" opacity={themeAwareGrid ? 0.65 : 1} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${majorPatternId})`} />

            {/* waveform */}
            <g
              className={animate ? "ecg-live-strip__scroll" : ""}
              style={{
                transform: paused && frameStep ? `translateX(${-scrollOffset}px)` : undefined,
                animationDuration: animate ? `${animationDurationSec}s` : undefined,
              }}
            >
              <path d={waveform.path} fill="none" stroke={waveStroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
              {animate ? (
                <path
                  d={waveform.path}
                  transform="translate(720 0)"
                  fill="none"
                  stroke={waveStroke}
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

            <style>{`
              @keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-720px); } }
              .ecg-live-strip__scroll { animation: ecg-scroll linear infinite; }
            `}</style>
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
