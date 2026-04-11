"use client";

/**
 * LessonAudioCard — premium, calm audio player for lesson narration.
 *
 * Placement: between the clinical image card and the lesson article, near the top of
 * the lesson content. Never buried deep in the page.
 *
 * Performance:
 *   - <audio preload="none"> — browser fetches nothing until user presses play
 *   - No waveform library — progress is a native range input styled with CSS variables
 *   - Audio ref created once; seeks and speed changes applied via HTMLAudioElement API
 *
 * Design surfaces:
 *   - Card outer: --surface-soft-b (soft cool surface)
 *   - Progress fill: --semantic-brand
 *   - Play button: brand fill
 *   - Speed chips: coordinated neutral/brand tints
 *   - Duration text: muted, tabular-nums
 *
 * Renders nothing when audioUrl is null/undefined — caller should guard with a conditional.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LessonAudioCardProps = {
  /** Pre-generated audio URL (TTS or studio). The component renders nothing when null. */
  audioUrl: string;
  /** Lesson title for aria-label. */
  lessonTitle?: string | null;
  /** Extra class on outer card. */
  className?: string;
};

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

function useLessonAudio(audioUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none"; // do NOT fetch audio until user interacts
    audio.src = audioUrl;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoaded(true);
    };
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setError(true);
      setIsPlaying(false);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || 0));
  }, []);

  const skip = useCallback((deltaSec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    seek(audio.currentTime + deltaSec);
  }, [seek]);

  const changeSpeed = useCallback((s: Speed) => {
    const audio = audioRef.current;
    setSpeed(s);
    if (audio) audio.playbackRate = s;
  }, []);

  return { isPlaying, currentTime, duration, speed, loaded, error, togglePlay, seek, skip, changeSpeed };
}

// ── LessonAudioControls (exported for reuse) ─────────────────────────────────

export type LessonAudioControlsProps = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: Speed;
  loaded: boolean;
  error: boolean;
  onTogglePlay: () => void;
  onSeek: (sec: number) => void;
  onSkip: (delta: number) => void;
  onSpeedChange: (s: Speed) => void;
  lessonTitle?: string | null;
};

export function LessonAudioControls({
  isPlaying,
  currentTime,
  duration,
  speed,
  loaded,
  error,
  onTogglePlay,
  onSeek,
  onSkip,
  onSpeedChange,
  lessonTitle,
}: LessonAudioControlsProps) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleProgressKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowLeft") onSkip(-5);
    if (e.key === "ArrowRight") onSkip(5);
  }

  if (error) {
    return (
      <p
        className="text-xs"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Audio unavailable for this lesson.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-label={`Audio player${lessonTitle ? ` — ${lessonTitle}` : ""}`}>
      {/* Row 1: play/pause + skip + time */}
      <div className="flex items-center gap-3">
        {/* Skip back 15s */}
        <SkipButton direction="back" onClick={() => onSkip(-15)} disabled={!loaded && currentTime === 0} />

        {/* Play / Pause */}
        <PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />

        {/* Skip forward 15s */}
        <SkipButton direction="forward" onClick={() => onSkip(15)} disabled={!loaded && currentTime === 0} />

        {/* Time */}
        <span
          className="ml-auto text-xs tabular-nums"
          style={{ color: "var(--semantic-text-muted)" }}
          aria-live="polite"
          aria-atomic="true"
        >
          {formatTime(currentTime)}
          {duration > 0 && (
            <span style={{ color: "var(--semantic-border-soft)" }}> / </span>
          )}
          {duration > 0 && formatTime(duration)}
        </span>
      </div>

      {/* Row 2: progress track */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "var(--semantic-brand)",
            top: "50%",
            transform: "translateY(-50%)",
            height: "3px",
          }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 100}
          step={0.5}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          onKeyDown={handleProgressKeyDown}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          className="nn-audio-seek-track relative w-full cursor-pointer appearance-none rounded-full"
          style={{
            height: "16px",
            background: "transparent",
            // Track styling via CSS (cross-browser range track must use ::before or appearance tricks)
            ["--nn-audio-pct" as string]: `${pct}%`,
          }}
        />
      </div>

      {/* Row 3: speed chips */}
      <div className="flex items-center gap-1.5">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Speed
        </span>
        {SPEEDS.map((s) => (
          <SpeedChip
            key={s}
            value={s}
            active={speed === s}
            onClick={() => onSpeedChange(s)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlayButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause lesson audio" : "Play lesson audio"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        background: "var(--semantic-brand)",
        color: "var(--semantic-surface, #fff)",
        boxShadow: "0 2px 8px -2px color-mix(in srgb, var(--semantic-brand) 40%, transparent)",
      }}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}

function SkipButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "back" | "forward";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "back" ? "Skip back 15 seconds" : "Skip forward 15 seconds"}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
        color: "var(--semantic-brand)",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)",
      }}
    >
      {direction === "back" ? <SkipBackIcon /> : <SkipForwardIcon />}
    </button>
  );
}

function SpeedChip({
  value,
  active,
  onClick,
}: {
  value: Speed;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Set playback speed to ${value}x`}
      className="rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={
        active
          ? {
              background: "var(--semantic-brand)",
              color: "var(--semantic-surface, #fff)",
            }
          : {
              background: "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))",
              color: "var(--semantic-text-muted)",
              border: "1px solid var(--semantic-border-soft)",
            }
      }
    >
      {value}×
    </button>
  );
}

// ── SVG icons (inline, no library) ───────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function SkipBackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
      <text x="7" y="16" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">15</text>
    </svg>
  );
}

function SkipForwardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-.49-3.51" />
      <text x="7" y="16" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">15</text>
    </svg>
  );
}

// ── LessonAudioCard (main export) ─────────────────────────────────────────────

/**
 * Compact audio player card for lesson narration.
 *
 * Usage:
 *   {lesson.audioUrl ? (
 *     <LessonAudioCard audioUrl={lesson.audioUrl} lessonTitle={lesson.title} />
 *   ) : null}
 *
 * The card renders nothing (null) when audioUrl is falsy — callers should guard
 * with a conditional rather than relying on internal null-check.
 */
export function LessonAudioCard({ audioUrl, lessonTitle, className = "" }: LessonAudioCardProps) {
  if (!audioUrl) return null;

  return <LessonAudioCardInner audioUrl={audioUrl} lessonTitle={lessonTitle} className={className} />;
}

function LessonAudioCardInner({ audioUrl, lessonTitle, className }: LessonAudioCardProps) {
  const { isPlaying, currentTime, duration, speed, loaded, error, togglePlay, seek, skip, changeSpeed } =
    useLessonAudio(audioUrl);

  return (
    <aside
      aria-label={`Audio player${lessonTitle ? ` for "${lessonTitle}"` : ""}`}
      className={`mx-auto mt-6 mb-2 max-w-[44rem] overflow-hidden rounded-2xl${className ? ` ${className}` : ""}`}
      style={{
        background: "var(--surface-soft-b, var(--semantic-panel-cool))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 18%, var(--semantic-border-soft))",
        boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06), 0 1px 4px -1px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
            }}
            aria-hidden="true"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--semantic-brand)" aria-hidden="true">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </span>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Audio lesson
          </p>
          {loaded && duration > 0 && (
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[10px] tabular-nums"
              style={{
                background: "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))",
                color: "var(--semantic-text-muted)",
                border: "1px solid var(--semantic-border-soft)",
              }}
            >
              {formatTime(duration)}
            </span>
          )}
        </div>

        {/* Optional lesson title */}
        {lessonTitle && (
          <p
            className="mb-3 truncate text-sm font-semibold"
            style={{ color: "var(--semantic-text-secondary)" }}
            title={lessonTitle}
          >
            {lessonTitle}
          </p>
        )}

        {/* Controls */}
        <LessonAudioControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          speed={speed}
          loaded={loaded}
          error={error}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onSkip={skip}
          onSpeedChange={changeSpeed}
          lessonTitle={lessonTitle}
        />
      </div>

      {/* CSS for range input track cross-browser */}
      <style>{`
        .nn-audio-seek-track::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            var(--semantic-brand) var(--nn-audio-pct, 0%),
            color-mix(in srgb, var(--semantic-text-muted) 25%, var(--semantic-surface)) var(--nn-audio-pct, 0%)
          );
        }
        .nn-audio-seek-track::-moz-range-track {
          height: 3px;
          border-radius: 9999px;
          background: color-mix(in srgb, var(--semantic-text-muted) 25%, var(--semantic-surface));
        }
        .nn-audio-seek-track::-moz-range-progress {
          height: 3px;
          border-radius: 9999px;
          background: var(--semantic-brand);
        }
        .nn-audio-seek-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--semantic-brand);
          margin-top: -5.5px;
          box-shadow: 0 1px 4px -1px color-mix(in srgb, var(--semantic-brand) 50%, transparent);
          cursor: pointer;
        }
        .nn-audio-seek-track::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--semantic-brand);
          border: none;
          cursor: pointer;
        }
        .nn-audio-seek-track:focus-visible {
          outline: none;
        }
        .nn-audio-seek-track:focus-visible::-webkit-slider-thumb {
          outline: 2px solid var(--semantic-brand);
          outline-offset: 2px;
        }
      `}</style>
    </aside>
  );
}
