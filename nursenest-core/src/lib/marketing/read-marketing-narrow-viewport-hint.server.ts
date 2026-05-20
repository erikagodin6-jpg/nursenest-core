import "server-only";

import { headers } from "next/headers";
import {
  MARKETING_NARROW_VIEWPORT_HINT_HEADER,
  parseMarketingNarrowViewportHintHeader,
} from "@/lib/marketing/marketing-narrow-viewport-hint";

/** Edge/proxy sets the header — safe false when headers are unavailable (build / edge cases). */
export async function readMarketingNarrowViewportServerHint(): Promise<boolean> {
  try {
    const h = await headers();
    return parseMarketingNarrowViewportHintHeader(h.get(MARKETING_NARROW_VIEWPORT_HINT_HEADER));
  } catch {
    return false;
  }
}
