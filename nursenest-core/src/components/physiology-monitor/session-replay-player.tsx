"use client";

/**
 * SessionReplayPlayer
 *
 * Replay UI for a completed Physiology Monitor session.
 * Controls: play, pause, step, scrub, jump-to-event, speed selection.
 * Displays the PatientMonitorDisplay at each replayed tick.
 *
 * Usage:
 *   <SessionReplayPlayer timeline={replayTimeline} />
 */

import "./patient-monitor-display.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { PatientMonitorDisplay } from "./patient-monitor-display";
import {
  seekToTick,
  seekToNextBookmark,
  seekToEvent,
  type ReplayTimeline,
  type ReplayCursor,
  type ReplayEventKind,
} from "@/lib/physiology-monitor/session-replay-engine";
import type { MonitorMode } from "@/lib/physiology-monitor/physiology-state";
import { REAL_MS_PER_TICK } from "@/lib/physiology-monitor/monitor-engine";

// ─── Speed options ────────────────────────────────────────────────────────────

const SPEEDS = [
  { label: "0.5×", ms: REAL_MS_PER_TICK * 2 },
  { label: "1×",   ms: REAL_MS_PER_TICK },
  { label: "2×",   ms: Math.round(REAL_MS_PER_TICK / 2) },
  { label: "5×",   ms: Math.round(REAL_MS_PER_TICK / 5) },
  { label: "10×",  ms: Math.round(REAL_MS_PER_TICK / 10) },
] as const;

// ─── Event kind colours ────────────────────────────────────────────────────────

const EVENT_COLORS: Record<ReplayEventKind, string> = {
  intervention:       "#00e676",
  recognition:        "#00e5ff",
  escalation:         "#ffd740",
  stage_transition:   "#ff9100",
  alarm_fired:        "#ff1744",
  harm_event:         "#ff1744",
  missed_opportunity: "#ff6e6e",
  optimal_action:     "#00e676",
  session_start:      "#4a6a88",
  session_end:        "#4a6a88",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSimTime(simSeconds: number): string {
  const m = Math.floor(simSeconds / 60);
  const s = Math.floor(simSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Timeline scrubber ────────────────────────────────────────────────────────

function TimelineScrubber({
  timeline,
  currentTick,
  onSeek,
}: {
  timeline: ReplayTimeline;
  currentTick: number;
  onSeek: (tick: number) => void;
}) {
  const width = timeline.totalTicks || 1;

  return (
    <div
      style={{
        position: "relative",
        height: 32,
        background: "#0a1520",
        borderRadius: 4,
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        onSeek(Math.round(pct * width));
      }}
    >
      {/* Severity background */}
      <div style={{ position: "absolute", inset: "0 0 8px 0", display: "flex" }}>
        {timeline.severityByTick.map((sev, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: sev === 2 ? "rgba(255,23,68,0.18)"
                : sev === 1 ? "rgba(255,145,0,0.12)"
                : "transparent",
            }}
          />
        ))}
      </div>

      {/* Alarm count sparkline */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, display: "flex", alignItems: "flex-end" }}>
        {timeline.alarmCountByTick.map((count, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.min(count * 33, 100)}%`,
              background: count >= 2 ? "#ff1744" : count === 1 ? "#ffd740" : "transparent",
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      {/* Bookmark markers */}
      {timeline.bookmarks.map((bm, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(bm.tick / width) * 100}%`,
            top: 0, bottom: 0, width: 2,
            background: bm.kind === "harm" ? "#ff1744"
              : bm.kind === "intervention" ? "#00e676"
              : bm.kind === "missed" ? "#ff6e6e"
              : "#ffd740",
            opacity: 0.8,
          }}
          title={bm.label}
        />
      ))}

      {/* Playhead */}
      <div
        style={{
          position: "absolute",
          left: `${(currentTick / width) * 100}%`,
          top: 0, bottom: 0, width: 2,
          background: "#e8edf2",
          boxShadow: "0 0 4px rgba(232,237,242,0.8)",
          pointerEvents: "none",
          transform: "translateX(-1px)",
        }}
      />
    </div>
  );
}

// ─── Event feed panel ─────────────────────────────────────────────────────────

function EventFeed({
  timeline,
  currentTick,
  onSeek,
}: {
  timeline: ReplayTimeline;
  currentTick: number;
  onSeek: (tick: number) => void;
}) {
  const visibleEvents = timeline.events.filter(
    (e) => e.kind !== "session_start" && e.kind !== "session_end",
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 260, overflowY: "auto" }}>
      {visibleEvents.map((ev, i) => {
        const color = EVENT_COLORS[ev.kind] ?? "#8fafc8";
        const isCurrent = Math.abs(ev.tick - currentTick) <= 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSeek(ev.tick)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "4px 8px",
              background: isCurrent ? "rgba(255,255,255,0.06)" : "transparent",
              border: "none",
              borderLeft: isCurrent ? `2px solid ${color}` : "2px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: 3,
            }}
          >
            <span style={{ fontSize: "9px", color: "#4a6a88", fontVariantNumeric: "tabular-nums", minWidth: "2.5rem", marginTop: 1 }}>
              {formatSimTime(ev.simSeconds)}
            </span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontSize: "9px", color: isCurrent ? "#e8edf2" : "#8fafc8", lineHeight: 1.4, flex: 1 }}>
              {ev.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main player component ────────────────────────────────────────────────────

export interface SessionReplayPlayerProps {
  timeline: ReplayTimeline;
  mode?: MonitorMode;
  onClose?: () => void;
}

export function SessionReplayPlayer({
  timeline,
  mode = "general",
  onClose,
}: SessionReplayPlayerProps) {
  const [currentTick, setCurrentTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(REAL_MS_PER_TICK);
  const [cursor, setCursor] = useState<ReplayCursor | null>(() =>
    seekToTick(timeline, 0),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const seek = useCallback((tick: number) => {
    const c = seekToTick(timeline, tick);
    if (c) {
      setCurrentTick(c.tick);
      setCursor(c);
    }
  }, [timeline]);

  // Playback loop
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentTick((prev) => {
        const next = prev + 1;
        if (next > timeline.totalTicks) {
          setPlaying(false);
          return prev;
        }
        const c = seekToTick(timeline, next);
        if (c) setCursor(c);
        return next;
      });
    }, speedMs);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speedMs, timeline]);

  if (timeline.totalTicks === 0 || !cursor) {
    return (
      <div data-nn-monitor style={{ padding: 24, color: "#4a6a88", fontSize: 11 }}>
        No replay data available for this session.
      </div>
    );
  }

  const pct = (currentTick / Math.max(1, timeline.totalTicks)) * 100;

  return (
    <div
      data-nn-monitor
      style={{ fontFamily: "var(--mon-font, monospace)", display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* ── Header bar ── */}
      <div style={{
        background: "#0a1520",
        border: "1px solid #1e3450",
        borderRadius: "10px 10px 0 0",
        borderBottom: "none",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "#8fafc8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Session Replay
        </span>
        <span style={{ fontSize: "8px", color: "#4a6a88" }}>
          {timeline.conditionKey.replace(/_/g, " ")}
        </span>
        <div style={{ flex: 1 }} />

        {/* Speed selector */}
        <div style={{ display: "flex", gap: 3 }}>
          {SPEEDS.map(({ label, ms }) => (
            <button
              key={label}
              type="button"
              data-nn-monitor-mode-pill=""
              aria-pressed={speedMs === ms}
              onClick={() => setSpeedMs(ms)}
              style={{ fontSize: "8px", padding: "2px 6px" }}
            >
              {label}
            </button>
          ))}
        </div>

        {onClose && (
          <button type="button" onClick={onClose} style={{ fontSize: "9px", color: "#8fafc8", background: "none", border: "none", cursor: "pointer" }}>
            ✕
          </button>
        )}
      </div>

      {/* ── Main layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 220px",
        background: "#0a1520",
        border: "1px solid #1e3450",
        borderRadius: "0 0 10px 10px",
        overflow: "hidden",
      }}>
        {/* Left: monitor display at replay tick */}
        <div>
          <PatientMonitorDisplay
            state={cursor.snapshot.state}
            history={timeline.snapshots.slice(0, currentTick + 1)}
            mode={mode}
            showOverlay={false}
          />

          {/* Educational note */}
          {cursor.educationalNote && (
            <div style={{
              padding: "6px 14px",
              borderTop: "1px solid #1e3450",
              fontSize: "9px",
              color: "#ffd740",
              lineHeight: 1.5,
              background: "rgba(255,215,64,0.05)",
            }}>
              ◆ {cursor.educationalNote}
            </div>
          )}

          {/* Timeline scrubber */}
          <div style={{ padding: "8px 14px", borderTop: "1px solid #1e3450" }}>
            <div style={{ marginBottom: 6 }}>
              <TimelineScrubber
                timeline={timeline}
                currentTick={currentTick}
                onSeek={seek}
              />
            </div>

            {/* Playback controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                data-nn-monitor-intervention-btn=""
                onClick={() => seek(0)}
                title="Restart"
                style={{ minWidth: 0, padding: "2px 8px", fontSize: "10px" }}
              >
                ⏮
              </button>
              <button
                type="button"
                data-nn-monitor-intervention-btn=""
                onClick={() => seek(currentTick - 1)}
                disabled={currentTick <= 0}
                title="Step back"
                style={{ minWidth: 0, padding: "2px 8px", fontSize: "10px" }}
              >
                ◀
              </button>
              <button
                type="button"
                data-nn-monitor-intervention-btn=""
                onClick={() => setPlaying((v) => !v)}
                aria-label={playing ? "Pause" : "Play"}
                style={{ minWidth: 0, padding: "2px 10px", fontSize: "11px" }}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                data-nn-monitor-intervention-btn=""
                onClick={() => seek(currentTick + 1)}
                disabled={currentTick >= timeline.totalTicks}
                title="Step forward"
                style={{ minWidth: 0, padding: "2px 8px", fontSize: "10px" }}
              >
                ▶
              </button>
              <button
                type="button"
                data-nn-monitor-intervention-btn=""
                onClick={() => {
                  const c = seekToNextBookmark(timeline, currentTick);
                  if (c) seek(c.tick);
                }}
                title="Next bookmark"
                style={{ minWidth: 0, padding: "2px 8px", fontSize: "10px" }}
              >
                ⏭
              </button>
              <button
                type="button"
                data-nn-monitor-mode-pill=""
                aria-pressed={false}
                onClick={() => {
                  const c = seekToEvent(timeline, "missed_opportunity", currentTick + 1);
                  if (c) seek(c.tick);
                }}
                style={{ fontSize: "8px" }}
              >
                Next Miss
              </button>
              <button
                type="button"
                data-nn-monitor-mode-pill=""
                aria-pressed={false}
                onClick={() => {
                  const c = seekToEvent(timeline, "harm_event", currentTick + 1);
                  if (c) seek(c.tick);
                }}
                style={{ fontSize: "8px" }}
              >
                Next Harm
              </button>

              <div style={{ flex: 1 }} />
              <span style={{ fontSize: "9px", color: "#8fafc8", fontVariantNumeric: "tabular-nums" }}>
                {formatSimTime(cursor.simSeconds)} / {formatSimTime(timeline.totalSimSeconds)}
              </span>
              <span style={{ fontSize: "8px", color: "#4a6a88" }}>
                {Math.round(pct)}%
              </span>
            </div>
          </div>

          {/* Alarm labels at current tick */}
          {cursor.alarmLabels.length > 0 && (
            <div style={{
              padding: "4px 14px 8px",
              borderTop: "1px solid #1e3450",
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}>
              {cursor.alarmLabels.map((a, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#ff1744",
                    border: "1px solid rgba(255,23,68,0.3)",
                    borderRadius: 3,
                    padding: "1px 5px",
                    background: "rgba(255,23,68,0.08)",
                  }}
                >
                  ⚠ {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: event feed + optimal path */}
        <div style={{
          borderLeft: "1px solid #1e3450",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Session Timeline
          </div>
          <EventFeed timeline={timeline} currentTick={currentTick} onSeek={seek} />

          {/* Optimal path comparison at current tick */}
          {(() => {
            const opc = timeline.optimalPathComparisons.find(
              (c) => Math.abs(c.tick - currentTick) <= 2,
            );
            if (!opc) return null;
            return (
              <div style={{
                borderTop: "1px solid #152336",
                paddingTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}>
                <div style={{ fontSize: "8px", fontWeight: 700, color: "#4a6a88", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Path Comparison
                </div>
                <div style={{ fontSize: "8px", color: "#00e676" }}>✓ Optimal: {opc.optimalAction.slice(0, 50)}</div>
                <div style={{ fontSize: "8px", color: opc.wasCorrect ? "#00e676" : "#ff6e6e" }}>
                  {opc.wasCorrect ? "✓ You:" : "✗ You:"} {opc.learnerAction ?? "No action"}
                </div>
                <div style={{ fontSize: "8px", color: "#4a6a88", lineHeight: 1.4 }}>{opc.coachingNote}</div>
              </div>
            );
          })()}

          {/* Missed opportunities list */}
          {timeline.missedOpportunities.length > 0 && (
            <div style={{ borderTop: "1px solid #152336", paddingTop: 8 }}>
              <div style={{ fontSize: "8px", fontWeight: 700, color: "#ff6e6e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Missed Opportunities
              </div>
              {timeline.missedOpportunities.slice(0, 4).map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => seek(m.tick)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    background: "none", border: "none", cursor: "pointer",
                    padding: "2px 0",
                  }}
                >
                  <span style={{ fontSize: "8px", color: m.isHarm ? "#ff1744" : "#ff9100" }}>
                    {formatSimTime(m.simSeconds)} — {m.description.slice(0, 45)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
