/**
 * Blog-only AI chat completions: OpenAI (default) or OpenRouter via the OpenAI SDK.
 * Non-blog callers continue to use {@link openAiChatCompletion} without `useBlogOpenAiApiKey`.
 */
import OpenAI from "openai";
import type { ChatCompletionResult } from "@/lib/ai/openai-chat-completions";
import { getBlogOpenAiApiKey, getBlogOpenAiChatModel, getOpenAiBaseUrl } from "@/lib/ai/openai-env";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type BlogAiChatProvider = "openai" | "openrouter" | "gemini";

/** Normalized blog AI routing for chat completions (Gemini uses a separate draft path). */
export function getBlogAiChatProvider(): BlogAiChatProvider {
  const raw = process.env.BLOG_AI_PROVIDER?.trim().toLowerCase();
  if (raw === "openrouter") return "openrouter";
  if (raw === "gemini") return "gemini";
  return "openai";
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
      "BLOG_AI_PROVIDER=gemini does not use OpenAI-compatible chat completions; use generateGeminiBlogDraft or set BLOG_AI_PROVIDER=openai|openrouter.",
    );
  }

  const model = params.model?.trim() || getBlogOpenAiChatModel();
  const user = params.user ? String(params.user).slice(0, 128) : undefined;

  if (provider === "openrouter") {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is required when BLOG_AI_PROVIDER=openrouter");
    }
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
    const resp = await client.chat.completions.create({
      model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      ...(user ? { user } : {}),
    });
    const content = resp.choices[0]?.message?.content ?? "";
    return { content, totalTokens: resp.usage?.total_tokens };
  }

  const apiKey = getBlogOpenAiApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when BLOG_AI_PROVIDER=openai");
  }
  const base = getOpenAiBaseUrl().replace(/\/$/, "");
  const client = new OpenAI({
    apiKey,
    baseURL: base,
  });
  const resp = await client.chat.completions.create({
    model,
    messages: params.messages,
    temperature: params.temperature,
    max_tokens: params.maxTokens,
    ...(user ? { user } : {}),
  });
  const content = resp.choices[0]?.message?.content ?? "";
  return { content, totalTokens: resp.usage?.total_tokens };
}
