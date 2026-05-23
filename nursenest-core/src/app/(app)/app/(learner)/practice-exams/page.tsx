import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * `/app/practice-exams` is a redirect alias — the canonical learner practice hub is
 * `/app/practice-tests`. Query params are forwarded so deep links (e.g. `?pathwayId=…`)
 * keep working. Pattern matches `/app/practice` and `/app/cat`.
 */
export default async function LearnerPracticeExamsAliasPage({ searchParams }: PageProps) {
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
