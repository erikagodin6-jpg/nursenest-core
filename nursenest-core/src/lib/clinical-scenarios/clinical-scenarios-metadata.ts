import type { Metadata } from "next";

/** Clinical scenario surfaces stay non-indexable until editorial/legal launch. */
export function clinicalScenariosRobotsMetadata(): Metadata["robots"] {
  return { index: false, follow: false, googleBot: { index: false, follow: false } };
}
