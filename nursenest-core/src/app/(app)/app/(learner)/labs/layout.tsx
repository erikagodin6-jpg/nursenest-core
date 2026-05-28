import type { ReactNode } from "react";
import "@/app/labs-workstation.css";
import { LabsWorkstationShell } from "@/components/labs/labs-workstation-shell";
import { listLabCategoriesForTrack } from "@/lib/labs/labs-engine";
import { loadLabsRouteContext } from "@/lib/labs/labs-route-loader";
import { auth } from "@/lib/auth";
import { buildLabsWorkstationNav, pickLabsContinueTarget } from "@/lib/labs/labs-workstation-nav";
import { findLatestLabProgressTouch, loadLabLessonProgressMap } from "@/lib/labs/lab-lesson-progress";
import { listLabLessonsForTrack } from "@/lib/labs/labs-engine";

export default async function LabsWorkstationLayout({ children }: { children: ReactNode }) {
  let context;
  try {
    context = await loadLabsRouteContext("(student).app.(learner).labs.layout");
  } catch {
    return <div className="px-4 py-8 text-sm text-[var(--semantic-text-secondary)]">{children}</div>;
  }

  const entitlementScope = context.entitlement !== "error" ? context.entitlement : undefined;
  const categories = listLabCategoriesForTrack(context.track, entitlementScope);
  const navCategories = buildLabsWorkstationNav(categories);
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const allLessons = listLabLessonsForTrack(context.track, entitlementScope);
  const progressMap = userId
    ? await loadLabLessonProgressMap(userId, context.track, allLessons, entitlementScope)
    : {};
  const lastTouch = userId ? await findLatestLabProgressTouch(userId, context.track, allLessons) : null;
  const continueTarget = pickLabsContinueTarget(categories, progressMap, lastTouch);

  return (
    <LabsWorkstationShell
      categories={navCategories}
      hasAccess={context.hasAccess}
      continueHref={continueTarget.href}
      continueTitle={continueTarget.title}
      progressMap={progressMap}
    >
      {children}
    </LabsWorkstationShell>
  );
}
