import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExamsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (Array.isArray(value)) {
      value.forEach((v) => qs.append(key, v));
    } else if (typeof value === "string" && value.trim()) {
      qs.set(key, value);
    }
  }
  const query = qs.toString();
  redirect(query ? `/app/practice-tests?${query}` : "/app/practice-tests");
}
