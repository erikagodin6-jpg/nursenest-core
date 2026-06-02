import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { useLocation } from "wouter";
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
    categoryKey: "faq.category.general",
    categorySlug: "general",
    questions: [
      { id: "general-1", questionKey: "faq.general1.q", answerKey: "faq.general1.a" },
      { id: "general-2", questionKey: "faq.general2.q", answerKey: "faq.general2.a" },
      { id: "general-3", questionKey: "faq.general3.q", answerKey: "faq.general3.a" },
      { id: "general-4", questionKey: "faq.general4.q", answerKey: "faq.general4.a" },
      { id: "general-5", questionKey: "faq.general5.q", answerKey: "faq.general5.a" },
    ],
  },
  {
    categoryKey: "faq.category.subscription",
    categorySlug: "subscription-access",
    questions: [
      { id: "pricing-1", questionKey: "faq.pricing1.q", answerKey: "faq.pricing1.a" },
      { id: "pricing-2", questionKey: "faq.pricing2.q", answerKey: "faq.pricing2.a" },
      { id: "pricing-3", questionKey: "faq.pricing3.q", answerKey: "faq.pricing3.a" },
      { id: "pricing-4", questionKey: "faq.pricing4.q", answerKey: "faq.pricing4.a" },
      { id: "pricing-5", questionKey: "faq.pricing5.q", answerKey: "faq.pricing5.a" },
      { id: "pricing-6", questionKey: "faq.pricing6.q", answerKey: "faq.pricing6.a" },
      { id: "pricing-7", questionKey: "faq.pricing7.q", answerKey: "faq.pricing7.a" },
      { id: "pricing-8", questionKey: "faq.pricing8.q", answerKey: "faq.pricing8.a" },
    ],
  },
  {
    categoryKey: "faq.category.exam",
    categorySlug: "exam-preparation",
    questions: [
      { id: "exam-1", questionKey: "faq.exam1.q", answerKey: "faq.exam1.a" },
      { id: "exam-2", questionKey: "faq.exam2.q", answerKey: "faq.exam2.a" },
      { id: "exam-3", questionKey: "faq.exam3.q", answerKey: "faq.exam3.a" },
      { id: "exam-4", questionKey: "faq.exam4.q", answerKey: "faq.exam4.a" },
      { id: "exam-5", questionKey: "faq.exam5.q", answerKey: "faq.exam5.a" },
      { id: "exam-6", questionKey: "faq.exam6.q", answerKey: "faq.exam6.a" },
    ],
  },
  {
    categoryKey: "faq.category.content",
    categorySlug: "content-educational-design",
    questions: [
      { id: "content-1", questionKey: "faq.content1.q", answerKey: "faq.content1.a" },
      { id: "content-2", questionKey: "faq.content2.q", answerKey: "faq.content2.a" },
      { id: "content-3", questionKey: "faq.content3.q", answerKey: "faq.content3.a" },
      { id: "content-4", questionKey: "faq.content4.q", answerKey: "faq.content4.a" },
      { id: "content-5", questionKey: "faq.content5.q", answerKey: "faq.content5.a" },
      { id: "content-6", questionKey: "faq.content6.q", answerKey: "faq.content6.a" },
    ],
  },
  {
    categoryKey: "faq.category.technical",
    categorySlug: "technical-platform",
    questions: [
      { id: "technical-1", questionKey: "faq.technical1.q", answerKey: "faq.technical1.a" },
      { id: "technical-2", questionKey: "faq.technical2.q", answerKey: "faq.technical2.a" },
      { id: "technical-3", questionKey: "faq.technical3.q", answerKey: "faq.technical3.a" },
    ],
  },
  {
    categoryKey: "faq.category.boundaries",
    categorySlug: "educational-professional-boundaries",
    questions: [
      { id: "boundaries-1", questionKey: "faq.boundaries1.q", answerKey: "faq.boundaries1.a" },
      { id: "boundaries-2", questionKey: "faq.boundaries2.q", answerKey: "faq.boundaries2.a" },
    ],
  },
];

export default function FAQPage() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const allFaqs = faqData.flatMap((s) => s.questions.map((q) => ({ question: t(q.questionKey), answer: t(q.answerKey) })));

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col">
      <SEO
        title={t("pages.faq.frequentlyAskedQuestionsNursenestHealthcare")}
        description={t("pages.faq.findAnswersAboutNursenestHealthcare")}
        keywords="NurseNest FAQ, nursing education questions, NCLEX prep FAQ, allied health exam prep, new graduate support, healthcare student help, subscription questions"
        canonicalPath="/faq"
        structuredData={buildFaqStructuredData(allFaqs)}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "FAQ", url: "https://www.nursenest.ca/faq" },
        ]}
      />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-faq-title"
          >
            {t("faq.pageTitle")}
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-faq-subtitle"
          >
            {t("faq.pageSubtitle")}
          </p>
        </div>

        {faqData.map((section) => (
          <div
            key={section.categorySlug}
            className="mb-8"
            data-testid={`faq-section-${section.categorySlug}`}
          >
            <h2
              className="text-2xl font-semibold text-primary mb-4"
              data-testid={`text-faq-category-${section.categorySlug}`}
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

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="faq-cross-links">
          <LocaleLink
            href="/allied-health/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-faq-to-allied"
          >
            <div>
              <p className="text-sm text-softgray">{t("faq.crossLink.allied")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("faq.crossLink.alliedLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
          <LocaleLink
            href="/new-grad/faq"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-primary/10 hover:border-primary/30 hover:shadow-sm transition-all group"
            data-testid="link-faq-to-newgrad"
          >
            <div>
              <p className="text-sm text-softgray">{t("faq.crossLink.newGrad")}</p>
              <p className="font-medium text-primary group-hover:underline">{t("faq.crossLink.newGradLink")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </LocaleLink>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/10 text-center text-sm text-softgray" data-testid="faq-footer-links">
          <p>
            {t("faq.footerText")}{" "}
            <LocaleLink
              href="/terms"
              className="text-primary hover:underline font-medium"
              data-testid="link-terms"
            >
              {t("faq.termsOfUse")}
            </LocaleLink>
            {t("faq.footerSeparator")}{" "}
            <LocaleLink
              href="/privacy"
              className="text-primary hover:underline font-medium"
              data-testid="link-privacy"
            >
              {t("faq.privacyPolicy")}
            </LocaleLink>
            {t("faq.footerAnd")}{" "}
            <LocaleLink
              href="/disclaimer"
              className="text-primary hover:underline font-medium"
              data-testid="link-disclaimer"
            >
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
