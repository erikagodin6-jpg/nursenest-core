import type { Metadata } from "next";
import Link from "next/link";
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
  buildAlliedFaqJsonLd,
  buildAlliedSkillPath,
  getAlliedAuthoritySkill,
  getAlliedAuthoritySkillStaticParams,
} from "@/lib/seo/allied-health-authority-program";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ slug: string; skillSlug: string }> };

export const revalidate = 86400;

export function generateStaticParams() {
  return getAlliedAuthoritySkillStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, skillSlug } = await params;
  const record = getAlliedAuthoritySkill(slug, skillSlug);
  if (!record) return {};
  const { profile, skill } = record;
  const path = buildAlliedSkillPath(profile, skill);
  const alt = marketingAlternatesSharedPage("en", path);
  return safeGenerateMetadata(
    {
      title: `${skill.title} For ${profile.label} | NurseNest`,
      description: skill.deck,
      alternates: { canonical: alt.canonical, languages: alt.languages },
      openGraph: { title: `${skill.title} For ${profile.label} | NurseNest`, description: skill.deck, url: alt.canonical, type: "article" },
      twitter: { card: "summary_large_image", title: `${skill.title} For ${profile.label} | NurseNest`, description: skill.deck },
    },
    { pathname: path, routeGroup: "marketing.default.allied_health.authority.skill" },
  );
}

export default async function AlliedClinicalSkillAuthorityPage({ params }: Props) {
  const { slug, skillSlug } = await params;
  const record = getAlliedAuthoritySkill(slug, skillSlug);
  if (!record) notFound();
  const { profile, skill } = record;
  const path = buildAlliedSkillPath(profile, skill);
  const title = `${skill.title} For ${profile.label}`;
  const breadcrumbs = buildAlliedAuthorityBreadcrumbs(profile, title, path);
  const faqJsonLd = buildAlliedFaqJsonLd(title, path, skill.faqs);

  return (
    <AlliedAuthorityPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={`${profile.label} Clinical Skill`}
      title={title}
      deck={skill.deck}
      sidebarLinks={[
        { label: "Career Guide", href: buildAlliedAuthorityPath(profile, "career") },
        { label: "Placement Guide", href: buildAlliedAuthorityPath(profile, "placement-guide") },
        { label: "Study Guide", href: buildAlliedAuthorityPath(profile, "study-guide") },
        { label: "Interview Questions", href: buildAlliedAuthorityPath(profile, "interview-questions") },
      ]}
    >
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <AuthoritySectionCard title="Learning Objectives">
            <AuthorityIconList items={skill.learningObjectives} icon="book" />
          </AuthoritySectionCard>
          <AuthoritySectionCard title="Clinical Context">
            {skill.clinicalContext.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AuthoritySectionCard>
          <AuthoritySectionCard title="Core Steps">
            <ol className="list-decimal space-y-3 pl-5">
              {skill.coreSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </AuthoritySectionCard>
          <AuthoritySectionCard title="Practice Activities">
            <AuthorityIconList items={skill.practiceActivities} icon="clinical" />
          </AuthoritySectionCard>
          <AuthoritySectionCard title="FAQs">
            <div className="space-y-3">
              {skill.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-[var(--semantic-border-soft)] p-4">
                  <summary className="cursor-pointer font-bold text-[var(--theme-heading-text)]">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-6">{faq.answer}</p>
                </details>
              ))}
            </div>
          </AuthoritySectionCard>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <AuthoritySectionCard title="Common Mistakes">
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {skill.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </AuthoritySectionCard>
          <AuthoritySectionCard title="Related Learning">
            <ul className="space-y-2 text-sm">
              {skill.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-semibold text-primary underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AuthoritySectionCard>
        </aside>
      </div>
    </AlliedAuthorityPageShell>
  );
}
