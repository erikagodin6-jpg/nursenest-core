import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, ArrowLeft, BookOpen, Layers, Download, FileText,
  RefreshCw, Loader2, ShieldCheck, Mail, CheckCircle2, HelpCircle
} from "lucide-react";

export function SafeExamFallback({ questions, onBack }: { questions?: any[]; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="safe-mode-exam">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Safe Mode — Simplified View</p>
            <p className="text-sm text-amber-700">
              The interactive exam player encountered an issue. Here are your questions in a simplified format.
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-safe-exam-back">
            <ArrowLeft className="w-4 h-4" /> Back to Exams
          </Button>
        )}

        {questions && questions.length > 0 ? (
          questions.map((q, i) => (
            <Card key={q.id || i} className="border-slate-200">
              <CardContent className="p-6 space-y-3">
                <p className="font-semibold text-slate-800">
                  <span className="text-primary mr-2">Q{i + 1}.</span>
                  {q.question || q.stem || q.text || "Question unavailable"}
                </p>
                {Array.isArray(q.options) && (
                  <ul className="space-y-2 ml-4">
                    {q.options.map((opt: string, j: number) => (
                      <li key={j} className="text-sm text-slate-600">
                        <span className="font-medium mr-2">{String.fromCharCode(65 + j)}.</span>
                        {typeof opt === "string" ? opt : JSON.stringify(opt)}
                      </li>
                    ))}
                  </ul>
                )}
                {q.answer && (
                  <details className="mt-2">
                    <summary className="text-sm text-primary cursor-pointer font-medium">Show Answer</summary>
                    <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{q.answer}</p>
                  </details>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <p>Questions could not be loaded in safe mode.</p>
              <p className="text-sm mt-1">Please try again later or contact support.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function SafeFlashcardFallback({ cards, onBack }: { cards?: any[]; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="safe-mode-flashcards">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Safe Mode — Basic Flashcards</p>
            <p className="text-sm text-amber-700">
              The interactive flashcard viewer encountered an issue. Here are your cards in a simple format.
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-safe-flashcards-back">
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </Button>
        )}

        {cards && cards.length > 0 ? (
          <div className="grid gap-4">
            {cards.map((card, i) => (
              <Card key={card.id || i} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold text-slate-800">
                    {card.question || card.front || card.term || `Card ${i + 1}`}
                  </p>
                  <details>
                    <summary className="text-sm text-primary cursor-pointer font-medium">Flip Card</summary>
                    <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {card.answer || card.back || card.definition || "Answer unavailable"}
                    </div>
                  </details>
                  {card.category && (
                    <span className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {card.category}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              <Layers className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <p>Flashcards could not be loaded in safe mode.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function SafeLessonFallback({ content, onBack }: { content?: any; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="safe-mode-lesson">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Safe Mode — Static Lesson View</p>
            <p className="text-sm text-amber-700">
              The interactive lesson viewer encountered an issue. Content is shown in a simplified format.
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-safe-lesson-back">
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Button>
        )}

        {content ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              {content.title && <h1 className="text-2xl font-bold text-slate-800">{content.title}</h1>}
              {content.summary && <p className="text-slate-600">{content.summary}</p>}
              {Array.isArray(content.content) &&
                content.content.map((block: any, i: number) => {
                  if (block.type === "heading") {
                    return <h2 key={i} className="text-lg font-semibold text-slate-800 mt-4">{block.content}</h2>;
                  }
                  if (block.type === "paragraph") {
                    return <p key={i} className="text-slate-600 text-sm leading-relaxed">{block.content}</p>;
                  }
                  if ((block.type === "list" || block.type === "bulletList") && Array.isArray(block.items)) {
                    return (
                      <ul key={i} className="list-disc ml-5 space-y-1 text-sm text-slate-600">
                        {block.items.map((item: string, j: number) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "clinical-pearl") {
                    return (
                      <div key={i} className="bg-amber-50 border-l-4 border-amber-400 p-3 text-sm text-amber-800">
                        {block.content}
                      </div>
                    );
                  }
                  return null;
                })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <p>Lesson content could not be loaded in safe mode.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function SafeDownloadFallback({ onBack }: { onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="safe-mode-downloads">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Downloads Temporarily Unavailable</p>
            <p className="text-sm text-amber-700">
              We're having trouble loading the download center. Your purchased content is safe and will be available shortly.
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-safe-downloads-back">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        )}

        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            <Download className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="font-medium text-slate-700">Downloads are temporarily unavailable</p>
            <p className="text-sm mt-1">Please try again in a few minutes. If the issue persists, contact support.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function FlashcardDownloadBackup({
  cards,
  deckTitle,
  contentId,
  onBack,
}: {
  cards?: any[];
  deckTitle?: string;
  contentId?: string;
  onBack?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      if (cards && cards.length > 0) {
        const blob = new Blob([JSON.stringify({ title: deckTitle, cards }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${deckTitle || "flashcards"}-backup.json`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
      } else if (contentId) {
        window.location.href = `/api/content/download/flashcard/${contentId}`;
        setDownloaded(true);
      }
    } catch {
      setDownloaded(false);
    } finally {
      setDownloading(false);
    }
  }, [cards, deckTitle, contentId]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="flashcard-download-backup">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Download className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">Downloadable Flashcard Backup</p>
            <p className="text-sm text-blue-700">
              The interactive flashcard viewer is temporarily unavailable. You can download your cards for offline study.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-flashcard-download-back">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloading || (!cards?.length && !contentId)}
            className="gap-2"
            data-testid="button-flashcard-download"
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</>
            ) : downloaded ? (
              <><CheckCircle2 className="w-4 h-4" /> Downloaded</>
            ) : (
              <><Download className="w-4 h-4" /> Download Flashcards</>
            )}
          </Button>
        </div>

        {cards && cards.length > 0 && (
          <div className="grid gap-3">
            {cards.slice(0, 10).map((card, i) => (
              <Card key={card.id || i} className="border-slate-200">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-sm text-slate-800">
                    {card.question || card.front || card.term || `Card ${i + 1}`}
                  </p>
                  <details>
                    <summary className="text-xs text-primary cursor-pointer font-medium">Show Answer</summary>
                    <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      {card.answer || card.back || card.definition || "Answer unavailable"}
                    </p>
                  </details>
                </CardContent>
              </Card>
            ))}
            {cards.length > 10 && (
              <p className="text-xs text-slate-400 text-center">
                Showing 10 of {cards.length} cards. Download for the full set.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FlashcardRecoveryScreen({
  contentId,
  onBack,
  onRetry,
}: {
  contentId?: string;
  onBack?: () => void;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="flashcard-recovery">
      <Card className="max-w-md w-full shadow-lg border-amber-200">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800" data-testid="text-flashcard-recovery-title">
            Flashcards Temporarily Unavailable
          </h2>
          <p className="text-sm text-slate-500">
            We're working on restoring your flashcards. Your progress and saved decks are safe.
          </p>
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="gap-2 w-full" data-testid="button-flashcard-recovery-retry">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            )}
            {contentId && (
              <Button
                variant="outline"
                onClick={() => { window.location.href = `/api/content/download/flashcard/${contentId}`; }}
                className="gap-2 w-full"
                data-testid="button-flashcard-recovery-download"
              >
                <Download className="w-4 h-4" /> Download Backup
              </Button>
            )}
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="gap-2 w-full" data-testid="button-flashcard-recovery-back">
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LessonDownloadBackup({
  content,
  contentId,
  onBack,
}: {
  content?: any;
  contentId?: string;
  onBack?: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      if (content) {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${content.title || "lesson"}-backup.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (contentId) {
        window.location.href = `/api/content/download/lesson/${contentId}`;
      }
    } finally {
      setDownloading(false);
    }
  }, [content, contentId]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="lesson-download-backup">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Download className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">Lesson Backup Download</p>
            <p className="text-sm text-blue-700">
              The interactive lesson viewer is temporarily unavailable. You can download the lesson content for offline reading.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-lesson-download-back">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloading || (!content && !contentId)}
            className="gap-2"
            data-testid="button-lesson-download"
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</>
            ) : (
              <><Download className="w-4 h-4" /> Download Lesson</>
            )}
          </Button>
        </div>

        {content && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {content.title && <h1 className="text-2xl font-bold text-slate-800">{content.title}</h1>}
              {content.summary && <p className="text-slate-600">{content.summary}</p>}
              <p className="text-xs text-slate-400">
                Full lesson content available via download. A simplified preview is shown above in the safe mode view.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export function LessonRecoveryScreen({
  contentId,
  onBack,
  onRetry,
}: {
  contentId?: string;
  onBack?: () => void;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="lesson-recovery">
      <Card className="max-w-md w-full shadow-lg border-amber-200">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800" data-testid="text-lesson-recovery-title">
            Lesson Temporarily Unavailable
          </h2>
          <p className="text-sm text-slate-500">
            We're working on restoring this lesson. Your progress is saved and will be available when the issue is resolved.
          </p>
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="gap-2 w-full" data-testid="button-lesson-recovery-retry">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            )}
            {contentId && (
              <Button
                variant="outline"
                onClick={() => { window.location.href = `/api/content/download/lesson/${contentId}`; }}
                className="gap-2 w-full"
                data-testid="button-lesson-recovery-download"
              >
                <Download className="w-4 h-4" /> Download Backup
              </Button>
            )}
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="gap-2 w-full" data-testid="button-lesson-recovery-back">
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DownloadFallbackChain({
  contentId,
  category,
  onBack,
}: {
  contentId: string;
  category?: string;
  onBack?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "trying-primary" | "trying-mirror" | "requesting-manual" | "manual-queued" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  const tryPrimaryDownload = useCallback(async () => {
    setStatus("trying-primary");
    setError(null);
    try {
      const res = await fetch(`/api/content/download/${category || "download"}/${contentId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${contentId}-backup.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus("idle");
        return;
      }
      throw new Error(`Download failed: ${res.status}`);
    } catch (err: any) {
      setError(err.message || "Primary download failed");
      tryMirroredStorage();
    }
  }, [contentId, category]);

  const tryMirroredStorage = useCallback(async () => {
    setStatus("trying-mirror");
    try {
      const res = await fetch(`/api/content/download/${category || "download"}/${contentId}?source=mirror`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${contentId}-backup.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus("idle");
        return;
      }
      throw new Error("Mirror unavailable");
    } catch {
      setStatus("failed");
      setError("Both primary and mirrored downloads failed.");
    }
  }, [contentId, category]);

  const requestManualFulfillment = useCallback(async () => {
    setStatus("requesting-manual");
    try {
      const res = await fetch("/api/delivery/manual-fulfillment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: category || "download",
          contentId,
          reason: "download_fallback_exhausted",
        }),
      });
      if (res.ok) {
        setStatus("manual-queued");
      } else {
        setStatus("failed");
        setError("Could not submit manual fulfillment request.");
      }
    } catch {
      setStatus("failed");
      setError("Could not submit manual fulfillment request.");
    }
  }, [contentId, category]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8" data-testid="download-fallback-chain">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">Download Issue</p>
            <p className="text-sm text-amber-700">
              We're having trouble with this download. Your purchased content is safe — we'll try alternative methods.
            </p>
          </div>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-download-chain-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <DownloadStep
                label="Primary Download"
                status={status === "trying-primary" ? "loading" : status === "idle" ? "ready" : error ? "failed" : "ready"}
                onAction={tryPrimaryDownload}
                actionLabel="Download"
                testId="download-primary"
              />
              <DownloadStep
                label="Mirrored Storage"
                status={status === "trying-mirror" ? "loading" : status === "failed" ? "available" : "waiting"}
                onAction={tryMirroredStorage}
                actionLabel="Try Mirror"
                testId="download-mirror"
              />
              <DownloadStep
                label="Manual Fulfillment"
                status={
                  status === "manual-queued" ? "done"
                    : status === "requesting-manual" ? "loading"
                    : status === "failed" ? "available"
                    : "waiting"
                }
                onAction={requestManualFulfillment}
                actionLabel="Request Manual Delivery"
                doneLabel="Request Queued — We'll email you"
                testId="download-manual"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700" data-testid="text-download-error">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DownloadStep({
  label,
  status,
  onAction,
  actionLabel,
  doneLabel,
  testId,
}: {
  label: string;
  status: "ready" | "loading" | "failed" | "available" | "waiting" | "done";
  onAction: () => void;
  actionLabel: string;
  doneLabel?: string;
  testId: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200" data-testid={`step-${testId}`}>
      <div className="flex items-center gap-2">
        {status === "done" ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : status === "loading" ? (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        ) : status === "failed" ? (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        ) : (
          <HelpCircle className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      {status === "done" ? (
        <span className="text-xs text-emerald-600 font-medium" data-testid={`text-${testId}-done`}>
          {doneLabel || "Complete"}
        </span>
      ) : status === "waiting" ? (
        <span className="text-xs text-slate-400">Waiting</span>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          disabled={status === "loading"}
          className="text-xs"
          data-testid={`button-${testId}`}
        >
          {status === "loading" ? "Trying..." : actionLabel}
        </Button>
      )}
    </div>
  );
}

export function DownloadRecoveryScreen({
  contentId,
  category,
  onBack,
  onRetry,
}: {
  contentId?: string;
  category?: string;
  onBack?: () => void;
  onRetry?: () => void;
}) {
  const [manualRequested, setManualRequested] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const requestManual = useCallback(async () => {
    if (!contentId) return;
    setRequesting(true);
    try {
      await fetch("/api/delivery/manual-fulfillment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: category || "download",
          contentId,
          reason: "recovery_screen_manual_request",
        }),
      });
      setManualRequested(true);
    } catch {} finally {
      setRequesting(false);
    }
  }, [contentId, category]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="download-recovery">
      <Card className="max-w-md w-full shadow-lg border-amber-200">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <Download className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800" data-testid="text-download-recovery-title">
            Download Temporarily Unavailable
          </h2>
          <p className="text-sm text-slate-500">
            Your purchased content is safe. We're experiencing a temporary issue with the download system.
          </p>
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="gap-2 w-full" data-testid="button-download-recovery-retry">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            )}
            {contentId && !manualRequested && (
              <Button
                variant="outline"
                onClick={requestManual}
                disabled={requesting}
                className="gap-2 w-full"
                data-testid="button-download-recovery-manual"
              >
                {requesting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</>
                ) : (
                  <><Mail className="w-4 h-4" /> Request Manual Delivery</>
                )}
              </Button>
            )}
            {manualRequested && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700" data-testid="text-manual-queued">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                Your request has been queued. We'll deliver your content manually.
              </div>
            )}
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="gap-2 w-full" data-testid="button-download-recovery-back">
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-400">Your subscription and purchases are not affected.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function KillSwitchMessage({ feature, onBack }: { feature: string; onBack?: () => void }) {
  const featureLabels: Record<string, string> = {
    exams: "Exams",
    flashcards: "Flashcards",
    lessons: "Lessons",
    downloads: "Downloads",
    cat: "CAT Exams",
    qbank: "Question Bank",
    mockExams: "Mock Exams",
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="kill-switch-message">
      <Card className="max-w-md w-full border-blue-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800" data-testid="text-kill-switch-title">
              {featureLabels[feature] || feature} is temporarily disabled
            </h2>
            <p className="text-slate-500 text-sm">
              This feature is temporarily disabled for maintenance. Your account and progress are not affected. Please check back shortly.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => onBack ? onBack() : (window.location.href = "/en/dashboard")}
            className="gap-2"
            data-testid="button-kill-switch-dashboard"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
