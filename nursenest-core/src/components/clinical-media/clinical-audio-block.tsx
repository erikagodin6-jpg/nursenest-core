"use client";

/**
 * ClinicalAudioBlock — a compact, embeddable single-sound player.
 *
 * Renders a clinical sound (cardiac or respiratory) in a self-contained
 * card that can be placed inside lessons, flashcards, practice test rationales,
 * or CAT feedback panels.
 *
 * The block uses the synthesized waveform engine (WebAudioAPI) rather than
 * an external audio file — works without any S3/Spaces dependency.
 *
 * USAGE:
 *   // Wheeze (asthma, COPD, bronchiolitis)
 *   <ClinicalAudioBlock soundId="wheeze" kind="respiratory" />
 *
 *   // S3 (heart failure, volume overload)
 *   <ClinicalAudioBlock soundId="s3" kind="cardiac" />
 *
 * EMBEDDING:
 *   Reusable across: Lessons · Flashcards · Practice Tests · CAT
 *
 * All synthesis happens client-side — no data fetching, no auth required.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Stethoscope, Wind } from "lucide-react";
import { CARDIAC_SOUND_RECORDS } from "@/lib/lessons/cardiac-sounds-library-data";
import { RESPIRATORY_SOUND_RECORDS } from "@/lib/lessons/respiratory-sounds-library-data";
import {
  scheduleCardiacWaveform,
  scheduleRespiratoryWaveform,
  type CardiacWaveformId,
  type RespiratoryWaveformId,
} from "@/lib/lessons/lesson-sound-waveform-synth";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ClinicalAudioBlockKind = "cardiac" | "respiratory";

export type ClinicalAudioBlockProps = {
  /** Sound record ID from CARDIAC_SOUND_RECORDS or RESPIRATORY_SOUND_RECORDS. */
  soundId: string;
  kind: ClinicalAudioBlockKind;
  /** Override the display name derived from the sound record. */
  displayName?: string;
  /** Show clinical significance below the player. */
  showSignificance?: boolean;
  /** Show auscultation site below the player. */
  showAuscultationSite?: boolean;
  /** Compact mode — single-line with minimal chrome. */
  compact?: boolean;
  className?: string;
};

// ── Sound lookup ──────────────────────────────────────────────────────────────

type AnyRecord = { id: string; name: string; waveformType: string; auscultationSite: string; clinicalSignificance: string; description: string };

function lookupSound(id: string, kind: ClinicalAudioBlockKind): AnyRecord | null {
  const records = kind === "cardiac"
    ? (CARDIAC_SOUND_RECORDS as AnyRecord[])
    : (RESPIRATORY_SOUND_RECORDS as AnyRecord[]);
  return records.find((r) => r.id === id) ?? null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ClinicalAudioBlock({
  soundId,
  kind,
  displayName,
  showSignificance = true,
  showAuscultationSite = false,
  compact = false,
  className = "",
}: ClinicalAudioBlockProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const stopRef = useRef<(() => void) | null>(null);

  const record = lookupSound(soundId, kind);

  useEffect(() => {
    if (typeof window === "undefined" || !("AudioContext" in window || "webkitAudioContext" in window)) {
      setSupported(false);
    }
    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (playing) {
      stopRef.current?.();
      stopRef.current = null;
      setPlaying(false);
      return;
    }
    if (!record) return;

    try {
      let stop: (() => void) | null = null;
      if (kind === "cardiac") {
        stop = scheduleCardiacWaveform(record.waveformType as CardiacWaveformId);
      } else {
        stop = scheduleRespiratoryWaveform(record.waveformType as RespiratoryWaveformId);
      }
      if (stop) {
        stopRef.current = stop;
        setPlaying(true);
        // Auto-stop after one playback cycle (~3–5 s)
        setTimeout(() => {
          stopRef.current?.();
          stopRef.current = null;
          setPlaying(false);
        }, 4_500);
      }
    } catch {
      setPlaying(false);
    }
  }, [playing, record, kind]);

  if (!record) return null;

  const label = displayName || record.name;
  const Icon = kind === "cardiac" ? Stethoscope : Wind;

  if (compact) {
    return (
      <div
        className={`nn-clinical-audio-block nn-clinical-audio-block--compact flex items-center gap-2 rounded-xl px-3 py-2 ${className}`}
        style={{
          background: "var(--lesson-media-surface)",
          border: "1px solid var(--lesson-media-border)",
        }}
      >
        <button
          type="button"
          onClick={handlePlay}
          disabled={!supported}
          aria-label={playing ? `Stop ${label}` : `Play ${label}`}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]"
          style={{
            background: playing
              ? "color-mix(in srgb, var(--semantic-brand) 15%, transparent)"
              : "var(--semantic-brand)",
            color: playing ? "var(--semantic-brand)" : "#fff",
          }}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
        </button>
        <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--lesson-media-label-text)" }} />
        <span className="text-xs font-semibold text-[var(--semantic-text-primary)]">{label}</span>
        {!supported && (
          <span className="ml-auto text-[10px] text-[var(--semantic-text-tertiary)]">Audio not supported</span>
        )}
      </div>
    );
  }

  return (
    <aside
      aria-label={`${kind === "cardiac" ? "Cardiac" : "Respiratory"} sound: ${label}`}
      className={`nn-clinical-audio-block overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "var(--lesson-media-surface)",
        border: "1px solid var(--lesson-media-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)" }}
        >
          <Icon className="h-4 w-4" style={{ color: "var(--semantic-brand)" }} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--lesson-media-label-text)" }}>
            {kind === "cardiac" ? "Cardiac sound" : "Respiratory sound"}
          </p>
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</p>
        </div>
      </div>

      {/* Player */}
      <div className="px-4 pb-3">
        <button
          type="button"
          onClick={handlePlay}
          disabled={!supported}
          aria-label={playing ? `Stop ${label}` : `Simulate ${label}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)] disabled:opacity-40"
          style={{
            background: playing
              ? "color-mix(in srgb, var(--semantic-brand) 12%, transparent)"
              : "var(--semantic-brand)",
            color: playing ? "var(--semantic-brand)" : "#fff",
          }}
        >
          {playing
            ? <><Pause className="h-4 w-4" aria-hidden /> Stop</>
            : <><Play className="h-4 w-4 translate-x-px" aria-hidden /> Simulate sound</>
          }
        </button>
        {!supported && (
          <p className="mt-1 text-center text-[11px] text-[var(--semantic-text-tertiary)]">
            Web Audio not supported in this browser.
          </p>
        )}
      </div>

      {/* Clinical context */}
      {(showAuscultationSite || showSignificance) && (
        <div
          className="px-4 pb-4"
          style={{ borderTop: "1px solid var(--lesson-media-border)" }}
        >
          {showAuscultationSite && record.auscultationSite && (
            <div className="pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--lesson-media-label-text)" }}>
                Auscultation site
              </p>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{record.auscultationSite}</p>
            </div>
          )}
          {showSignificance && record.clinicalSignificance && (
            <div className="pt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--lesson-media-label-text)" }}>
                Clinical significance
              </p>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{record.clinicalSignificance}</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

// ── ClinicalAudioGroup ────────────────────────────────────────────────────────

export type ClinicalAudioGroupProps = {
  /** Array of sound IDs to show as a compact group. */
  sounds: Array<{ soundId: string; kind: ClinicalAudioBlockKind; displayName?: string }>;
  heading?: string;
  className?: string;
};

/**
 * Groups multiple clinical audio blocks in a compact list — for when a lesson
 * covers several related sounds (e.g. all valve murmurs in a cardiac assessment lesson).
 */
export function ClinicalAudioGroup({ sounds, heading, className = "" }: ClinicalAudioGroupProps) {
  if (sounds.length === 0) return null;
  return (
    <div className={`nn-clinical-audio-group space-y-1.5 ${className}`}>
      {heading && (
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--lesson-media-label-text)" }}>
          {heading}
        </p>
      )}
      {sounds.map(({ soundId, kind, displayName }) => (
        <ClinicalAudioBlock
          key={`${kind}:${soundId}`}
          soundId={soundId}
          kind={kind}
          displayName={displayName}
          compact
          showSignificance={false}
        />
      ))}
    </div>
  );
}
