import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import {
  AlliedAuthorityPageShell,
  AuthorityIconList,
  AuthorityLinkGrid,
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
  const path = buildAlliedAuthorityPath(profile, "career");
  const alt = marketingAlternatesSharedPage("en", path);
  return safeGenerateMetadata(
    {
      title: `${profile.careerTitle} | NurseNest`,
      description: profile.careerDeck,
      alternates: { canonical: alt.canonical, languages: alt.languages },
      openGraph: { title: `${profile.careerTitle} | NurseNest`, description: profile.careerDeck, url: alt.canonical, type: "article" },
      twitter: { card: "summary_large_image", title: `${profile.careerTitle} | NurseNest`, description: profile.careerDeck },
    },
    { pathname: path, routeGroup: "marketing.default.allied_health.authority.career" },
  );
}

export default async function AlliedCareerAuthorityPage({ params }: Props) {
  const { slug } = await params;
  const profile = getAlliedAuthorityProfileBySlug(slug);
  if (!profile) notFound();
  const path = buildAlliedAuthorityPath(profile, "career");
  const breadcrumbs = buildAlliedAuthorityBreadcrumbs(profile, profile.careerTitle, path);
  const skillLinks = profile.clinicalSkills.map((skill) => ({ label: skill.title, href: buildAlliedSkillPath(profile, skill) }));

  return (
    <AlliedAuthorityPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={`${profile.label} Career Hub`}
      title={profile.careerTitle}
      deck={profile.careerDeck}
      sidebarLinks={[
        { label: "Profession Overview", href: `/allied-health/${profile.routeSlug}` },
        { label: "Clinical Skills", href: `#clinical-skills` },
        { label: "Placement Guide", href: buildAlliedAuthorityPath(profile, "placement-guide") },
        { label: "Study Guide", href: buildAlliedAuthorityPath(profile, "study-guide") },
        { label: "Interview Questions", href: buildAlliedAuthorityPath(profile, "interview-questions") },
      ]}
    >
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {profile.careerSections.map((section) => (
            <AuthoritySectionCard key={section.title} title={section.title}>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </AuthoritySectionCard>
          ))}
          <AuthoritySectionCard title="What To Study First">
            <p>
              Start with safety, anatomy and physiology, documentation, communication, and the clinical skills most likely to
              appear in placement. Then connect each skill to practice questions and case-based reasoning.
            </p>
            <AuthorityIconList items={profile.studyGuides.flatMap((guide) => guide.resources)} icon="book" />
          </AuthoritySectionCard>
          <section id="clinical-skills" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-bold text-[var(--theme-heading-text)]">{profile.label} Clinical Skills</h2>
            <AuthorityLinkGrid links={skillLinks} />
          </section>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <AuthoritySectionCard title="Keyword Clusters">
            <dl className="space-y-4 text-sm">
              {Object.entries(profile.keywordClusters).map(([cluster, keywords]) => (
                <div key={cluster}>
                  <dt className="font-bold capitalize text-[var(--theme-heading-text)]">{cluster.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className="mt-2 text-[var(--theme-muted-text)]">{keywords.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </AuthoritySectionCard>
          <AuthoritySectionCard title="Next Step">
            <Link href={buildAlliedAuthorityPath(profile, "study-guide")} className="font-semibold text-primary underline-offset-4 hover:underline">
              Open the {profile.label} Study Guide
            </Link>
          </AuthoritySectionCard>
        </aside>
      </div>
    </AlliedAuthorityPageShell>
  );
}
