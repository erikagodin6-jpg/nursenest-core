import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { CheckoutSuccessBanner } from "@/components/student/checkout-success-banner";
import { LearnerThemeControl } from "@/components/student/learner-theme-control";
import { SentryLearnerShell } from "@/components/observability/sentry-learner-shell";

/** Auth is enforced in `src/proxy.ts` (Next.js 16+) so this layout never calls `redirect()` for missing session. */
export const dynamic = "force-dynamic";

export default async function LearnerShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <p className="text-sm text-[var(--theme-muted-text)]">
          <Link className="font-medium text-primary underline" href="/login">
            Sign in
          </Link>{" "}
          to access the learner app.
        </p>
      </div>
    );
  }

  return (
    <SentryLearnerShell userId={userId}>
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="nn-card mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <Link className="rounded-full border border-primary/15 bg-primary/8 px-3 py-2 text-primary" href="/app">
            Dashboard
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/lessons">
            Lessons
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/questions">
            Question Bank
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/exams">
            Practice Exams
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/study-plan">
            Study plan
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/app/flashcards">
            Flashcards
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/blog">
            Blog
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/tools">
            Clinical tools
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/case-studies">
            Case studies
          </Link>
          <Link className="rounded-full border border-border bg-white px-3 py-2 hover:bg-gray-50" href="/pricing">
            Plans
          </Link>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <LearnerThemeControl />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="rounded-full border border-border bg-white px-3 py-2 text-sm hover:bg-gray-50">
              Logout
            </button>
          </form>
        </div>
      </header>
      <CheckoutSuccessBanner />
      {children}
    </div>
    </SentryLearnerShell>
  );
}
