import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * `/app/cat` is a redirect alias. CAT and adaptive flows live under the
 * shared `/app/practice-tests` launcher.
 *
 * Preserve query params so `pathwayId` deep links keep working. Because this
 * alias is specifically `/app/cat`, carry CAT intent into the unified setup
 * surface instead of dropping the learner into generic practice exams.
 */
export default async function CatAliasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || k === "catLaunch") continue;
    if (Array.isArray(v)) {
      for (const item of v) q.append(k, String(item));
    } else {
      q.set(k, String(v));
    }
  }
  q.set("catLaunch", "1");
  const suffix = q.toString();
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
