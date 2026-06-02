import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import {
  AlliedAuthorityPageShell,
  AuthoritySectionCard,
} from "@/components/marketing/allied-health-authority-layout";
import {
  buildAlliedAuthorityBreadcrumbs,
  buildAlliedAuthorityPath,
  buildAlliedSkillPath,
  getAlliedAuthorityProfiles,
  getAlliedAuthorityProfileBySlug,
} from "@/lib/seo/allied-health-authority-program";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return getAlliedAuthorityProfiles().map((profile) => ({ slug: profile.routeSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getAlliedAuthorityProfileBySlug(slug);
  if (!profile) return {};
  const title = `${profile.label} Study Guide`;
  const description = `Study ${profile.label.toLowerCase()} with clinical reasoning guides, quick reviews, skill pages, placement prep, and practice activity links.`;
  const path = buildAlliedAuthorityPath(profile, "study-guide");
  const alt = marketingAlternatesSharedPage("en", path);
  return safeGenerateMetadata(
    {
      title: `${title} | NurseNest`,
      description,
      alternates: { canonical: alt.canonical, languages: alt.languages },
      openGraph: { title: `${title} | NurseNest`, description, url: alt.canonical, type: "article" },
      twitter: { card: "summary_large_image", title: `${title} | NurseNest`, description },
    },
    { pathname: path, routeGroup: "marketing.default.allied_health.authority.study" },
  );
}

export default async function AlliedStudyGuidePage({ params }: Props) {
  const { slug } = await params;
  const profile = getAlliedAuthorityProfileBySlug(slug);
  if (!profile) notFound();
  const title = `${profile.label} Study Guide`;
  const path = buildAlliedAuthorityPath(profile, "study-guide");
  const breadcrumbs = buildAlliedAuthorityBreadcrumbs(profile, title, path);

  return (
    <AlliedAuthorityPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={`${profile.label} Study Hub`}
      title={title}
      deck={`Clinical reasoning guides, quick reviews, practice activities, and skill pages for ${profile.label.toLowerCase()} learners.`}
      sidebarLinks={[
        { label: "Career Guide", href: buildAlliedAuthorityPath(profile, "career") },
        { label: "Placement Guide", href: buildAlliedAuthorityPath(profile, "placement-guide") },
        { label: "Interview Questions", href: buildAlliedAuthorityPath(profile, "interview-questions") },
      ]}
    >
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      <div className="grid gap-6 lg:grid-cols-2">
        {profile.studyGuides.map((guide) => (
          <AuthoritySectionCard key={guide.title} title={guide.title}>
            <p>{guide.description}</p>
            <ul className="mt-4 space-y-3">
              {guide.resources.map((resource) => {
                const skill = profile.clinicalSkills.find((item) => item.title === resource);
                return (
                  <li key={resource} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
                    {skill ? (
                      <Link href={buildAlliedSkillPath(profile, skill)} className="font-semibold text-primary underline-offset-4 hover:underline">
                        {resource}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[var(--theme-heading-text)]">{resource}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </AuthoritySectionCard>
        ))}
        <AuthoritySectionCard title="Quick Review Routine">
          <ol className="list-decimal space-y-3 pl-5">
            <li>Read the concept page and identify what finding would change priority.</li>
            <li>Review flashcards for terminology, safety checks, and normal or abnormal cues.</li>
            <li>Answer practice questions and write why each distractor is less safe or less complete.</li>
            <li>Use a placement scenario to rehearse what you would say, document, and escalate.</li>
          </ol>
        </AuthoritySectionCard>
      </div>
    </AlliedAuthorityPageShell>
  );
}
