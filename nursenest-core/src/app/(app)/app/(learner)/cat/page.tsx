import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * `/app/cat` is a redirect alias. CAT and adaptive flows live under `/app/practice-tests`.
 * Preserve query params so `pathwayId` deep links keep working, and explicitly open CAT mode.
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
  if (!q.has("catLaunch")) {
    q.set("catLaunch", "1");
  }
  const suffix = q.toString();
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
