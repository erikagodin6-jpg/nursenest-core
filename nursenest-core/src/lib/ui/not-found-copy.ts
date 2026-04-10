import type { ThemeGroup } from "@/lib/theme/theme-registry";

export type NotFoundCopyPair = { headline: string; subtext: string };

/** Rotating pairs; index derived from pathname hash for stability per URL. */
const LIGHT_PAIRS: NotFoundCopyPair[] = [
  { headline: "This page took a little detour", subtext: "Your next study step is still close by." },
  { headline: "We couldn’t find that page", subtext: "We’ll help you find your way back." },
  { headline: "Looks like this page wandered off", subtext: "Let’s guide you somewhere useful." },
  { headline: "That address doesn’t match anything here", subtext: "No worries — let’s head back to something helpful." },
];

const DARK_PAIRS: NotFoundCopyPair[] = [
  { headline: "Page not found", subtext: "Here’s a clear path back into your prep." },
  { headline: "We couldn’t find that page", subtext: "Choose a destination below to continue." },
  { headline: "This link isn’t available", subtext: "Your study tools are still one tap away." },
];

const PASTEL_WARM_PAIRS: NotFoundCopyPair[] = [
  { headline: "This page took a gentle detour", subtext: "Your next study step is still close by." },
  { headline: "We couldn’t find that page", subtext: "Let’s get you somewhere calm and useful." },
  { headline: "Looks like this page wandered off", subtext: "We’ll help you find your way back." },
];

function hashPathForIndex(pathname: string): number {
  let h = 0;
  for (let i = 0; i < pathname.length; i++) h = (h * 31 + pathname.charCodeAt(i)) >>> 0;
  return h;
}

function isPastelThemeId(themeId: string): boolean {
  return (
    themeId.includes("blush") ||
    themeId.includes("rose") ||
    themeId.includes("lavender") ||
    themeId.includes("lilac") ||
    themeId.includes("strawberry") ||
    themeId.includes("coral") ||
    themeId === "multi-pastel"
  );
}

/**
 * Theme-aware 404 headline + subtext. Uses resolved theme group + id for soft variation.
 */
export function pickNotFoundCopy(pathname: string, themeId: string | undefined, themeGroup: ThemeGroup | undefined): NotFoundCopyPair {
  const idx = hashPathForIndex(pathname || "/");
  const group = themeGroup ?? "light";
  if (group === "dark") {
    const row = DARK_PAIRS[idx % DARK_PAIRS.length]!;
    return row;
  }
  if (themeId && isPastelThemeId(themeId)) {
    const row = PASTEL_WARM_PAIRS[idx % PASTEL_WARM_PAIRS.length]!;
    return row;
  }
  return LIGHT_PAIRS[idx % LIGHT_PAIRS.length]!;
}
