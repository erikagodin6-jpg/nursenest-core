import { redirect } from "next/navigation";
import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Starting exam simulation | NurseNest",
    }),
    { pathname: "/app/practice-tests/cat-launch", routeGroup: "student.learner.practice_test_cat_launch" },
  );
}

type Props = {
  searchParams: Promise<{ pathwayId?: string; alliedProfession?: string }>;
};

/** Legacy deep link — redirects to hub inline CAT launch (CNPLE still routes to LOFT cases). */
export default async function CatDirectLaunchRedirectPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pathwayId = typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 2 ? sp.pathwayId.trim() : null;

  if (!pathwayId) {
    redirect("/app/practice-tests");
  }

  if (isCnplePathway(pathwayId)) {
    redirect("/app/cases/cnple");
  }

  const allied =
    typeof sp.alliedProfession === "string" && sp.alliedProfession.trim().length > 0
      ? sp.alliedProfession.trim()
      : null;

  redirect(appPathwayCatSessionStartPath(pathwayId, { alliedProfession: allied }));
}
