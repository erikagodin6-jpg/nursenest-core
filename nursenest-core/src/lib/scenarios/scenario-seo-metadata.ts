import type { Metadata } from "next";

/** OSCE / clinical scenario marketing + learner shells stay non-indexable until editorial launch. */
export function osceScenariosRobotsMetadata(): Metadata["robots"] {
  return { index: false, follow: false, googleBot: { index: false, follow: false } };
}
