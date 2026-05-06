/**
 * UI gates derived from server entitlement flags — never infer paid progress locally.
 */

export type LessonProgressUiEntitlement = {
  readonly hasAccess: boolean;
  readonly canShowLessonProgress: boolean;
};

export function canShowPaidLessonProgressRow(entitlement: LessonProgressUiEntitlement | null | undefined): boolean {
  return Boolean(entitlement?.hasAccess && entitlement.canShowLessonProgress);
}
