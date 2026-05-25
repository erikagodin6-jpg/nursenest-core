import { createTraceInfo, traceLayout, withBuildTrace } from "@/build/tracing";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import "@/app/learner-exam-shell.css";
import "@/app/learner-exam-session-premium.css";
import "@/app/learner-loft-simulation.css";
import "./exam-shell.css";

/**
 * Exam attempt surface under the learner shell (`(learner)/layout.tsx`).
 * Theme tokens + narrow column for focus; primary nav comes from the parent layout.
 */
export const dynamic = "force-dynamic";

const examSessionTrace = createTraceInfo(import.meta, {
  kind: "provider",
  name: "getProtectedRouteSession",
  phase: "layout",
});

const ExamShellLayout = traceLayout(
  import.meta,
  async function ExamShellLayout({ children }: { children: React.ReactNode }) {
    let session = null;

    try {
      session = await withBuildTrace(examSessionTrace, () => getProtectedRouteSession("(student).app.(learner).exams"));
    } catch (e) {
      console.error("[exam-shell-layout] failed to load session", {
        error: e instanceof Error ? e.message : String(e),
      });
    }

  const userId = (session?.user as { id?: string } | null)?.id ?? "";

  if (!userId) {
      return (
        <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
          <p className="text-sm text-muted">
            We are checking your learner session. Refresh this page if the exam does not load.
          </p>
        </div>
      );
    }

    return (
      <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">{children}</div>
    );
  },
  { name: "ExamShellLayout" },
);

export default ExamShellLayout;
