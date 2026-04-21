import Link from "next/link";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getLearnerShellMarketingBundle } from "@/lib/learner/learner-marketing-server";
import "./exam-shell.css";

/**
 * Exam attempt surface under the learner shell (`(learner)/layout.tsx`).
 * Theme tokens + narrow column for focus; primary nav comes from the parent layout.
 */
export const dynamic = "force-dynamic";

export default async function ExamShellLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  let t: (key: string) => string = (key) => key;

  try {
    [session] = await Promise.all([getProtectedRouteSession("(student).app.(learner).exams")]);
    const bundle = await getLearnerShellMarketingBundle();
    t = bundle.t;
  } catch (e) {
    console.error("[exam-shell-layout] failed to load session or i18n bundle", {
      error: e instanceof Error ? e.message : String(e),
    });
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
    <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">{children}</div>
  );
}
