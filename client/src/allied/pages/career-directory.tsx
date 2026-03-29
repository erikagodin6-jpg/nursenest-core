import { Link } from "wouter";
import { CAREER_CONFIGS, getCanonicalRoute } from "@shared/careers";
import { CAREER_GUIDES } from "@shared/career-guide-data";
import { Wind, Ambulance, Pill, Microscope, Radio, ArrowRight, BookOpen, FileText, Brain, Wrench, ShieldCheck, Users, Hand, Activity, GraduationCap, Stethoscope } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { getCrossPlatformLinksForCareer } from "@/data/internal-links";
import { buildJobPostingStructuredData, buildEducationalOrganizationStructuredData } from "@/lib/structured-data";

import { useI18n } from "@/lib/i18n";
const CAREER_TO_GUIDE_SLUG: Record<string, string> = Object.values(CAREER_GUIDES).reduce((acc, guide) => {
  acc[guide.careerSlug] = guide.slug;
  return acc;
}, {} as Record<string, string>);

const ALLIED_CAREERS = [
  { ...CAREER_CONFIGS.rrt, Icon: Wind },
  { ...CAREER_CONFIGS.paramedic, Icon: Ambulance },
  { ...CAREER_CONFIGS.pharmacyTech, Icon: Pill },
  { ...CAREER_CONFIGS.mlt, Icon: Microscope },
  { ...CAREER_CONFIGS.imaging, Icon: Radio },
  { ...CAREER_CONFIGS.psychotherapist, Icon: Brain },
  { ...CAREER_CONFIGS.socialWorker, Icon: Users },
  { ...CAREER_CONFIGS.addictionsCounsellor, Icon: ShieldCheck },
  { ...CAREER_CONFIGS.occupationalTherapy, Icon: Hand },
  { ...CAREER_CONFIGS.physicalTherapy, Icon: Activity },
];

export default function CareerDirectoryPage() {
  const { t } = useI18n();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="career-directory-page">
      <AlliedSEO
        title={t("allied.careerDirectory.alliedHealthCareerDirectoryChoose")}
        description={t("allied.careerDirectory.browseAllAlliedHealthCareer")}
        keywords="allied health careers, healthcare careers directory, RRT career, paramedic career, pharmacy technician career, MLT career, medical imaging career, certification prep"
        canonicalPath="/careers"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Allied Health Career Directory",
          "url": "https://www.nursenest.ca/allied-health/careers",
          "description": "Browse all allied health career paths. Access tailored question banks, mock exams, flashcards, AI tools, and study plans for RRT, Paramedic, Pharmacy Tech, MLT, and Medical Imaging certifications."
        }}
        additionalStructuredData={[
          buildEducationalOrganizationStructuredData(),
          ...ALLIED_CAREERS.filter(c => c.enabled).map(career =>
            buildJobPostingStructuredData({
              title: `${career.name} - Certification Exam Prep`,
              description: `Prepare for your ${career.name} certification with practice questions, adaptive mock exams, and study tools. ${career.description}`,
              salaryMin: 45000,
              salaryMax: 95000,
              salaryCurrency: "USD",
              educationRequirements: career.examNames[0],
              occupationalCategory: career.name,
              url: `https://www.nursenest.ca/allied-health${getCanonicalRoute(career.slug)}`,
            })
          ),
        ]}
      />
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-directory-title">{t("allied.careerDirectory.alliedHealthCareerDirectory")}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("allied.careerDirectory.chooseYourCertificationPathEach")}</p>
      </div>

      <div className="space-y-6">
        {ALLIED_CAREERS.filter(c => c.enabled).map(career => {
          const crossLinks = getCrossPlatformLinksForCareer(career.slug);
          return (
            <div key={career.slug} className="bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all p-6 sm:p-8" data-testid={`card-career-${career.slug}`}>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: career.colorAccent }}>
                    <career.Icon className="w-8 h-8" style={{ color: career.color }} />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{career.name}</h2>
                <p className="text-gray-600 mb-4">{career.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {career.examNames.map(exam => (
                    <span key={exam} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{exam}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-teal-500" /> {t("allied.careerDirectory.practiceQuestions")}</span>
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-teal-500" /> {t("allied.careerDirectory.mockExams")}</span>
                  <span className="flex items-center gap-1"><Brain className="w-4 h-4 text-teal-500" /> {t("allied.careerDirectory.flashcards")}</span>
                  <span className="flex items-center gap-1"><Wrench className="w-4 h-4 text-teal-500" /> {t("allied.careerDirectory.aiTools")}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {career.domains.slice(0, 5).map(domain => (
                    <span key={domain} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-xs">{domain}</span>
                  ))}
                  {career.domains.length > 5 && (
                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-xs">+{career.domains.length - 5} more</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={getCanonicalRoute(career.slug)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors" data-testid={`button-start-${career.slug}`}>
                    Start Studying <ArrowRight className="w-4 h-4" />
                  </Link>
                  {CAREER_TO_GUIDE_SLUG[career.slug] && (
                    <Link href={`/${CAREER_TO_GUIDE_SLUG[career.slug]}`} className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors" data-testid={`button-guide-${career.slug}`}>
                      <GraduationCap className="w-4 h-4" /> Career Guide
                    </Link>
                  )}
                </div>
                {crossLinks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">{t("allied.careerDirectory.relatedResources")}</p>
                    <div className="flex flex-wrap gap-2">
                      {crossLinks.slice(0, 4).map((link, i) => (
                        <Link
                          key={i}
                          href={link.target}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            link.platform === "nursenest"
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          }`}
                          data-testid={`link-career-cross-${career.slug}-${i}`}
                        >
                          {link.platform === "nursenest" ? (
                            <Stethoscope className="w-3 h-3" />
                          ) : (
                            <GraduationCap className="w-3 h-3" />
                          )}
                          {link.anchor}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
