import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function searchParamsToURLSearchParams(sp: Record<string, string | string[] | undefined>): URLSearchParams {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      for (const item of v) q.append(k, String(item));
    } else {
      q.set(k, String(v));
    }
  }
  return q;
}

/**
 * Legacy `/app/cat` alias. Adaptive CAT lives under `/app/practice-tests` (`cat-launch`, `start`).
 * When `pathwayId` is present, send learners to **cat-launch** (same entry as study-loop CAT CTAs),
 * not only the generic practice hub — preserves deep links and bookmarks.
 */
export default async function CatAliasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = searchParamsToURLSearchParams(sp);
  const suffix = q.toString();
  const rawPid = q.get("pathwayId");
  const pathwayId = typeof rawPid === "string" && rawPid.trim().length > 2 ? rawPid.trim() : null;

  if (pathwayId) {
    redirect(suffix ? `/app/practice-tests/cat-launch?${suffix}` : `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pathwayId)}`);
  }

  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
