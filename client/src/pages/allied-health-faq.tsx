import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { useI18n } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { ArrowRight } from "lucide-react";

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

interface FaqSection {
  categoryKey: string;
  categorySlug: string;
  questions: FaqItem[];
}

const faqData: FaqSection[] = [
  {
    categoryKey: "alliedFaq.category.general",
    categorySlug: "general",
    questions: [
      { id: "ah-general-1", questionKey: "alliedFaq.general1.q", answerKey: "alliedFaq.general1.a" },
      { id: "ah-general-2", questionKey: "alliedFaq.general2.q", answerKey: "alliedFaq.general2.a" },
      { id: "ah-general-3", questionKey: "alliedFaq.general3.q", answerKey: "alliedFaq.general3.a" },
    ],
  },
  {
    categoryKey: "alliedFaq.category.professions",
    categorySlug: "professions",
    questions: [
      { id: "ah-prof-1", questionKey: "alliedFaq.professions1.q", answerKey: "alliedFaq.professions1.a" },
      { id: "ah-prof-2", questionKey: "alliedFaq.professions2.q", answerKey: "alliedFaq.professions2.a" },
      { id: "ah-prof-3", questionKey: "alliedFaq.professions3.q", answerKey: "alliedFaq.professions3.a" },
      { id: "ah-prof-4", questionKey: "alliedFaq.professions4.q", answerKey: "alliedFaq.professions4.a" },
      { id: "ah-prof-5", questionKey: "alliedFaq.professions5.q", answerKey: "alliedFaq.professions5.a" },
    ],
  },
  {
    categoryKey: "alliedFaq.category.exams",
    categorySlug: "exams-certifications",
    questions: [
      { id: "ah-exam-1", questionKey: "alliedFaq.exams1.q", answerKey: "alliedFaq.exams1.a" },
      { id: "ah-exam-2", questionKey: "alliedFaq.exams2.q", answerKey: "alliedFaq.exams2.a" },
      { id: "ah-exam-3", questionKey: "alliedFaq.exams3.q", answerKey: "alliedFaq.exams3.a" },
    ],
  },
  {
    categoryKey: "alliedFaq.category.studyTools",
    categorySlug: "study-tools",
    questions: [
      { id: "ah-tools-1", questionKey: "alliedFaq.studyTools1.q", answerKey: "alliedFaq.studyTools1.a" },
      { id: "ah-tools-2", questionKey: "alliedFaq.studyTools2.q", answerKey: "alliedFaq.studyTools2.a" },
    ],
  },
];

export default function AlliedHealthFAQPage() {
  const { t } = useI18n();

  const allFaqs = faqData.flatMap((s) =>
    s.questions.map((q) => ({ question: t(q.questionKey), answer: t(q.answerKey) }))
  );

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col">
      <SEO
        title={t("pages.alliedHealthFaq.alliedHealthFaqNursenestHealthcare")}
        description={t("pages.alliedHealthFaq.findAnswersAboutNursenestAllied")}
        keywords="allied health FAQ, RRT exam prep questions, paramedic certification FAQ, pharmacy technician exam, MLT certification, ARRT exam prep, healthcare exam preparation"
        canonicalPath="/allied-health/faq"
        structuredData={buildFaqStructuredData(allFaqs)}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Allied Health", url: "https://www.nursenest.ca/allied-health" },
          { name: "FAQ", url: "https://www.nursenest.ca/allied-health/faq" },
        ]}
      />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-allied-faq-title"
          >
            {t("alliedFaq.pageTitle")}
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-allied-faq-subtitle"
          >
            {t("alliedFaq.pageSubtitle")}
          </p>
        </div>

        {faqData.map((section) => (
          <div
            key={section.categorySlug}
            className="mb-8"
            data-testid={`allied-faq-section-${section.categorySlug}`}
          >
            <h2
              className="text-2xl font-semibold text-primary mb-4"
              data-testid={`text-allied-faq-category-${section.categorySlug}`}
            >
              {t(section.categoryKey)}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6">
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((q) => (
                  <AccordionItem
                    key={q.id}
                    value={q.id}
                    data-testid={`accordion-item-${q.id}`}
                    className="border-primary/10"
                  >
                    <AccordionTrigger
                      className="text-left font-medium text-gray-800 hover:text-primary hover:no-underline"
                      data-testid={`accordion-trigger-${q.id}`}
                    >
                      {t(q.questionKey)}
                    </AccordionTrigger>
                    <AccordionContent
                      className="text-softgray leading-relaxed"
                      data-testid={`accordion-content-${q.id}`}
                    >
                      {t(q.answerKey)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        ))}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="allied-faq-cross-links">
          <LocaleLink
            href="/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-allied-faq-to-main"
          >
            <div>
              <p className="text-sm text-softgray">{t("alliedFaq.crossLink.main")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("alliedFaq.crossLink.mainLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
          <LocaleLink
            href="/new-grad/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-allied-faq-to-newgrad"
          >
            <div>
              <p className="text-sm text-softgray">{t("alliedFaq.crossLink.newGrad")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("alliedFaq.crossLink.newGradLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/10 text-center text-sm text-softgray" data-testid="allied-faq-footer-links">
          <p>
            {t("faq.footerText")}{" "}
            <LocaleLink href="/terms" className="text-primary hover:underline font-medium" data-testid="link-terms">
              {t("faq.termsOfUse")}
            </LocaleLink>
            {t("faq.footerSeparator")}{" "}
            <LocaleLink href="/privacy" className="text-primary hover:underline font-medium" data-testid="link-privacy">
              {t("faq.privacyPolicy")}
            </LocaleLink>
            {t("faq.footerAnd")}{" "}
            <LocaleLink href="/disclaimer" className="text-primary hover:underline font-medium" data-testid="link-disclaimer">
              {t("faq.disclaimer")}
            </LocaleLink>
            {t("faq.footerPeriod")}
          </p>
        </div>
      </div>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
