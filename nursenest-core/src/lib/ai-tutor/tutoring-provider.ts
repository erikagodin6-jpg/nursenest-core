import {
  composeTutoringPromptEnvelope,
  composeTutoringPromptFromGraphSteps,
} from "@/lib/ai-tutor/prompt-composition";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type {
  TutoringExplainOptions,
  TutoringGenerateOptions,
  TutoringPromptContext,
  TutoringProvider,
  TutoringRecommendation,
} from "@/lib/ai-tutor/types";
import { runDeterministicTutoringFallbackChain, defaultWeakTopicFallback } from "@/lib/ai-tutor/deterministic-fallback";
import { guardTutoringEntitlementSnapshot } from "@/lib/ai-tutor/entitlement-guard";

/**
 * Timeout helper — rejects when signal aborts or deadline passes.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, signal?: AbortSignal): Promise<T> {
  if (ms <= 0) return promise;
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("tutoring_provider_timeout")), ms);
    const onAbort = () => reject(new Error("tutoring_provider_aborted"));
    if (signal) {
      if (signal.aborted) {
        clearTimeout(t);
        onAbort();
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
    promise
      .then((v) => {
        clearTimeout(t);
        if (signal) signal.removeEventListener("abort", onAbort);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        if (signal) signal.removeEventListener("abort", onAbort);
        reject(e);
      });
  });
}

/**
 * Stub provider: never calls external APIs; exercises timeout + deterministic chain.
 * Replace via {@link createTutoringProvider} when a real adapter exists.
 */
export class StubTutoringProvider implements TutoringProvider {
  readonly kind = "stub";

  async generateRecommendation(
    ctx: TutoringPromptContext,
    options?: TutoringGenerateOptions,
  ): Promise<TutoringRecommendation | null> {
    const g = guardTutoringEntitlementSnapshot(ctx.entitlementSnapshot);
    if (!g.ok) return null;
    const boundCtx: TutoringPromptContext = { ...ctx, entitlementSnapshot: g.value };
    const graphSteps = (boundCtx as TutoringPromptContext & { graphSteps?: readonly EduGraphStep[] }).graphSteps;
    if (graphSteps?.length) {
      void composeTutoringPromptFromGraphSteps(boundCtx, graphSteps);
    } else {
      void composeTutoringPromptEnvelope(boundCtx);
    }
    const ms = options?.timeoutMs;
    const runner = async () =>
      runDeterministicTutoringFallbackChain(boundCtx, [defaultWeakTopicFallback]) ??
      ({
        source: "deterministic",
        summaryLines: ["Continue your scheduled study plan in the active pathway."],
        suggestedHrefs: [],
        usedDeterministicFallback: true,
      } satisfies TutoringRecommendation);
    try {
      if (ms == null || ms <= 0) return await runner();
      return await withTimeout(runner(), ms, options?.signal);
    } catch {
      return runDeterministicTutoringFallbackChain(boundCtx, [defaultWeakTopicFallback]);
    }
  }

  async explainRemediation(
    ctx: TutoringPromptContext,
    explanationMarkdown: string,
    options?: TutoringExplainOptions,
  ): Promise<string | null> {
    const g = guardTutoringEntitlementSnapshot(ctx.entitlementSnapshot);
    if (!g.ok) return null;
    void ctx;
    const ms = options?.timeoutMs;
    const text = explanationMarkdown.trim().slice(0, 4000);
    const runner = async () => (text.length ? `Summary: ${text.slice(0, 280)}…` : null);
    try {
      if (ms == null || ms <= 0) return await runner();
      return await withTimeout(runner(), ms, options?.signal);
    } catch {
      return null;
    }
  }
}
