/**
 * Future hook: sensitive account changes (email, password, billing) can require a recent
 * second factor or password re-check. Export constants so routes can align without importing secrets.
 */
export const STEP_UP_HEADER = "x-nn-step-up";

export function readStepUpHeader(req: Request): string | null {
  const v = req.headers.get(STEP_UP_HEADER)?.trim();
  return v && v.length > 0 ? v : null;
}
