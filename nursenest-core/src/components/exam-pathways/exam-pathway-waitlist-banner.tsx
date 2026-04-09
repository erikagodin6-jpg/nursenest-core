"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  pathwayId: string;
  variant: "waitlist" | "upcoming";
};

/**
 * Waitlist / upcoming-pathway notice on marketing exam hubs (localized).
 */
export function ExamPathwayWaitlistBanner({ pathwayId, variant }: Props) {
  const { t } = useMarketingI18n();
  const title =
    variant === "waitlist"
      ? t("components.examPathwayHub.waitlist.titleWaitlist")
      : t("components.examPathwayHub.waitlist.titleUpcoming");
  const body =
    pathwayId === "ca-np-cnple"
      ? t("components.examPathwayHub.waitlist.bodyCnple")
      : t("components.examPathwayHub.waitlist.bodyDefault");

  return (
    <aside className="nn-study-card mt-8 border-[var(--role-warning-border)] bg-[var(--role-warning-soft)] p-4 sm:p-5">
      <p className="nn-marketing-h4 text-[var(--role-warning-text)]">{title}</p>
      <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{body}</p>
    </aside>
  );
}
