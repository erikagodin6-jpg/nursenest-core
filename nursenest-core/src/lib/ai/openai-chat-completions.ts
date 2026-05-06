import {
  blogOpenRouterChatCompletion,
  getEffectiveBlogAiProvider,
  getBlogAiChatModel,
} from "@/lib/ai/blog-ai-provider";
import {
  getBlogOpenAiApiKey,
  getOpenAiApiKey,
  getOpenAiBaseUrl,
  getOpenAiChatModel,
} from "@/lib/ai/openai-env";

function resolveChatModel(explicit?: string): string {
  const t = explicit?.trim();
  if (t) return t;
  return getOpenAiChatModel();
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatCompletionResult = {
  content: string;
  totalTokens?: number;
};

/**
 * OpenAI-compatible chat completions via fetch (no `openai` SDK — keeps server deps minimal).
 * Honors AI_INTEGRATIONS_OPENAI_BASE_URL for Azure/OpenAI-compatible proxies.
 */
export async function openAiChatCompletion(params: {
  messages: ChatMessage[];
  temperature: number;
  maxTokens: number;
  /** OpenAI `user` field — stable per generation attempt for tracing / abuse signals. */
  user?: string;
  /**
   * When set, overrides {@link getOpenAiChatModel} (use {@link getBlogOpenAiChatModel} / {@link getLessonOpenAiChatModel} for those pipelines).
   */
  model?: string;
  /**
   * When true, resolve API key with {@link getBlogOpenAiApiKey} (`BLOG_OPENAI_API_KEY` first), unless
   * `BLOG_AI_PROVIDER=openrouter` (then {@link OPENROUTER_API_KEY} via OpenRouter-compatible SDK).
   * Blog pipelines should set this; other callers use shared {@link getOpenAiApiKey}.
   */
  useBlogOpenAiApiKey?: boolean;
}): Promise<ChatCompletionResult> {
  if (params.useBlogOpenAiApiKey) {
    const provider = getEffectiveBlogAiProvider();
    if (provider === "gemini") {
      throw new Error(
        "BLOG_AI_PROVIDER=gemini is not supported for OpenAI-compatible blog chat; set BLOG_AI_PROVIDER=openai|openrouter or use the admin Gemini draft endpoint.",
      );
    }
    if (provider === "openrouter") {
      const model = params.model?.trim() ? params.model.trim() : getBlogAiChatModel();
      return blogOpenRouterChatCompletion({
        messages: params.messages,
        temperature: params.temperature,
        maxTokens: params.maxTokens,
        model,
        user: params.user,
      });
    }
  }

  const key = params.useBlogOpenAiApiKey ? getBlogOpenAiApiKey() : getOpenAiApiKey();
  if (!key) {
    throw new Error(
      params.useBlogOpenAiApiKey
        ? "Missing BLOG_OPENAI_API_KEY (or AI_INTEGRATIONS_OPENAI_API_KEY / OPENAI_API_KEY)"
        : "Missing AI_INTEGRATIONS_OPENAI_API_KEY (or OPENAI_API_KEY)",
    );
  }

  const base = getOpenAiBaseUrl().replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  const model = resolveChatModel(params.model);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      ...(params.user ? { user: String(params.user).slice(0, 128) } : {}),
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    const snippet = rawText.slice(0, 500);
    throw new Error(`OpenAI HTTP ${res.status}${snippet ? `: ${snippet}` : ""}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid JSON from OpenAI response");
  }

  const obj = data as {
    choices?: { message?: { content?: string } }[];
    usage?: { total_tokens?: number };
  };
  const content = obj.choices?.[0]?.message?.content ?? "";
  return {
    content,
    totalTokens: obj.usage?.total_tokens,
  };
}
