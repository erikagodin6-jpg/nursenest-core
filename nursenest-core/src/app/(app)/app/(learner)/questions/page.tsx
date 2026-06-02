import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function QuestionBankPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) { for (const item of v) q.append(k, String(item)); }
    else { q.set(k, String(v)); }
  }
  const suffix = q.toString();
  redirect(suffix ? `/app/practice-tests?${suffix}` : "/app/practice-tests");
}
