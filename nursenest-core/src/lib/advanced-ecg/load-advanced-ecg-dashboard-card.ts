import "server-only";

import {
  ADVANCED_ECG_MARKETING_ROUTE,
  ADVANCED_ECG_MODULE_ROUTE,
  ADVANCED_ECG_PRICE_LABEL,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import { loadAdvancedEcgAccess } from "@/lib/advanced-ecg/advanced-ecg-access";

export type AdvancedEcgDashboardCardModel = {
  locked: boolean;
  href: string;
  ctaLabel: string;
  badgeLabel: string;
  title: string;
  body: string;
  detail: string;
  resumeHref: string | null;
};

export async function loadAdvancedEcgDashboardCardModel(resumeHref: string | null = null): Promise<AdvancedEcgDashboardCardModel> {
  const access = await loadAdvancedEcgAccess();
  const locked = !access.ok;

  return locked
    ? {
        locked: true,
        href: ADVANCED_ECG_MARKETING_ROUTE,
        ctaLabel: "View specialty module",
        badgeLabel: "Premium specialty module",
        title: "Advanced ECG & Telemetry Mastery",
        body: "Telemetry, 12-lead, ACLS, pacemaker interpretation, and premium case progressions in one ICU-grade module.",
        detail: `${ADVANCED_ECG_PRICE_LABEL} one-time purchase. Includes full Basic ECG Foundations and keeps advanced telemetry lanes locked until owned.`,
        resumeHref,
      }
    : {
        locked: false,
        href: ADVANCED_ECG_MODULE_ROUTE,
        ctaLabel: "Open specialty module",
        badgeLabel: access.mode === "admin-preview" ? "Admin preview" : "Owned specialty module",
        title: "Advanced ECG & Telemetry Mastery",
        body: "Continue from foundational ECG into premium telemetry, 12-lead, ACLS, pacemaker, and case-based interpretation.",
        detail: "Includes Basic ECG Foundations for one continuous rhythm-learning pathway from beginner review into advanced specialty work.",
        resumeHref,
      };
}
