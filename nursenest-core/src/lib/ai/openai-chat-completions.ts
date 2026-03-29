import { getOpenAiChatModel } from "@/lib/ai/openai-env";

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
}): Promise<ChatCompletionResult> {
  const key = process.env.AI_INTEGRATIONS_OPENAI_API_KEY?.trim();
  if (!key) {
    throw new Error("Missing AI_INTEGRATIONS_OPENAI_API_KEY");
  }

  const base =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL?.replace(/\/$/, "") || "https://api.openai.com/v1";
  const url = `${base}/chat/completions`;
  const model = getOpenAiChatModel();

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
