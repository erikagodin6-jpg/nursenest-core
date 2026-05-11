export const MODULE_ADD_ON_PLAN_CODE_PREFIX = "module_" as const;

export function normalizePlanCode(planCode: string | null | undefined): string | null {
  const normalized = planCode?.trim().toLowerCase() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export function isModuleAddOnPlanCode(planCode: string | null | undefined): boolean {
  const normalized = normalizePlanCode(planCode);
  return normalized?.startsWith(MODULE_ADD_ON_PLAN_CODE_PREFIX) ?? false;
}

export function isBaseSubscriptionPlanCode(planCode: string | null | undefined): boolean {
  return !isModuleAddOnPlanCode(planCode);
}

export function pickLatestBaseSubscription<T extends { planCode: string | null | undefined }>(rows: readonly T[]): T | null {
  return rows.find((row) => isBaseSubscriptionPlanCode(row.planCode)) ?? null;
}
