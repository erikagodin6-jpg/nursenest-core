/**
 * Heuristic filters — never click controls that look destructive.
 * Locale-tolerant: matches common English UI verbs; extend with more locales as needed.
 */
const DESTRUCTIVE_RE =
  /\b(delete|remove|cancel\s+subscription|unsubscribe|revoke|clear\s+all|purge|archive|trash|permanently|erase\s+account|downgrade|refund|disconnect)\b/i;

const LOGOUT_RE = /\b(log\s*out|sign\s*out|log\s*off)\b/i;

/** Payment / billing mutations — avoid in production-safe audits. */
const BILLING_RE =
  /\b(update\s+payment|change\s+plan|cancel\s+plan|pay\s+now|confirm\s+purchase|checkout|subscribe\s+now)\b/i;

export function textBlob(ctrl: { text: string; ariaLabel: string | null; dataTestId: string | null }): string {
  return [ctrl.text, ctrl.ariaLabel, ctrl.dataTestId].filter(Boolean).join(" \n ");
}

export function isLikelyDestructive(ctrl: { text: string; ariaLabel: string | null; dataTestId: string | null }): boolean {
  const b = textBlob(ctrl);
  return DESTRUCTIVE_RE.test(b);
}

export function isLogoutControl(ctrl: { text: string; ariaLabel: string | null }): boolean {
  const b = textBlob({ ...ctrl, dataTestId: null });
  return LOGOUT_RE.test(b);
}

export function isLikelyBillingMutation(ctrl: { text: string; ariaLabel: string | null }): boolean {
  const b = textBlob({ ...ctrl, dataTestId: null });
  return BILLING_RE.test(b);
}

/**
 * Safe to probe in default production-safe mode (no billing, no destructive, no logout).
 */
export function isSafeForDefaultAudit(ctrl: {
  text: string;
  ariaLabel: string | null;
  dataTestId: string | null;
  disabled: boolean;
  href: string | null;
}): boolean {
  if (ctrl.disabled) return false;
  if (isLikelyDestructive(ctrl)) return false;
  if (isLogoutControl(ctrl)) return false;
  if (isLikelyBillingMutation(ctrl)) return false;
  if (ctrl.href) {
    try {
      const u = new URL(ctrl.href, "http://local.invalid");
      if (u.protocol === "mailto:" || u.protocol === "tel:" || u.protocol === "javascript:") return false;
      const path = u.pathname.toLowerCase();
      if (path.includes("/logout") || path.includes("sign-out")) return false;
    } catch {
      return false;
    }
  }
  return true;
}
