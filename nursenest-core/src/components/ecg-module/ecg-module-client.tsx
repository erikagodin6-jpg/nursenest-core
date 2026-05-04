"use client";

import { useEffect, useState } from "react";
import type { EcgLevel, EcgMode, EcgRouteKind } from "@/lib/ecg-module/ecg-module-config";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { isEcgLiveStripMediaConfig } from "@/lib/ecg-module/ecg-strip-clinical-validation";
import { ECG_LIVE_STRIP_MEDIA_TYPE } from "@/lib/ecg-video-quiz/ecg-video-question";

type EcgQuestion = {
  id: string;
  videoUrl: string;
  mediaType: string;
  mediaConfig: unknown;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  questionText: string;
  options: { id: string; text: string }[];
  rationale: string | null;
  rhythmTag: string;
  clinicalPriority: string | null;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

type EcgWorksheet = {
  id: string;
  title: string;
  description: string | null;
  accessState: "free" | "premium_included" | "unlocked" | "locked" | "admin_preview";
  previewBlurred: boolean;
  downloadUrl: string | null;
};

type AnswerResult = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctRhythm: string;
  correctAnswerId: string;
  rationale: string | null;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

function VideoPreview({
  videoUrl,
  thumbnailUrl,
  autoplay,
  slow,
}: {
  videoUrl: string;
  thumbnailUrl: string | null;
  autoplay?: boolean;
  slow?: boolean;
}) {
  const source = videoUrl.trim();
  if (!source) return null;

  return (
    <video
      className="mt-3 aspect-video w-full rounded-md border border-[var(--semantic-border-soft)] bg-black object-contain"
      controls
      autoPlay={autoplay}
      muted={autoplay}
      loop={autoplay}
      preload="metadata"
      poster={thumbnailUrl ?? undefined}
      onLoadedMetadata={(event) => {
        if (slow) event.currentTarget.playbackRate = 0.75;
      }}
    >
      <source src={source} />
    </video>
  );
}

export function EcgQuestionList({
  level,
  mode,
  kind,
}: {
  level: EcgLevel;
  mode: EcgMode;
  kind: EcgRouteKind;
}) {
  const [items, setItems] = useState<EcgQuestion[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, AnswerResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ level, mode, kind });
    fetch(`/api/modules/ecg/questions?${params.toString()}`, {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as { ok?: boolean; items?: EcgQuestion[] };
        if (!res.ok || !data.ok) throw new Error("load_failed");
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError("Unable to load ECG questions right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [kind, level, mode]);

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG items...</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]">{error}</p>;
  if (items.length === 0) {
    return <p className="text-sm text-[var(--semantic-text-secondary)]">No ECG items are published for this mode yet.</p>;
  }

  const quizItems = kind === "quizzes" ? items : [];
  const answeredQuizItems = quizItems.filter((item) => selected[item.id]);
  const correctQuizItems = answeredQuizItems.filter((item) => results[item.id]?.isCorrect);
  const wrongQuizItems = answeredQuizItems.filter((item) => !results[item.id]?.isCorrect);
  const percentCorrect = answeredQuizItems.length > 0 ? Math.round((correctQuizItems.length / answeredQuizItems.length) * 100) : null;

  async function submitAnswer(item: EcgQuestion, optionId: string) {
    setSelected((prev) => ({ ...prev, [item.id]: optionId }));
    setSubmittingId(item.id);
    try {
      const attemptMode = kind === "video-drills" ? "practice" : "quiz";
      const res = await fetch(`/api/modules/ecg/questions/${encodeURIComponent(item.id)}/answer`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedOptionId: optionId, attemptMode }),
      });
      const data = (await res.json()) as { ok?: boolean; result?: AnswerResult };
      if (!res.ok || !data.ok || !data.result) throw new Error("answer_failed");
      setResults((prev) => ({ ...prev, [item.id]: data.result! }));
    } catch {
      setError("Unable to grade this ECG question right now.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {kind === "quizzes" ? (
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {percentCorrect === null ? "Answer questions to see your score." : `${percentCorrect}% correct`}
          </p>
          {wrongQuizItems.length > 0 ? (
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              Wrong answers: {wrongQuizItems.map((item) => {
                const selectedId = selected[item.id];
                return item.options.find((option) => option.id === selectedId)?.text ?? selectedId;
              }).join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
      <ul className="grid gap-4">
        {items.map((item) => {
          const chosen = selected[item.id];
          const result = results[item.id];
          const isAnswered = Boolean(result);
          const isCorrect = result?.isCorrect ?? false;
          const correctOptionLabel =
            item.options.find((option) => option.id === result?.correctAnswerId)?.text ?? result?.correctAnswerId ?? "";
          return (
            <li key={item.id} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              {item.clinicalPriority ? (
                <p className="mb-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  Clinical priority: {item.clinicalPriority}
                </p>
              ) : null}
              <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{item.questionText}</h2>
              <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{item.rhythmTag}</p>
              <VideoPreview
                videoUrl={item.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE ? "" : item.videoUrl}
                thumbnailUrl={item.thumbnailUrl}
                autoplay={kind === "video-drills"}
                slow={level === "basic" && kind === "lessons"}
              />
              {item.mediaType === ECG_LIVE_STRIP_MEDIA_TYPE && isEcgLiveStripMediaConfig(item.mediaConfig) ? (
                <EcgLiveStrip
                  className="mt-3"
                  config={item.mediaConfig}
                  mode={kind === "video-drills" ? "live" : "static"}
                />
              ) : null}
              {item.options.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => void submitAnswer(item, option.id)}
                      disabled={submittingId === item.id}
                      className={`rounded-md border px-3 py-2 text-left text-sm ${
                        chosen === option.id
                          ? "border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] text-[var(--semantic-text-primary)]"
                          : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              ) : null}
              {isAnswered ? (
                <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {isCorrect ? `Correct rhythm: ${result?.correctRhythm ?? item.rhythmTag}` : `Correct answer: ${correctOptionLabel}`}
                </p>
              ) : null}
              {isAnswered && kind !== "video-drills" && result?.rationale ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{result.rationale}</p>
              ) : null}
              {isAnswered ? (
                <div className="mt-3 space-y-1 text-sm text-[var(--semantic-text-secondary)]">
                  <p>{result?.percentCorrect == null ? "Not enough attempts yet." : `${result.percentCorrect}% answered correctly`}</p>
                  {result?.commonWrongAnswers.length ? (
                    <p>Most common wrong answers: {result.commonWrongAnswers.join(", ")}</p>
                  ) : null}
                </div>
              ) : null}
              {!isAnswered && item.percentCorrect != null ? (
                <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{item.percentCorrect}% answered correctly</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function EcgWorksheetList({ level }: { level: EcgLevel }) {
  const [items, setItems] = useState<EcgWorksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/modules/ecg/worksheets?level=${encodeURIComponent(level)}`, {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as { ok?: boolean; items?: EcgWorksheet[] };
        if (!res.ok || !data.ok) throw new Error("load_failed");
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setError("Unable to load ECG worksheets right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [level]);

  if (loading) return <p className="text-sm text-[var(--semantic-text-muted)]">Loading ECG worksheets...</p>;
  if (error) return <p className="text-sm text-[var(--semantic-danger)]">{error}</p>;
  if (items.length === 0) return <p className="text-sm text-[var(--semantic-text-secondary)]">No ECG worksheets are published yet.</p>;

  async function downloadWorksheet(item: EcgWorksheet) {
    if (!item.downloadUrl) return;
    setDownloadingId(item.id);
    try {
      const res = await fetch(item.downloadUrl, { method: "POST", credentials: "same-origin" });
      if (!res.ok) throw new Error("download_failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${item.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "ecg-worksheet"}.pdf`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Unable to download this ECG worksheet right now.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <div className={item.previewBlurred ? "pointer-events-none select-none blur-[2px]" : ""}>
            <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{item.title}</h2>
            {item.description ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {item.description}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {item.downloadUrl ? (
              <button
                type="button"
                onClick={() => void downloadWorksheet(item)}
                disabled={downloadingId === item.id}
                className="nn-btn-primary inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold"
              >
                {downloadingId === item.id ? "Downloading..." : "Download PDF"}
              </button>
            ) : (
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)]">
                {item.accessState === "admin_preview" ? "Admin preview" : "Unlock worksheet"}
              </span>
            )}
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {item.accessState === "admin_preview" ? "Download remains hidden until launch." : item.accessState === "locked" ? "Free preview" : "Unlocked"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
