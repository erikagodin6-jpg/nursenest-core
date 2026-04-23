/**
 * Admin-only mobile **viewport convenience** for learner QA (iframe chrome).
 * Not a device emulator — does not change learner page rendering logic.
 */

export type AdminLearnerQaMobileViewportPreset = {
  id: string;
  label: string;
  widthPx: number;
};

/** Common CSS viewport widths for spot-checking responsive layouts. */
export const ADMIN_LEARNER_QA_MOBILE_VIEWPORT_PRESETS: readonly AdminLearnerQaMobileViewportPreset[] = [
  { id: "se", label: "Narrow phone · 360px", widthPx: 360 },
  { id: "iphone-se", label: "iPhone SE class · 375px", widthPx: 375 },
  { id: "iphone-12", label: "iPhone 12/13 · 390px", widthPx: 390 },
  { id: "iphone-plus", label: "Large phone · 414px", widthPx: 414 },
  { id: "iphone-max", label: "Max / Pro Max · 428px", widthPx: 428 },
  { id: "tablet-portrait", label: "Small tablet · 768px", widthPx: 768 },
] as const;

export type AdminLearnerQaMobileFlowLink = { label: string; path: string; hint?: string };

/** In-app learner URLs safe to frame for QA (all under `/app/`). */
export const ADMIN_LEARNER_QA_MOBILE_FLOW_LINKS: readonly AdminLearnerQaMobileFlowLink[] = [
  { label: "Lessons hub (open a lesson)", path: "/app/lessons", hint: "Pick any lesson for premium shell + paywall behavior." },
  { label: "Flashcards", path: "/app/flashcards" },
  { label: "CAT launch", path: "/app/practice-tests/cat-launch" },
  { label: "Practice exams hub", path: "/app/practice-tests" },
  { label: "Billing / paywall", path: "/app/account/billing" },
  { label: "Study home", path: "/app" },
  { label: "Question bank", path: "/app/questions" },
  { label: "Command center", path: "/app/command-center" },
  { label: "Start studying", path: "/app/start-studying" },
  { label: "Study plan", path: "/app/study-plan" },
] as const;

const DEFAULT_IFRAME_PATH = "/app";
const MIN_WIDTH = 320;
const MAX_WIDTH = 896;

function stripQueryAndHash(path: string): string {
  const noHash = path.split("#")[0] ?? path;
  return noHash.split("?")[0] ?? noHash;
}

/**
 * Restrict iframe targets to same-app learner routes (prefix `/app/`).
 * Rejects scheme-relative URLs, traversal, and non-app prefixes.
 */
export function sanitizeAdminLearnerQaIframePath(raw: string | null | undefined): string {
  const s0 = (raw ?? "").trim();
  if (!s0) return DEFAULT_IFRAME_PATH;
  let s = s0;
  if (!s.startsWith("/")) return DEFAULT_IFRAME_PATH;
  if (s.startsWith("//")) return DEFAULT_IFRAME_PATH;
  s = stripQueryAndHash(s);
  if (s.includes("..")) return DEFAULT_IFRAME_PATH;
  if (s.length > 512) return DEFAULT_IFRAME_PATH;
  /** `/app` or `/app/...` only — reject `/apple`, `/apply`, etc. */
  if (s === "/app") return s;
  if (!s.startsWith("/app/")) return DEFAULT_IFRAME_PATH;
  return s;
}

export function clampAdminLearnerQaPreviewWidth(raw: string | number | null | undefined): number {
  const n = typeof raw === "number" ? raw : Number.parseInt(String(raw ?? "").trim(), 10);
  if (!Number.isFinite(n) || n < MIN_WIDTH) return 390;
  return Math.min(MAX_WIDTH, Math.round(n));
}

export function adminLearnerQaMobilePreviewHref(path: string, widthPx: number): string {
  const p = sanitizeAdminLearnerQaIframePath(path);
  const w = clampAdminLearnerQaPreviewWidth(widthPx);
  return `/admin/learner-qa/mobile?path=${encodeURIComponent(p)}&width=${w}`;
}
