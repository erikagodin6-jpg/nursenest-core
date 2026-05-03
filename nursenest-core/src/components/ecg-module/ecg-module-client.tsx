"use client";

import { useEffect, useMemo, useState } from "react";
import type { EcgLevel, EcgMode, EcgRouteKind } from "@/lib/ecg-module/ecg-module-config";

type EcgQuestion = {
  id: string;
  stem: string;
  options: string[];
  correctAnswer: string[];
  rationale: string | null;
  topic: string | null;
  scenario: string | null;
  exhibitData: unknown;
};

type EcgWorksheet = {
  id: string;
  title: string;
  description: string | null;
  accessState: "free" | "premium_included" | "unlocked" | "locked";
  previewBlurred: boolean;
  downloadUrl: string | null;
};

function JsonVideoPreview({ exhibitData, autoplay, slow }: { exhibitData: unknown; autoplay?: boolean; slow?: boolean }) {
  const asset = useMemo(() => {
    if (!exhibitData || typeof exhibitData !== "object") return null;
    const root = exhibitData as { asset?: { url?: unknown; thumbnailUrl?: unknown; mimeType?: unknown } };
    return root.asset ?? null;
  }, [exhibitData]);
  const source = typeof asset?.url === "string" ? asset.url : null;
  if (!source) return null;

  return (
    <video
      className="mt-3 aspect-video w-full rounded-md border border-[var(--semantic-border-soft)] bg-black object-contain"
      controls
      autoPlay={autoplay}
      muted={autoplay}
      loop={autoplay}
      preload="metadata"
      poster={typeof asset?.thumbnailUrl === "string" ? asset.thumbnailUrl : undefined}
      onLoadedMetadata={(event) => {
        if (slow) event.currentTarget.playbackRate = 0.75;
      }}
    >
      <source src={source} type={typeof asset?.mimeType === "string" ? asset.mimeType : undefined} />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const correctQuizItems = answeredQuizItems.filter((item) => item.correctAnswer.includes(selected[item.id] ?? ""));
  const wrongQuizItems = answeredQuizItems.filter((item) => !item.correctAnswer.includes(selected[item.id] ?? ""));
  const percentCorrect = answeredQuizItems.length > 0 ? Math.round((correctQuizItems.length / answeredQuizItems.length) * 100) : null;

  return (
    <div className="space-y-4">
      {kind === "quizzes" ? (
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {percentCorrect === null ? "Answer questions to see your score." : `${percentCorrect}% correct`}
          </p>
          {wrongQuizItems.length > 0 ? (
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
              Wrong answers: {wrongQuizItems.map((item) => selected[item.id]).join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
      <ul className="grid gap-4">
        {items.map((item) => {
          const chosen = selected[item.id];
          const isAnswered = Boolean(chosen);
          const isCorrect = isAnswered && item.correctAnswer.includes(chosen);
          return (
            <li key={item.id} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              {item.scenario ? (
                <p className="mb-2 text-sm font-semibold text-[var(--semantic-text-primary)]">{item.scenario}</p>
              ) : null}
              <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{item.stem}</h2>
              {item.topic ? <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{item.topic}</p> : null}
              <JsonVideoPreview
                exhibitData={item.exhibitData}
                autoplay={kind === "video-drills"}
                slow={level === "basic" && kind === "lessons"}
              />
              {kind === "quizzes" && item.options.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {item.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelected((prev) => ({ ...prev, [item.id]: option }))}
                      className={`rounded-md border px-3 py-2 text-left text-sm ${
                        chosen === option
                          ? "border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] text-[var(--semantic-text-primary)]"
                          : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
              {kind === "quizzes" && isAnswered ? (
                <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {isCorrect ? "Correct" : `Correct answer: ${item.correctAnswer.join(", ")}`}
                </p>
              ) : null}
              {kind === "quizzes" && isAnswered && item.rationale ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{item.rationale}</p>
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
                Unlock worksheet
              </span>
            )}
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {item.accessState === "locked" ? "Free preview" : "Unlocked"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
