import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/** Max readable width on tablets / large phones in landscape. */
export const LEARNER_CONTENT_MAX_WIDTH = 720;

/** Minimum tappable row height (Apple HIG / Material baseline). */
export const HIT_TARGET_MIN = 44;

/**
 * Horizontal padding that keeps content centered up to {@link LEARNER_CONTENT_MAX_WIDTH} on wide layouts.
 */
export function useLearnerHorizontalPadding(maxWidth = LEARNER_CONTENT_MAX_WIDTH): number {
  const { width } = useWindowDimensions();
  return useMemo(() => {
    const base = 16;
    if (width <= maxWidth) return base;
    return Math.max(base, Math.round((width - maxWidth) / 2));
  }, [width, maxWidth]);
}
