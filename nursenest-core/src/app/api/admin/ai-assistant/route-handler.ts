import { NextResponse } from "next/server";
import {
  adminAiAssistantRequestSchema,
  buildAdminAiAssistantMessages,
  ensureAdminAiAssistantDraftLabel,
  getAdminAiAssistantTaskMeta,
} from "@/lib/admin/admin-ai-assistant";

type RequireAdminResult =
  | { ok: false; response: NextResponse }
  | { ok: true; admin: { userId: string; role: string; tier: string } };

export type AdminAiAssistantRouteDeps = {
  requireAdmin: (req: Request) => Promise<RequireAdminResult>;
  adminAiGenerationHttpBlock: () => NextResponse | null;
  openAiChatCompletion: (params: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature: number;
    maxTokens: number;
  }) => Promise<{ content: string; totalTokens?: number }>;
};

export async function postAdminAiAssistant(req: Request, deps: AdminAiAssistantRouteDeps) {
  const gate = await deps.requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = deps.adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const parsed = adminAiAssistantRequestSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const task = getAdminAiAssistantTaskMeta(parsed.data.taskType);
  const completion = await deps.openAiChatCompletion({
    messages: buildAdminAiAssistantMessages(parsed.data),
    temperature: 0.35,
    maxTokens: 1400,
  });

  return NextResponse.json({
    ok: true,
    taskType: parsed.data.taskType,
    taskLabel: task.label,
    output: ensureAdminAiAssistantDraftLabel(completion.content),
    notice: "Draft only. Review and approve manually before any real-world use.",
    totalTokens: completion.totalTokens,
  });
}
