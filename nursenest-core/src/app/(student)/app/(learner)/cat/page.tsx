import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Legacy/marketing `/app/cat` — CAT and adaptive flows live under `/app/practice-tests`
 * (e.g. `cat-launch`, `start`). Preserve query params so `pathwayId` deep links keep working.
 */
export default async function CatAliasPage({ searchParams }: PageProps) {
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
