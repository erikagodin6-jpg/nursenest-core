import type { AdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

/**
 * Server-safe banner — show when admin AI routes would reject generation.
 */
export function AdminAiGenerationBanner({ gate }: { gate: AdminAiGenerationGate }) {
  if (gate.runnable) return null;

  const tone =
    gate.mode === "misconfigured"
      ? "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100"
      : "border-border bg-[var(--theme-muted-surface)] text-[var(--theme-body-text)]";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mx-auto w-full max-w-5xl border px-4 py-3 text-sm leading-relaxed sm:px-6 ${tone}`}
      data-testid="admin-ai-generation-banner"
    >
      <p className="font-semibold">{gate.summaryLine}</p>
      <p className="mt-2 text-xs opacity-90">
        Live OpenAI-backed admin tools (blog, lessons, exam questions, flashcards, batch processors) stay disabled until the
        generation flag is enabled (for example{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">true</code>,{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">1</code>,{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">yes</code>, or{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">on</code> — case-insensitive) and{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">AI_INTEGRATIONS_OPENAI_API_KEY</code> (or{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">OPENAI_API_KEY</code>) is set. Slot preview and
        precomputed localized imports may still work without this gate.
      </p>
    </div>
  );
}
