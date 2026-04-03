import Link from "next/link";
import { auth } from "@/lib/auth";
import { BaselineAssessmentFlow } from "@/components/student/baseline-assessment-flow";

export const metadata = {
  title: "Baseline assessment | NurseNest",
};

export default async function BaselineAssessmentPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return (
      <main>
        <p className="text-sm text-muted">
          <Link href="/login" className="font-medium text-primary underline">
            Sign in
          </Link>{" "}
          to take the baseline.
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Getting started</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Baseline assessment</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Short, untimed. Your answers tune weak-topic signals. Nothing here is a pass/fail grade for your license.
        </p>
      </div>
      <BaselineAssessmentFlow />
    </main>
  );
}
