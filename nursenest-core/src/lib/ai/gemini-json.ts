import { z } from "zod";

export type GeminiJsonErrorCode =
  | "missing_api_key"
  | "timeout"
  | "quota"
  | "upstream"
  | "malformed_response";

export class GeminiJsonError extends Error {
  code: GeminiJsonErrorCode;

  constructor(code: GeminiJsonErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "GeminiJsonError";
  }
}

type GeminiGenerateJsonParams<T> = {
  schema: z.ZodType<T>;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  timeoutMs?: number;
  malformedRetries?: number;
  model?: string;
};

function extractCandidateText(payload: unknown): string {
  const obj = payload as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const parts = obj.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("").trim();
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(trimmed);
  const unfenced = fenced ? fenced[1].trim() : trimmed;
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new GeminiJsonError("malformed_response", "Gemini response did not contain a JSON object.");
  }
  try {
    return JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    throw new GeminiJsonError("malformed_response", "Gemini returned invalid JSON.");
  }
}

function classifyUpstreamError(status: number, bodyText: string): GeminiJsonError {
  const snippet = bodyText.slice(0, 400);
  if (status === 429 || (status === 403 && /quota|rate|exceed/i.test(snippet))) {
    return new GeminiJsonError("quota", `Gemini quota/rate limit: HTTP ${status}${snippet ? `: ${snippet}` : ""}`);
  }
  return new GeminiJsonError("upstream", `Gemini HTTP ${status}${snippet ? `: ${snippet}` : ""}`);
}

/**
 * Minimal Gemini JSON wrapper with bounded retries only for malformed structured output.
 */
export async function generateGeminiJson<T>(params: GeminiGenerateJsonParams<T>): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiJsonError(
      "missing_api_key",
      "Missing GEMINI_API_KEY. For local dev, set it in nursenest-core/.env.local (or .env) and restart next dev.",
    );
  }

  const model = params.model ?? process.env.GEMINI_MODEL?.trim() ?? "gemini-2.5-flash";
  const timeoutMs = params.timeoutMs ?? 45000;
  const malformedRetries = Math.max(0, Math.min(2, params.malformedRetries ?? 1));
  const attempts = malformedRetries + 1;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);
    let rawText = "";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: params.systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: params.userPrompt }] }],
          generationConfig: {
            temperature: params.temperature ?? 0.3,
            responseMimeType: "application/json",
          },
        }),
      });
      rawText = await res.text();
      if (!res.ok) throw classifyUpstreamError(res.status, rawText);

      let parsedPayload: unknown;
      try {
        parsedPayload = JSON.parse(rawText);
      } catch {
        throw new GeminiJsonError("malformed_response", "Gemini returned non-JSON HTTP payload.");
      }

      const candidateText = extractCandidateText(parsedPayload);
      if (!candidateText) {
        throw new GeminiJsonError("malformed_response", "Gemini returned empty content.");
      }

      const json = extractJsonObject(candidateText);
      const validated = params.schema.safeParse(json);
      if (!validated.success) {
        throw new GeminiJsonError("malformed_response", `Gemini JSON failed schema validation: ${validated.error.message}`);
      }
      return validated.data;
    } catch (error) {
      const isAbort = error instanceof Error && error.name === "AbortError";
      if (isAbort) {
        throw new GeminiJsonError("timeout", `Gemini request timed out after ${timeoutMs}ms.`);
      }
      if (error instanceof GeminiJsonError) {
        if (error.code === "malformed_response" && attempt < attempts) {
          continue;
        }
        throw error;
      }
      const msg = error instanceof Error ? error.message : String(error);
      throw new GeminiJsonError("upstream", `Gemini request failed: ${msg}`);
    } finally {
      clearTimeout(timer);
    }
  }

  throw new GeminiJsonError("malformed_response", "Gemini returned invalid structured output after retries.");
}
