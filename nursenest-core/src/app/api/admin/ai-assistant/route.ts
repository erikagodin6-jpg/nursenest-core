import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { postAdminAiAssistant } from "@/app/api/admin/ai-assistant/route-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  return postAdminAiAssistant(req, {
    requireAdmin,
    adminAiGenerationHttpBlock,
    openAiChatCompletion,
  });
}
