"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LearnerAccountSettingsPanel } from "@/components/student/learner-account-settings-panel";
import { ExamPlanSettingsCard } from "@/components/student/exam-plan-settings-card";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import {
  ALLOWED_QBANK_SESSION_SIZES,
  defaultLearnerStudyDefaults,
  readLearnerStudyDefaults,
  writeLearnerStudyDefaults,
  type LearnerStudyDefaultsV1,
} from "@/lib/student/learner-study-defaults";

export function LearnerStudySettingsHub({
  userId,
  defaultPathwayLabel,
  showExamPlanForm,
  t,
}: {
  userId: string;
  /** Resolved display label for `User.learnerPath`, or null if unset. */
  defaultPathwayLabel: string | null;
  showExamPlanForm: boolean;
  t: LearnerMarketingT;
}) {
  const [bank, setBank] = useState<LearnerStudyDefaultsV1["questionBank"]>(() => defaultLearnerStudyDefaults().questionBank);
  const [examPref, setExamPref] = useState<LearnerStudyDefaultsV1["practiceExam"]>(() => defaultLearnerStudyDefaults().practiceExam);
  const [deviceSaved, setDeviceSaved] = useState(false);
  const [deviceBusy, setDeviceBusy] = useState(false);

  useEffect(() => {
    const d = readLearnerStudyDefaults(userId);
    setBank(d.questionBank);
    setExamPref(d.practiceExam);
  }, [userId]);

  const saveDeviceDefaults = useCallback(() => {
    setDeviceBusy(true);
    setDeviceSaved(false);
    try {
      const current = readLearnerStudyDefaults(userId);
      const next: LearnerStudyDefaultsV1 = {
        v: 1,
        questionBank: bank,
        practiceExam: examPref,
        lessonAssessments: current.lessonAssessments,
      };
      writeLearnerStudyDefaults(userId, next);
      setDeviceSaved(true);
    } finally {
      setDeviceBusy(false);
    }
  }, [userId, bank, examPref]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/[0.06] to-transparent px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.appearance")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.appearanceSub")}</p>
        </div>
        <div className="p-5">
          <LearnerAccountSettingsPanel />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.pathway")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.pathwaySub")}</p>
        </div>
        <div className="space-y-3 p-5">
          <p className="text-sm text-foreground">
            {defaultPathwayLabel ? (
              <span className="font-medium">{defaultPathwayLabel}</span>
            ) : (
              <span className="text-muted-foreground">{t("learner.studySettings.pathwayUnset")}</span>
            )}
          </p>
          <Link
            href="/app/account/personal"
            className="inline-flex text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            {t("learner.studySettings.pathwayEdit")}
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.qbank")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.qbankSub")}</p>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <label htmlFor="ss-session-size" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("learner.studySettings.sessionSize")}
            </label>
            <select
              id="ss-session-size"
              value={bank.sessionSize}
              onChange={(e) => {
                setDeviceSaved(false);
                setBank((b) => ({ ...b, sessionSize: Number(e.target.value) }));
              }}
              className="mt-1 w-full max-w-md rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              {ALLOWED_QBANK_SESSION_SIZES.map((n) => (
                <option key={n} value={n}>
                  {t("learner.studySettings.sessionSizeOption", { count: n })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.studySettings.practiceMode")}</span>
            <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.practiceModeHint")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeviceSaved(false);
                  setBank((b) => ({ ...b, examShell: false }));
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  !bank.examShell
                    ? "bg-role-cta text-role-cta-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted/40"
                }`}
              >
                {t("learner.studySettings.modeStudy")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeviceSaved(false);
                  setBank((b) => ({ ...b, examShell: true }));
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  bank.examShell
                    ? "bg-role-cta text-role-cta-foreground"
                    : "border border-border bg-card text-foreground hover:bg-muted/40"
                }`}
              >
                {t("learner.studySettings.modeExam")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.practiceExams")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.practiceExamsSub")}</p>
        </div>
        <div className="space-y-3 p-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.studySettings.timedDefault")}</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setDeviceSaved(false);
                setExamPref({ timedPreferred: false });
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                !examPref.timedPreferred
                  ? "bg-role-cta text-role-cta-foreground"
                  : "border border-border bg-card text-foreground hover:bg-muted/40"
              }`}
            >
              {t("learner.studySettings.untimedFirst")}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeviceSaved(false);
                setExamPref({ timedPreferred: true });
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                examPref.timedPreferred
                  ? "bg-role-cta text-role-cta-foreground"
                  : "border border-border bg-card text-foreground hover:bg-muted/40"
              }`}
            >
              {t("learner.studySettings.timedFirst")}
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={deviceBusy}
          onClick={() => saveDeviceDefaults()}
          className="inline-flex rounded-full bg-role-cta px-5 py-3 text-sm font-semibold text-role-cta-foreground disabled:opacity-50"
        >
          {deviceBusy ? t("learner.studySettings.savingDevice") : t("learner.studySettings.saveDevice")}
        </button>
        {deviceSaved ? (
          <span className="text-sm text-role-success" role="status">
            {t("learner.studySettings.deviceSaved")}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">{t("learner.studySettings.deviceNote")}</p>

      {showExamPlanForm ? (
        <div id="exam-plan">
          <ExamPlanSettingsCard />
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/5 p-6">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.examPlanLockedTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("learner.studySettings.section.examPlanLockedBody")}</p>
          <Link
            href="/app/account/billing"
            className="mt-4 inline-flex rounded-full border border-role-cta/30 bg-role-cta-soft px-4 py-2 text-sm font-semibold text-role-cta-on-soft"
          >
            {t("learner.account.nav.billing")}
          </Link>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.notifications")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.notificationsSub")}</p>
        </div>
        <p className="p-5 text-sm text-muted-foreground">{t("learner.studySettings.notificationsBody")}</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.studySettings.section.shortcuts")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.studySettings.section.shortcutsSub")}</p>
        </div>
        <ul className="flex flex-col gap-2 p-5 sm:flex-row sm:flex-wrap">
          <li>
            <Link href="/app/account/personal" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.account.nav.personal")}
            </Link>
          </li>
          <li>
            <Link href="/app/account/security" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.account.nav.security")}
            </Link>
          </li>
          <li>
            <Link href="/app/account/billing" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.account.nav.billing")}
            </Link>
          </li>
          <li>
            <Link href="/app/questions" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              {t("learner.studySettings.shortcutQbank")}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
