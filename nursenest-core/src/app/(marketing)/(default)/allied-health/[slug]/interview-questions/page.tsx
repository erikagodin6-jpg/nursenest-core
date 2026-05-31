import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import {
  AlliedAuthorityPageShell,
  AuthoritySectionCard,
} from "@/components/marketing/allied-health-authority-layout";
import {
  buildAlliedAuthorityBreadcrumbs,
  buildAlliedAuthorityPath,
  getAlliedAuthorityInterviewQuestions,
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
  const title = `50 ${profile.label} Interview Questions`;
  const description = `Practice ${profile.label.toLowerCase()} interview questions for clinical placement, school admissions, and early-career roles.`;
  const path = buildAlliedAuthorityPath(profile, "interview-questions");
  const alt = marketingAlternatesSharedPage("en", path);
  return safeGenerateMetadata(
    {
      title: `${title} | NurseNest`,
      description,
      alternates: { canonical: alt.canonical, languages: alt.languages },
      openGraph: { title: `${title} | NurseNest`, description, url: alt.canonical, type: "article" },
      twitter: { card: "summary_large_image", title: `${title} | NurseNest`, description },
    },
    { pathname: path, routeGroup: "marketing.default.allied_health.authority.interview" },
  );
}

export default async function AlliedInterviewQuestionsPage({ params }: Props) {
  const { slug } = await params;
  const profile = getAlliedAuthorityProfileBySlug(slug);
  if (!profile) notFound();
  const title = `50 ${profile.label} Interview Questions`;
  const path = buildAlliedAuthorityPath(profile, "interview-questions");
  const breadcrumbs = buildAlliedAuthorityBreadcrumbs(profile, title, path);
  const questions = getAlliedAuthorityInterviewQuestions(profile);

  return (
    <AlliedAuthorityPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={`${profile.label} Interview Hub`}
      title={title}
      deck={`Use these ${profile.label.toLowerCase()} interview questions to prepare for admissions, clinical placement, practicum, and early-career conversations.`}
      sidebarLinks={[
        { label: "Career Guide", href: buildAlliedAuthorityPath(profile, "career") },
        { label: "Placement Guide", href: buildAlliedAuthorityPath(profile, "placement-guide") },
        { label: "Study Guide", href: buildAlliedAuthorityPath(profile, "study-guide") },
      ]}
    >
      <BreadcrumbJsonLd items={breadcrumbs.map((crumb) => ({ name: crumb.name, path: crumb.href }))} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <AuthoritySectionCard title="Interview Question Bank">
          <ol className="grid gap-3 sm:grid-cols-2">
            {questions.map((question, index) => (
              <li key={question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-6">
                <span className="font-bold text-[var(--semantic-brand)]">{index + 1}.</span> {question}
              </li>
            ))}
          </ol>
        </AuthoritySectionCard>
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <AuthoritySectionCard title="How To Practice">
            <p>
              Answer with a clear situation, action, reasoning, safety consideration, and reflection. Strong answers show what
              you noticed, why it mattered, and how you communicated.
            </p>
          </AuthoritySectionCard>
          <AuthoritySectionCard title="What Interviewers Listen For">
            <ul className="list-disc space-y-2 pl-5 text-sm">
              <li>Patient safety and scope awareness.</li>
              <li>Professional communication under stress.</li>
              <li>Ability to learn from feedback.</li>
              <li>Clinical reasoning, not memorized scripts.</li>
            </ul>
          </AuthoritySectionCard>
        </aside>
      </div>
    </AlliedAuthorityPageShell>
  );
}
