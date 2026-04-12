"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Lock,
  Target,
} from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type Step = "loading" | "intro" | "quiz" | "scoring" | "results";

type QuizQuestion = {
  id: string;
  stem: string;
  questionType: string;
  options: { key: string; text: string }[];
  topic: string | null;
};

type SubmitResult = {
  correctCount: number;
  total: number;
  weakTopics: string[];
  weakTopicsDisplay: string[];
};

type QuestionWithAnswer = QuizQuestion & {
  userAnswer: string | string[];
  isCorrect: boolean;
};

export function QuickStartFlowClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attemptId, setAttemptId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [reviewItems, setReviewItems] = useState<QuestionWithAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const trackedStart = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/learner/baseline-assessment/questions");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data?.code === "baseline_unavailable") {
            router.replace("/app");
            return;
          }
          setError("Unable to load questions. Please try again.");
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        const qs: QuizQuestion[] = (data.questions ?? []).map(
          (q: Record<string, unknown>) => ({
            id: q.id as string,
            stem: (q.stem as string) ?? "",
            questionType: (q.questionType as string) ?? "MCQ",
            options: Array.isArray(q.options)
              ? (q.options as { key: string; text: string }[])
              : [],
            topic: (q.topic as string) ?? null,
          }),
        );

        setQuestions(qs);
        setAttemptId(data.attemptId ?? "");
        setStep("intro");
      } catch {
        if (!cancelled) setError("Unable to load questions. Please try again.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const startQuiz = useCallback(() => {
    setStep("quiz");
    if (!trackedStart.current) {
      trackedStart.current = true;
      trackClientEvent("quickstart_quiz_started", {
        question_count: questions.length,
      });
    }
  }, [questions.length]);

  const selectAndAdvance = useCallback(
    (questionId: string, answer: string) => {
      if (animating) return;
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));

      const isLast = currentIndex === questions.length - 1;
      if (!isLast) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setAnimating(false);
        }, 350);
      }
    },
    [animating, currentIndex, questions.length],
  );

  const submitQuiz = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setStep("scoring");
    try {
      const res = await fetch("/api/learner/baseline-assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });

      if (!res.ok) {
        setError("Unable to submit. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = (await res.json()) as SubmitResult & { ok: boolean };
      setResult(data);

      const items: QuestionWithAnswer[] = questions.map((q) => ({
        ...q,
        userAnswer: answers[q.id] ?? "",
        isCorrect: false,
      }));

      let correctIdx = 0;
      for (const item of items) {
        if (correctIdx < data.correctCount) {
          const isInWeak =
            item.topic &&
            data.weakTopics.some(
              (w) => w.toLowerCase() === item.topic!.toLowerCase(),
            );
          if (!isInWeak) {
            item.isCorrect = true;
            correctIdx++;
          }
        }
      }

      setReviewItems(items.filter((i) => !i.isCorrect).slice(0, 3));

      setTimeout(() => {
        setStep("results");
      }, 800);

      trackClientEvent("quickstart_quiz_completed", {
        correct: data.correctCount,
        total: data.total,
        weak_topics: data.weakTopics.join(", "),
      });
    } catch {
      setError("Unable to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [submitting, attemptId, answers, questions]);

  if (error) {
    return (
      <div className="nn-qs">
        <div className="nn-qs__center">
          <p className="text-sm text-[var(--semantic-danger)]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="nn-qs__btn mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="nn-qs">
        <div className="nn-qs__center">
          <div className="nn-qs__spinner" />
        </div>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="nn-qs nn-qs--fade-in">
        <div className="nn-qs__intro">
          <div className="nn-qs__intro-icon">
            <ClipboardList className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="nn-qs__intro-title">Quick Start Assessment</h1>
          <p className="nn-qs__intro-desc">
            Answer {questions.length} questions so we can identify your strengths,
            find your weak areas, and build a study plan for you.
          </p>
          <div className="nn-qs__intro-meta">
            <span>{questions.length} questions</span>
            <span aria-hidden>·</span>
            <span>About 5 minutes</span>
          </div>
          <button type="button" onClick={startQuiz} className="nn-qs__btn">
            Start Assessment
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (step === "scoring") {
    return (
      <div className="nn-qs">
        <div className="nn-qs__center">
          <div className="nn-qs__spinner" />
          <p className="mt-4 text-sm font-medium text-[var(--semantic-text-secondary)]">
            Analyzing your results...
          </p>
        </div>
      </div>
    );
  }

  if (step === "quiz") {
    const q = questions[currentIndex];
    if (!q) return null;
    const selected = answers[q.id];
    const isLast = currentIndex === questions.length - 1;
    const progress = ((currentIndex + (selected ? 1 : 0)) / questions.length) * 100;

    return (
      <div className="nn-qs">
        {/* Progress strip */}
        <div className="nn-qs__topbar">
          <div className="nn-qs__progress-bar">
            <div
              className="nn-qs__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="nn-qs__progress-count">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Question */}
        <div
          key={q.id}
          className={`nn-qs__card ${animating ? "nn-qs__card--exit" : "nn-qs__card--enter"}`}
        >
          {q.topic ? (
            <span className="nn-qs__topic-tag">{q.topic}</span>
          ) : null}
          <p className="nn-qs__stem">{q.stem}</p>

          <div className="nn-qs__options">
            {q.options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                disabled={animating}
                onClick={() => selectAndAdvance(q.id, opt.key)}
                className={`nn-qs__option ${
                  selected === opt.key ? "nn-qs__option--selected" : ""
                }`}
              >
                <span className="nn-qs__option-key">{opt.key}</span>
                <span className="nn-qs__option-text">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit on last question */}
        {isLast && selected ? (
          <div className="nn-qs__nav nn-qs--fade-in">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitQuiz()}
              className="nn-qs__btn nn-qs__btn--wide"
            >
              {submitting ? "Submitting..." : "See My Results"}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────────────
  if (!result) return null;
  const pct = Math.round((result.correctCount / result.total) * 100);
  const strengthMsg =
    pct >= 70
      ? "You have a solid foundation to build on."
      : pct >= 50
        ? "You have some strong areas, with room to grow."
        : "A focused study plan will help you improve quickly.";

  return (
    <div className="nn-qs nn-qs--fade-in">
      {/* Score hero */}
      <section className="nn-qs__hero">
        <p className="nn-qs__hero-kicker">Your Results</p>
        <div className="nn-qs__hero-score-row">
          <span className="nn-qs__hero-score">{pct}%</span>
          <div className="nn-qs__hero-detail">
            <span className="nn-qs__hero-correct">
              {result.correctCount} of {result.total} correct
            </span>
            <p className="nn-qs__hero-msg">{strengthMsg}</p>
          </div>
        </div>
      </section>

      {/* Weak areas */}
      {result.weakTopicsDisplay.length > 0 ? (
        <section className="nn-qs__section nn-qs--stagger-1">
          <div className="nn-qs__section-header">
            <Target className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden />
            <h3 className="nn-qs__section-title">Your Weak Areas</h3>
          </div>
          <div className="nn-qs__weak-list">
            {result.weakTopicsDisplay.slice(0, 3).map((topic) => (
              <div key={topic} className="nn-qs__weak-chip">{topic}</div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Review preview */}
      {reviewItems.length > 0 ? (
        <section className="nn-qs__section nn-qs--stagger-2">
          <div className="nn-qs__section-header">
            <ClipboardList className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
            <h3 className="nn-qs__section-title">Questions to Review</h3>
          </div>
          {reviewItems.map((item) => (
            <p key={item.id} className="nn-qs__review-line">
              {item.stem.length > 100 ? item.stem.slice(0, 100) + "..." : item.stem}
            </p>
          ))}
          <p className="nn-qs__review-lock">
            <Lock className="h-3 w-3" aria-hidden />
            Full explanations available with a subscription.
          </p>
        </section>
      ) : null}

      {/* Value + Paywall (merged) */}
      <section className="nn-qs__cta-card nn-qs--stagger-3">
        <h3 className="nn-qs__cta-title">Your Study Plan Is Ready</h3>
        <ul className="nn-qs__cta-perks">
          <li>
            <BookOpen className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
            <span>Guided lessons on your weakest topics</span>
          </li>
          <li>
            <ClipboardList className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
            <span>Detailed explanations for every mistake</span>
          </li>
          <li>
            <CheckCircle2 className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
            <span>A personalized plan built for your exam</span>
          </li>
        </ul>
        <Link
          href="/pricing"
          className="nn-qs__btn nn-qs__btn--wide"
          onClick={() =>
            trackClientEvent("quickstart_trial_cta_clicked", { score_pct: pct })
          }
        >
          Start Free Trial
          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/app"
          className="nn-qs__link-secondary"
          onClick={() =>
            trackClientEvent("quickstart_continue_limited_clicked", { score_pct: pct })
          }
        >
          Continue with limited access
        </Link>
      </section>
    </div>
  );
}
