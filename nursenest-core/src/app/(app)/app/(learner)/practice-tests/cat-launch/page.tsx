import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: {
        index: false,
        follow: false,
      },

      title: "Starting exam simulation | NurseNest",
    }),
    {
      pathname: "/app/practice-tests/cat-launch",
      routeGroup:
        "student.learner.practice_test_cat_launch",
    },
  );
}

type Props = {
  searchParams: Promise<{
    pathwayId?: string;
    alliedProfession?: string;
  }>;
};

function isSafePathwayId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9_-]{3,80}$/.test(value)
  );
}

function isSafeAlliedProfession(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9 _-]{1,80}$/.test(value)
  );
}

/**
 * @deprecated Prefer `/app/practice-tests?pathwayId=...`.
 *
 * Direct CAT launch compatibility route. Non-CNPLE learners now land on the
 * shared practice-tests launcher with CAT mode selected, so they can choose
 * systems, focus, and question count before starting.
 *
 * Routes:
 * - CNPLE → LOFT cases
 * - all others → shared practice-tests launcher
 *
 * Compatibility-only alias. Keep until route access logs confirm direct usage
 * has ended; do not add a duplicate setup UI here.
 */
export default async function CatDirectLaunchRedirectPage({
  searchParams,
}: Props) {
  const sp = await searchParams;

  const pathwayId = isSafePathwayId(
    sp.pathwayId,
  )
    ? sp.pathwayId.trim()
    : null;

  if (!pathwayId) {
    redirect("/app/practice-tests");
  }

  if (isCnplePathway(pathwayId)) {
    redirect("/app/cases/cnple");
  }

  const allied = isSafeAlliedProfession(
    sp.alliedProfession,
  )
    ? sp.alliedProfession.trim()
    : null;

  const q = new URLSearchParams({ pathwayId, catLaunch: "1" });
  if (allied) q.set("alliedProfession", allied);
  redirect(`/app/practice-tests?${q.toString()}`);
}
