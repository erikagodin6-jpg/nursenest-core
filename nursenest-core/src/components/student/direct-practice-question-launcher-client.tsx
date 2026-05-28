"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart, PlayCircle } from "lucide-react";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";
import type { PracticeTestSelectionMode, StudyLaunchPayload } from "@/lib/practice-tests/types";
import { safeRouterReplace } from "@/lib/runtime/client-navigation";

type Props = {
  pathwayId: string;
  questionCount: number;
  selectionMode: Exclude<PracticeTestSelectionMode, "cat" | "targeted">;
  topicNames: string[];
  practiceHubIds: string[];
};

export function DirectPracticeQuestionLauncherClient({
  pathwayId,
  questionCount,
  selectionMode,
  topicNames,
  practiceHubIds,
}: Props) {
  const router = useRouter();
  const startedRef = useRef(false);
  const [status, setStatus] = useState<"starting" | "error">("starting");
  const [message, setMessage] = useState("Opening your RN practice questions…");

  const fallbackHref = useMemo(() => {
    const qs = new URLSearchParams();
    if (pathwayId) qs.set("pathwayId", pathwayId);
    qs.set("count", String(questionCount));
    if (selectionMode === "weak") qs.set("studyFilter", "weak");
    if (selectionMode === "missed") qs.set("studyFilter", "incorrect");
    if (selectionMode === "starred") qs.set("studyFilter", "bookmarked");
    if (selectionMode === "unseen") qs.set("studyFilter", "unseen");
    return `/app/practice-tests?${qs.toString()}`;
  }, [pathwayId, questionCount, selectionMode]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 28_000);

    async function start() {
      try {
        const trimmedPathwayId = pathwayId.trim();
        if (!trimmedPathwayId) {
          throw new Error("Missing RN pathway context. Return to the RN Hub and start Practice Questions again.");
        }

        const studyLaunchPayload: StudyLaunchPayload = {
          pathwayId: trimmedPathwayId,
          mode: "practice_exam",
          selectedCategories: practiceHubIds,
          filters: { hubFilter: selectionMode === "random" ? "all" : selectionMode },
          count: questionCount,
          shuffle: true,
        };

        const payload = {
          ...buildPracticeExamStartPayload({
            questionCount,
            selectionMode,
            topicNames,
            pathwayId: trimmedPathwayId,
            timedMode: false,
            timeLimitSec: null,
            difficultyMin: null,
            difficultyMax: null,
            sessionMode: "tutor",
            rationaleVisibilityMode: "immediate",
            linearAllowReviewNavigation: true,
          }),
          studyLaunchPayload,
        };

        const res = await fetch("/api/practice-tests", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            "x-nn-study-launch-surface": "practice_exams",
          },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
        if (!res.ok || !data.id) {
          throw new Error(data.error ?? "We could not start this practice session. Try again from the practice page.");
        }

        const destination = `/app/practice-tests/${encodeURIComponent(data.id)}?pathwayId=${encodeURIComponent(trimmedPathwayId)}`;
        safeRouterReplace(router, destination, {
          fallbackDelayMs: 900,
          hardFallbackDelayMs: 4000,
          context: {
            feature: "direct_practice_questions_launch",
            pathwayId: trimmedPathwayId,
            sessionId: data.id,
          },
        });
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof DOMException && error.name === "AbortError"
            ? "Starting timed out. Your account is safe; try again in a moment."
            : error instanceof Error
              ? error.message
              : "We could not start this practice session. Try again from the practice page.",
        );
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void start();
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [pathwayId, practiceHubIds, questionCount, router, selectionMode, topicNames]);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-7rem)] w-full max-w-3xl items-center justify-center px-4 py-8">
      <section className="w-full rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-6 text-center shadow-[0_24px_70px_color-mix(in_srgb,var(--semantic-brand)_10%,transparent)] sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
          {status === "starting" ? (
            <LineChart className="h-5 w-5 animate-pulse" aria-hidden />
          ) : (
            <PlayCircle className="h-5 w-5" aria-hidden />
          )}
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
          Practice Questions
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          {status === "starting" ? "Starting your session" : "Session did not start"}
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-sm leading-6 text-[var(--semantic-text-secondary)]">
          {message}
        </p>
        {status === "error" ? (
          <Link
            href={fallbackHref}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 text-sm font-semibold text-white transition hover:brightness-[1.03]"
          >
            Open Practice Questions
          </Link>
        ) : null}
      </section>
    </main>
  );
}
