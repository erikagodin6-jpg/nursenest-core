import type { Metadata } from "next";
import { isStudyToolsPubliclyEnabled } from "@/lib/study-tools/study-tools-feature-flag";

export function studyToolsRobotsDirective(): Metadata["robots"] {
  return isStudyToolsPubliclyEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } };
}

export function buildStudyToolsActivityMetadata(title: string): Metadata {
  return {
    title: `${title} · Study tools`,
    robots: studyToolsRobotsDirective(),
  };
}
