"use client";

import { SiteFooter } from "@/components/layout/site-footer";

type LearnerAppFooterProps = {
  serverHasStaffSession?: boolean;
};

/**
 * Learner `/app/*` surfaces use the same premium marketing footer as public study hubs.
 */
export function LearnerAppFooter({ serverHasStaffSession }: LearnerAppFooterProps = {}) {
  return <SiteFooter serverHasStaffSession={serverHasStaffSession} />;
}
