"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  inferStageQuestionFormat,
  type ParsedBranchingOption,
  type StageQuestionFormat,
} from "@/lib/clinical-scenarios/branching-scenario-engine";
import { cn } from "@/lib/utils";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function ClinicalScenarioQuestionPanel({
  questionStem,
  focus,
  options,
  pending,
  onSelectPending,
  onCommit,
}: {
  questionStem: string;
  focus: string;
  options: ParsedBranchingOption[];
  pending: ParsedBranchingOption | null;
  onSelectPending: (opt: ParsedBranchingOption | null) => void;
  onCommit: () => void;
}) {
  const format = useMemo(() => inferStageQuestionFormat(options), [options]);

  if (format === "sata") {
    return (
      <SataPanel
        questionStem={questionStem}
        focus={focus}
        options={options}
        onCommit={(synthetic) => {
          onSelectPending(synthetic);
          onCommit();
        }}
      />
    );
  }

  if (format === "ranking" || format === "sequencing") {
    return (
      <OrderPanel
        format={format}
        questionStem={questionStem}
        focus={focus}
        options={options}
        onCommit={(synthetic) => {
          onSelectPending(synthetic);
          onCommit();
        }}
      />
    );
  }

  return (
    <McqPanel
      questionStem={questionStem}
      focus={focus}
      options={options}
      pending={pending}
      onSelectPending={onSelectPending}
      onCommit={onCommit}
    />
  );
}

function McqPanel({
  questionStem,
  focus,
  options,
  pending,
  onSelectPending,
  onCommit,
}: {
  questionStem: string;
  focus: string;
  options: ParsedBranchingOption[];
  pending: ParsedBranchingOption | null;
  onSelectPending: (opt: ParsedBranchingOption | null) => void;
  onCommit: () => void;
}) {
  return (
    <section className="nn-clinical-scenarios-judgment">
      <h3 className="nn-clinical-scenarios-judgment__title">Clinical judgment check</h3>
      <p className="nn-clinical-scenarios-judgment__stem">{questionStem}</p>
      <p className="nn-clinical-scenarios-judgment__focus">Focus: {focus}</p>
      <div className="nn-clinical-scenarios-judgment__options">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={cn(
              "nn-clinical-scenarios-judgment__option",
              pending?.id === o.id && "nn-clinical-scenarios-judgment__option--active",
            )}
            onClick={() => onSelectPending(o)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {pending ? (
        <div className="nn-clinical-scenarios-judgment__commit">
          <p className="text-sm text-[var(--semantic-text-secondary)]">{pending.rationale}</p>
          <button type="button" className="nn-clinical-scenarios-judgment__commit-btn" onClick={onCommit}>
            Commit & continue — patient responds
          </button>
        </div>
      ) : null}
    </section>
  );
}

function SataPanel({
  questionStem,
  focus,
  options,
  onCommit,
}: {
  questionStem: string;
  focus: string;
  options: ParsedBranchingOption[];
  onCommit: (synthetic: ParsedBranchingOption) => void;
}) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const correctIds = new Set(options.filter((o) => o.isCorrect).map((o) => o.id));

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const submit = () => {
    const allCorrect =
      picked.size === correctIds.size && [...correctIds].every((id) => picked.has(id));
    const best = options.find((o) => o.isCorrect) ?? options[0]!;
    onCommit({
      ...best,
      isCorrect: allCorrect,
      label: `SATA: ${[...picked].join(", ")}`,
      rationale: allCorrect
        ? "You selected all appropriate interventions."
        : "Not all required actions were selected — the patient may destabilize.",
      trajectory: allCorrect ? "improves" : "deteriorates",
      effect: allCorrect ? "unlock" : "delay",
    });
  };

  return (
    <section className="nn-clinical-scenarios-judgment">
      <h3 className="nn-clinical-scenarios-judgment__title">Select all that apply</h3>
      <p className="nn-clinical-scenarios-judgment__stem">{questionStem}</p>
      <p className="nn-clinical-scenarios-judgment__focus">Focus: {focus}</p>
      <div className="nn-clinical-scenarios-judgment__options">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={cn(
              "nn-clinical-scenarios-judgment__option",
              picked.has(o.id) && "nn-clinical-scenarios-judgment__option--active",
            )}
            onClick={() => toggle(o.id)}
            aria-pressed={picked.has(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button type="button" className="nn-clinical-scenarios-judgment__commit-btn" onClick={submit}>
        Apply interventions — see patient response
      </button>
    </section>
  );
}

function OrderPanel({
  format,
  questionStem,
  focus,
  options,
  onCommit,
}: {
  format: "ranking" | "sequencing";
  questionStem: string;
  focus: string;
  options: ParsedBranchingOption[];
  onCommit: (synthetic: ParsedBranchingOption) => void;
}) {
  const [order, setOrder] = useState(() => shuffle(options));

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to]!, next[from]!];
    setOrder(next);
  };

  const submit = () => {
    const key = format === "ranking" ? "rankOrder" : "sequenceOrder";
    const correct = order.every((o, idx) => {
      const expected = o[key];
      return expected == null || expected === idx + 1;
    });
    const best = options.find((o) => o.isCorrect) ?? options[0]!;
    onCommit({
      ...best,
      isCorrect: correct,
      label: order.map((o) => o.label).join(" → "),
      rationale: correct
        ? "Prioritization matched the safest clinical sequence."
        : "Sequence did not match safest practice — reassess ABCs and escalation.",
      trajectory: correct ? "improves" : "deteriorates",
      effect: correct ? "unlock" : "limit",
    });
  };

  return (
    <section className="nn-clinical-scenarios-judgment">
      <h3 className="nn-clinical-scenarios-judgment__title">
        {format === "ranking" ? "Prioritization ranking" : "Ordered response"}
      </h3>
      <p className="nn-clinical-scenarios-judgment__stem">{questionStem}</p>
      <p className="nn-clinical-scenarios-judgment__focus">Focus: {focus}</p>
      <ol className="mt-3 space-y-2">
        {order.map((o, i) => (
          <li key={o.id} className="flex items-center gap-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-xs font-bold">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 font-medium text-[var(--semantic-text-primary)]">{o.label}</span>
            <button type="button" className="nn-clinical-scenarios-sequencing__arrow" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" className="nn-clinical-scenarios-sequencing__arrow" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Move down">
              <ArrowDown className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="nn-clinical-scenarios-judgment__commit-btn mt-4" onClick={submit}>
        Commit sequence — patient responds
      </button>
    </section>
  );
}
