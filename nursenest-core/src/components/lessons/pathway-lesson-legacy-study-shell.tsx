"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BarChart3, Stethoscope, TrendingUp } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonQuizSet, itemsResetKey } from "@/components/lessons/pathway-lesson-quiz-set";
import { Progress } from "@/components/ui/progress";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type TabKey = "pretest" | "content" | "posttest";

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

/**
 * Legacy NurseNest `lesson-detail.tsx` study pattern: learning-progress card, optional show/hide pre-post,
 * and a three-column tab strip (Pre-test · Clinical content · Post-test). Uses current theme tokens only.
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
  const [postMode, setPostMode] = useState<"practice" | "exam">("practice");
  const [activeTab, setActiveTab] = useState<TabKey>("content");

  useEffect(() => {
    setLessonProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    const hp = localStorage.getItem(storageKey("hidePre", pathwayId, lessonSlug)) === "true";
    const hs = localStorage.getItem(storageKey("hidePost", pathwayId, lessonSlug)) === "true";
    setHidePre(hp);
    setHidePost(hs);
    if (preTest?.length && !hp) setActiveTab("pretest");
    const pd = readBool(storageKey("preDone", pathwayId, lessonSlug));
    const po = readBool(storageKey("postDone", pathwayId, lessonSlug));
    if (pd !== null) setPreDone(pd);
    if (po !== null) setPostDone(po);
  }, [pathwayId, lessonSlug, preTest?.length]);

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
  const tabCount = (showPreTab ? 1 : 0) + 1 + (showPostTab ? 1 : 0);

  useEffect(() => {
    if (activeTab === "pretest" && !showPreTab) setActiveTab("content");
    if (activeTab === "posttest" && !showPostTab) setActiveTab("content");
  }, [activeTab, showPreTab, showPostTab]);

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

  const panelFrame =
    "rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-info)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-cool)_4%)] p-4 shadow-[var(--shadow-card)] sm:p-5";

  const tabBtn = (key: TabKey, selected: boolean) =>
    [
      "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-center text-sm font-semibold transition",
      selected
        ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
        : "text-[var(--theme-muted-text)] hover:bg-[color-mix(in_srgb,var(--theme-page-bg)_85%,var(--semantic-panel-warm)_15%)] hover:text-[var(--theme-heading-text)]",
    ].join(" ");

  return (
    <div className="space-y-5">
      <section
        className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_92%,var(--semantic-panel-positive)_8%)] p-4 sm:p-5"
        aria-label="Learning progress"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">
              Learning progress
            </p>
            <p className="mt-1 hidden text-sm text-[var(--theme-muted-text)] sm:block">
              Pre-test, study the lesson, then post-test — track your flow here.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{progressLabel}</p>
            <Progress value={progressValue} variant="accent" className="h-2 w-28" />
          </div>
        </div>
      </section>

      {(hasPre || hasPost) && (
        <div
          className="flex flex-wrap items-center justify-end gap-4 text-xs text-[var(--theme-muted-text)]"
          data-testid="lesson-test-visibility-toggles"
        >
          {hasPre ? (
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={!hidePre}
                onChange={(e) => {
                  const hide = !e.target.checked;
                  setHidePre(hide);
                  localStorage.setItem(storageKey("hidePre", pathwayId, lessonSlug), String(hide));
                  if (hide && activeTab === "pretest") setActiveTab("content");
                }}
                className="h-3.5 w-3.5 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)]"
              />
              Show pre-test tab
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
                  if (hide && activeTab === "posttest") setActiveTab("content");
                }}
                className="h-3.5 w-3.5 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)]"
              />
              Show post-test tab
            </label>
          ) : null}
        </div>
      )}

      <div
        className="inline-flex w-full flex-wrap gap-1 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-page-bg)_94%,var(--semantic-panel-cool)_6%)] p-1 sm:flex-nowrap"
        role="tablist"
        aria-label="Lesson study tabs"
        data-testid="pathway-lesson-study-tabs"
        style={{
          display: "grid",
          gridTemplateColumns: tabCount === 1 ? "1fr" : tabCount === 2 ? "1fr 1fr" : "1fr 1fr 1fr",
        }}
      >
        {showPreTab ? (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "pretest"}
            className={tabBtn("pretest", activeTab === "pretest")}
            onClick={() => setActiveTab("pretest")}
          >
            <BarChart3 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Pre-test
          </button>
        ) : null}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "content"}
          className={tabBtn("content", activeTab === "content")}
          onClick={() => setActiveTab("content")}
        >
          <Stethoscope className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
          Clinical content
        </button>
        {showPostTab ? (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "posttest"}
            className={tabBtn("posttest", activeTab === "posttest")}
            onClick={() => setActiveTab("posttest")}
          >
            <TrendingUp className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Post-test
          </button>
        ) : null}
      </div>

      {showPreTab ? (
        <div
          role="tabpanel"
          id="pathway-lesson-tab-pretest"
          hidden={activeTab !== "pretest"}
          className="mt-2"
        >
          <section className={panelFrame} aria-label="Pre-test">
            <PathwayLessonQuizSet
              key={`shell-pre-${itemsResetKey(preTest)}`}
              variant="pre"
              title="Pre-test"
              subtitle="Before you read"
              items={preTest}
              fullAccess={fullAccess}
              onAssessmentFinished={onPreFinished}
              className="border-0 pb-0"
            />
          </section>
        </div>
      ) : null}

      <div
        role="tabpanel"
        id="pathway-lesson-tab-content"
        hidden={activeTab !== "content"}
        className="mt-2"
      >
        {sectionAnchors && sectionAnchors.length > 0 ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <nav className="hidden shrink-0 lg:block lg:w-44 xl:w-52" aria-label="Jump to section">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-secondary)]">
                Sections
              </p>
              <ul className="sticky top-24 space-y-1">
                {sectionAnchors.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block truncate rounded-md px-2 py-1.5 text-xs text-[var(--theme-muted-text)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_8%,transparent)] hover:text-[var(--theme-heading-text)]"
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
      </div>

      {showPostTab ? (
        <div
          role="tabpanel"
          id="pathway-lesson-tab-posttest"
          hidden={activeTab !== "posttest"}
          className="mt-2"
        >
          {!postTestReady ? (
            <section className="nn-study-card border border-[var(--semantic-border-soft)] p-5 text-sm text-[var(--theme-muted-text)]">
              <p className="font-semibold text-[var(--theme-heading-text)]">Post-test locked</p>
              <p className="mt-2 leading-6">
                Mark this lesson complete (or finish the reading flow) to unlock the post-test. Your progress above moves
                to 50% once the lesson is complete.
              </p>
            </section>
          ) : (
            <section className={panelFrame} aria-label="Post-test">
              <PathwayLessonQuizSet
                key={`shell-post-${itemsResetKey(postTest)}-${postMode}`}
                variant="post"
                title="Post-test"
                subtitle="After the lesson"
                items={postTest}
                fullAccess={fullAccess}
                postMode={postMode}
                onPostModeChange={setPostMode}
                onAssessmentFinished={onPostFinished}
                className="border-0 pb-0"
              />
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}
