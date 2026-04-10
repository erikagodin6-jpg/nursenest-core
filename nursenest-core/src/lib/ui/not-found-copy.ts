import { normalizeNotFoundPathname } from "@/lib/ui/not-found-recovery";

export type NotFoundCopyPair = { headline: string; subtext: string };

/**
 * Rotating pairs; index derived from normalized pathname hash for stability per URL.
 * Pathname-only selection keeps SSR and client renders identical (no theme hook on the client).
 */
const ROTATING_PAIRS: NotFoundCopyPair[] = [
  { headline: "This page took a little detour", subtext: "Your next study step is still close by." },
  { headline: "We couldn’t find that page", subtext: "We’ll help you find your way back." },
  { headline: "Looks like this page wandered off", subtext: "Let’s guide you somewhere useful." },
  { headline: "That address doesn’t match anything here", subtext: "No worries — let’s head back to something helpful." },
];

export function hashPathForIndex(pathname: string): number {
  let h = 0;
  const p = pathname || "/";
  for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Deterministic 404 headline + subtext from pathname only (hydration-safe with `usePathname()`).
 */
export function pickNotFoundCopy(pathname: string | null | undefined): NotFoundCopyPair {
  const normalized = normalizeNotFoundPathname(pathname);
  const idx = hashPathForIndex(normalized);
  return ROTATING_PAIRS[idx % ROTATING_PAIRS.length]!;
}
