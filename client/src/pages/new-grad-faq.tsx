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
    categoryKey: "newGradFaq.category.transition",
    categorySlug: "career-transition",
    questions: [
      { id: "ng-trans-1", questionKey: "newGradFaq.transition1.q", answerKey: "newGradFaq.transition1.a" },
      { id: "ng-trans-2", questionKey: "newGradFaq.transition2.q", answerKey: "newGradFaq.transition2.a" },
      { id: "ng-trans-3", questionKey: "newGradFaq.transition3.q", answerKey: "newGradFaq.transition3.a" },
      { id: "ng-trans-4", questionKey: "newGradFaq.transition4.q", answerKey: "newGradFaq.transition4.a" },
      { id: "ng-trans-5", questionKey: "newGradFaq.transition5.q", answerKey: "newGradFaq.transition5.a" },
    ],
  },
  {
    categoryKey: "newGradFaq.category.certifications",
    categorySlug: "certifications-licensing",
    questions: [
      { id: "ng-cert-1", questionKey: "newGradFaq.certifications1.q", answerKey: "newGradFaq.certifications1.a" },
      { id: "ng-cert-2", questionKey: "newGradFaq.certifications2.q", answerKey: "newGradFaq.certifications2.a" },
      { id: "ng-cert-3", questionKey: "newGradFaq.certifications3.q", answerKey: "newGradFaq.certifications3.a" },
    ],
  },
  {
    categoryKey: "newGradFaq.category.profDev",
    categorySlug: "professional-development",
    questions: [
      { id: "ng-pd-1", questionKey: "newGradFaq.profDev1.q", answerKey: "newGradFaq.profDev1.a" },
      { id: "ng-pd-2", questionKey: "newGradFaq.profDev2.q", answerKey: "newGradFaq.profDev2.a" },
      { id: "ng-pd-3", questionKey: "newGradFaq.profDev3.q", answerKey: "newGradFaq.profDev3.a" },
    ],
  },
  {
    categoryKey: "newGradFaq.category.tools",
    categorySlug: "career-tools",
    questions: [
      { id: "ng-tools-1", questionKey: "newGradFaq.tools1.q", answerKey: "newGradFaq.tools1.a" },
      { id: "ng-tools-2", questionKey: "newGradFaq.tools2.q", answerKey: "newGradFaq.tools2.a" },
    ],
  },
];

export default function NewGradFAQPage() {
  const { t } = useI18n();

  const allFaqs = faqData.flatMap((s) =>
    s.questions.map((q) => ({ question: t(q.questionKey), answer: t(q.answerKey) }))
  );

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col">
      <SEO
        title={t("pages.newGradFaq.newGraduateFaqNursenestHealthcare")}
        description={t("pages.newGradFaq.findAnswersAboutNursenestNew")}
        keywords="new grad nurse FAQ, new graduate healthcare, career transition questions, interview prep, resume builder, first year nurse, nursing graduate support, allied health new grad"
        canonicalPath="/new-grad/faq"
        structuredData={buildFaqStructuredData(allFaqs)}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "New Grad", url: "https://www.nursenest.ca/new-grad" },
          { name: "FAQ", url: "https://www.nursenest.ca/new-grad/faq" },
        ]}
      />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-newgrad-faq-title"
          >
            {t("newGradFaq.pageTitle")}
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-newgrad-faq-subtitle"
          >
            {t("newGradFaq.pageSubtitle")}
          </p>
        </div>

        {faqData.map((section) => (
          <div
            key={section.categorySlug}
            className="mb-8"
            data-testid={`newgrad-faq-section-${section.categorySlug}`}
          >
            <h2
              className="text-2xl font-semibold text-primary mb-4"
              data-testid={`text-newgrad-faq-category-${section.categorySlug}`}
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

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="newgrad-faq-cross-links">
          <LocaleLink
            href="/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-newgrad-faq-to-main"
          >
            <div>
              <p className="text-sm text-softgray">{t("newGradFaq.crossLink.main")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("newGradFaq.crossLink.mainLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
          <LocaleLink
            href="/allied-health/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-newgrad-faq-to-allied"
          >
            <div>
              <p className="text-sm text-softgray">{t("newGradFaq.crossLink.allied")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("newGradFaq.crossLink.alliedLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/10 text-center text-sm text-softgray" data-testid="newgrad-faq-footer-links">
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
