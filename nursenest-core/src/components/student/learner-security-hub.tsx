"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";
import { useMarketingI18n } from "@/lib/marketing-i18n";

export function LearnerSecurityHub({
  hasPassword,
  sessionMaxDays,
}: {
  hasPassword: boolean;
  sessionMaxDays: number;
}) {
  const { t } = useMarketingI18n();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/[0.06] to-transparent px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.security.section.passwordTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.security.section.passwordSub")}</p>
        </div>
        <div className="p-5">
          <LearnerProfileAccountActions hasPassword={hasPassword} showBillingPortal={false} variant="passwordOnly" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.security.section.resetTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.security.section.resetSub")}</p>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-sm text-muted-foreground">{t("learner.security.resetBody")}</p>
          <Link
            href="/forgot-password"
            className="inline-flex rounded-full border border-role-cta/35 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
          >
            {t("learner.security.resetCta")}
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.security.section.sessionTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.security.section.sessionSub")}</p>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm text-muted-foreground">{t("learner.security.sessionExplain", { days: sessionMaxDays })}</p>
          <p className="text-sm text-muted-foreground">{t("learner.security.sessionOtherDevices")}</p>
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              setSigningOut(true);
              void signOut({ callbackUrl: "/login" });
            }}
            className="inline-flex rounded-full bg-role-cta px-5 py-3 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
          >
            {signingOut ? t("learner.security.signingOut") : t("learner.security.signOutThisDevice")}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.security.section.troubleTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.security.section.troubleSub")}</p>
        </div>
        <ul className="list-inside list-disc space-y-2 p-5 text-sm text-muted-foreground">
          <li>{t("learner.security.trouble1")}</li>
          <li>{t("learner.security.trouble2")}</li>
          <li>{t("learner.security.trouble3")}</li>
          <li>{t("learner.security.trouble4")}</li>
        </ul>
        <div className="border-t border-border/50 px-5 py-4">
          <Link href="/contact" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
            {t("learner.security.contactSupport")}
          </Link>
        </div>
      </section>
    </div>
  );
}
