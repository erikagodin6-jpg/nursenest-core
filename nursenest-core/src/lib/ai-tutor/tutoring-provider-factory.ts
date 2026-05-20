import { StubTutoringProvider } from "@/lib/ai-tutor/tutoring-provider";
import type { TutoringProvider } from "@/lib/ai-tutor/types";

export type TutoringProviderFactoryKind = "stub";

/**
 * Central factory — keeps call sites provider-agnostic. New kinds register here only.
 */
export function createTutoringProvider(kind: TutoringProviderFactoryKind = "stub"): TutoringProvider {
  switch (kind) {
    case "stub":
      return new StubTutoringProvider();
    default:
      return new StubTutoringProvider();
  }
}
