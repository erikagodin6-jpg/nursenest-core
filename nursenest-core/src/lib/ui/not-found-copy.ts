import { normalizeNotFoundPathname } from "@/lib/ui/not-found-recovery";

export type NotFoundCopyPair = { headline: string; subtext: string };

const ROTATING_PAIRS: NotFoundCopyPair[] = [
  { headline: "Page not found", subtext: "Use the links below to return to a valid page." },
  { headline: "We couldn’t find that page", subtext: "Use the recovery links below to continue." },
  { headline: "This route is unavailable", subtext: "Return to your study hub or a nearby page." },
  { headline: "That address does not match a page here", subtext: "Choose a valid destination below." },
];

export function hashPathForIndex(pathname: string): number {
  let h = 0;
  const p = pathname || "/";
  for (let i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) >>> 0;
  return h;
}

export function pickNotFoundCopy(pathname: string | null | undefined): NotFoundCopyPair {
  const normalized = normalizeNotFoundPathname(pathname);
  const idx = hashPathForIndex(normalized);
  return ROTATING_PAIRS[idx % ROTATING_PAIRS.length]!;
}
