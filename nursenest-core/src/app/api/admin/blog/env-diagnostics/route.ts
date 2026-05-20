import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { getBlogAiChatProvider } from "@/lib/ai/blog-ai-routing";
import { getBlogAiRelatedEnvKeyPresence } from "@/lib/ai/blog-ai-env-keys";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";
import { getBlogGenerationModelLabelForLogs } from "@/lib/ai/openai-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function envString(key: string): string | null {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const generationGate = getAdminAiGenerationGate({ pipeline: "blog" });
  const keys = getBlogAiRelatedEnvKeyPresence();
  const providerResolved = getBlogAiChatProvider();

  return NextResponse.json(
    {
      aiGenerationEnabled: generationGate.flagEnabled,
      providerResolved,
      modelResolved: getBlogGenerationModelLabelForLogs(),
      keys,
      nodeEnv: process.env.NODE_ENV ?? null,
      runtime: "nodejs",
      gate: {
        mode: generationGate.mode,
        runnable: generationGate.runnable,
        summaryLine: generationGate.summaryLine,
        missingEnvVarNames: generationGate.missingEnvVarNames,
        diagnostics: generationGate.diagnostics,
      },
      providerChain: {
        BLOG_AI_PROVIDER: envString("BLOG_AI_PROVIDER"),
        AI_PROVIDER: envString("AI_PROVIDER"),
        inferredFromOpenRouterKey: providerResolved === "openrouter" && !envString("BLOG_AI_PROVIDER") && !envString("AI_PROVIDER"),
      },
    },
    {
      headers: {
        "Cache-Control": "private, no-store, must-revalidate",
      },
    },
  );
}
