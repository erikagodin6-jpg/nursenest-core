"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useId, useState } from "react";
import type { NormalizedBowtiePayload, BowtieSlotKey } from "@/lib/questions/bowtie-adapter";
import { BOWTIE_SLOT_KEYS, coerceBowtieDraftAnswer } from "@/lib/questions/bowtie-adapter";

export type BowtieRevealState = {
  /** Correct option ids per slot (same order as {@link BOWTIE_SLOT_KEYS}). */
  correctIds: [string, string, string];
};

type Props = {
  payload: NormalizedBowtiePayload;
  value: unknown;
  onChange: (next: { type: "bowtie"; mapping: Record<BowtieSlotKey, string> }) => void;
  /** When false, parent already rendered the vignette (e.g. question stem card). */
  showScenarioBanner?: boolean;
  disabled?: boolean;
  /** After grading — highlight per-slot correctness; requires labels from bank for SR. */
  reveal?: {
    correct: BowtieRevealState;
    selectedIds: Record<BowtieSlotKey, string>;
  } | null;
};

function labelForId(bank: NormalizedBowtiePayload["bank"], id: string): string {
  const hit = bank.find((b) => b.id === id);
  return hit?.label ?? id;
}

function slotSurface(
  slot: BowtieSlotKey,
  reveal: Props["reveal"],
  selectedId: string | undefined,
): string {
  if (!reveal) {
    return "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))]";
  }
  const sel = selectedId ?? "";
  const ok = reveal.correct.correctIds[BOWTIE_SLOT_KEYS.indexOf(slot)] === sel;
  return ok
    ? "border-[color-mix(in_srgb,var(--semantic-success)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))]"
    : "border-[color-mix(in_srgb,var(--semantic-danger)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))]";
}

/**
 * NGN Bowtie — tap-to-assign slots + option bank. Theme tokens only; keyboard-friendly.
 */
export function BowtieQuestionRenderer({
  payload,
  value,
  onChange,
  showScenarioBanner = true,
  disabled = false,
  reveal,
}: Props) {
  const baseId = useId();
  const mapping = coerceBowtieDraftAnswer(value);

  const [focusedSlot, setFocusedSlot] = useState<BowtieSlotKey | null>("condition");

  const assign = useCallback(
    (slot: BowtieSlotKey, optId: string) => {
      const next: Record<BowtieSlotKey, string> = { ...mapping, [slot]: optId };
      for (const k of BOWTIE_SLOT_KEYS) {
        if (k !== slot && next[k] === optId) next[k] = "";
      }
      onChange({ type: "bowtie", mapping: next });
    },
    [mapping, onChange],
  );

  const clearSlot = useCallback(
    (slot: BowtieSlotKey) => {
      const next = { ...mapping, [slot]: "" };
      onChange({ type: "bowtie", mapping: next });
    },
    [mapping, onChange],
  );

  const onKeyBank = useCallback(
    (e: KeyboardEvent, slot: BowtieSlotKey, optId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) assign(slot, optId);
      }
    },
    [assign, disabled],
  );

  const scenarioBlock = (
    <div
      className="mx-auto max-w-3xl rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--semantic-surface))] px-4 py-5 text-center shadow-[var(--semantic-shadow-soft)] sm:px-8"
      role="region"
      aria-label="Clinical scenario"
    >
      <p className="m-0 font-sans text-base leading-relaxed text-[var(--semantic-text-primary)]">{payload.scenario}</p>
    </div>
  );

  const connectors = (
    <div
      className="pointer-events-none hidden h-px w-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))] lg:col-span-3 lg:block"
      aria-hidden
    />
  );

  return (
    <div className="bowtie-ngn bowtie-ngn--premium font-sans" data-nn-qa-exam-format="bowtie">
      <div className="flex flex-col gap-6 lg:gap-8">
        {showScenarioBanner ? <div className="order-1">{scenarioBlock}</div> : null}

        {/* Slots: mobile stack → desktop 3-column */}
        <div className="order-2 grid gap-4 lg:grid-cols-3 lg:gap-3">
          {BOWTIE_SLOT_KEYS.map((slot) => {
            const sid = `${baseId}-slot-${slot}`;
            const selected = mapping[slot] || "";
            const focus = focusedSlot === slot;
            const chipLabel = selected ? labelForId(payload.bank, selected) : null;
            return (
              <div key={slot} className="flex min-h-[8rem] flex-col gap-2">
                <h3 className="m-0 text-center text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {payload.slotLabels[slot]}
                </h3>
                <button
                  type="button"
                  id={sid}
                  disabled={disabled}
                  aria-pressed={focus}
                  aria-label={`${payload.slotLabels[slot]} slot${selected ? `: ${chipLabel}` : ", empty"}`}
                  onClick={() => setFocusedSlot(slot)}
                  className={`flex min-h-[6.5rem] flex-1 flex-col justify-center rounded-xl border-2 px-3 py-3 text-left transition ${slotSurface(slot, reveal ?? null, selected)} ${
                    focus && !disabled ? "ring-2 ring-[color-mix(in_srgb,var(--semantic-brand)_55%,transparent)] ring-offset-2 ring-offset-[var(--semantic-surface)]" : ""
                  }`}
                >
                  {selected ? (
                    <span className="text-sm font-medium leading-snug text-[var(--semantic-text-primary)]">{chipLabel}</span>
                  ) : (
                    <span className="text-sm text-[var(--semantic-text-muted)]">Tap an option below, or focus this slot first.</span>
                  )}
                  {selected && !disabled ? (
                    <span className="mt-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--semantic-info)] underline-offset-2 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSlot(slot);
                        }}
                      >
                        Remove
                      </button>
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>

        {connectors}

        {/* Option bank */}
        <div className="order-3">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Option bank
          </p>
          <div
            role="listbox"
            aria-label="Answer options"
            className="flex flex-wrap justify-center gap-2 sm:justify-start"
          >
            {payload.bank.map((item) => {
              const targetSlot = focusedSlot ?? "condition";
              const placed =
                mapping.condition === item.id || mapping.intervention === item.id || mapping.monitoring === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={placed}
                  disabled={disabled}
                  title={`Assign to ${payload.slotLabels[targetSlot]}`}
                  onClick={() => {
                    if (disabled) return;
                    assign(targetSlot, item.id);
                  }}
                  onKeyDown={(e) => onKeyBank(e, targetSlot, item.id)}
                  className={`max-w-[100%] rounded-full border px-3 py-2 text-left text-sm leading-snug transition sm:max-w-[20rem] ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_8%,var(--semantic-surface))] text-[var(--semantic-text-primary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
                  }`}
                >
                  <span className="font-medium text-[var(--semantic-text-secondary)]">{item.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-[var(--semantic-text-muted)] lg:text-left">
            Focus a slot above, then tap an option. Only one use per option unless you remove it first.
          </p>
        </div>
      </div>
    </div>
  );
}
