import Link from "next/link";
import { auth } from "@/lib/auth";
import "./exam-shell.css";

/**
 * Isolated exam surface: no marketing chrome, no ThemePicker, no learner nav.
 * Theme tokens are locked to a light, high-contrast baseline for item readability.
 * Session for `/app/exams` is enforced in `src/proxy.ts` (avoid auth `redirect()` in RSC layouts).
 */
export const dynamic = "force-dynamic";

export default async function ExamShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  if (!userId) {
    return (
      <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
        <p className="text-sm text-muted">
          <Link className="font-medium text-primary underline" href="/login">
            Sign in
          </Link>{" "}
          to access practice exams.
        </p>
      </div>
    );
  }

  return (
    <div className="nn-exam-surface mx-auto w-full max-w-4xl px-6 py-8">
      <nav className="mb-6 text-sm">
        <Link href="/app" className="font-medium text-primary hover:underline">
          ← Back to dashboard
        </Link>
      </nav>
      {children}
    </div>
  );
}
