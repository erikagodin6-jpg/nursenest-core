"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Circle, CircleCheck, Lock } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonQuizLegacyFlow } from "@/components/lessons/pathway-lesson-quiz-legacy-flow";
import { itemsResetKey } from "@/components/lessons/pathway-lesson-quiz-set";
import { Progress } from "@/components/ui/progress";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

const storageKey = (kind: "hidePre" | "hidePost" | "preDone" | "postDone", pathwayId: string, lessonSlug: string) =>
  `nn.pathwayLesson.${kind}.${pathwayId}.${lessonSlug}`;

function readBool(key: string): boolean | null {
  try {
    const v = sessionStorage.getItem(key);
    if (v === "1") return true;
    if (v === "0") return false;
    return null;
  } catch {
    return null;
  }
}

function writeBool(key: string, value: boolean) {
  try {
    sessionStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function progressPercent(args: {
  hasPre: boolean;
  hasPost: boolean;
  preDone: boolean;
  postDone: boolean;
  lessonProgress: PathwayLessonProgressStatus;
}): { value: number; label: string } {
  const { hasPre, hasPost, preDone, postDone, lessonProgress } = args;
  const lessonDone = lessonProgress === "completed";

  if (hasPre && hasPost) {
    if (!preDone) return { value: 0, label: "0%" };
    if (!postDone) return { value: 50, label: "50%" };
    return { value: 100, label: "100%" };
  }
  if (hasPre && !hasPost) {
    return preDone ? { value: 100, label: "100%" } : { value: 0, label: "0%" };
  }
  if (!hasPre && hasPost) {
    if (!lessonDone) return { value: 0, label: "0%" };
    if (!postDone) return { value: 50, label: "50%" };
    return { value: 100, label: "100%" };
  }
  return { value: 0, label: "0%" };
}

type FlowStep = {
  key: string;
  label: string;
  state: "done" | "current" | "upcoming" | "locked";
};

/**
 * Linear study flow: readiness check → lesson reading → reinforcement.
 * Replaces tabbed pre/content/post with one scrollable sequence (premium assessment modules).
 */
export function PathwayLessonLegacyStudyShell({
  pathwayId,
  lessonSlug,
  initialProgress,
  preTest,
  postTest,
  fullAccess,
  postTestReady,
  sectionAnchors,
  children,
}: {
  pathwayId: string;
  lessonSlug: string;
  initialProgress: PathwayLessonProgressStatus;
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  fullAccess: boolean;
  /** Post-test quiz unlocked (lesson marked complete / flow satisfied). */
  postTestReady: boolean;
  sectionAnchors?: readonly { id: string; label: string }[];
  children: ReactNode;
}) {
  const hasPre = Boolean(preTest?.length);
  const hasPost = Boolean(postTest?.length);

  const [hidePre, setHidePre] = useState(false);
  const [hidePost, setHidePost] = useState(false);
  const [preDone, setPreDone] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<PathwayLessonProgressStatus>(initialProgress);

  useEffect(() => {
    setLessonProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    const hp = localStorage.getItem(storageKey("hidePre", pathwayId, lessonSlug)) === "true";
    const hs = localStorage.getItem(storageKey("hidePost", pathwayId, lessonSlug)) === "true";
    setHidePre(hp);
    setHidePost(hs);
    const pd = readBool(storageKey("preDone", pathwayId, lessonSlug));
    const po = readBool(storageKey("postDone", pathwayId, lessonSlug));
    if (pd !== null) setPreDone(pd);
    if (po !== null) setPostDone(po);
  }, [pathwayId, lessonSlug]);

  const onPreFinished = useCallback(() => {
    setPreDone(true);
    writeBool(storageKey("preDone", pathwayId, lessonSlug), true);
  }, [pathwayId, lessonSlug]);

  const onPostFinished = useCallback(() => {
    setPostDone(true);
    writeBool(storageKey("postDone", pathwayId, lessonSlug), true);
  }, [pathwayId, lessonSlug]);

  const showPreTab = hasPre && !hidePre;
  const showPostTab = hasPost && !hidePost;

  const { value: progressValue, label: progressLabel } = useMemo(
    () =>
      progressPercent({
        hasPre,
        hasPost,
        preDone,
        postDone,
        lessonProgress,
      }),
    [hasPre, hasPost, preDone, postDone, lessonProgress],
  );

  const lessonDone = lessonProgress === "completed";

  const steps: FlowStep[] = useMemo(() => {
    const readinessComplete = !showPreTab || preDone;
    const studyComplete = lessonDone;

    const out: FlowStep[] = [];
    if (showPreTab) {
      out.push({
        key: "pre",
        label: "Readiness",
        state: preDone ? "done" : "current",
      });
    }
    out.push({
      key: "read",
      label: "Study",
      state: !readinessComplete ? "upcoming" : studyComplete ? "done" : "current",
    });
    if (showPostTab) {
      let postState: FlowStep["state"] = "upcoming";
      if (!postTestReady) postState = "locked";
      else if (postDone) postState = "done";
      else if (lessonDone) postState = "current";
      out.push({
        key: "post",
        label: "Reinforce",
        state: postState,
      });
    }
    return out;
  }, [showPreTab, showPostTab, preDone, postDone, postTestReady, lessonDone]);

  const preCount = preTest?.length ?? 0;
  const postCount = postTest?.length ?? 0;

  return (
    <div className="nn-lesson-study-flow space-y-5">
      <section
        className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-info)_8%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_96%,var(--semantic-panel-cool)_4%)] px-3 py-3 sm:px-4 sm:py-3.5"
        aria-label="Lesson study flow"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)] sm:text-xs">
            {steps.map((s, i) => (
              <li key={s.key} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="mx-0.5 h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden /> : null}
                <span className="inline-flex items-center gap-1.5">
                  {s.state === "done" ? (
                    <CircleCheck className="h-3.5 w-3.5 text-[var(--semantic-success)]" aria-hidden />
                  ) : s.state === "locked" ? (
                    <Lock className="h-3.5 w-3.5 text-[var(--theme-muted-text)]" aria-hidden />
                  ) : s.state === "current" ? (
                    <Circle className="h-3.5 w-3.5 fill-[var(--semantic-brand)] text-[var(--semantic-brand)]" aria-hidden />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-[var(--semantic-border-soft)]" aria-hidden />
                  )}
                  <span
                    className={
                      s.state === "current"
                        ? "text-[var(--theme-heading-text)]"
                        : s.state === "done"
                          ? "text-[var(--theme-body-text)]"
                          : "text-[var(--theme-muted-text)]"
                    }
                  >
                    {s.label}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
            <span className="text-xs tabular-nums text-[var(--theme-heading-text)] sm:text-sm">{progressLabel}</span>
            <Progress value={progressValue} variant="accent" className="h-1.5 w-full min-w-[6rem] sm:w-32" />
          </div>
        </div>
      </section>

      {(hasPre || hasPost) && (
        <details
          className="group rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--bg-card)_98%,var(--semantic-panel-muted)_2%)] px-3 py-2 text-sm"
          data-testid="lesson-test-visibility-toggles"
        >
          <summary className="cursor-pointer select-none font-medium text-[var(--theme-heading-text)] outline-none marker:text-[var(--theme-muted-text)] group-open:mb-2">
            Lesson test visibility
          </summary>
          <div className="flex flex-col gap-2 pt-1 text-xs text-[var(--theme-muted-text)] sm:flex-row sm:flex-wrap sm:gap-4">
            {hasPre ? (
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={!hidePre}
                  onChange={(e) => {
                    const hide = !e.target.checked;
                    setHidePre(hide);
                    localStorage.setItem(storageKey("hidePre", pathwayId, lessonSlug), String(hide));
                  }}
                  className="h-3.5 w-3.5 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)]"
                />
                Show readiness (pre-test) block
              </label>
            ) : null}
            {hasPost ? (
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={!hidePost}
                  onChange={(e) => {
                    const hide = !e.target.checked;
                    setHidePost(hide);
                    localStorage.setItem(storageKey("hidePost", pathwayId, lessonSlug), String(hide));
                  }}
                  className="h-3.5 w-3.5 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)]"
                />
                Show reinforcement (post-test) block
              </label>
            ) : null}
          </div>
        </details>
      )}

      {showPreTab ? (
        <section
          id="lesson-readiness"
          className="nn-lesson-quiz-module scroll-mt-24"
          aria-labelledby="lesson-pre-test-heading"
        >
          <header className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-info)_10%)] px-4 pb-3 pt-1 sm:px-5 sm:pb-4">
            <p id="lesson-pre-test-heading" className="nn-lesson-module-eyebrow">
              Before you read
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">
              Readiness check
            </h2>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--theme-muted-text)]">
              Activate what you already know—{preCount} question{preCount === 1 ? "" : "s"}, low pressure. Then move straight
              into the lesson.
            </p>
          </header>
          <div className="px-3 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
            <PathwayLessonQuizLegacyFlow
              key={`shell-pre-${itemsResetKey(preTest)}`}
              variant="pre"
              pathwayId={pathwayId}
              lessonSlug={lessonSlug}
              title="Pre-test"
              subtitle="Baseline"
              items={preTest}
              fullAccess={fullAccess}
              onAssessmentFinished={onPreFinished}
              className="border-0 pb-0"
            />
          </div>
        </section>
      ) : null}

      <section id="lesson-core" className="scroll-mt-20" aria-label="Lesson content">
        {sectionAnchors && sectionAnchors.length > 0 ? (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            <nav
              className="hidden shrink-0 lg:block lg:w-40 xl:w-44"
              aria-label="Jump to section"
            >
              <p className="nn-lesson-module-eyebrow mb-2">On this page</p>
              <ul className="sticky top-24 space-y-0.5 border-l border-[var(--semantic-border-soft)] pl-3">
                {sectionAnchors.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block truncate py-1 text-xs leading-snug text-[var(--theme-muted-text)] transition hover:text-[var(--theme-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        ) : (
          children
        )}
      </section>

      {showPostTab ? (
        <section
          id="lesson-reinforcement"
          className="nn-lesson-quiz-module scroll-mt-24"
          aria-labelledby="lesson-post-test-heading"
        >
          <header className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-success)_10%)] px-4 pb-3 pt-1 sm:px-5 sm:pb-4">
            <p id="lesson-post-test-heading" className="nn-lesson-module-eyebrow">
              After the lesson
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-xl">
              Reinforcement check
            </h2>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--theme-muted-text)]">
              Short active recall—{postCount} question{postCount === 1 ? "" : "s"} to confirm retention and surface gaps
              before you practice further.
            </p>
          </header>
          <div className="px-3 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
            {!postTestReady ? (
              <div
                className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-warning)_12%)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))] px-4 py-4 text-sm text-[var(--theme-body-text)]"
                role="status"
              >
                <p className="font-semibold text-[var(--theme-heading-text)]">Complete the lesson to unlock</p>
                <p className="mt-2 leading-relaxed text-[var(--theme-muted-text)]">
                  Mark this lesson studied when you finish reading. The reinforcement block opens right after so you can
                  prove retention while the material is fresh.
                </p>
              </div>
            ) : (
              <PathwayLessonQuizLegacyFlow
                key={`shell-post-${itemsResetKey(postTest)}`}
                variant="post"
                pathwayId={pathwayId}
                lessonSlug={lessonSlug}
                title="Post-test"
                subtitle="Retention"
                items={postTest}
                fullAccess={fullAccess}
                onAssessmentFinished={onPostFinished}
                className="border-0 pb-0"
              />
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
