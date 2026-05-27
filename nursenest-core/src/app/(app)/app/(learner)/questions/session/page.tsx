import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

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
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
