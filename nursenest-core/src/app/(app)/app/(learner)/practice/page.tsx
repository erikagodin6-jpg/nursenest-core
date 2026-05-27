import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * `/app/practice` is not a separate product surface — learner practice exams and CAT live under
 * {@link import("@/app/(app)/app/(learner)/practice-tests/page") `/app/practice-tests`}.
 * Dev render trace: `NN_RENDER_TRACE: practice live route` is emitted from the practice-tests hub
 * (`LearnerRenderTraceBanner`), not this redirect-only route.
 */
export default async function PracticeAliasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) q.append(k, String(item));
    } else {
      q.set(k, String(v));
    }
  }
  const suffix = q.toString();
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
