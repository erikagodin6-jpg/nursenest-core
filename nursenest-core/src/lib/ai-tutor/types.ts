import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

/**
 * Server-trusted entitlement slice plus **non-empty** learner pathway.
 * All AI tutoring and explainable remediation entry points must require this;
 * never infer pathway from client-only hints.
 */
export type TutoringEntitlementSnapshot = AccessScope & {
  pathwayId: string;
};

/**
 * Structured inputs for tutoring prompts — **no raw HTML / stems / answers**.
 * Question or lesson identifiers are opaque ids only; labels are plain text snippets
 * already authorized for the learner surface (titles), never full bank content.
 */
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

export type TutoringPromptContext = {
  entitlementSnapshot: TutoringEntitlementSnapshot;
  /** When set, prompt composition uses graph-ordered remediation only. */
  graphSteps?: readonly EduGraphStep[];
  /** Opaque content ids (question id, lesson id, deck id, etc.) — never log stems. */
  focusContentIds: string[];
  /** Short plain-text labels for display composition (titles), max lengths enforced in builders. */
  focusContentLabels: string[];
  /** Normalized topic keys aligned with weak-topic / adaptive engines. */
  topicKeys: string[];
  /** Named signals only (e.g. `weak_topic_priority`, `readiness_band`) — no PII. */
  signalNames: string[];
  pathwayId?: string | null;
  locale?: string;
};

export type TutoringRecommendationSource = "deterministic" | "provider" | "blended";

/**
 * Educational framing only — exam prep rationale, next-study links, conceptual hints.
 * Must not present individualized medical directives; see {@link TUTORING_SAFETY_DISCLAIMERS}.
 */
export type TutoringRecommendation = {
  source: TutoringRecommendationSource;
  summaryLines: string[];
  /** App-relative hrefs already entitlement-safe when produced by server loaders. */
  suggestedHrefs: string[];
  /** True when no provider was consulted or provider failed and a fallback won. */
  usedDeterministicFallback: boolean;
};

export type TutoringGenerateOptions = {
  /** Wall-clock budget for provider round-trip (deterministic path ignores). */
  timeoutMs?: number;
  signal?: AbortSignal;
};

export type TutoringExplainOptions = TutoringGenerateOptions;

/**
 * Provider-agnostic tutoring backend. Implementations wrap OpenAI, Anthropic, etc.
 * behind this interface; {@link createTutoringProvider} returns a stub by default.
 */
export type TutoringProvider = {
  readonly kind: string;
  generateRecommendation(
    ctx: TutoringPromptContext,
    options?: TutoringGenerateOptions,
  ): Promise<TutoringRecommendation | null>;
  explainRemediation(
    ctx: TutoringPromptContext,
    explanationMarkdown: string,
    options?: TutoringExplainOptions,
  ): Promise<string | null>;
};
