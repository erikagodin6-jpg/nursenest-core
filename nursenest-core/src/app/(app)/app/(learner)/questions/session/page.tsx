import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * @deprecated Replaced by the direct unified practice launcher at `/app/questions/start`.
 *
 * Compatibility-only alias for older weak-area/question-session callbacks.
 * Keep as a redirect shim until access logs confirm removal is safe. Do not add
 * session setup UI here.
 */
export default async function PracticeQuestionSessionAliasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) q.append(key, String(item));
    } else {
      q.set(key, String(value));
    }
  }
  const suffix = q.toString();
  redirect(suffix ? `/app/questions/start?${suffix}` : "/app/questions/start");
}
