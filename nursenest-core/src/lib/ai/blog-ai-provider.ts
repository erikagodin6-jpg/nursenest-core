/**
 * AI chat completions: OpenAI (default) or OpenRouter via the OpenAI SDK.
 * Blog callers may override the global provider with `BLOG_AI_PROVIDER`.
 */
import OpenAI from "openai";
import type { BlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import { getBlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import { appendOpenRouterHintIfQuotaError } from "@/lib/ai/openai-quota-hint";
import type { ChatCompletionResult } from "@/lib/ai/openai-chat-types";
import {
  getBlogOpenAiApiKey,
  getBlogOpenAiChatModel,
  getBlogOpenRouterChatModel,
  getOpenAiBaseUrl,
  getOpenRouterChatModel,
} from "@/lib/ai/openai-env";

export type { BlogAiChatProvider } from "@/lib/ai/blog-ai-routing";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

let lastLoggedBlogProvider = "";

function logBlogProviderSelection(provider: BlogAiChatProvider, model: string): void {
  const key = `${provider}:${model}`;
  if (key === lastLoggedBlogProvider) return;
  lastLoggedBlogProvider = key;
  console.info(`[BlogAI] provider=${provider} model=${model}`);
}

async function mapOpenAiSdkError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw appendOpenRouterHintIfQuotaError(e);
  }
}

function normalizeOpenRouterModel(explicit: string | undefined, fallback: string): string {
  const configured = process.env.OPENROUTER_MODEL?.trim();
  if (configured) return configured;
  const candidate = explicit?.trim();
  if (candidate && candidate.includes("/")) return candidate;
  return fallback.includes("/") ? fallback : getOpenRouterChatModel();
}

export async function openRouterChatCompletion(params: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  user?: string;
  model?: string;
}): Promise<ChatCompletionResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter or BLOG_AI_PROVIDER=openrouter",
    );
  }
  const user = params.user ? String(params.user).slice(0, 128) : undefined;
  const model = normalizeOpenRouterModel(params.model, getOpenRouterChatModel());
  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER?.trim() || "https://nursenest.ca",
      "X-Title": process.env.OPENROUTER_APP_TITLE?.trim() || "NurseNest",
    },
  });
  const resp = await mapOpenAiSdkError(() =>
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

export async function blogAiChatCompletion(params: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  user?: string;
  model?: string;
}): Promise<ChatCompletionResult> {
  const provider = getBlogAiChatProvider();
  if (provider === "gemini") {
    throw new Error(
      "BLOG_AI_PROVIDER=gemini does not use OpenAI-compatible chat completions; use generateGeminiBlogDraft or set BLOG_AI_PROVIDER=openai|openrouter (or AI_PROVIDER=openrouter).",
    );
  }
  if (provider === "unconfigured") {
    throw new Error(
      "Blog AI provider is not configured. Set BLOG_AI_PROVIDER=openrouter with OPENROUTER_API_KEY, or explicitly set BLOG_AI_PROVIDER=openai with BLOG_OPENAI_API_KEY / AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY.",
    );
  }

  if (provider === "openrouter") {
    if (!process.env.OPENROUTER_API_KEY?.trim()) {
      throw new Error(
        "OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter or BLOG_AI_PROVIDER=openrouter",
      );
    }
    const model = normalizeOpenRouterModel(params.model, getBlogOpenRouterChatModel());
    logBlogProviderSelection(provider, model);
    return openRouterChatCompletion({
      messages: params.messages,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      user: params.user,
      model,
    });
  }

  const user = params.user ? String(params.user).slice(0, 128) : undefined;
  const model = params.model?.trim() || getBlogOpenAiChatModel();
  const apiKey = getBlogOpenAiApiKey();
  if (!apiKey) {
    throw new Error(
      "OpenAI API key is required when using the OpenAI blog provider (BLOG_OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY).",
    );
  }
  logBlogProviderSelection(provider, model);
  const base = getOpenAiBaseUrl().replace(/\/$/, "");
  const client = new OpenAI({
    apiKey,
    baseURL: base,
  });
  const resp = await mapOpenAiSdkError(() =>
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
