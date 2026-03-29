import { useState, useEffect, useCallback, useRef } from "react";
import { X, Delete } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export function ExamCalculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState("");
  const dragRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (pos.x === -1) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setPos({ x: Math.max(16, w - 340), y: Math.max(60, h / 2 - 240) });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
  const { t } = useI18n();
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const inputDigit = useCallback((digit: string) => {
    if (resetNext) {
      setDisplay(digit);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }, [display, resetNext]);

  const inputDecimal = useCallback(() => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, resetNext]);

  const calculate = useCallback((a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? 0 : a / b;
      default: return b;
    }
  }, []);

  const handleOperation = useCallback((op: string) => {
    const current = parseFloat(display);
    if (previousValue !== null && operation && !resetNext) {
      const result = calculate(previousValue, current, operation);
      const rounded = parseFloat(result.toFixed(10));
      setDisplay(String(rounded));
      setPreviousValue(rounded);
      setHistory(`${rounded} ${op}`);
    } else {
      setPreviousValue(current);
      setHistory(`${current} ${op}`);
    }
    setOperation(op);
    setResetNext(true);
  }, [display, previousValue, operation, calculate, resetNext]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || !operation) return;
    const current = parseFloat(display);
    const result = calculate(previousValue, current, operation);
    const rounded = parseFloat(result.toFixed(10));
    setHistory(`${previousValue} ${operation} ${current} =`);
    setDisplay(String(rounded));
    setPreviousValue(null);
    setOperation(null);
    setResetNext(true);
  }, [display, previousValue, operation, calculate]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetNext(false);
    setHistory("");
  }, []);

  const handleBackspace = useCallback(() => {
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  }, [display]);

  const handlePercent = useCallback(() => {
    const val = parseFloat(display) / 100;
    setDisplay(String(parseFloat(val.toFixed(10))));
    setResetNext(true);
  }, [display]);

  const handleNegate = useCallback(() => {
    if (display !== "0") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    }
  }, [display]);

  const handleMemory = useCallback((action: string) => {
    const current = parseFloat(display);
    switch (action) {
      case "MC": setMemory(0); break;
      case "MR": setDisplay(String(memory)); setResetNext(true); break;
      case "M+": setMemory(memory + current); setResetNext(true); break;
      case "M-": setMemory(memory - current); setResetNext(true); break;
    }
  }, [display, memory]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
      else if (e.key === ".") inputDecimal();
      else if (e.key === "+") handleOperation("+");
      else if (e.key === "-") handleOperation("-");
      else if (e.key === "*") handleOperation("×");
      else if (e.key === "/") { e.preventDefault(); handleOperation("÷"); }
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Escape") handleClear();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "%") handlePercent();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inputDigit, inputDecimal, handleOperation, handleEquals, handleClear, handleBackspace, handlePercent]);

  const btnBase = "flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 select-none";
  const numBtn = `${btnBase} bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 h-11`;
  const opBtn = `${btnBase} bg-[#BFA6F6]/10 hover:bg-[#BFA6F6]/20 border border-[#BFA6F6]/30 text-[#BFA6F6] h-11 font-bold`;
  const funcBtn = `${btnBase} bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 h-9 text-xs`;
  const eqBtn = `${btnBase} bg-[#BFA6F6] hover:bg-[#BFA6F6]/90 text-white h-11 font-bold`;

  return (
    <div
      ref={dragRef}
      className="fixed z-[9999] select-none"
      style={{ left: pos.x, top: pos.y }}
      data-testid="panel-calculator"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[280px] overflow-hidden"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#BFA6F6]/10 to-[#AEE3E1]/10 border-b border-gray-100 cursor-move">
          <span className="text-sm font-semibold text-[#2E3A59]">{t("components.examCalculator.calculator")}</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            data-testid="button-close-calculator"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 pt-3 pb-1">
          {history && (
            <div className="text-right text-xs text-gray-400 mb-0.5 h-4 truncate" data-testid="text-calc-history">
              {history}
            </div>
          )}
          <div
            className="text-right text-2xl font-mono font-bold text-[#2E3A59] mb-2 min-h-[36px] break-all leading-tight"
            data-testid="text-calc-display"
          >
            {display}
          </div>
          {memory !== 0 && (
            <div className="text-right text-xs text-[#BFA6F6] mb-1">M = {memory}</div>
          )}
        </div>

        <div className="px-3 pb-1">
          <div className="grid grid-cols-4 gap-1 mb-1.5">
            {["MC", "MR", "M+", "M-"].map((m) => (
              <button key={m} className={funcBtn} onClick={() => handleMemory(m)} data-testid={`button-calc-${m.toLowerCase()}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 pb-3">
          <div className="grid grid-cols-4 gap-1.5">
            <button className={`${numBtn} bg-gray-50 text-gray-500`} onClick={handleClear} data-testid="button-calc-clear">AC</button>
            <button className={`${numBtn} bg-gray-50 text-gray-500`} onClick={handleNegate} data-testid="button-calc-negate">+/-</button>
            <button className={`${numBtn} bg-gray-50 text-gray-500`} onClick={handlePercent} data-testid="button-calc-percent">%</button>
            <button className={opBtn} onClick={() => handleOperation("÷")} data-testid="button-calc-divide">÷</button>

            <button className={numBtn} onClick={() => inputDigit("7")} data-testid="button-calc-7">7</button>
            <button className={numBtn} onClick={() => inputDigit("8")} data-testid="button-calc-8">8</button>
            <button className={numBtn} onClick={() => inputDigit("9")} data-testid="button-calc-9">9</button>
            <button className={opBtn} onClick={() => handleOperation("×")} data-testid="button-calc-multiply">×</button>

            <button className={numBtn} onClick={() => inputDigit("4")} data-testid="button-calc-4">4</button>
            <button className={numBtn} onClick={() => inputDigit("5")} data-testid="button-calc-5">5</button>
            <button className={numBtn} onClick={() => inputDigit("6")} data-testid="button-calc-6">6</button>
            <button className={opBtn} onClick={() => handleOperation("-")} data-testid="button-calc-subtract">-</button>

            <button className={numBtn} onClick={() => inputDigit("1")} data-testid="button-calc-1">1</button>
            <button className={numBtn} onClick={() => inputDigit("2")} data-testid="button-calc-2">2</button>
            <button className={numBtn} onClick={() => inputDigit("3")} data-testid="button-calc-3">3</button>
            <button className={opBtn} onClick={() => handleOperation("+")} data-testid="button-calc-add">+</button>

            <button className={`${numBtn} col-span-1`} onClick={() => inputDigit("0")} data-testid="button-calc-0">0</button>
            <button className={numBtn} onClick={inputDecimal} data-testid="button-calc-decimal">.</button>
            <button className={numBtn} onClick={handleBackspace} data-testid="button-calc-backspace">
              <Delete className="w-4 h-4" />
            </button>
            <button className={eqBtn} onClick={handleEquals} data-testid="button-calc-equals">=</button>
          </div>
        </div>
      </div>
    </div>
  );
}
