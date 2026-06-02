/**
 * Safe diagnostic for the exact Node/tsx runtime used by blog generation.
 *
 * Run:
 *   npx tsx scripts/diagnose-blog-openrouter-env.ts
 *
 * Never prints the full API key.
 */
import "../src/lib/db/script-env-bootstrap";

import { getBlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import {
  getBlogGenerationModelLabelForLogs,
  getBlogGenerationProviderLabelForLogs,
} from "@/lib/ai/openai-env";

function redactKey(raw: string | undefined): {
  present: boolean;
  length: number;
  first4: string | null;
  last4: string | null;
  hasWrappingQuotes: boolean;
  hasBearerPrefix: boolean;
  looksPlaceholder: boolean;
  looksOpenRouterFormat: boolean;
} {
  const trimmed = raw?.trim() ?? "";
  return {
    present: trimmed.length > 0,
    length: trimmed.length,
    first4: trimmed.length >= 4 ? trimmed.slice(0, 4) : null,
    last4: trimmed.length >= 4 ? trimmed.slice(-4) : null,
    hasWrappingQuotes:
      (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")),
    hasBearerPrefix: /^bearer\s+/i.test(trimmed),
    looksPlaceholder: trimmed === "dry-run-test" || trimmed === "test" || trimmed.includes("YOUR_OPENROUTER_API_KEY"),
    looksOpenRouterFormat: /^sk-or-/i.test(trimmed),
  };
}

function main(): void {
  const provider = getBlogGenerationProviderLabelForLogs();
  let model = "(unconfigured)";
  try {
    model = getBlogGenerationModelLabelForLogs();
  } catch (e) {
    model = e instanceof Error ? `ERROR: ${e.message}` : `ERROR: ${String(e)}`;
  }

  const key = redactKey(process.env.OPENROUTER_API_KEY);
  const selected = getBlogAiChatProvider();
  const diagnostics = {
    provider,
    selectedBlogProvider: selected,
    model,
    OPENROUTER_MODEL_present: Boolean(process.env.OPENROUTER_MODEL?.trim()),
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL?.trim() || null,
    OPENROUTER_API_KEY: key,
    authorizationHeaderShape:
      selected === "openrouter" && key.present && !key.hasBearerPrefix
        ? "Authorization: Bearer <OPENROUTER_API_KEY redacted>"
        : null,
    contentType: "application/json",
  };

  console.log(JSON.stringify(diagnostics, null, 2));
}

main();
