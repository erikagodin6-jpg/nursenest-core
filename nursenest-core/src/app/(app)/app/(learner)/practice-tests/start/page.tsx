import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Practice exam setup | NurseNest",
    }),
    { pathname: "/app/practice-tests/start", routeGroup: "student.learner.practice_test_start" },
  );
}

export default async function PracticeTestsStartAliasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  q.set("catLaunch", "1");
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined || key === "review") continue;
    if (Array.isArray(value)) {
      for (const item of value) q.append(key, String(item));
    } else {
      q.set(key, String(value));
    }
  }
  redirect(`/app/practice-tests?${q.toString()}`);
}
