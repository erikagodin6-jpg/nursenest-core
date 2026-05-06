import type { Metadata } from "next";
import type { ReactNode } from "react";
import { studyToolsRobotsDirective } from "@/lib/study-tools/study-tools-metadata";
import { requireStudyToolsRouteAccess } from "@/lib/study-tools/study-tools-route-access.server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Study tools",
    robots: studyToolsRobotsDirective(),
  };
}

export default async function StudyToolsRouteGroupLayout({ children }: { children: ReactNode }) {
  await requireStudyToolsRouteAccess();
  return <>{children}</>;
}
