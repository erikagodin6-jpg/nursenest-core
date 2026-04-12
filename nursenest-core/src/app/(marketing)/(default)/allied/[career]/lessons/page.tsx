import { notFound, redirect } from "next/navigation";
import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";

/**
 * /allied/[career]/lessons → redirects to the canonical allied-health lessons route.
 * Keeps the new /allied/[career]/ URL namespace working without duplicating lesson content.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ career: string }> };

export default async function AlliedCareerLessonsRedirect({ params }: Props) {
  const { career } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  if (!prof) notFound();
  redirect(alliedHealthLessonsIndexPath(prof.professionKey));
}
