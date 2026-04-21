import { notFound, redirect } from "next/navigation";
import { PathwayLessonProgressRefreshListener } from "@/components/lessons/pathway-lesson-progress-refresh-listener";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { isPathwayPublishedForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";

/**
 * This segment and the marketing `(default)` layout read cookies (locale, region, optional session).
 * Without `force-dynamic`, Next can treat the route as static/ISR and throw at runtime:
 * "Page changed from static to dynamic … reason: cookies" → 500 on public exam landings.
 */
export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  /** `locale` = pathway countrySlug (`us` / `canada`); `slug` = roleTrack; `examCode` = exam segment. */
  params: Promise<{ locale: string; slug: string; examCode: string }>;
};

/**
 * No `generateMetadata` here: child routes need different canonicals (alias hub self-canonical vs subpages → core pathway).
 * Each `page.tsx` under this segment defines title, description, and `alternates.canonical`.
 */

export default async function ExamPathwayLayout({ children, params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}`;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway || pathway.status === "hidden") {
    notFound();
  }
  if (!isPathwayPublishedForPublicSite(pathway.id)) {
    redirect("/lessons");
  }
  return (
    <>
      <PathwayLessonProgressRefreshListener />
      {children}
    </>
  );
}
