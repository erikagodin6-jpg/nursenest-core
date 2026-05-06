import { parseBooleanEnv } from "@/lib/env/parse-boolean-env";

/** Opt-in: only `true`/`1`/`yes`/`on` enables outbound AI replies. Unset → off (safe default). */
export function isInboundAiAutoReplyEnabled(): boolean {
  return parseBooleanEnv(process.env.INBOUND_AI_AUTO_REPLY_ENABLED);
}
