import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";

/** Per-admin hourly cap for AI batch generators. */
export const ADMIN_AI_GENERATE_RATE = { windowMs: 60 * 60 * 1000, max: 12 } as const;

export function checkAdminAiGenerateLimit(adminUserId: string) {
  return checkRateLimit(`admin-ai-gen:${adminUserId}`, ADMIN_AI_GENERATE_RATE);
}
