import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";

import {
  appPathwayCatSessionStartPath,
} from "@/lib/exam-pathways/pathway-cat-flow";

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
 * Legacy deep link.
 *
 * Redirects:
 * - CNPLE → LOFT cases
 * - all others → inline CAT launch flow
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

  try {
    const nextPath =
      appPathwayCatSessionStartPath(
        pathwayId,
        {
          alliedProfession: allied,
        },
      );

    if (
      typeof nextPath !== "string" ||
      !nextPath.startsWith("/app/")
    ) {
      console.error(
        "[cat-launch] invalid redirect target",
        nextPath,
      );

      redirect("/app/practice-tests");
    }

    redirect(nextPath);
  } catch (error) {
    console.error(
      "[cat-launch] failed to resolve CAT launch route",
      error,
    );

    redirect("/app/practice-tests");
  }
}