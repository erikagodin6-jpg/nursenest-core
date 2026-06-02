import { revalidatePath, revalidateTag } from "next/cache";

export const RELIABILITY_SELF_HEAL_ACTION = "revalidate-critical-paths" as const;

/** Allowlisted steps (for tests + operator transparency). Must match execution order below. */
export const SELF_HEAL_REVALIDATION_STEP_LABELS: readonly string[] = [
  'revalidatePath("/")',
  'revalidatePath("/pricing")',
  'revalidatePath("/blog")',
  'revalidatePath("/sitemap.xml")',
  'revalidatePath("/sitemap-allied.xml")',
  'revalidatePath("/sitemap-new-grad.xml")',
  'revalidateTag("pricing", "default")',
  'revalidateTag("marketing", "default")',
  'revalidateTag("lessons", "default")',
] as const;

export type SelfHealParseResult =
  | { ok: true; action: typeof RELIABILITY_SELF_HEAL_ACTION }
  | { ok: false; error: string };

export function parseSelfHealBody(body: unknown): SelfHealParseResult {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid_body" };
  const action = (body as { action?: unknown }).action;
  if (action !== RELIABILITY_SELF_HEAL_ACTION) return { ok: false, error: "unknown_action" };
  return { ok: true, action };
}

/**
 * Safe ISR/cache hints only — no DB, Stripe, filesystem, or global purge.
 */
export async function executeRevalidateCriticalPaths(): Promise<string[]> {
  revalidatePath("/");
  revalidatePath("/pricing");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap-allied.xml");
  revalidatePath("/sitemap-new-grad.xml");
  revalidateTag("pricing", "default");
  revalidateTag("marketing", "default");
  revalidateTag("lessons", "default");
  return [...SELF_HEAL_REVALIDATION_STEP_LABELS];
}
