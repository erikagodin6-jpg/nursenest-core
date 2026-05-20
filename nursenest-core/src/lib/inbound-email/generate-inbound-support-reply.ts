import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { buildInboundSupportSystemPrompt } from "@/lib/inbound-email/inbound-support-system-prompt";
import type { NormalizedInboundMessage } from "@/lib/inbound-email/postmark-inbound-types";

export async function generateInboundSupportReplyText(msg: NormalizedInboundMessage): Promise<string> {
  const system = buildInboundSupportSystemPrompt();
  const userContent = [
    `Incoming email summary for drafting a reply:`,
    `From: ${msg.fromEmail}${msg.fromDisplayName ? ` (${msg.fromDisplayName})` : ""}`,
    `Subject: ${msg.subject || "(no subject)"}`,
    ``,
    `Message text (may include quoted thread — focus on the latest ask):`,
    msg.textBody.slice(0, 12_000),
  ].join("\n");

  const { content } = await openAiChatCompletion({
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
    temperature: 0.35,
    maxTokens: 900,
  });

  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("OpenAI returned an empty reply body");
  }
  return trimmed;
}
