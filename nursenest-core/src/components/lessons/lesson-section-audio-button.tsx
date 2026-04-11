"use client";

/**
 * LessonSectionAudioButton — per-section "Listen to this section" inline control.
 *
 * Design intent:
 *   - Very small and quiet — renders nothing when no section audioUrl
 *   - Appears below the section heading chip, above the section body
 *   - One active player at a time: calling play on one pauses all others via a
 *     simple custom event on the window (no Redux, no context overhead)
 *   - Audio element created lazily on first play — no preload overhead
 *
 * Surfaces:
 *   - Button idle: muted neutral pill
 *   - Button active (playing): brand tint pill
 *   - No outer card — sits inline in the section flow
 *
 * Usage:
 *   {section.audioUrl ? (
 *     <LessonSectionAudioButton
 *       audioUrl={section.audioUrl}
 *       sectionId={section.id}
 *       sectionHeading={section.heading}
 *     />
 *   ) : null}
 */

import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_AUDIO_EVENT = "nn:section-audio-play";

export type LessonSectionAudioButtonProps = {
  /** URL for the section-level audio narration. Component renders nothing when falsy. */
  audioUrl: string;
  /** Section ID — used to identify which player is active for single-play enforcement. */
  sectionId: string;
  /** Section heading for aria-label. */
  sectionHeading?: string;
};

export function LessonSectionAudioButton({
  audioUrl,
  sectionId,
  sectionHeading,
}: LessonSectionAudioButtonProps) {
  if (!audioUrl) return null;
  return (
    <LessonSectionAudioButtonInner
      audioUrl={audioUrl}
      sectionId={sectionId}
      sectionHeading={sectionHeading}
    />
  );
}

function LessonSectionAudioButtonInner({
  audioUrl,
  sectionId,
  sectionHeading,
}: LessonSectionAudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  // Create audio element lazily (on first play)
  function ensureAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = "none";
      a.src = audioUrl;
      a.addEventListener("ended", () => setIsPlaying(false));
      a.addEventListener("error", () => { setError(true); setIsPlaying(false); });
      a.addEventListener("play", () => setIsPlaying(true));
      a.addEventListener("pause", () => setIsPlaying(false));
      audioRef.current = a;
    }
    return audioRef.current;
  }

  // Listen for other sections starting — pause self
  useEffect(() => {
    function handleOtherPlay(e: Event) {
      const event = e as CustomEvent<{ sectionId: string }>;
      if (event.detail.sectionId !== sectionId) {
        audioRef.current?.pause();
      }
    }
    window.addEventListener(SECTION_AUDIO_EVENT, handleOtherPlay);
    return () => window.removeEventListener(SECTION_AUDIO_EVENT, handleOtherPlay);
  }, [sectionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggle = useCallback(() => {
    if (error) return;
    const audio = ensureAudio();
    if (audio.paused) {
      // Broadcast so other sections pause themselves
      window.dispatchEvent(
        new CustomEvent(SECTION_AUDIO_EVENT, { detail: { sectionId } }),
      );
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  }, [error, sectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <span
        className="mt-1 inline-block text-[10px]"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Section audio unavailable
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isPlaying
          ? `Pause audio for "${sectionHeading ?? "this section"}"`
          : `Listen to "${sectionHeading ?? "this section"}"`
      }
      aria-pressed={isPlaying}
      className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={
        isPlaying
          ? {
              background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 30%, transparent)",
            }
          : {
              background: "color-mix(in srgb, var(--semantic-text-muted) 6%, var(--semantic-surface))",
              color: "var(--semantic-text-muted)",
              border: "1px solid var(--semantic-border-soft)",
            }
      }
    >
      {/* Small audio icon */}
      <span aria-hidden="true" className="flex h-3 w-3 shrink-0 items-center justify-center">
        {isPlaying ? <MiniPauseIcon /> : <MiniAudioIcon />}
      </span>
      <span className="uppercase tracking-[0.08em]">
        {isPlaying ? "Pause section" : "Listen to section"}
      </span>
    </button>
  );
}

function MiniAudioIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

function MiniPauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}
