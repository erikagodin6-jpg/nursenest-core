import { normalizeNotFoundPathname } from "@/lib/ui/not-found-recovery";

export type NotFoundCopyPair = { headline: string; subtext: string };

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

export function pickNotFoundCopy(pathname: string | null | undefined): NotFoundCopyPair {
  const normalized = normalizeNotFoundPathname(pathname);
  const idx = hashPathForIndex(normalized);
  return ROTATING_PAIRS[idx % ROTATING_PAIRS.length]!;
}
