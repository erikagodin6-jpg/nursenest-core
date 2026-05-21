"use client";

import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";

/**
 * Footer brand row — blossom leaf + NurseNest wordmark (matches header lockup tone).
 */
export function FooterBrandLockup({ brandName }: { brandName: string }) {
  return (
    <div className="nn-footer-brand-lockup flex flex-wrap items-center gap-x-3 gap-y-2 bg-transparent">
      <SiteBrandLogoMark variant="footer" logoVariant="leaf" />
      <span
        data-nn-footer-lockup="wordmark"
        className="text-[1.125rem] font-semibold tracking-[-0.025em] text-[var(--footer-fg)] sm:text-[1.2rem]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {brandName}
      </span>
    </div>
  );
}
