"use client";

import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NCLEX Exam Calculator
// Basic arithmetic: +, -, ×, ÷, %, ±, C, backspace, decimal.
// Draggable floating panel — stays within viewport.
// ─────────────────────────────────────────────────────────────────────────────

type CalcOp = "+" | "-" | "×" | "÷" | null;

export function NclexCalculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [op, setOp] = useState<CalcOp>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const [error, setError] = useState(false);

  // Dragging state
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 80, y: 80 });

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    const onMove = (me: MouseEvent) => {
      if (!dragOffset.current) return;
      const nx = me.clientX - dragOffset.current.x;
      const ny = me.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - 260;
      const maxY = window.innerHeight - 360;
      setPos({ x: Math.max(0, Math.min(nx, maxX)), y: Math.max(0, Math.min(ny, maxY)) });
    };
    const onUp = () => {
      dragOffset.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function pressDigit(d: string) {
    if (error) { setDisplay(d); setError(false); return; }
    if (waitingForNext) {
      setDisplay(d);
      setWaitingForNext(false);
      return;
    }
    if (display === "0" && d !== ".") {
      setDisplay(d);
    } else if (d === "." && display.includes(".")) {
      return;
    } else if (display.length >= 15) {
      return;
    } else {
      setDisplay(display + d);
    }
  }

  function pressOp(nextOp: CalcOp) {
    if (error) return;
    if (prevValue !== null && !waitingForNext) {
      const result = compute(parseFloat(prevValue), parseFloat(display), op);
      if (result === null) { setDisplay("Error"); setError(true); return; }
      const s = formatResult(result);
      setDisplay(s);
      setPrevValue(s);
    } else {
      setPrevValue(display);
    }
    setOp(nextOp);
    setWaitingForNext(true);
  }

  function pressEquals() {
    if (error || prevValue === null || op === null) return;
    const a = parseFloat(prevValue);
    const b = parseFloat(display);
    const result = compute(a, b, op);
    if (result === null) { setDisplay("Error"); setError(true); setPrevValue(null); setOp(null); return; }
    setDisplay(formatResult(result));
    setPrevValue(null);
    setOp(null);
    setWaitingForNext(true);
  }

  function pressClear() {
    setDisplay("0");
    setPrevValue(null);
    setOp(null);
    setWaitingForNext(false);
    setError(false);
  }

  function pressBackspace() {
    if (error || waitingForNext) return;
    if (display.length <= 1) { setDisplay("0"); return; }
    setDisplay(display.slice(0, -1));
  }

  function pressPercent() {
    if (error) return;
    const v = parseFloat(display) / 100;
    setDisplay(formatResult(v));
    setWaitingForNext(true);
  }

  function pressNegate() {
    if (error) return;
    const v = parseFloat(display) * -1;
    setDisplay(formatResult(v));
  }

  return (
    <div
      ref={panelRef}
      onMouseDown={onMouseDown}
      className="nclex-calculator fixed z-[100] select-none rounded-2xl shadow-2xl"
      style={{
        left: pos.x,
        top: pos.y,
        width: 240,
        background: "color-mix(in srgb, var(--semantic-surface) 98%, var(--semantic-brand) 2%)",
        border: "1px solid var(--semantic-border-soft)",
        cursor: "grab",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between rounded-t-2xl px-4 py-2.5"
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
          borderBottom: "1px solid var(--semantic-border-soft)",
        }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
          Calculator
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold transition-colors"
          style={{ color: "var(--semantic-text-muted)", background: "transparent" }}
        >
          ✕
        </button>
      </div>

      {/* Display */}
      <div
        className="px-4 py-4 text-right"
        style={{ borderBottom: "1px solid var(--semantic-border-soft)" }}
      >
        {op && prevValue ? (
          <div className="mb-0.5 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            {prevValue} {op}
          </div>
        ) : null}
        <div
          className="overflow-hidden text-ellipsis whitespace-nowrap text-right font-mono text-2xl font-bold tabular-nums"
          style={{ color: error ? "var(--semantic-danger)" : "var(--semantic-text-primary)" }}
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-3" style={{ cursor: "default" }}>
        <CalcBtn label="C" onClick={pressClear} variant="function" />
        <CalcBtn label="±" onClick={pressNegate} variant="function" />
        <CalcBtn label="%" onClick={pressPercent} variant="function" />
        <CalcBtn label="÷" onClick={() => pressOp("÷")} variant="op" active={op === "÷" && waitingForNext} />

        <CalcBtn label="7" onClick={() => pressDigit("7")} />
        <CalcBtn label="8" onClick={() => pressDigit("8")} />
        <CalcBtn label="9" onClick={() => pressDigit("9")} />
        <CalcBtn label="×" onClick={() => pressOp("×")} variant="op" active={op === "×" && waitingForNext} />

        <CalcBtn label="4" onClick={() => pressDigit("4")} />
        <CalcBtn label="5" onClick={() => pressDigit("5")} />
        <CalcBtn label="6" onClick={() => pressDigit("6")} />
        <CalcBtn label="−" onClick={() => pressOp("-")} variant="op" active={op === "-" && waitingForNext} />

        <CalcBtn label="1" onClick={() => pressDigit("1")} />
        <CalcBtn label="2" onClick={() => pressDigit("2")} />
        <CalcBtn label="3" onClick={() => pressDigit("3")} />
        <CalcBtn label="+" onClick={() => pressOp("+")} variant="op" active={op === "+" && waitingForNext} />

        <CalcBtn label="0" onClick={() => pressDigit("0")} wide />
        <CalcBtn label="." onClick={() => pressDigit(".")} />
        <CalcBtn label="=" onClick={pressEquals} variant="equals" />
      </div>
    </div>
  );
}

function CalcBtn({
  label,
  onClick,
  variant = "digit",
  active = false,
  wide = false,
}: {
  label: string;
  onClick: () => void;
  variant?: "digit" | "op" | "function" | "equals";
  active?: boolean;
  wide?: boolean;
}) {
  const base =
    "flex items-center justify-center rounded-xl text-[15px] font-semibold transition-all active:scale-95";
  const height = "h-11";

  const bg =
    variant === "equals"
      ? "var(--semantic-brand)"
      : active
        ? "color-mix(in srgb, var(--semantic-brand) 20%, var(--semantic-surface))"
        : variant === "op"
          ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))"
          : variant === "function"
            ? "color-mix(in srgb, var(--semantic-text-muted) 12%, var(--semantic-surface))"
            : "color-mix(in srgb, var(--semantic-text-muted) 6%, var(--semantic-surface))";

  const color =
    variant === "equals"
      ? "#fff"
      : active || variant === "op"
        ? "var(--semantic-brand)"
        : "var(--semantic-text-primary)";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${height} ${wide ? "col-span-2" : ""}`}
      style={{ background: bg, color, cursor: "pointer", border: "1px solid transparent" }}
    >
      {label}
    </button>
  );
}

function compute(a: number, b: number, op: CalcOp): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
    default: return b;
  }
}

function formatResult(v: number): string {
  if (!Number.isFinite(v)) return "Error";
  if (Number.isInteger(v) && Math.abs(v) < 1e12) return String(v);
  const s = parseFloat(v.toPrecision(10)).toString();
  return s.length > 14 ? v.toExponential(6) : s;
}
