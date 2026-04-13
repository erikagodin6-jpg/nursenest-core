import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import "./exam-shell.css";
import { LearnerFeedbackShell } from "@/components/feedback/learner-feedback-shell";

/**
 * Isolated exam surface: no learner nav row; theme tokens locked for readability.
 * Locale + i18n: `app/(student)/app/layout.tsx`.
 */
export const dynamic = "force-dynamic";

export default async function ExamShellLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  let t: (key: string) => string = (key) => key;

  try {
    [session] = await Promise.all([auth()]);
    const bundle = await getLearnerMarketingBundle();
    t = bundle.t;
  } catch (e) {
    console.error("[exam-shell-layout] failed to load session or i18n bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
    // Fallback t() returns the key — exam shell renders with raw keys rather than crashing.
  }

  const userId = (session?.user as { id?: string } | null)?.id ?? "";

  if (!userId) {
    return (
      <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
        <p className="text-sm text-muted">
          <Link className="font-medium text-primary underline" href="/login">
            {t("learner.exams.shell.signIn")}
          </Link>{" "}
          {t("learner.exams.shell.signInToPractice")}
        </p>
      </div>
    );
  }

  return (
    <LearnerFeedbackShell pathwayId={null}>
      <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
        <nav className="mb-6 text-sm">
          <Link href="/app" className="font-medium text-primary hover:underline">
            {t("learner.exams.shell.backToDashboard")}
          </Link>
        </nav>
        {children}
      </div>
    </LearnerFeedbackShell>
  );
}
