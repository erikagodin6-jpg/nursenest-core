"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BASELINE_QUESTION_COUNT } from "@/lib/baseline/baseline-assessment";

type Q = {
  id: string;
  stem: string;
  questionType: string;
  options: unknown;
  topic: string | null;
  exam: string | null;
};

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x));
  return [];
}

export function BaselineAssessmentFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "ready" | "submitting" | "done" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<{
    correctCount: number;
    total: number;
    weakTopics: string[];
    weakTopicsDisplay: string[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/learner/baseline-assessment/questions");
        const data = (await res.json()) as {
          error?: string;
          attemptId?: string;
          questions?: Q[];
        };
        if (!res.ok) {
          if (!cancelled) {
            setError(data.error ?? "Could not start baseline.");
            setPhase("error");
          }
          return;
        }
        if (!cancelled && data.attemptId && data.questions?.length) {
          setAttemptId(data.attemptId);
          setQuestions(data.questions);
          setPhase("ready");
        }
      } catch {
        if (!cancelled) {
          setError("Network error.");
          setPhase("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = questions[idx];
  const total = questions.length;

  const isSata = useMemo(() => {
    if (!current) return false;
    const t = current.questionType.toUpperCase();
    return t === "SATA" || t === "SELECT_ALL_THAT_APPLY";
  }, [current]);

  const raw = current ? answers[current.id] : undefined;

  const onSubmitAll = useCallback(async () => {
    if (!attemptId || questions.length === 0) return;
    for (const q of questions) {
      if (!Object.prototype.hasOwnProperty.call(answers, q.id)) {
        setError("Answer every question before finishing.");
        return;
      }
    }
    setError(null);
    setPhase("submitting");
    try {
      const res = await fetch("/api/learner/baseline-assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });
      const data = (await res.json()) as {
        error?: string;
        correctCount?: number;
        total?: number;
        weakTopics?: string[];
        weakTopicsDisplay?: string[];
      };
      if (!res.ok) {
        setError(data.error ?? "Could not save results.");
        setPhase("ready");
        return;
      }
      const weakTopics = data.weakTopics ?? [];
      const weakTopicsDisplay =
        data.weakTopicsDisplay?.length === weakTopics.length && data.weakTopicsDisplay?.length
          ? data.weakTopicsDisplay
          : weakTopics;
      setResult({
        correctCount: data.correctCount ?? 0,
        total: data.total ?? questions.length,
        weakTopics,
        weakTopicsDisplay,
      });
      setPhase("done");
      router.refresh();
    } catch {
      setError("Could not save results.");
      setPhase("ready");
    }
  }, [attemptId, answers, questions, router]);

  if (phase === "loading") {
    return <p className="text-sm text-muted">Preparing your baseline…</p>;
  }

  if (phase === "error" && !current) {
    return (
      <div className="nn-card space-y-3 p-6">
        <p className="text-sm text-muted">{error ?? "Something went wrong."}</p>
        <Link href="/app" className="inline-block text-sm font-semibold text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (phase === "done" && result) {
    const pct =
      result.total > 0 ? Math.round((result.correctCount / result.total) * 100) : 0;
    const firstWeakTopic =
      result.weakTopicsDisplay[0] ?? result.weakTopics[0] ?? "";
    const qbankHref =
      firstWeakTopic.length > 0
        ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(firstWeakTopic)}`
        : "/app/questions?preset=topic_drill";

    return (
      <div className="nn-card space-y-5 p-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Your baseline snapshot</h2>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">
            You answered <strong>{result.correctCount}</strong> of <strong>{result.total}</strong> questions correctly (
            <strong>{pct}%</strong>). This is a quick orientation check, not a pass/fail exam.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-[var(--theme-body-text)]">
          <p className="font-medium text-[var(--theme-heading-text)]">What this means</p>
          <p className="mt-2 leading-relaxed">
            Your answers update topic practice signals in NurseNest. Topics you missed here are highlighted so drills and
            reviews can target real gaps. This is a starting point and will refine as you practice more.
          </p>
        </div>

        {result.weakTopics.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-[var(--theme-heading-text)]">Topics to focus on first</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted">
              {result.weakTopicsDisplay.slice(0, 8).map((label, i) => (
                <li key={result.weakTopics[i] ?? label}>{label}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">
            No single topic stood out from missed items this time. Your pathway mix still guides what you see next.
          </p>
        )}

        <div>
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">Recommended next steps</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/app/lessons" className="font-medium text-primary hover:underline">
                Review lessons
              </Link>
              <span className="text-muted"> Align with your exam blueprint.</span>
            </li>
            <li>
              <Link href={qbankHref} className="font-medium text-primary hover:underline">
                Question bank (topic drill)
              </Link>
              <span className="text-muted">
                {firstWeakTopic
                  ? ` Start with “${firstWeakTopic}” or pick another topic in the menu.`
                  : " Pick a topic from the menu to drill recent items."}
              </span>
            </li>
            <li>
              <Link href="/app/flashcards/weak-areas" className="font-medium text-primary hover:underline">
                Weak-area flashcards
              </Link>
              <span className="text-muted"> Short bursts on high-yield facts.</span>
            </li>
          </ul>
        </div>

        <Link
          href="/app"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
        >
          Continue to dashboard
        </Link>
      </div>
    );
  }

  if (!current) return null;

  const opts = parseOptions(current.options);
  const progress = `${idx + 1} / ${total}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Baseline assessment · {progress} · ~{BASELINE_QUESTION_COUNT} items
        </p>
        <Link href="/app" className="text-sm font-medium text-primary hover:underline">
          Exit to dashboard
        </Link>
      </div>

      <div className="nn-card space-y-4 p-6">
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {current.topic ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{current.topic}</span> : null}
          <span className="uppercase">{current.questionType}</span>
        </div>
        <p className="text-base font-medium leading-relaxed">{current.stem}</p>

        {isSata ? (
          <ul className="space-y-2">
            {opts.map((label) => {
              const selected = Array.isArray(raw) ? raw.includes(label) : false;
              return (
                <li key={label}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const prev = Array.isArray(raw) ? [...raw] : [];
                        const next = e.target.checked ? [...prev, label] : prev.filter((x) => x !== label);
                        setAnswers((a) => ({ ...a, [current.id]: next }));
                      }}
                      className="mt-1"
                    />
                    <span>{label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-2">
            {opts.map((label) => (
              <li key={label}>
                <label className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={raw === label}
                    onChange={() => setAnswers((a) => ({ ...a, [current.id]: label }))}
                    className="mt-1"
                  />
                  <span>{label}</span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={idx === 0}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            Back
          </button>
          {idx < total - 1 ? (
            <button
              type="button"
              className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
              onClick={() => setIdx((i) => i + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={phase === "submitting"}
              className="rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground disabled:opacity-60"
              onClick={() => void onSubmitAll()}
            >
              {phase === "submitting" ? "Saving…" : "Finish and save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
