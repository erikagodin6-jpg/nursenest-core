import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { useState } from "react";
import {
  BookOpen, ArrowRight, HelpCircle,
  Shield, Heart, Droplets, Thermometer,
  ChevronDown, Stethoscope, Baby,
  ClipboardList, Activity, FileText, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
const CLINICAL_SKILLS_TOPICS = [
  {
    slug: "sterile-technique-nursing",
    title: "Sterile Technique in Nursing",
    description: "Master the principles of surgical asepsis including sterile field setup, gloving procedures, and contamination prevention for invasive procedures.",
    category: "Clinical Skills",
    color: "#059669",
    icon: Shield,
  },
  {
    slug: "wound-irrigation-procedure",
    title: "Wound Irrigation Procedure",
    description: "Learn proper wound irrigation technique including optimal pressure, solution selection, wound assessment, and evidence-based documentation.",
    category: "Clinical Skills",
    color: "#2563EB",
    icon: Droplets,
  },
  {
    slug: "fluid-status-assessment",
    title: "Fluid Status Assessment",
    description: "Master fluid balance assessment including signs of dehydration and fluid overload, I&O monitoring, daily weights, and hemodynamic indicators.",
    category: "Clinical Skills",
    color: "#0284C7",
    icon: Activity,
  },
  {
    slug: "pain-assessment-scales",
    title: "Pain Assessment Scales",
    description: "Comprehensive guide to selecting and applying pain assessment tools: NRS, Wong-Baker FACES, FLACC, CPOT, and age-appropriate scales.",
    category: "Clinical Skills",
    color: "#9333EA",
    icon: Thermometer,
  },
  {
    slug: "newborn-assessment-guide",
    title: "Newborn Assessment Guide",
    description: "Complete head-to-toe newborn assessment including Apgar scoring, vital signs, reflexes, and critical findings requiring immediate intervention.",
    category: "Clinical Skills",
    color: "#DB2777",
    icon: Baby,
  },
];

const HUB_FAQS = [
  { question: "What are clinical nursing skills?", answer: "Clinical nursing skills are the hands-on, practical competencies that nurses use in direct patient care. They include assessment techniques (vital signs, physical examination), procedural skills (sterile technique, wound care, catheterization), monitoring abilities (fluid balance, pain assessment), and clinical judgment (recognizing deterioration, prioritizing interventions). These skills are developed through education, simulation, and supervised clinical practice." },
  { question: "Which clinical skills are most tested on the NCLEX?", answer: "The most heavily tested clinical skills on the NCLEX include: sterile vs. clean technique, wound care and assessment, fluid balance monitoring (I&O, daily weights), pain assessment using validated tools, newborn and pediatric assessment, medication administration safety, and infection control practices. Questions typically test application and clinical judgment rather than simple recall of procedure steps." },
  { question: "How can I improve my clinical nursing skills?", answer: "Practice in simulation labs before clinical rotations. Study the evidence-based rationale behind each step — understanding 'why' helps you adapt when situations change. Use mental rehearsal and checklists. Seek feedback from preceptors. Practice NCLEX-style questions that present clinical scenarios requiring skill application. Review nursing skills videos and participate in skills validation sessions." },
  { question: "What is the difference between sterile and clean technique?", answer: "Sterile technique (surgical asepsis) eliminates ALL microorganisms and is required for procedures entering sterile body cavities (catheterization, central line insertion, surgery). Clean technique (medical asepsis) reduces the number of microorganisms and is used for non-invasive procedures (oral suctioning, wound care of chronic wounds). The key distinction is the level of contamination risk and the body cavity being accessed." },
  { question: "Why is pain considered the fifth vital sign?", answer: "Pain assessment became recognized as the 'fifth vital sign' because unrelieved pain affects every body system, impairs healing, increases anxiety, and reduces quality of life. Like temperature, pulse, respirations, and blood pressure, pain should be assessed regularly and systematically using validated tools. Accurate pain assessment drives appropriate intervention and is a fundamental nursing responsibility." },
];

const breadcrumbItems = [
  { name: "Home", url: "https://www.nursenest.ca" },
  { name: "Topics", url: "https://www.nursenest.ca/topics" },
  { name: "Clinical Nursing Skills", url: "https://www.nursenest.ca/clinical-nursing-skills" },
];

export default function ClinicalNursingSkillsHubPage() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = buildFaqStructuredData(HUB_FAQS);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Clinical Nursing Skills",
    "description": "Comprehensive clinical nursing skills hub covering sterile technique, wound care, fluid assessment, pain scales, and newborn assessment with step-by-step procedures and exam prep.",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.nursenest.ca/clinical-nursing-skills",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="page-clinical-nursing-skills-hub">
      <Navigation />
      <SEO
        title={t("pages.clinicalNursingSkillsHubPage.clinicalNursingSkillsPracticalSkills")}
        description={t("pages.clinicalNursingSkillsHubPage.comprehensiveClinicalNursingSkillsHub")}
        keywords="clinical nursing skills, nursing procedures, sterile technique, wound care nursing, pain assessment nursing, newborn assessment, NCLEX clinical skills"
        canonicalPath="/clinical-nursing-skills"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #D1FAE560, white, #DBEAFE30)" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white bg-emerald-600" data-testid="badge-hub-category">
              <ClipboardList className="w-3 h-3 mr-1" /> Skills Hub
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-hub-title">
              Clinical Nursing Skills
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-hub-description">
              Build confidence in essential clinical nursing procedures. Each skill guide includes step-by-step techniques, evidence-based rationales, clinical significance, and exam preparation notes to help you deliver safe, competent patient care.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-12" data-testid="section-topics">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3" data-testid="heading-topics">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
            </div>
            Clinical Skills Guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CLINICAL_SKILLS_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <LocaleLink key={topic.slug} href={`/${topic.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`card-topic-${topic.slug}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${topic.color}15` }}>
                          <Icon className="w-4 h-4" style={{ color: topic.color }} />
                        </div>
                        <Badge variant="outline" className="text-[10px]">{topic.category}</Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{topic.description}</p>
                      <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </section>

        <div className="my-8 rounded-xl p-6 text-center bg-emerald-50 border-l-4 border-emerald-600" data-testid="cta-practice">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.clinicalNursingSkillsHubPage.practiceClinicalSkillsQuestions")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("pages.clinicalNursingSkillsHubPage.testYourClinicalSkillsKnowledge")}</p>
          <LocaleLink href="/practice-questions">
            <Button className="text-white bg-emerald-600 hover:bg-emerald-700" data-testid="button-cta-practice">
              Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </LocaleLink>
        </div>

        <section className="mb-12" data-testid="section-why-skills">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-blue-50">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            Why Clinical Skills Matter
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Clinical nursing skills are the bridge between theoretical knowledge and patient care. While understanding pathophysiology tells you <em>{t("pages.clinicalNursingSkillsHubPage.what")}</em> is happening, clinical skills determine <em>{t("pages.clinicalNursingSkillsHubPage.how")}</em> you respond. Proper sterile technique prevents infections. Accurate pain assessment drives appropriate intervention. Skilled fluid status monitoring catches deterioration before it becomes critical.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Each skill in this hub is presented with the evidence-based rationale behind every step, common mistakes to avoid, and exam-focused tips. Whether you are preparing for clinical rotations, skills validation, or the NCLEX, these guides provide the systematic approach you need for safe, confident patient care.
            </p>
          </div>
        </section>

        <section className="mb-12" data-testid="section-related-resources">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-violet-50">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            Related Study Resources
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <LocaleLink href="/nursing-physiology-explained">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-physiology-hub">
                <CardContent className="p-4 text-center">
                  <Brain className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.clinicalNursingSkillsHubPage.nursingPhysiology")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.clinicalNursingSkillsHubPage.underlyingPathophysiologyConcepts")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/lessons">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-lessons">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.clinicalNursingSkillsHubPage.clinicalLessons")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.clinicalNursingSkillsHubPage.comprehensiveClinicalEducation")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/flashcards">
              <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid="link-flashcards">
                <CardContent className="p-4 text-center">
                  <ClipboardList className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{t("pages.clinicalNursingSkillsHubPage.flashcards")}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t("pages.clinicalNursingSkillsHubPage.quickReviewAndReinforcement")}</p>
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section id="faq" className="mb-12" data-testid="section-faq">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {HUB_FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mb-12">
          <EndOfContentLeadCapture leadMagnetType="study_guide" source="clinical_nursing_skills_hub" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
