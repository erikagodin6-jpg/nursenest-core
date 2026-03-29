import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { TestimonialSection } from "@/components/new-grad/testimonial-section";
import { LeadCaptureInline } from "@/components/new-grad/lead-capture";
import { InternalLinks } from "@/components/new-grad/internal-links";
import { SocialShareCards } from "@/components/new-grad/social-share-cards";
import { NEW_GRAD_PROFESSIONS, UNIT_GUIDES, CLINICAL_SKILLS_CATEGORIES, CAREER_DEVELOPMENT_PATHS, getProfessionBySlug } from "@shared/new-grad-professions";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, ChevronRight, GraduationCap, Target, Shield,
  AlertTriangle, Clock, Heart, Users, Brain, CheckCircle2, Star,
  TrendingUp, Stethoscope, Ambulance, Wind, Microscope, ScanLine,
  MessageSquare, FileText, HeartPulse, Siren, Baby, Ribbon
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Stethoscope, Ambulance, Wind, Microscope, ScanLine, Heart, Users, Brain, Shield,
  TrendingUp, GraduationCap, AlertTriangle, Clock, MessageSquare, FileText,
  HeartPulse, Siren, Baby, Ribbon, Target, Star,
};

export default function NewGradProfessionHub() {
  const { t } = useI18n();
  const params = useParams<{ profession: string }>();
  const profession = getProfessionBySlug(params.profession || "");

  const { data: guides = [] } = useQuery({
    queryKey: ["/api/new-grad/guides", params.profession],
    queryFn: async () => {
      const res = await fetch(`/api/new-grad/guides?profession=${params.profession}`);
      return res.ok ? res.json() : [];
    },
    enabled: !!params.profession,
  });

  if (!profession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-profession-not-found">{t("pages.newGrad.professionHubPage.professionNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("pages.newGrad.professionHubPage.thisProfessionHubIsntAvailable")}</p>
            <Link href="/new-grad" className="text-blue-600 hover:underline" data-testid="link-back-new-grad">{t("pages.newGrad.professionHubPage.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = ICON_MAP[profession.icon] || GraduationCap;
  const unitGuides = Object.entries(UNIT_GUIDES).filter(([_, u]) => u.professions.includes(profession.id));
  const skillCategories = Object.entries(CLINICAL_SKILLS_CATEGORIES).filter(([key]) => (profession.clinicalSkillCategories || []).includes(key));
  const careerPaths = Object.entries(CAREER_DEVELOPMENT_PATHS).filter(([key]) => (profession.careerPaths || []).includes(key));
  const relatedProfessions = (profession.relatedProfessions || []).map(s => NEW_GRAD_PROFESSIONS[s]).filter(Boolean);

  const faqData = [
    { question: `What should I expect in my first year in ${profession.shortName}?`, answer: (profession.firstYearExpectations || []).join(" ") },
    { question: `What are common challenges for new ${profession.shortName} graduates?`, answer: (profession.commonChallenges || []).join(" ") },
    { question: `How can NurseNest help me prepare for my ${profession.shortName} career?`, answer: `NurseNest provides exam prep, clinical guides, and career resources specifically designed for ${profession.name} graduates. Access practice exams, study plans, and career transition tools.` },
    { question: `What exams do I need to pass as a new ${profession.shortName} graduate?`, answer: `Key exams include: ${(profession.examNames || []).join(", ")}. Our exam prep resources cover all major certification exams for ${profession.name}.` },
  ];

  const faqStructuredData = buildFaqStructuredData(faqData);
  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `New Grad ${profession.name} Career Hub`,
    description: profession.description,
    provider: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    educationalLevel: `New Graduate ${profession.shortName}`,
    inLanguage: "en",
    url: `https://www.nursenest.ca/new-grad/${profession.slug}`,
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid={`new-grad-profession-${profession.slug}`}>
      <Navigation />
      <SEO
        title={`New Grad ${profession.name} Hub - Career Guide & Exam Prep | NurseNest`}
        description={profession.description}
        keywords={`new grad ${profession.shortName}, ${profession.name} career, ${(profession.examNames || []).join(", ")}, first year ${profession.shortName}`}
        canonicalPath={`/new-grad/${profession.slug}`}
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: profession.name, url: `https://www.nursenest.ca/new-grad/${profession.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-profession-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${profession.colorAccent} 0%, white 100%)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.professionHubPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.professionHubPage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span style={{ color: profession.color }} className="font-medium">{profession.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: profession.color + "20", color: profession.color }}>
              <Icon className="w-4 h-4" />
              New Grad {profession.shortName}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-profession-title">
              Your First Year in <span style={{ color: profession.color }}>{profession.shortName}</span>, Mastered
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-profession-description">
              {profession.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={profession.nurseNestExamPrepLink} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-colors shadow-lg" style={{ backgroundColor: profession.color }} data-testid="button-exam-prep">
                Start Exam Prep <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/new-grad/${profession.slug}-first-year-guide`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold transition-colors border" style={{ color: profession.color, borderColor: profession.color + "40" }} data-testid="button-first-year-guide">
                First Year Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-profession-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><div className="text-2xl font-bold" style={{ color: profession.color }}>{(profession.examNames || []).length}</div><div className="text-sm text-gray-500">{t("pages.newGrad.professionHubPage.certificationExams")}</div></div>
            <div><div className="text-2xl font-bold" style={{ color: profession.color }}>{(profession.clinicalTips || []).length}</div><div className="text-sm text-gray-500">{t("pages.newGrad.professionHubPage.clinicalTips")}</div></div>
            <div><div className="text-2xl font-bold" style={{ color: profession.color }}>{careerPaths.length}</div><div className="text-sm text-gray-500">{t("pages.newGrad.professionHubPage.careerPaths")}</div></div>
            <div><div className="text-2xl font-bold" style={{ color: profession.color }}>{guides.length || "5+"}</div><div className="text-sm text-gray-500">{t("pages.newGrad.professionHubPage.resources")}</div></div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-career-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t("pages.newGrad.professionHubPage.careerOverview")}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">{profession.careerOverview}</p>
          <div className="flex flex-wrap gap-2">
            {(profession.examNames || []).map((exam) => (
              <span key={exam} className="px-3 py-1.5 text-sm font-medium rounded-full" style={{ backgroundColor: profession.colorAccent, color: profession.color }} data-testid={`badge-exam-${exam}`}>
                {exam}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-first-year-expectations">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.firstYearExpectations")}</h2>
          <div className="space-y-3">
            {(profession.firstYearExpectations || []).map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100" data-testid={`expectation-${i}`}>
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: profession.color }} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-common-challenges">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.commonChallenges")}</h2>
          <p className="text-gray-600 mb-6">{t("pages.newGrad.professionHubPage.everyNewGradFacesThese")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(profession.commonChallenges || []).map((challenge, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all" data-testid={`challenge-${i}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{challenge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-clinical-tips">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.clinicalTipsForNewGrads")}</h2>
          <div className="space-y-3">
            {(profession.clinicalTips || []).map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100" data-testid={`tip-${i}`}>
                <Star className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: profession.color }} />
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {skillCategories.length > 0 && (
        <section className="py-16" data-testid="section-clinical-skills">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.clinicalSkillsGuides")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skillCategories.map(([key, skill]) => {
                const SkillIcon = ICON_MAP[skill.icon] || BookOpen;
                return (
                  <Link key={key} href={`/new-grad/clinical-skills/${key}`} className="group" data-testid={`link-skill-${key}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                      <SkillIcon className="w-7 h-7 mb-3" style={{ color: profession.color }} />
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700">{skill.name}</h3>
                      <p className="text-sm text-gray-500">{skill.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {unitGuides.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-unit-guides">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.unitspecificGuides")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unitGuides.map(([key, unit]) => {
                const UnitIcon = ICON_MAP[unit.icon] || BookOpen;
                return (
                  <Link key={key} href={`/new-grad/unit-guide/${key}`} className="group" data-testid={`link-unit-${key}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all h-full">
                      <UnitIcon className="w-7 h-7 mb-3" style={{ color: profession.color }} />
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700">{unit.name}</h3>
                      <p className="text-sm text-gray-500">{unit.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {careerPaths.length > 0 && (
        <section className="py-16" data-testid="section-career-paths">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.careerDevelopment")}</h2>
            <div className="space-y-4">
              {careerPaths.map(([key, path]) => {
                const PathIcon = ICON_MAP[path.icon] || TrendingUp;
                return (
                  <Link key={key} href={`/new-grad/career/${key}`} className="group block" data-testid={`link-career-${key}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all flex items-start gap-4">
                      <PathIcon className="w-8 h-8 flex-shrink-0" style={{ color: profession.color }} />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700">{path.name}</h3>
                        <p className="text-sm text-gray-500">{path.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 flex-shrink-0 ml-auto mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-50" data-testid="section-exam-prep-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready for Your {profession.shortName} Exam?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            NurseNest offers comprehensive exam preparation for {(profession.examNames || []).join(", ")} with practice questions, study plans, and mock exams.
          </p>
          <Link href={profession.nurseNestExamPrepLink} className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl font-semibold transition-colors shadow-lg" style={{ backgroundColor: profession.color }} data-testid="button-start-exam-prep">
            Start Exam Prep <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <LeadCaptureInline profession={profession.slug} professionName={profession.name} color={profession.color} />
      <TestimonialSection profession={profession.slug} />

      {relatedProfessions.length > 0 && (
        <section className="py-16" data-testid="section-related-professions">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.newGrad.professionHubPage.exploreRelatedProfessions")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProfessions.map((rp) => {
                const RPIcon = ICON_MAP[rp.icon] || GraduationCap;
                return (
                  <Link key={rp.slug} href={`/new-grad/${rp.slug}`} className="group" data-testid={`link-related-${rp.slug}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all text-center">
                      <RPIcon className="w-8 h-8 mx-auto mb-2" style={{ color: rp.color }} />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">{rp.shortName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{rp.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white" data-testid="section-profession-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">{t("pages.newGrad.professionHubPage.frequentlyAskedQuestions")}</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-xl p-4 group" data-testid={`faq-${i}`}>
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <InternalLinks
        currentPath={`/new-grad/${profession.slug}`}
        profession={profession.slug}
        professionName={profession.name}
      />
      <Footer />
    </div>
  );
}
