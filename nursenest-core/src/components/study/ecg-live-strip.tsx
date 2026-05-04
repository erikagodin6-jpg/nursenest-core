"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateEcgWaveform, type EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";

export function EcgLiveStrip({
  config,
  mode = "static",
  className = "",
  title = "ECG strip",
}: {
  config: EcgStripMediaConfig;
  mode?: "static" | "live";
  className?: string;
  title?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(mode === "static");
  const [paused, setPaused] = useState(false);
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

  return (
    <div ref={rootRef} className={className} data-testid="ecg-live-strip" data-lazy-visible={visible ? "true" : "false"}>
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-xs font-semibold text-[var(--semantic-text-muted)]">{title}</p>
        {mode === "live" ? (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="rounded-md border border-[var(--semantic-border-soft)] px-2 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
            aria-pressed={paused}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        ) : null}
      </div>
      {visible ? (
        <svg
          className="mt-2 aspect-[18/5] w-full overflow-hidden rounded-md border border-[var(--semantic-border-soft)] bg-white"
          viewBox={waveform.viewBox}
          role="img"
          aria-label={`${title}: ${config.rhythmKey.replace(/_/g, " ")}`}
        >
          <defs>
            <pattern id="ecg-grid-minor" width={waveform.grid.minor} height={waveform.grid.minor} patternUnits="userSpaceOnUse">
              <path d={`M ${waveform.grid.minor} 0 L 0 0 0 ${waveform.grid.minor}`} fill="none" stroke="#f7b4b4" strokeWidth="0.6" />
            </pattern>
            <pattern id="ecg-grid-major" width={waveform.grid.major} height={waveform.grid.major} patternUnits="userSpaceOnUse">
              <rect width={waveform.grid.major} height={waveform.grid.major} fill="url(#ecg-grid-minor)" />
              <path d={`M ${waveform.grid.major} 0 L 0 0 0 ${waveform.grid.major}`} fill="none" stroke="#ee7777" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecg-grid-major)" />
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
          <style>{`@keyframes ecg-scroll { from { transform: translateX(0); } to { transform: translateX(-720px); } }`}</style>
        </svg>
      ) : (
        <div className="mt-2 aspect-[18/5] w-full rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]" />
      )}
    </div>
  );
}
