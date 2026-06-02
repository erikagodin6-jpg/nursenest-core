import { useState } from "react";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Shield, Globe, BookOpen, GraduationCap,
  Scale, ChevronRight, HelpCircle,
  Briefcase, Stethoscope, Award, ClipboardList, TrendingUp
} from "lucide-react";

const POLICY_CATEGORIES = [
  {
    id: "licensing",
    title: "Licensing Policy Changes",
    description: "Major updates to nursing licensure requirements, exam eligibility, and scope of practice across jurisdictions.",
    icon: Shield,
    color: "blue",
    href: "/healthcare-policy-and-updates/licensing-policy-changes",
    topics: ["Compact licensing updates", "Scope of practice changes", "Endorsement requirements", "License renewal policies"],
  },
  {
    id: "international",
    title: "International Nursing Recruitment",
    description: "Policies and pathways for internationally educated nurses seeking licensure and employment in new countries.",
    icon: Globe,
    color: "emerald",
    href: "/healthcare-policy-and-updates/international-nursing-recruitment",
    topics: ["Credential evaluation processes", "Visa and immigration pathways", "Bridging program requirements", "Recruitment agency regulations"],
  },
  {
    id: "exam-updates",
    title: "Exam Format Updates",
    description: "Changes to nursing examination formats, scoring methodologies, and testing procedures.",
    icon: ClipboardList,
    color: "violet",
    href: "/healthcare-policy-and-updates/exam-format-updates",
    topics: ["Next Generation NCLEX format", "CAT algorithm changes", "Score reporting updates", "Testing center policies"],
  },
  {
    id: "regulatory",
    title: "Regulatory Changes",
    description: "Healthcare regulatory updates affecting nursing practice, patient safety standards, and professional requirements.",
    icon: Scale,
    color: "amber",
    href: "/healthcare-policy-and-updates/regulatory-changes-affecting-nurses",
    topics: ["Patient safety regulations", "Staffing ratio mandates", "Telehealth practice standards", "Continuing education requirements"],
  },
];

const COLOR_STYLES: Record<string, { bg: string; iconColor: string; border: string; gradient: string }> = {
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-200", gradient: "from-blue-500 to-blue-600" },
  emerald: { bg: "bg-emerald-50", iconColor: "text-emerald-600", border: "border-emerald-200", gradient: "from-emerald-500 to-emerald-600" },
  violet: { bg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-200", gradient: "from-violet-500 to-violet-600" },
  amber: { bg: "bg-amber-50", iconColor: "text-amber-600", border: "border-amber-200", gradient: "from-amber-500 to-amber-600" },
};

const FAQ_DATA = [
  { question: "How often do nursing licensure requirements change?", answer: "Nursing licensure requirements can change at any time as regulatory bodies update their standards. Major changes typically occur annually through legislative sessions, though emergency provisions can be enacted more quickly. We track these changes across all major jurisdictions to keep you informed." },
  { question: "How do exam format changes affect my preparation?", answer: "Exam format changes may alter question types, scoring methods, or content distribution. When changes are announced, exam prep materials and study strategies should be updated accordingly. NurseNest continuously updates its question bank and study resources to align with the latest exam formats." },
  { question: "What policies affect internationally educated nurses?", answer: "Internationally educated nurses must navigate credential evaluation, language proficiency requirements, visa/immigration processes, and jurisdiction-specific bridging programs. Policies vary significantly between countries and even between states or provinces within a country." },
  { question: "How do staffing ratio laws affect new nurses?", answer: "Staffing ratio laws directly impact working conditions, patient assignments, and workplace safety. States and provinces with mandated ratios typically provide more structured orientation periods and manageable patient loads for new graduates." },
  { question: "Where can I find updates about my state or provincial nursing board?", answer: "Our regulatory bodies hub covers major nursing regulatory organizations across North America, the UK, Australia, and New Zealand. For jurisdiction-specific updates, we recommend also checking your local nursing board's website directly." },
  { question: "How do scope of practice changes affect my career?", answer: "Scope of practice expansions or restrictions can open new career opportunities or require additional training. For example, nurse practitioner full practice authority laws vary by state and directly impact NP autonomy, prescribing privileges, and practice settings." },
];

const RELATED_RESOURCES = [
  { title: "Exam Prep Hub", href: "/exam-prep", icon: BookOpen, desc: "Comprehensive exam preparation resources" },
  { title: "Healthcare Careers", href: "/healthcare-careers", icon: Briefcase, desc: "Explore healthcare career pathways" },
  { title: "Healthcare Certifications", href: "/healthcare-certifications", icon: Award, desc: "Certification guides and requirements" },
  { title: "International Nurses", href: "/international-nurses", icon: Globe, desc: "Resources for internationally educated nurses" },
  { title: "Nursing Regulatory Bodies", href: "/nursing-regulatory-bodies", icon: Shield, desc: "Regulatory body directory" },
  { title: "Study Pathways", href: "/study-pathways", icon: GraduationCap, desc: "Structured study pathways" },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-policy-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-policy-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-policy-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}

export default function HealthcarePolicyHub() {
  const faqStructuredData = buildFaqStructuredData(FAQ_DATA);

  return (
    <div data-testid="page-healthcare-policy-hub">
      <Navigation />
      <SEO
        title={t("pages.healthcarePolicyHub.healthcarePolicyUpdatesHubLicensing")}
        description={t("pages.healthcarePolicyHub.stayInformedOnHealthcarePolicy")}
        keywords="healthcare policy, nursing policy changes, nursing licensure updates, exam format changes, regulatory changes nursing, international nursing recruitment, nurse practice act, scope of practice"
        canonicalPath="/healthcare-policy-and-updates"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Healthcare Policy & Updates Hub",
          "description": "Comprehensive healthcare policy resource covering licensing changes, international recruitment, exam updates, and regulatory developments affecting nurses.",
          "url": "https://www.nursenest.ca/healthcare-policy-and-updates",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca",
          },
        }}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Healthcare Policy & Updates", url: "https://www.nursenest.ca/healthcare-policy-and-updates" },
        ]}
      />

      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <LocaleLink href="/" className="hover:text-primary" data-testid="link-policy-breadcrumb-home">{t("pages.healthcarePolicyHub.home")}</LocaleLink>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{t("pages.healthcarePolicyHub.healthcarePolicyUpdates")}</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyHub.policyResource")}</span>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">{t("pages.healthcarePolicyHub.evergreenContent")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="heading-policy-hub">
              Healthcare Policy & Updates
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6" data-testid="text-policy-hub-subtitle">
              Navigate the evolving landscape of healthcare policy. Our comprehensive guides cover licensing changes, international nursing recruitment, exam format updates, and regulatory developments that affect your career and practice.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/exam-prep" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium" data-testid="button-policy-explore-exam-prep">
                <BookOpen className="w-4 h-4" />
                Exam Prep Hub
              </LocaleLink>
              <LocaleLink href="/healthcare-careers" className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-300" data-testid="button-policy-explore-careers">
                <Briefcase className="w-4 h-4" />
                Healthcare Careers
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="heading-policy-categories">{t("pages.healthcarePolicyHub.policyCategories")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.healthcarePolicyHub.explorePolicyTopicsOrganizedBy")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {POLICY_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const styles = COLOR_STYLES[cat.color];
              return (
                <LocaleLink
                  key={cat.id}
                  href={cat.href}
                  className={`block p-6 rounded-2xl border ${styles.border} ${styles.bg} hover:shadow-lg transition-all group`}
                  data-testid={`card-policy-${cat.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                      <Icon className={`w-6 h-6 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {cat.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.topics.map((topic, i) => (
                          <span key={i} className="text-xs bg-white/80 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{topic}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.healthcarePolicyHub.whyPolicyAwarenessMatters")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.healthcarePolicyHub.understandingHealthcarePolicyChangesHelps")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "License Compliance", desc: "Stay current with licensing requirements to maintain your practice credentials." },
              { icon: TrendingUp, title: "Career Advancement", desc: "Understand scope of practice changes that create new career opportunities." },
              { icon: Stethoscope, title: "Patient Safety", desc: "Stay informed on regulatory changes that affect care delivery standards." },
              { icon: Globe, title: "Global Mobility", desc: "Navigate international recruitment policies for cross-border career moves." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 text-center" data-testid={`card-policy-benefit-${i}`}>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t("pages.healthcarePolicyHub.relatedResources")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.healthcarePolicyHub.connectPolicyKnowledgeWithYour")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RELATED_RESOURCES.map((res, i) => {
              const Icon = res.icon;
              return (
                <LocaleLink
                  key={i}
                  href={res.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  data-testid={`link-policy-resource-${i}`}
                >
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{res.title}</div>
                    <div className="text-xs text-gray-500">{res.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" />
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="heading-policy-faq">{t("pages.healthcarePolicyHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t("pages.healthcarePolicyHub.prepareForYourNursingCareer")}</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Combine policy awareness with comprehensive exam preparation. NurseNest offers practice questions, clinical simulations, and study resources aligned with the latest exam formats and licensing requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <LocaleLink href="/free-practice" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors" data-testid="button-policy-start-free">
              Start Free Practice
            </LocaleLink>
            <LocaleLink href="/pricing" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-policy-view-plans">
              View Plans
            </LocaleLink>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
