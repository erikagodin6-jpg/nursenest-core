import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import "./exam-shell.css";

/**
 * Isolated exam surface: no learner nav row; theme tokens locked for readability.
 * Locale + i18n: `app/(student)/app/layout.tsx`.
 */
export const dynamic = "force-dynamic";

export default async function ExamShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { t } = await getLearnerMarketingBundle();

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
    <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
      <nav className="mb-6 text-sm">
        <Link href="/app" className="font-medium text-primary hover:underline">
          {t("learner.exams.shell.backToDashboard")}
        </Link>
      </nav>
      {children}
    </div>
  );
}
