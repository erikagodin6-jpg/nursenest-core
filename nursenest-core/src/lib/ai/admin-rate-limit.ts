import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";

/** Per-admin hourly cap for AI batch generators. */
export const ADMIN_AI_GENERATE_RATE = { windowMs: 60 * 60 * 1000, max: 12 } as const;

export async function checkAdminAiGenerateLimit(adminUserId: string) {
  return await checkRateLimitUnified(`admin-ai-gen:${adminUserId}`, ADMIN_AI_GENERATE_RATE);
}
