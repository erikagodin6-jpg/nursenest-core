/**
 * AI chat completions: OpenAI (explicit) or OpenRouter via OpenAI-compatible chat completions.
 * Blog callers may override the global provider with `BLOG_AI_PROVIDER`.
 */
import OpenAI from "openai";
import type { BlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import {
  assertBlogAiExplicitOpenRouterHonored,
  getBlogAiChatProvider,
  sanitizeEnvProviderToken,
} from "@/lib/ai/blog-ai-routing";
import { appendOpenRouterHintIfQuotaError } from "@/lib/ai/openai-quota-hint";
import type { ChatCompletionResult } from "@/lib/ai/openai-chat-types";
import { getOpenRouterApiKeyTrimmedFromEnv } from "@/lib/ai/blog-ai-env-keys";
import {
  getBlogOpenAiApiKey,
  getBlogOpenAiChatModel,
  getBlogOpenRouterChatModel,
  getOpenAiBaseUrl,
  OPENROUTER_MODELS_URL,
  resolveBlogOpenRouterModelSlugFromEnv,
  resolveOpenRouterModelSlugFromEnv,
} from "@/lib/ai/openai-env";

export type { BlogAiChatProvider } from "@/lib/ai/blog-ai-routing";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_401_MESSAGE =
  "OpenRouter rejected the API key. Check OPENROUTER_API_KEY or BLOG_OPENROUTER_API_KEY, account credits, model access, and shell env loading.";

/** Logged on every blog pipeline completion (repair/retry uses the same entrypoint). */
function logBlogAiInvocation(provider: BlogAiChatProvider, model: string): void {
  console.info(`[BlogAI] provider=${provider} model=${model}`);
}

let loggedOpenRouterResolvedModelSlug = false;

/** Once per process: confirms which OpenRouter slug is in use (no secrets). */
function logOpenRouterResolvedModelOnce(model: string): void {
  if (loggedOpenRouterResolvedModelSlug) return;
  loggedOpenRouterResolvedModelSlug = true;
  console.info(`[OpenRouter] Resolved chat model slug: ${model}`);
}

function openRouterModelRoutingFailed(status: number, rawText: string): boolean {
  if (status === 404) return true;
  const m = rawText.toLowerCase();
  return (
    m.includes("no endpoints") ||
    m.includes("no providers") ||
    m.includes("model not found") ||
    m.includes("invalid model") ||
    m.includes("unknown model") ||
    m.includes("does not exist")
  );
}

function formatOpenRouterModelRoutingError(status: number, rawText: string): string {
  const hint = `OpenRouter could not route this model (HTTP ${status}). Set OPENROUTER_MODEL or BLOG_OPENROUTER_MODEL to a valid slug from ${OPENROUTER_MODELS_URL} (account must have access to that model).`;
  const tail = rawText.trim() ? ` Response (truncated): ${rawText.slice(0, 500)}` : "";
  return `${hint}${tail}`;
}

async function mapProviderError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw appendOpenRouterHintIfQuotaError(e);
  }
}

function normalizeOpenRouterModel(explicit: string | undefined, fallback: string): string {
  const fromEnv = process.env.OPENROUTER_MODEL?.trim() || process.env.BLOG_OPENROUTER_MODEL?.trim();
  if (fromEnv) return fromEnv;
  const candidate = explicit?.trim();
  if (candidate && candidate.includes("/")) return candidate;
  return fallback.includes("/") ? fallback : resolveOpenRouterModelSlugFromEnv();
}

/** Same as {@link normalizeOpenRouterModel} but `BLOG_OPENROUTER_MODEL` wins over `OPENROUTER_MODEL` for blog traffic. */
function normalizeBlogOpenRouterModel(explicit: string | undefined, fallback: string): string {
  const fromEnv = process.env.BLOG_OPENROUTER_MODEL?.trim() || process.env.OPENROUTER_MODEL?.trim();
  if (fromEnv) return fromEnv;
  const candidate = explicit?.trim();
  if (candidate && candidate.includes("/")) return candidate;
  return fallback.includes("/") ? fallback : resolveBlogOpenRouterModelSlugFromEnv();
}

function normalizeOpenRouterApiKey(raw: string | undefined): string {
  const apiKey = raw?.trim() ?? "";
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY or BLOG_OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter or BLOG_AI_PROVIDER=openrouter",
    );
  }
  if ((apiKey.startsWith("\"") && apiKey.endsWith("\"")) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
    throw new Error(
      "OpenRouter API key appears to include wrapping quote characters. Remove the quotes from the runtime value (OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY).",
    );
  }
  if (/^bearer\s+/i.test(apiKey)) {
    throw new Error(
      "OpenRouter API key must be the raw key only; do not include a Bearer prefix (OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY).",
    );
  }
  if (apiKey === "dry-run-test" || apiKey === "test" || apiKey.includes("YOUR_OPENROUTER_API_KEY")) {
    throw new Error(
      "OpenRouter API key is a placeholder value, not a live key (OPENROUTER_API_KEY / BLOG_OPENROUTER_API_KEY).",
    );
  }
  return apiKey;
}

export async function openRouterChatCompletion(params: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  user?: string;
  model?: string;
}): Promise<ChatCompletionResult> {
  const apiKey = normalizeOpenRouterApiKey(getOpenRouterApiKeyTrimmedFromEnv() || undefined);
  const user = params.user ? String(params.user).slice(0, 128) : undefined;
  const model = normalizeOpenRouterModel(params.model, resolveOpenRouterModelSlugFromEnv());
  logOpenRouterResolvedModelOnce(model);
  const resp = await mapProviderError(async () => {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER?.trim() || "https://nursenest.ca",
        "X-Title": process.env.OPENROUTER_APP_TITLE?.trim() || "NurseNest",
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        ...(user ? { user } : {}),
      }),
    });
    const rawText = await res.text();
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error(`${OPENROUTER_401_MESSAGE}${rawText ? ` OpenRouter response: ${rawText.slice(0, 500)}` : ""}`);
      }
      if (openRouterModelRoutingFailed(res.status, rawText)) {
        throw new Error(formatOpenRouterModelRoutingError(res.status, rawText));
      }
      throw new Error(`OpenRouter HTTP ${res.status}${rawText ? `: ${rawText.slice(0, 500)}` : ""}`);
    }
    try {
      return JSON.parse(rawText) as {
        choices?: { message?: { content?: string } }[];
        usage?: { total_tokens?: number };
      };
    } catch {
      throw new Error("Invalid JSON from OpenRouter response");
    }
  });
  const content = resp.choices[0]?.message?.content ?? "";
  return { content, totalTokens: resp.usage?.total_tokens };
}

export async function blogAiChatCompletion(params: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  user?: string;
  model?: string;
}): Promise<ChatCompletionResult> {
  const provider = getBlogAiChatProvider();
  assertBlogAiExplicitOpenRouterHonored(provider);
  if (provider === "gemini") {
    throw new Error(
      "BLOG_AI_PROVIDER=gemini does not use OpenAI-compatible chat completions; use generateGeminiBlogDraft or set BLOG_AI_PROVIDER=openai|openrouter (or AI_PROVIDER=openrouter).",
    );
  }
  if (provider === "unconfigured") {
    throw new Error(
      "Blog AI provider is not configured. Set BLOG_AI_PROVIDER=openrouter with OPENROUTER_API_KEY (or BLOG_OPENROUTER_API_KEY), or explicitly set BLOG_AI_PROVIDER=openai with BLOG_OPENAI_API_KEY / AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY.",
    );
  }

  if (provider === "openrouter") {
    normalizeOpenRouterApiKey(getOpenRouterApiKeyTrimmedFromEnv() || undefined);
    const model = normalizeBlogOpenRouterModel(params.model, getBlogOpenRouterChatModel());
    logBlogAiInvocation(provider, model);
    return openRouterChatCompletion({
      messages: params.messages,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      user: params.user,
      model,
    });
  }

  if (sanitizeEnvProviderToken(process.env.BLOG_AI_PROVIDER) === "openrouter") {
    throw new Error(
      "[BlogAI] Blocked OpenAI SDK path while BLOG_AI_PROVIDER=openrouter — routing should use OpenRouter only.",
    );
  }

  const user = params.user ? String(params.user).slice(0, 128) : undefined;
  const model = params.model?.trim() || getBlogOpenAiChatModel();
  const apiKey = getBlogOpenAiApiKey();
  if (!apiKey) {
    throw new Error(
      "OpenAI API key is required when using the OpenAI blog provider (BLOG_OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY).",
    );
  }
  logBlogAiInvocation(provider, model);
  const base = getOpenAiBaseUrl().replace(/\/$/, "");
  const client = new OpenAI({
    apiKey,
    baseURL: base,
  });
  const resp = await mapProviderError(() =>
    client.chat.completions.create({
      model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      ...(user ? { user } : {}),
    }),
  );
  const content = resp.choices[0]?.message?.content ?? "";
  return { content, totalTokens: resp.usage?.total_tokens };
}
