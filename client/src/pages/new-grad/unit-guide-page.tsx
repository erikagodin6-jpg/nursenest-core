import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { LeadCaptureInline } from "@/components/new-grad/lead-capture";
import { UNIT_GUIDES, NEW_GRAD_PROFESSIONS } from "@shared/new-grad-professions";
import { ChevronRight, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function UnitGuidePage() {
  const { t } = useI18n();
  const params = useParams<{ unit: string }>();
  const unit = UNIT_GUIDES[params.unit || ""];

  const { data: guide } = useQuery({
    queryKey: ["/api/new-grad/guides", `unit-guide-${params.unit}`],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides/unit-guide-${params.unit}`);
      return res.ok ? res.json() : null;
    },
    enabled: !!params.unit,
  });

  if (!unit) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-unit-not-found">{t("pages.newGrad.unitGuidePage.unitGuideNotFound")}</h1>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.unitGuidePage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProfessions = unit.professions.map(s => NEW_GRAD_PROFESSIONS[s]).filter(Boolean);
  const sections = guide?.sections || [];

  const faqData = [
    { question: `What should I expect as a new grad on a ${unit.name} unit?`, answer: `${unit.description} As a new grad, expect a structured orientation period with increasing patient responsibilities.` },
    { question: `How long is orientation on a ${unit.name} unit?`, answer: `Orientation typically lasts 8-16 weeks depending on the facility and unit complexity. Some specialty units may have longer orientation periods.` },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid={`unit-guide-${params.unit}`}>
      <Navigation />
      <SEO
        title={`${unit.name} Unit Guide for New Grads | NurseNest`}
        description={unit.description}
        keywords={`${unit.name.toLowerCase()} new grad, new graduate ${unit.name.toLowerCase()}, ${params.unit} unit guide`}
        canonicalPath={`/new-grad/unit-guide/${params.unit}`}
        additionalStructuredData={[buildFaqStructuredData(faqData)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: "Unit Guides", url: "https://www.nursenest.ca/new-grad" },
          { name: unit.name, url: `https://www.nursenest.ca/new-grad/unit-guide/${params.unit}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/50 to-white" data-testid="section-unit-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.unitGuidePage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.unitGuidePage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-700 font-medium">{unit.name}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-emerald-100 text-emerald-700">
            <BookOpen className="w-4 h-4" />
            Unit-Specific Guide
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-unit-title">
            New Grad Guide: <span className="text-emerald-600">{unit.name}</span>
          </h1>
          <p className="text-lg text-gray-600">{unit.description}</p>
        </div>
      </section>

      <section className="py-16" data-testid="section-unit-content">
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.unitGuidePage.whatToExpect")}</h2>
              <p className="text-gray-600 mb-6">{unit.description}</p>
              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{t("pages.newGrad.unitGuidePage.preparationChecklist")}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />{t("pages.newGrad.unitGuidePage.researchCommonDiagnosesAndProcedures")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />{t("pages.newGrad.unitGuidePage.reviewRelevantMedicationsAndTheir")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />{t("pages.newGrad.unitGuidePage.learnUnitspecificProtocolsAndDocumentation")}</li>
                  <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />{t("pages.newGrad.unitGuidePage.connectWithExperiencedStaffFor")}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {relatedProfessions.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-unit-professions">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("pages.newGrad.unitGuidePage.relatedProfessionHubs")}</h2>
            <div className="flex flex-wrap gap-3">
              {relatedProfessions.map(p => (
                <Link key={p.slug} href={`/new-grad/${p.slug}`} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 hover:border-emerald-300 transition-colors" data-testid={`link-profession-${p.slug}`}>
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white" data-testid="section-unit-faq">
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

      <LeadCaptureInline profession="general" professionName={unit.name} color="#10b981" resourceName={`${unit.name} Orientation Checklist`} resourceType="unit-orientation-checklist" />
      <InternalLinks currentPath={`/new-grad/unit-guide/${params.unit}`} profession="general" professionName="Healthcare" />
      <Footer />
    </div>
  );
}
