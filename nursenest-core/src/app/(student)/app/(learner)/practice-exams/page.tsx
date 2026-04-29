import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Learner product uses `/app/practice-tests` for the practice exam / mock exam builder and sessions.
 * `/app/practice-exams` is a common mistaken URL — preserve query string and send users to the live hub.
 */
export default async function LearnerPracticeExamsAliasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [key, raw] of Object.entries(sp)) {
    if (raw == null) continue;
    if (Array.isArray(raw)) {
      for (const v of raw) {
        if (typeof v === "string" && v.length > 0) q.append(key, v);
      }
    } else if (typeof raw === "string" && raw.length > 0) {
      q.set(key, raw);
    }
  }
  const suffix = q.toString();
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
