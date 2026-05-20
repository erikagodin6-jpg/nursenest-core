import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { LeadCaptureInline } from "@/components/new-grad/lead-capture";
import { CAREER_DEVELOPMENT_PATHS, NEW_GRAD_PROFESSIONS } from "@shared/new-grad-professions";
import { ChevronRight, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function CareerDevelopmentPage() {
  const { t } = useI18n();
  const params = useParams<{ path: string }>();
  const careerPath = CAREER_DEVELOPMENT_PATHS[params.path || ""];

  const { data: guide } = useQuery({
    queryKey: ["/api/new-grad/guides", `career-${params.path}`],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides/career-${params.path}`);
      return res.ok ? res.json() : null;
    },
    enabled: !!params.path,
  });

  if (!careerPath) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-career-not-found">{t("pages.newGrad.careerDevelopmentPage.careerPathNotFound")}</h1>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.careerDevelopmentPage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fromProfession = NEW_GRAD_PROFESSIONS[careerPath.fromProfession];
  const toProfession = careerPath.toProfession ? NEW_GRAD_PROFESSIONS[careerPath.toProfession] : null;
  const color = fromProfession?.color || "#3b82f6";
  const sections = guide?.sections || [];

  const faqData = [
    { question: `How long does the ${careerPath.name} transition take?`, answer: `The timeline varies depending on program requirements, but typically ranges from 1-4 years including education, clinical hours, and certification preparation.` },
    { question: `What are the requirements for ${careerPath.name}?`, answer: `${careerPath.description} Requirements typically include additional education, supervised clinical hours, and passing relevant certification exams.` },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid={`career-path-${params.path}`}>
      <Navigation />
      <SEO
        title={`${careerPath.name} - Career Development Guide | NurseNest`}
        description={careerPath.description}
        keywords={`${careerPath.name.toLowerCase()}, career advancement, ${careerPath.fromProfession} career path`}
        canonicalPath={`/new-grad/career/${params.path}`}
        additionalStructuredData={[buildFaqStructuredData(faqData)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: "Career Development", url: "https://www.nursenest.ca/new-grad" },
          { name: careerPath.name, url: `https://www.nursenest.ca/new-grad/career/${params.path}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white" data-testid="section-career-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.careerDevelopmentPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.careerDevelopmentPage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            {fromProfession && (
              <>
                <Link href={`/new-grad/${fromProfession.slug}`} className="hover:text-blue-600">{fromProfession.shortName}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
            <span style={{ color }} className="font-medium">{careerPath.name}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-purple-100 text-purple-700">
            <TrendingUp className="w-4 h-4" />
            Career Development
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-career-title">
            {careerPath.name}
          </h1>
          <p className="text-lg text-gray-600 mb-8">{careerPath.description}</p>
          {toProfession && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: fromProfession?.color + "40", color: fromProfession?.color }}>
                {fromProfession?.shortName}
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-3 py-1 rounded-full border" style={{ borderColor: toProfession.color + "40", color: toProfession.color }}>
                {toProfession.shortName}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="py-16" data-testid="section-career-content">
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.careerDevelopmentPage.careerTransitionOverview")}</h2>
              <p className="text-gray-600 mb-6">{careerPath.description}</p>
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{t("pages.newGrad.careerDevelopmentPage.stepsToGetStarted")}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />{t("pages.newGrad.careerDevelopmentPage.researchProgramRequirementsAndPrerequisites")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />{t("pages.newGrad.careerDevelopmentPage.gainRelevantClinicalExperienceIn")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />{t("pages.newGrad.careerDevelopmentPage.connectWithProfessionalsWhoHave")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />{t("pages.newGrad.careerDevelopmentPage.applyToAccreditedProgramsAnd")}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-career-faq">
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

      <LeadCaptureInline profession={careerPath.fromProfession} professionName={fromProfession?.name || "Healthcare"} color={color} resourceName="Career Advancement Guide" resourceType="career-advancement-guide" />
      <InternalLinks currentPath={`/new-grad/career/${params.path}`} profession={careerPath.fromProfession} professionName={fromProfession?.name || "Healthcare"} />
      <Footer />
    </div>
  );
}
