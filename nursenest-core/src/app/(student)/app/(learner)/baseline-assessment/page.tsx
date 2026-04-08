import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BaselineAssessmentFlow } from "@/components/student/baseline-assessment-flow";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getLearnerMarketingBundle();
  return { title: t("learner.baseline.metaTitle"), robots: { index: false, follow: false } };
}

export default async function BaselineAssessmentPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return (
      <main>
        <p className="text-sm text-muted">
          <Link href="/login" className="font-medium text-primary underline">
            {t("learner.gate.signIn")}
          </Link>{" "}
          {t("learner.baseline.signInPromptAfter")}
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.baseline.kicker")}</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{t("learner.baseline.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{t("learner.baseline.intro")}</p>
      </div>
      <BaselineAssessmentFlow />
    </main>
  );
}
