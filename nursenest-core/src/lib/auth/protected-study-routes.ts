/**
 * Central classifier for protected study routes.
 *
 * Single source of truth for:
 * - Which /app paths are study routes (tier-scoped or content-addressed)
 * - How to validate callback URLs so they survive login redirects
 * - How to detect session IDs that cannot be restored after logout
 *
 * Adding a new study route: add its base path to STUDY_ROUTE_PREFIXES.
 * Callback validation works automatically — no other files need changes.
 */

// ─── Route prefix registries ─────────────────────────────────────────────────

/**
 * All study route base paths. Any subpath is implicitly included.
 *
 * Adding a prefix here is the ONLY change needed to make a new study route
 * survive post-login callback restoration.
 */
export const STUDY_ROUTE_PREFIXES = [
  "/app/flashcards",
  "/app/practice-tests",
  "/app/questions",
  "/app/practice-exams",
  "/app/cat",
  "/app/exams",
] as const;

export type StudyRoutePrefix = (typeof STUDY_ROUTE_PREFIXES)[number];

/**
 * Non-study learner routes that can be freely deep-linked without pathwayId.
 * These are NOT tier-scoped — they do not need pathway validation.
 */
export const LEARNER_DEEP_LINK_PREFIXES = [
  "/app/lessons",
  "/app/account/analytics",
  "/app/study-plan",
  "/app/study-coach",
  "/app/exam-plan",
  "/app/guided",
  "/app/start-studying",
] as const;

/** Paths that must never be used as auth callback destinations. */
const AUTH_BLOCKLIST_PREFIXES = [
  "/login",
  "/signup",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

// ─── Regex constants ──────────────────────────────────────────────────────────

/**
 * Valid pathway ID slug: lowercase letter start, letters/digits/hyphens, 6–81 chars total.
 * Matches the same constraint as the DB-side pathway ID format.
 */
export const PATHWAY_ID_RE = /^[a-z][a-z0-9-]{5,80}$/i;

/**
 * Session-ID segment detector.
 *
 * Matches generated identifiers that appear in practice-session URLs and should
 * not be restored after logout (the session is gone):
 * - UUID v1–v5:  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * - Prisma CUID: c[a-z0-9]{24}  (always starts with 'c', 25 chars)
 * - CUID2/ULID:  any 20+ char segment of [a-z0-9] without hyphens
 *
 * Named route segments (e.g. "custom", "start", "nclex-rn-fundamentals") are
 * too short OR contain hyphens, so they never match.
 */
const SESSION_SEGMENT_RE =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9]{20,})$/i;

// ─── Typed helpers ────────────────────────────────────────────────────────────

/** True if `pathname` is under (or exactly equals) a known study route prefix. */
export function isStudyRoutePath(pathname: string): boolean {
  return STUDY_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * True if `pathname` is a study route that is safe to restore after login.
 * Rejects paths with session ID segments — those sessions are invalid once logged out.
 */
export function isProtectedStudyRoute(pathname: string): boolean {
  return isStudyRoutePath(pathname) && !hasSessionIdSegment(pathname);
}

/**
 * True if any path segment at depth ≥ 3 (`/app/{route}/{here}`) looks like a
 * generated session ID (UUID, CUID, CUID2, ULID).
 *
 * Depth-2 segments (the route name itself: "flashcards", "practice-tests") are
 * intentionally skipped — they are never session IDs.
 */
export function hasSessionIdSegment(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  // parts[0] = "app", parts[1] = route name, parts[2+] = sub-segments
  return parts.slice(2).some((seg) => SESSION_SEGMENT_RE.test(seg));
}

/** True if `value` is a well-formed pathway ID slug. */
export function isValidPathwayId(value: string | null | undefined): boolean {
  const v = (value ?? "").trim();
  return v.length > 0 && PATHWAY_ID_RE.test(v);
}

/**
 * True if `raw` is a safe same-origin return path (starts with `/`, not API,
 * not an auth page, not the bare `/app` shell).
 *
 * This is a structural check only. For study-route callback validation use
 * {@link normalizeStudyCallback}; for full learner deep-link validation use
 * {@link isValidLearnerReturnPath}.
 */
export function isValidAuthReturnPath(raw: string | null | undefined): boolean {
  const s = (raw ?? "").trim();
  if (!s.startsWith("/")) return false;
  const pathname = s.split("?")[0] ?? s;
  if (pathname === "/app" || pathname === "/app/") return false;
  if (pathname.startsWith("/api/")) return false;
  if (
    AUTH_BLOCKLIST_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
  )
    return false;
  return true;
}

/**
 * True if `pathname` is a non-study learner route that can be freely deep-linked
 * (e.g., `/app/lessons`, `/app/account/analytics`).
 */
export function isLearnerDeepLinkPath(pathname: string): boolean {
  return LEARNER_DEEP_LINK_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// ─── Callback normalization ───────────────────────────────────────────────────

/**
 * Validates and normalizes a study-route callback URL for use as a post-login destination.
 *
 * Rules applied in order:
 * 1. Path must start with a known study route prefix ({@link STUDY_ROUTE_PREFIXES}).
 * 2. Path must not contain a session-ID segment ({@link hasSessionIdSegment}) —
 *    those sessions are gone after logout.
 * 3. **Hub routes** (path exactly equals the prefix, e.g. `/app/flashcards`) require a
 *    valid `pathwayId` query param to prevent cross-tier silent fallbacks.
 * 4. **Sub-routes** (paths deeper than the prefix, e.g. `/app/flashcards/custom`,
 *    `/app/flashcards/nclex-rn-fundamentals`) allow `pathwayId` to be absent —
 *    the path itself identifies the content. If `pathwayId` IS present it must be valid.
 *
 * @returns Normalized `pathname + search + hash`, or `null` if the URL is invalid.
 */
export function normalizeStudyCallback(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.trim(), "http://localhost");

    // Reject absolute URLs pointing to a different origin (open-redirect guard).
    // Relative paths parsed against the base always get hostname "localhost".
    if (u.hostname !== "localhost") return null;

    const { pathname } = u;

    const matchedPrefix = STUDY_ROUTE_PREFIXES.find(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    if (!matchedPrefix) return null;

    if (hasSessionIdSegment(pathname)) return null;

    const pid = u.searchParams.get("pathwayId")?.trim() ?? null;
    const isPracticeExamSetupHub =
      pathname === "/app/practice-tests" &&
      (u.searchParams.get("startMode") === "practice_exam" ||
        u.searchParams.get("cat") === "1" ||
        u.searchParams.get("cat") === "true");

    // Hub routes require pathwayId — prevents cross-tier silent fallbacks.
    // Practice exam setup is the one safe hub-level exception: the authenticated hub
    // resolves the learner's pathway server-side and renders an explicit picker.
    if (pathname === matchedPrefix && !isValidPathwayId(pid) && !isPracticeExamSetupHub) return null;

    // Sub-routes: pathwayId optional (content-addressed by path), but must be valid if given.
    if (pid !== null && !isValidPathwayId(pid)) return null;

    return `${pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
