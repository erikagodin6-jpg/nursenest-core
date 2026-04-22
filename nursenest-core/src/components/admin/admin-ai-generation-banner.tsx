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
      <p className="font-semibold">
        {gate.mode === "misconfigured" ? "AI admin generation misconfigured" : "AI admin generation disabled"}
      </p>
      <p className="mt-1 text-xs opacity-90">{gate.summaryLine}</p>
      <p className="mt-2 text-xs opacity-90">
        Generation actions are disabled until{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">AI_ADMIN_GENERATION_ENABLED=true</code> and{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">AI_INTEGRATIONS_OPENAI_API_KEY</code> (or{" "}
        <code className="rounded bg-black/10 px-1 dark:bg-white/10">OPENAI_API_KEY</code>) are set.
      </p>
    </div>
  );
}
