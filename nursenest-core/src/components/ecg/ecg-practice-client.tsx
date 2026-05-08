"use client";

import { useMemo, useState } from "react";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

type Q = { id: string; prompt: string; options: string[]; answer: number; rhythm: "nsr" | "afib" | "vt" };

const BANK: Q[] = [
  {
    id: "q1",
    prompt: "Regular narrow QRS with upright P before each QRS — best label?",
    options: ["Normal sinus rhythm", "Atrial fibrillation", "Ventricular tachycardia"],
    answer: 0,
    rhythm: "nsr",
  },
  {
    id: "q2",
    prompt: "Irregularly irregular rhythm without organized P waves — best label?",
    options: ["Sinus tachycardia", "Atrial fibrillation", "Sinus bradycardia"],
    answer: 1,
    rhythm: "afib",
  },
  {
    id: "q3",
    prompt: "Wide-complex regular monomorphic tachycardia — first priority is:",
    options: ["Assume artifact", "Assess pulse and perfusion", "Ignore until rounds"],
    answer: 1,
    rhythm: "vt",
  },
];

export function EcgPracticeClient({ segmentLabel }: { segmentLabel: string }) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const q = BANK[idx]!;
  const correct = choice === q.answer;

  const progress = useMemo(() => `${idx + 1} / ${BANK.length}`, [idx]);

  return (
    <div className="space-y-4" data-nn-ecg-practice>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">
          Timed interpretation — {segmentLabel}
        </p>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">ECG practice</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">Progress: {progress}</p>
        <EcgEducationalDisclaimer />
      </header>

      <EcgRhythmStrip rhythmId={q.rhythm} />

      <fieldset className="space-y-2">
        <legend className="text-base font-semibold text-[var(--semantic-text-primary)]">{q.prompt}</legend>
        {q.options.map((opt, i) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] hover:border-[var(--semantic-info)]"
          >
            <input
              type="radio"
              name={q.id}
              checked={choice === i}
              onChange={() => setChoice(i)}
              className="h-4 w-4 accent-[var(--semantic-brand)]"
            />
            {opt}
          </label>
        ))}
      </fieldset>

      {choice !== null ? (
        <p
          className={`text-sm font-semibold ${
            correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-danger)]"
          }`}
        >
          {correct ? "Correct — keep linking morphology to action." : "Not quite — revisit rate, regularity, and QRS width."}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          disabled={choice === null}
          onClick={() => {
            setChoice(null);
            setIdx((v) => (v + 1) % BANK.length);
          }}
        >
          Next strip
        </button>
      </div>
    </div>
  );
}
