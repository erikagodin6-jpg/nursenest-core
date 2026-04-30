"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
  LearnerSessionStartPanel,
  LearnerStudyHero,
  LearnerStudyPageShell,
} from "@/components/learner-study-ui";
import { CANONICAL_STUDY_CATEGORIES, type CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import { recordStudyToolAttempt } from "@/lib/study-tools/study-tools-progress-persistence";
import type { StudyToolSessionItem, StudyToolSessionMode } from "@/lib/study-tools/study-tools-session-types";

const COUNTS = [8, 12, 20, 30] as const;

function modeApiValue(mode: StudyToolSessionMode): string {
  return mode;
}

function assertNeverStudyToolSessionItem(x: never): never {
  throw new Error(`Unexpected study tool session item: ${JSON.stringify(x)}`);
}

function itemKeyForProgress(item: StudyToolSessionItem): string {
  switch (item.kind) {
    case "medication_drills":
      return `st:${item.kind}:${item.sourceId}`;
    case "ordering":
      return `st:${item.kind}:${item.id}`;
    case "matching":
    case "fill_in_the_blank":
    case "lab_drills":
      return `st:${item.kind}:${item.sourceQuestionId}`;
    default:
      return assertNeverStudyToolSessionItem(item);
  }
}

function sourceQuestionId(item: StudyToolSessionItem): string | null {
  switch (item.kind) {
    case "medication_drills":
      return item.sourceId.startsWith("fc:") ? null : item.sourceId;
    case "ordering":
      return null;
    case "matching":
    case "fill_in_the_blank":
    case "lab_drills":
      return item.sourceQuestionId;
    default:
      return assertNeverStudyToolSessionItem(item);
  }
}

export function StudyToolsWorkspaceClient({
  userId,
  pathwayId,
  mode,
  heroTitle,
  heroSubtitle,
}: {
  userId: string;
  pathwayId: string | null;
  mode: StudyToolSessionMode;
  heroTitle: string;
  heroSubtitle?: string;
}) {
  const [countsBySystem, setCountsBySystem] = useState<Record<CanonicalStudyCategoryId, number> | null>(null);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [cardLimit, setCardLimit] = useState<number>(12);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(false);

  const [sessionPhase, setSessionPhase] = useState<"idle" | "loading" | "active" | "empty" | "error">("idle");
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [items, setItems] = useState<StudyToolSessionItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [lastOutcome, setLastOutcome] = useState<"correct" | "incorrect" | null>(null);

  const [fillInput, setFillInput] = useState("");
  const [labInput, setLabInput] = useState("");
  const [medInput, setMedInput] = useState("");
  const [orderPicks, setOrderPicks] = useState<string[]>([]);

  const loadInventory = useCallback(async () => {
    if (!pathwayId) return;
    setInventoryError(null);
    try {
      const res = await fetch(`/api/study-tools/inventory?pathwayId=${encodeURIComponent(pathwayId)}`, {
        credentials: "include",
      });
      const data = (await res.json()) as { ok?: boolean; countsByCanonical?: Record<string, number>; message?: string };
      if (!res.ok || !data.ok || !data.countsByCanonical) {
        setInventoryError(data.message ?? "Could not load category inventory.");
        return;
      }
      setCountsBySystem(data.countsByCanonical as Record<CanonicalStudyCategoryId, number>);
    } catch {
      setInventoryError("Could not load category inventory.");
    }
  }, [pathwayId]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const countsSafe = useMemo(() => {
    const base = Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((c) => [c.id, 0])) as Record<
      CanonicalStudyCategoryId,
      number
    >;
    if (!countsBySystem) return base;
    for (const c of CANONICAL_STUDY_CATEGORIES) {
      base[c.id] = countsBySystem[c.id] ?? 0;
    }
    return base;
  }, [countsBySystem]);

  const startSession = useCallback(async () => {
    if (!pathwayId) return;
    setSessionPhase("loading");
    setSessionError(null);
    setItems([]);
    setIdx(0);
    setLastOutcome(null);
    setFillInput("");
    setLabInput("");
    setMedInput("");
    setOrderPicks([]);

    const qs = new URLSearchParams();
    qs.set("pathwayId", pathwayId);
    qs.set("mode", modeApiValue(mode));
    qs.set("count", String(cardLimit));
    qs.set("shuffle", shuffleOn ? "1" : "0");
    if (weakOnly) qs.set("weakOnly", "1");
    const selected = selectedCanonicalIds.filter(Boolean) as CanonicalStudyCategoryId[];
    if (selected.length > 0 && selected.length < CANONICAL_STUDY_CATEGORIES.length) {
      qs.set("categories", selected.join(","));
    }

    try {
      const res = await fetch(`/api/study-tools/session?${qs.toString()}`, { credentials: "include" });
      const data = (await res.json()) as { ok?: boolean; items?: StudyToolSessionItem[]; message?: string };
      if (!res.ok || !data.ok || !Array.isArray(data.items)) {
        setSessionError(data.message ?? "Could not build a session.");
        setSessionPhase("error");
        return;
      }
      if (data.items.length === 0) {
        setSessionPhase("empty");
        return;
      }
      setItems(data.items);
      setSessionPhase("active");
    } catch {
      setSessionError("Could not build a session.");
      setSessionPhase("error");
    }
  }, [pathwayId, mode, cardLimit, shuffleOn, weakOnly, selectedCanonicalIds]);

  const current = items[idx];

  const advance = useCallback(
    (correct: boolean) => {
      if (!pathwayId || !current) return;
      const key = itemKeyForProgress(current);
      recordStudyToolAttempt({
        userId,
        itemKey: key,
        pathwayId,
        mode,
        correct,
        canonicalCategory: current.canonicalCategory,
        sourceQuestionId: sourceQuestionId(current),
      });
      setLastOutcome(correct ? "correct" : "incorrect");
      if (idx >= items.length - 1) {
        setSessionPhase("idle");
        setItems([]);
        setIdx(0);
        return;
      }
      setIdx((i) => i + 1);
      setFillInput("");
      setLabInput("");
      setMedInput("");
      setOrderPicks([]);
    },
    [current, idx, items.length, mode, pathwayId, userId],
  );

  const matchingChoices = useMemo(() => {
    if (!current || current.kind !== "matching") return [];
    const pool = shuffleSeeded(
      [current.answer, ...current.distractors],
      `${current.id}:choices:${idx}`,
    );
    return pool;
  }, [current, idx]);

  if (!pathwayId) {
    return (
      <LearnerStudyPageShell>
        <p className="text-sm text-muted-foreground">
          Add <code className="rounded bg-muted px-1 py-0.5 text-xs">?pathwayId=your-pathway-id</code> to the URL to
          scope this session to your exam track (same pattern as flashcards and practice).
        </p>
      </LearnerStudyPageShell>
    );
  }

  return (
    <LearnerStudyPageShell>
      <LearnerStudyHero title={heroTitle} subtitle={heroSubtitle ?? ""} />

      {inventoryError ? (
        <p className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-primary)]">
          {inventoryError}
        </p>
      ) : null}

      <LearnerCategorySelector
        countsBySystem={countsSafe}
        selectedCanonicalIds={selectedCanonicalIds}
        onToggleCanonical={(id) => {
          setSelectedCanonicalIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
        }}
        search={categorySearch}
        onSearchChange={setCategorySearch}
        heading="Categories (same as flashcards & practice)"
        intro="Pick body systems and cross-cutting topics. Leave none toggled off to study the full scoped bank."
      />

      <LearnerFilterBar title="Session options" description="Matches flashcards / practice query shape: pathway, categories, count, shuffle, weak-only.">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
          Weak items only (uses recent missed questions from graded practice tests)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} />
          Shuffle order
        </label>
        <div className="flex flex-wrap gap-2">
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={[
                "rounded-full border px-3 py-1 text-sm",
                cardLimit === n ? "border-primary bg-primary/10 font-semibold" : "border-border bg-background",
              ].join(" ")}
              onClick={() => setCardLimit(n)}
            >
              {n} items
            </button>
          ))}
        </div>
      </LearnerFilterBar>

      <LearnerSessionStartPanel
        primary={
          <button
            type="button"
            className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold disabled:opacity-50"
            disabled={sessionPhase === "loading" || !userId}
            onClick={() => void startSession()}
          >
            {sessionPhase === "loading" ? "Building session…" : "Start session"}
          </button>
        }
        footnote={
          sessionError ? (
            <span className="text-[color-mix(in_srgb,var(--semantic-danger)_85%,var(--semantic-text-primary))]">{sessionError}</span>
          ) : sessionPhase === "empty" ? (
            <span>No items matched — broaden categories or turn off weak-only.</span>
          ) : lastOutcome ? (
            <span>Last item: {lastOutcome}</span>
          ) : null
        }
      />

      {sessionPhase === "active" && current ? (
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6" data-nn-study-tool-active>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Item {idx + 1} / {items.length}
          </p>
          {(() => {
            switch (current.kind) {
              case "matching":
                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-base text-foreground">{current.prompt}</p>
                    <p className="text-sm text-muted-foreground">Tap the best match.</p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      {matchingChoices.map((choice) => (
                        <button
                          key={choice}
                          type="button"
                          className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-left text-sm font-medium hover:border-primary"
                          onClick={() => advance(choice.trim() === current.answer.trim())}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              case "fill_in_the_blank":
                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-base text-foreground whitespace-pre-wrap">{current.stemMasked}</p>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      value={fillInput}
                      onChange={(e) => setFillInput(e.target.value)}
                      placeholder="Type the missing term"
                    />
                    <button
                      type="button"
                      className="nn-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
                      onClick={() => {
                        const guess = fillInput.trim().toLowerCase();
                        const ok = current.acceptableAnswers.some((a) => a.trim().toLowerCase() === guess);
                        advance(ok);
                      }}
                    >
                      Check answer
                    </button>
                  </div>
                );
              case "lab_drills":
                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-base text-foreground whitespace-pre-wrap">{current.prompt}</p>
                    {current.rationaleHint ? (
                      <p className="text-xs text-muted-foreground">Hint: {current.rationaleHint}</p>
                    ) : null}
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      value={labInput}
                      onChange={(e) => setLabInput(e.target.value)}
                      placeholder="Enter expected value(s) — numeric when applicable"
                    />
                    <button
                      type="button"
                      className="nn-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
                      onClick={() => {
                        const g = labInput.trim().toLowerCase();
                        const ok = current.acceptableAnswers.some((a) => g.includes(a.toLowerCase()));
                        advance(ok);
                      }}
                    >
                      Check answer
                    </button>
                  </div>
                );
              case "medication_drills":
                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-base text-foreground whitespace-pre-wrap">{current.prompt}</p>
                    {current.hint ? <p className="text-xs text-muted-foreground">Topic: {current.hint}</p> : null}
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      placeholder="Key dose / class / monitoring answer"
                    />
                    <button
                      type="button"
                      className="nn-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
                      onClick={() => {
                        const g = medInput.trim().toLowerCase();
                        const ok = current.acceptableAnswers.some(
                          (a) => g.includes(a.toLowerCase()) || a.toLowerCase().includes(g),
                        );
                        advance(ok);
                      }}
                    >
                      Check answer
                    </button>
                  </div>
                );
              case "ordering":
                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-base font-semibold text-foreground">{current.title}</p>
                    <p className="text-sm text-muted-foreground">Tap steps in the correct order. Tap “Reset order” to retry.</p>
                    <div className="flex flex-wrap gap-2">
                      {shuffleSeeded([...current.steps], `${current.id}:scramble:${idx}`).map((step) => (
                        <button
                          key={step}
                          type="button"
                          disabled={orderPicks.includes(step)}
                          className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-sm disabled:opacity-30"
                          onClick={() => setOrderPicks((p) => [...p, step])}
                        >
                          {step}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Selected order: {orderPicks.join(" → ") || "—"}</p>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="text-sm underline" onClick={() => setOrderPicks([])}>
                        Reset order
                      </button>
                      <button
                        type="button"
                        className="nn-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
                        onClick={() => {
                          const ok =
                            orderPicks.length === current.steps.length &&
                            orderPicks.every((s, i) => s === current.steps[i]);
                          advance(ok);
                        }}
                      >
                        Lock in order
                      </button>
                    </div>
                  </div>
                );
              default:
                return assertNeverStudyToolSessionItem(current);
            }
          })()}
        </section>
      ) : null}
    </LearnerStudyPageShell>
  );
}
