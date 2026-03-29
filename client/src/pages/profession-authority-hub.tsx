import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AlliedNavigation } from "@/allied/allied-navigation";
import { AlliedFooter } from "@/allied/allied-footer";
import { useState } from "react";
import {
  ArrowRight, BookOpen, FileText, Brain, GraduationCap, Target,
  CheckCircle2, ChevronDown, DollarSign, MapPin, Briefcase,
  Award, Clock, Shield, TrendingUp, Users, Building2, Stethoscope
} from "lucide-react";
import { PROFESSION_AUTHORITY_DATA, type ProfessionAuthorityData } from "@shared/profession-authority-data";
import { getAuthorityContentPagesByProfession } from "@shared/authority-content-data";
import { SocialProofBar } from "@/components/conversion-funnel";

import { useI18n } from "@/lib/i18n";
interface ProfessionAuthorityHubProps {
  data: ProfessionAuthorityData;
}

function SalaryCard({ title, salary, flag }: { title: string; salary: { entry: string; mid: string; senior: string; source: string }; flag: string }) {
  const { t } = useI18n();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`salary-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{flag}</span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t("pages.professionAuthorityHub.entrylevel")}</span>
          <span className="text-sm font-semibold text-gray-900">{salary.entry}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t("pages.professionAuthorityHub.midcareer")}</span>
          <span className="text-sm font-semibold text-gray-900">{salary.mid}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{t("pages.professionAuthorityHub.seniorSpecialized")}</span>
          <span className="text-sm font-semibold text-green-700 font-bold">{salary.senior}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-4 italic">{salary.source}</p>
    </div>
  );
}

function CareerPathwayTimeline({ steps, color }: { steps: { title: string; description: string; yearsExperience: string }[]; color: string }) {
  return (
    <div className="relative" data-testid="career-pathway-timeline">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-12" data-testid={`career-step-${i}`}>
            <div
              className="absolute left-2 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: color, backgroundColor: i === steps.length - 1 ? color : 'white' }}
            >
              {i === steps.length - 1 && (
                <CheckCircle2 className="w-3 h-3 text-white" />
              )}
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                <span className="text-xs text-gray-400 whitespace-nowrap">{step.yearsExperience} yrs</span>
              </div>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationCard({ edu, index, color }: { edu: { level: string; duration: string; description: string }; index: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow" data-testid={`education-card-${index}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: color }}>
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{edu.level}</h4>
          <span className="text-xs text-gray-400">{edu.duration}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500">{edu.description}</p>
    </div>
  );
}

function LicensingSection({ licensing, color }: { licensing: { body: string; country: string; requirements: string[] }[]; color: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="licensing-section">
      {licensing.map((lic, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`licensing-card-${lic.country.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color }} />
            <div>
              <h4 className="font-semibold text-gray-900">{lic.body}</h4>
              <span className="text-xs text-gray-400">{lic.country}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {lic.requirements.map((req, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                {req}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ExamInfoTable({ exams, color }: { exams: { name: string; format: string; passingScore: string; duration: string }[]; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid="exam-info-table">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.professionAuthorityHub.exam")}</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.professionAuthorityHub.format")}</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.professionAuthorityHub.passingScore")}</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-500">{t("pages.professionAuthorityHub.duration")}</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, i) => (
              <tr key={i} className={i < exams.length - 1 ? "border-b border-gray-50" : ""} data-testid={`exam-row-${i}`}>
                <td className="px-5 py-3 text-sm font-medium" style={{ color }}>{exam.name}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{exam.format}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{exam.passingScore}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{exam.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProfessionAuthorityHub({ data }: ProfessionAuthorityHubProps) {
  const [showAllSteps, setShowAllSteps] = useState(false);
  const visibleSteps = showAllSteps ? data.careerPathway : data.careerPathway.slice(0, 4);
  const isNursing = data.slug === "nursing";
  const Nav = isNursing ? Navigation : AlliedNavigation;
  const Foot = isNursing ? Footer : AlliedFooter;

  return (
    <div data-testid={`authority-hub-${data.slug}`}>
      <Nav />
      <SEO
        title={data.seoTitle}
        description={data.seoDescription}
        keywords={data.seoKeywords}
        canonicalPath={data.canonicalPath}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data.heroTitle,
          "description": data.seoDescription,
          "url": `https://www.nursenest.ca${data.canonicalPath}`,
          "publisher": {
            "@type": "Organization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca",
          },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca",
            "description": "Comprehensive nursing and allied health exam preparation platform.",
          },
          {
            "@context": "https://schema.org",
            "@type": "Occupation",
            "name": data.heroTitle,
            "description": data.seoDescription,
            "occupationLocation": [
              { "@type": "Country", "name": "Canada" },
              { "@type": "Country", "name": "United States" },
            ],
            "estimatedSalary": [
              {
                "@type": "MonetaryAmountDistribution",
                "name": "Canada",
                "currency": "CAD",
                "percentile25": parseInt(data.salaryCanada.entry.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
                "median": parseInt(data.salaryCanada.mid.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
                "percentile75": parseInt(data.salaryCanada.senior.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
              },
              {
                "@type": "MonetaryAmountDistribution",
                "name": "United States",
                "currency": "USD",
                "percentile25": parseInt(data.salaryUSA.entry.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
                "median": parseInt(data.salaryUSA.mid.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
                "percentile75": parseInt(data.salaryUSA.senior.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
              },
            ],
          },
        ]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: data.heroTitle, url: `https://www.nursenest.ca${data.canonicalPath}` },
        ]}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${data.colorGradientFrom} ${data.colorGradientTo} to-white`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: data.colorAccent, color: data.color }}
              data-testid="badge-profession"
            >
              <Briefcase className="w-4 h-4" />
              Career & Exam Guide
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hero-title">
              {data.heroTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-hero-subtitle">
              {data.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={data.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: data.color }}
                data-testid="button-cta-primary"
              >
                {data.ctaPrimary.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={data.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border"
                style={{ color: data.color, borderColor: data.color + "40" }}
                data-testid="button-cta-secondary"
              >
                {data.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-overview">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" data-testid="text-overview-h2">{t("pages.professionAuthorityHub.professionOverview")}</h2>
          <p className="text-gray-600 leading-relaxed text-base" data-testid="text-overview">{data.overview}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: data.colorAccent }}>
              <Building2 className="w-5 h-5 mx-auto mb-2" style={{ color: data.color }} />
              <p className="text-sm font-semibold text-gray-900">{data.workSettings.length}+</p>
              <p className="text-xs text-gray-500">{t("pages.professionAuthorityHub.workSettings")}</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: data.colorAccent }}>
              <Award className="w-5 h-5 mx-auto mb-2" style={{ color: data.color }} />
              <p className="text-sm font-semibold text-gray-900">{data.examInfo.length}</p>
              <p className="text-xs text-gray-500">{t("pages.professionAuthorityHub.certificationExams")}</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: data.colorAccent }}>
              <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: data.color }} />
              <p className="text-sm font-semibold text-gray-900">{data.careerPathway.length}</p>
              <p className="text-xs text-gray-500">{t("pages.professionAuthorityHub.careerStages")}</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: data.colorAccent }}>
              <Target className="w-5 h-5 mx-auto mb-2" style={{ color: data.color }} />
              <p className="text-sm font-semibold text-gray-900">{data.keySkills.length}</p>
              <p className="text-xs text-gray-500">{t("pages.professionAuthorityHub.keySkills")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-education">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-education-h2">
              <GraduationCap className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Education Requirements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.theEducationalPathwayAndCredentials")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.education.map((edu, i) => (
              <EducationCard key={i} edu={edu} index={i} color={data.color} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-career-pathway">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-career-h2">
              <Briefcase className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Career Pathway
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.fromStudentToSeniorLeader")}</p>
          </div>
          <CareerPathwayTimeline steps={visibleSteps} color={data.color} />
          {data.careerPathway.length > 4 && !showAllSteps && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAllSteps(true)}
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                style={{ color: data.color }}
                data-testid="button-show-all-steps"
              >
                Show all {data.careerPathway.length} career stages <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-salary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-salary-h2">
              <DollarSign className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Salary Information
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.expectedSalaryRangesByExperience")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SalaryCard title={t("pages.professionAuthorityHub.canada")} salary={data.salaryCanada} flag="🇨🇦" />
            <SalaryCard title={t("pages.professionAuthorityHub.unitedStates")} salary={data.salaryUSA} flag="🇺🇸" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-licensing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-licensing-h2">
              <Shield className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Licensing & Certification
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.requirementsToBecomeLicensedAnd")}</p>
          </div>
          <LicensingSection licensing={data.licensing} color={data.color} />
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-exam-info">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-exam-h2">
              <FileText className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Certification Exams
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.keyDetailsAboutTheCertification")}</p>
          </div>
          <ExamInfoTable exams={data.examInfo} color={data.color} />
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-skills-settings">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-skills-h2">
                <Target className="w-5 h-5" style={{ color: data.color }} />
                Key Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.keySkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-medium rounded-full"
                    style={{ backgroundColor: data.colorAccent, color: data.color }}
                    data-testid={`skill-badge-${i}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="text-settings-h2">
                <MapPin className="w-5 h-5" style={{ color: data.color }} />
                Work Settings
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {data.workSettings.map((setting, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600" data-testid={`work-setting-${i}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: data.color }} />
                    {setting}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: `linear-gradient(135deg, ${data.colorAccent} 0%, white 100%)` }} data-testid="section-study-resources">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-resources-h2">
              <BookOpen className="w-7 h-7 inline-block mr-2 -mt-1" style={{ color: data.color }} />
              Study Resources & Exam Prep
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.prepareForYourCertificationExam")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link href={data.ctaPrimary.href} className="group" data-testid="resource-card-practice">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all h-full">
                <FileText className="w-7 h-7 mb-3" style={{ color: data.color }} />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:transition-colors">{t("pages.professionAuthorityHub.practiceExams")}</h3>
                <p className="text-sm text-gray-500">{t("pages.professionAuthorityHub.blueprintweightedMockExamsThatSimulate")}</p>
                <span className="text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: data.color }}>
                  Start Practicing <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href={data.ctaSecondary.href} className="group" data-testid="resource-card-questions">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all h-full">
                <Brain className="w-7 h-7 mb-3" style={{ color: data.color }} />
                <h3 className="font-semibold text-gray-900 mb-1">{t("pages.professionAuthorityHub.testBank")}</h3>
                <p className="text-sm text-gray-500">{t("pages.professionAuthorityHub.practiceQuestionsWithDetailedRationales")}</p>
                <span className="text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: data.color }}>
                  Browse Questions <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href={data.flashcardsHref} className="group" data-testid="resource-card-flashcards">
              <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all h-full">
                <BookOpen className="w-7 h-7 mb-3" style={{ color: data.color }} />
                <h3 className="font-semibold text-gray-900 mb-1">{t("pages.professionAuthorityHub.flashcards")}</h3>
                <p className="text-sm text-gray-500">{t("pages.professionAuthorityHub.spacedrepetitionFlashcardsToMasterKey")}</p>
                <span className="text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: data.color }}>
                  Study Flashcards <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            {getAuthorityContentPagesByProfession(data.slug).map((acp) => (
              <Link key={acp.slug} href={acp.canonicalPath} className="group" data-testid={`resource-card-authority-${acp.slug}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all h-full">
                  <Target className="w-7 h-7 mb-3" style={{ color: data.color }} />
                  <h3 className="font-semibold text-gray-900 mb-1">{acp.heroTitle}</h3>
                  <p className="text-sm text-gray-500">{t("pages.professionAuthorityHub.comprehensiveGuideWithPracticeQuestions")}</p>
                  <span className="text-sm font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: data.color }}>
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-related-professions">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-related-h2">
              <Users className="w-7 h-7 inline-block mr-2 -mt-1 text-gray-400" />
              Explore Other Healthcare Professions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.professionAuthorityHub.discoverCareerPathwaysSalaryInfo")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(PROFESSION_AUTHORITY_DATA)
              .filter((p) => p.slug !== data.slug)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={p.canonicalPath}
                  className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 transition-all hover:shadow-md"
                  data-testid={`crosslink-${p.slug}`}
                >
                  <span className="text-xl mb-2 block">{p.icon}</span>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 mb-1 line-clamp-1">{p.heroTitle.replace(/^Your Complete | Guide$/g, '').split(' Career')[0]}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.salaryCanada.entry} – {p.salaryCanada.senior}</p>
                  <span className="text-xs font-medium mt-2 flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color: p.color }}>
                    Learn More <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="rounded-2xl p-8 sm:p-12 text-white" style={{ backgroundColor: data.color }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-final-cta-h2">
              Ready to Start Your Exam Prep?
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Join thousands of students using NurseNest to prepare for their certification exams. Start with a free diagnostic to see where you stand.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={data.ctaPrimary.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: data.color }}
                data-testid="button-final-cta-primary"
              >
                {data.ctaPrimary.label} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={data.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-white transition-colors"
                data-testid="button-final-cta-secondary"
              >
                {data.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="allied-social-proof">
        <SocialProofBar />
      </div>

      <Foot />
    </div>
  );
}
