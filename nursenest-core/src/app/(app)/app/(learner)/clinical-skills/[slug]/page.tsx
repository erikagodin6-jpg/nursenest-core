import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { ClinicalSkillDetailClient } from "@/components/clinical-skills/clinical-skill-detail-client";
import { getClinicalSkillBySlug } from "@/lib/clinical-skills/clinical-skills-catalog";
import { loadClinicalSkillProgressForSlug } from "@/lib/clinical-skills/clinical-skills-lesson-progress";
import { loadClinicalSkillsRouteContext } from "@/lib/clinical-skills/clinical-skills-route-context.server";
import { auth } from "@/lib/auth";

type Props = { params: Promise<{ slug: string }>; searchParams?: Promise<{ pathwayId?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getClinicalSkillBySlug(decodeURIComponent(slug));
  if (!skill) return { title: "Clinical skill | NurseNest" };
  return {
    title: `${skill.title} | Clinical skills | NurseNest`,
    description: skill.summary,
    robots: { index: false, follow: false },
  };
}

export default async function ClinicalSkillDetailRoute({ params, searchParams }: Props) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const skill = getClinicalSkillBySlug(slug);
  if (!skill) notFound();

  const ctx = await loadClinicalSkillsRouteContext("(student).app.(learner).clinical-skills.[slug]");
  const pathwayId = ctx.pathwayId ?? ((await searchParams)?.pathwayId ?? null) ?? null;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? ctx.userId;
  const initialProgress = userId ? await loadClinicalSkillProgressForSlug(userId, skill.slug) : ("not_started" as const);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="clinical-skill" skillTitle={skill.title} pathname="/app/clinical-skills" />
      <ClinicalSkillDetailClient
        skill={skill}
        pathwayId={pathwayId}
        userId={userId}
        initialProgress={initialProgress}
      />
    </div>
  );
}
