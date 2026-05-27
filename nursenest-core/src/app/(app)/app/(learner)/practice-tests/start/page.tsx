import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * @deprecated Replaced by the unified practice setup flow at `/app/practice-tests`.
 *
 * Compatibility-only alias. Keep as a redirect shim until route access logs and
 * auth callback telemetry confirm this path has no meaningful direct usage.
 * Do not add setup UI here.
 */
export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Practice exam setup | NurseNest",
    }),
    { pathname: "/app/practice-tests/start", routeGroup: "student.learner.practice_test_start" },
  );
}

/**
 * @deprecated Replaced by `/app/practice-tests`.
 * Candidate for removal only after verified zero/low traffic.
 */
export default async function PracticeTestsStartAliasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
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
