import { notFound } from "next/navigation";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";

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
  const pathway = resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway || pathway.status === "hidden") {
    notFound();
  }
  return <>{children}</>;
}
