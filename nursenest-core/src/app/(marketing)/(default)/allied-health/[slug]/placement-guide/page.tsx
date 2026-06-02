import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import {
  AlliedAuthorityPageShell,
  AuthorityIconList,
  AuthoritySectionCard,
} from "@/components/marketing/allied-health-authority-layout";
import {
  buildAlliedAuthorityBreadcrumbs,
  buildAlliedAuthorityPath,
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
  const title = `${profile.label} Clinical Placement Guide`;
  const description = `Prepare for ${profile.label.toLowerCase()} clinical placement with safety expectations, study priorities, documentation habits, and preceptor-ready reasoning.`;
  const path = buildAlliedAuthorityPath(profile, "placement-guide");
  const alt = marketingAlternatesSharedPage("en", path);
  return safeGenerateMetadata(
    {
      title: `${title} | NurseNest`,
      description,
      alternates: { canonical: alt.canonical, languages: alt.languages },
      openGraph: { title: `${title} | NurseNest`, description, url: alt.canonical, type: "article" },
      twitter: { card: "summary_large_image", title: `${title} | NurseNest`, description },
    },
    { pathname: path, routeGroup: "marketing.default.allied_health.authority.placement" },
  );
}

export default async function AlliedPlacementGuidePage({ params }: Props) {
  const { slug } = await params;
  const profile = getAlliedAuthorityProfileBySlug(slug);
  if (!profile) notFound();
  const title = `${profile.label} Clinical Placement Guide`;
  const path = buildAlliedAuthorityPath(profile, "placement-guide");
  const breadcrumbs = buildAlliedAuthorityBreadcrumbs(profile, title, path);

  return (
    <AlliedAuthorityPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={`${profile.label} Placement Hub`}
      title={title}
      deck={`A practical placement guide for ${profile.label.toLowerCase()} learners who want to arrive prepared, practice safely, and turn feedback into targeted study.`}
      sidebarLinks={[
        { label: "Career Guide", href: buildAlliedAuthorityPath(profile, "career") },
        { label: "Study Guide", href: buildAlliedAuthorityPath(profile, "study-guide") },
        { label: "Interview Questions", href: buildAlliedAuthorityPath(profile, "interview-questions") },
      ]}
    >
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      <div className="space-y-6">
        {profile.placementSections.map((section) => (
          <AuthoritySectionCard key={section.title} title={section.title}>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AuthoritySectionCard>
        ))}
        <AuthoritySectionCard title="Placement Readiness Checklist">
          <AuthorityIconList
            icon="placement"
            items={[
              "Know the unit or placement setting's most common safety risks.",
              "Prepare concise language for reporting abnormal findings.",
              "Review the clinical skills most likely to be observed.",
              "Clarify supervision expectations before performing unfamiliar tasks.",
              "Reflect after each shift and convert feedback into study tasks.",
            ]}
          />
        </AuthoritySectionCard>
      </div>
    </AlliedAuthorityPageShell>
  );
}
