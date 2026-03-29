import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { LeadCaptureInline } from "@/components/new-grad/lead-capture";
import { CLINICAL_SKILLS_CATEGORIES, NEW_GRAD_PROFESSIONS } from "@shared/new-grad-professions";
import { ChevronRight, BookOpen, CheckCircle2, Star, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function ClinicalSkillsGuidePage() {
  const { t } = useI18n();
  const params = useParams<{ skill: string }>();
  const skill = CLINICAL_SKILLS_CATEGORIES[params.skill || ""];

  const { data: guide } = useQuery({
    queryKey: ["/api/new-grad/guides", `clinical-skill-${params.skill}`],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides/clinical-skill-${params.skill}`);
      return res.ok ? res.json() : null;
    },
    enabled: !!params.skill,
  });

  if (!skill) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-skill-not-found">{t("pages.newGrad.clinicalSkillsGuidePage.clinicalSkillGuideNotFound")}</h1>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.clinicalSkillsGuidePage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProfessions = Object.values(NEW_GRAD_PROFESSIONS).filter(p =>
    p.clinicalSkillCategories.includes(params.skill || "")
  );

  const faqData = [
    { question: `Why is ${skill.name.toLowerCase()} important for new graduates?`, answer: `${skill.description} Mastering this skill early in your career builds confidence and improves patient outcomes.` },
    { question: `How can I improve my ${skill.name.toLowerCase()} skills?`, answer: `Practice consistently, seek feedback from experienced colleagues, use structured frameworks, and reflect on your performance after each shift.` },
  ];

  const sections = guide?.sections || [];

  return (
    <div className="min-h-screen flex flex-col" data-testid={`clinical-skill-${params.skill}`}>
      <Navigation />
      <SEO
        title={`${skill.name} - Clinical Skills Guide for New Grads | NurseNest`}
        description={skill.description}
        keywords={`${skill.name.toLowerCase()}, new grad clinical skills, ${params.skill}, healthcare skills guide`}
        canonicalPath={`/new-grad/clinical-skills/${params.skill}`}
        additionalStructuredData={[buildFaqStructuredData(faqData)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: "Clinical Skills", url: "https://www.nursenest.ca/new-grad" },
          { name: skill.name, url: `https://www.nursenest.ca/new-grad/clinical-skills/${params.skill}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white" data-testid="section-skill-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.clinicalSkillsGuidePage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.clinicalSkillsGuidePage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-700 font-medium">{skill.name}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-blue-100 text-blue-700">
            <BookOpen className="w-4 h-4" />
            Clinical Skills Guide
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-skill-title">
            {skill.name}
          </h1>
          <p className="text-lg text-gray-600 mb-8" data-testid="text-skill-description">
            {skill.description}
          </p>
        </div>
      </section>

      <section className="py-16" data-testid="section-skill-content">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections.length > 0 ? (
            <div className="space-y-8">
              {(sections as any[]).map((section: any, i: number) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                  <div className="text-gray-600 whitespace-pre-line">{section.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.clinicalSkillsGuidePage.keyPrinciples")}</h2>
              <p className="text-gray-600 mb-6">{skill.description}</p>
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{t("pages.newGrad.clinicalSkillsGuidePage.quickTips")}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    Practice this skill deliberately during every shift
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    Ask experienced colleagues for feedback on your technique
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    Reflect on what went well and what could improve after each shift
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    Use structured frameworks and checklists to ensure consistency
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {relatedProfessions.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-related-professions">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.clinicalSkillsGuidePage.relevantFor")}</h2>
            <div className="flex flex-wrap gap-3">
              {relatedProfessions.map(p => (
                <Link key={p.slug} href={`/new-grad/${p.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-blue-300 transition-colors" data-testid={`link-profession-${p.slug}`}>
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white" data-testid="section-skill-faq">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-4 group" data-testid={`faq-${i}`}>
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-gray-600 mt-3 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <LeadCaptureInline profession="general" professionName="Healthcare" color="#3b82f6" resourceName="Clinical Skills Quick Reference" resourceType="clinical-skills-reference" />
      <InternalLinks currentPath={`/new-grad/clinical-skills/${params.skill}`} profession="general" professionName="Healthcare" />
      <Footer />
    </div>
  );
}
