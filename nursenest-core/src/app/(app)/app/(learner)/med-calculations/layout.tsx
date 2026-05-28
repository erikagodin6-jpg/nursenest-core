import type { ReactNode } from "react";
import "@/app/med-calc-workstation.css";
import { MedCalcWorkstationShell } from "@/components/med-calculations/med-calc-workstation-shell";
import {
  listMedCalcCategoriesForTrack,
  listMedCalcLessonsForTrack,
} from "@/lib/med-calculations/med-calculations-engine";
import { loadMedCalculationsRouteContext } from "@/lib/med-calculations/med-calculations-route-loader";
import { auth } from "@/lib/auth";
import { buildMedCalcWorkstationNav, pickMedCalcContinueTarget } from "@/lib/med-calculations/med-calc-workstation-nav";
import {
  findLatestMedCalcProgressTouch,
  loadMedCalcLessonProgressMap,
} from "@/lib/med-calculations/med-calc-lesson-progress";

export default async function MedCalcWorkstationLayout({ children }: { children: ReactNode }) {
  let context;
  try {
    context = await loadMedCalculationsRouteContext("(student).app.(learner).med-calculations.layout");
  } catch {
    return <div className="px-4 py-8 text-sm text-[var(--semantic-text-secondary)]">{children}</div>;
  }

  const categories = listMedCalcCategoriesForTrack(context.track);
  const navCategories = buildMedCalcWorkstationNav(categories);
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const allLessons = listMedCalcLessonsForTrack(context.track);
  const progressMap = userId ? await loadMedCalcLessonProgressMap(userId, context.track, allLessons) : {};
  const lastTouch = userId ? await findLatestMedCalcProgressTouch(userId, context.track, allLessons) : null;
  const continueTarget = pickMedCalcContinueTarget(categories, progressMap, lastTouch);

  return (
    <MedCalcWorkstationShell
      categories={navCategories}
      hasAccess={context.hasAccess}
      continueHref={continueTarget.href}
      continueTitle={continueTarget.title}
      progressMap={progressMap}
    >
      {children}
    </MedCalcWorkstationShell>
  );
}
