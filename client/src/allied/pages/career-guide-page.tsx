import { useRoute, Link } from "wouter";
import { CAREER_GUIDES, type CareerGuideData } from "@shared/career-guide-data";
import { AlliedSEO } from "@/allied/allied-seo";
import { AlliedBreadcrumb } from "@/components/allied-breadcrumb";
import { useI18n } from "@/lib/i18n";
import {
  GraduationCap, Briefcase, DollarSign, TrendingUp, MapPin, Clock,
  ChevronRight, BookOpen, FileText, ArrowRight, CheckCircle2, Building2,
  Shield, Users, Heart, Star, Lightbulb
} from "lucide-react";

function HeroSection({ guide }: { guide: CareerGuideData }) {
  const { t } = useI18n();
  return (
    <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white py-16 sm:py-20" data-testid="section-hero">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="[&_nav]:text-teal-200 [&_a]:text-teal-200 [&_a:hover]:text-white [&_span]:text-white [&_.text-gray-300]:text-teal-300 [&_.text-gray-400]:text-teal-300 mb-6">
          <AlliedBreadcrumb items={[{ label: guide.profession }]} />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-guide-title">
          {guide.articleTitle}
        </h1>
        <p className="text-lg sm:text-xl text-teal-100 max-w-3xl leading-relaxed" data-testid="text-guide-description">
          {guide.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={guide.examPrepLink} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors" data-testid="button-start-prep">
            Start Exam Prep <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={guide.studyResourcesLink} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="button-study-resources">
            Study Resources <BookOpen className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TableOfContents() {
  const sections = [
    { id: "overview", label: "Career Overview" },
    { id: "education", label: "Education Pathway" },
    { id: "licensing", label: "Licensing & Certification" },
    { id: "salary", label: "Salary Information" },
    { id: "job-outlook", label: "Job Outlook" },
    { id: "work-environments", label: "Work Environments" },
    { id: "day-in-the-life", label: "Day in the Life" },
    { id: "key-skills", label: "Key Skills" },
    { id: "get-started", label: "Get Started" },
  ];

  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-10" data-testid="nav-toc">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t("allied.careerGuidePage.inThisGuide")}</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sections.map(s => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors py-1" data-testid={`link-toc-${s.id}`}>
              <ChevronRight className="w-3.5 h-3.5 text-teal-500" />
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function OverviewSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="overview" className="mb-12" data-testid="section-overview">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <Heart className="w-5 h-5 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.careerOverview")}</h2>
      </div>
      <p className="text-gray-700 leading-relaxed text-base">{guide.overview}</p>
    </section>
  );
}

function EducationSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="education" className="mb-12" data-testid="section-education">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{guide.educationPathway.title}</h2>
      </div>
      <div className="space-y-0">
        {guide.educationPathway.steps.map((step, i) => (
          <div key={i} className="relative pl-10 pb-8 last:pb-0" data-testid={`step-education-${i}`}>
            {i < guide.educationPathway.steps.length - 1 && (
              <div className="absolute left-[18px] top-8 bottom-0 w-0.5 bg-blue-200" />
            )}
            <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {i + 1}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-bold text-gray-900">{step.step}</h3>
                {step.duration && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                    <Clock className="w-3 h-3" /> {step.duration}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LicensingSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="licensing" className="mb-12" data-testid="section-licensing">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{guide.licensingRequirements.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guide.licensingRequirements.canada && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="card-licensing-canada">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇨🇦</span>
              <h3 className="font-bold text-gray-900 text-lg">{t("allied.careerGuidePage.canada")}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3"><span className="font-medium text-gray-800">{t("allied.careerGuidePage.regulatoryBody")}</span> {guide.licensingRequirements.canada.body}</p>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1.5">{t("allied.careerGuidePage.requiredExams")}</p>
              <ul className="space-y-1">
                {guide.licensingRequirements.canada.exams.map((exam, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {exam}
                  </li>
                ))}
              </ul>
            </div>
            {guide.licensingRequirements.canada.notes && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">{guide.licensingRequirements.canada.notes}</p>
            )}
          </div>
        )}
        {guide.licensingRequirements.usa && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm" data-testid="card-licensing-usa">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇺🇸</span>
              <h3 className="font-bold text-gray-900 text-lg">{t("allied.careerGuidePage.unitedStates")}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3"><span className="font-medium text-gray-800">{t("allied.careerGuidePage.regulatoryBody2")}</span> {guide.licensingRequirements.usa.body}</p>
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1.5">{t("allied.careerGuidePage.requiredExams2")}</p>
              <ul className="space-y-1">
                {guide.licensingRequirements.usa.exams.map((exam, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {exam}
                  </li>
                ))}
              </ul>
            </div>
            {guide.licensingRequirements.usa.notes && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">{guide.licensingRequirements.usa.notes}</p>
            )}
          </div>
        )}
      </div>
      {guide.licensingRequirements.generalNotes && (
        <p className="mt-4 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl p-4">{guide.licensingRequirements.generalNotes}</p>
      )}
    </section>
  );
}

function SalarySection({ guide }: { guide: CareerGuideData }) {
  const levels = [
    { label: "Entry Level", value: guide.salary.entryLevel, color: "bg-emerald-100 text-emerald-700" },
    { label: "Median", value: guide.salary.median, color: "bg-teal-100 text-teal-700" },
    { label: "Experienced", value: guide.salary.experienced, color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <section id="salary" className="mb-12" data-testid="section-salary">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.salaryInformation")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {levels.map((level, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm text-center" data-testid={`card-salary-${i}`}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${level.color}`}>
              {level.label}
            </span>
            <p className="text-sm font-semibold text-gray-900">{level.value}</p>
          </div>
        ))}
      </div>
      {guide.salary.notes && (
        <p className="text-sm text-gray-600 bg-green-50 border border-green-100 rounded-xl p-4">{guide.salary.notes}</p>
      )}
    </section>
  );
}

function JobOutlookSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="job-outlook" className="mb-12" data-testid="section-job-outlook">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.jobOutlook")}</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{guide.jobOutlook.growthRate}</p>
            <p className="text-xs text-gray-500 mt-1">{t("allied.careerGuidePage.projectedGrowth")}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">{guide.jobOutlook.growthPeriod}</p>
            <p className="text-xs text-gray-500 mt-1">{t("allied.careerGuidePage.growthPeriod")}</p>
          </div>
        </div>
        <h3 className="font-bold text-gray-800 mb-3">{t("allied.careerGuidePage.demandDrivers")}</h3>
        <ul className="space-y-2">
          {guide.jobOutlook.demandDrivers.map((driver, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              {driver}
            </li>
          ))}
        </ul>
      </div>
      {guide.jobOutlook.topEmploymentAreas && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">{t("allied.careerGuidePage.topEmploymentAreas")}</h3>
          <div className="flex flex-wrap gap-2">
            {guide.jobOutlook.topEmploymentAreas.map((area, i) => (
              <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{area}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function WorkEnvironmentsSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="work-environments" className="mb-12" data-testid="section-work-environments">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.workEnvironments")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guide.workEnvironments.map((env, i) => (
          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 shadow-sm" data-testid={`card-environment-${i}`}>
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{env}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DayInTheLifeSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="day-in-the-life" className="mb-12" data-testid="section-day-in-the-life">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.aDayInTheLife")}</h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <ul className="space-y-3">
          {guide.dayInTheLife.map((task, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700" data-testid={`item-daily-task-${i}`}>
              <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
              {task}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function KeySkillsSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="key-skills" className="mb-12" data-testid="section-key-skills">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Star className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.keySkills")}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {guide.keySkills.map((skill, i) => (
          <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-medium shadow-sm" data-testid={`tag-skill-${i}`}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function GetStartedSection({ guide }: { guide: CareerGuideData }) {
  return (
    <section id="get-started" className="mb-12" data-testid="section-get-started">
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-8 sm:p-10 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Ready to Start Your {guide.profession} Career?</h2>
        </div>
        <p className="text-teal-100 mb-6 max-w-2xl">
          Prepare for your {guide.profession.toLowerCase()} certification exam with NurseNest Allied. Access practice questions, mock exams, flashcards, and personalized study tools designed specifically for your profession.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href={guide.examPrepLink} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors" data-testid="button-cta-prep">
            <BookOpen className="w-4 h-4" /> Start Exam Prep
          </Link>
          <Link href={guide.studyResourcesLink} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="button-cta-questions">
            <FileText className="w-4 h-4" /> Practice Questions
          </Link>
        </div>
      </div>
    </section>
  );
}

function RelatedGuidesSection({ currentSlug }: { currentSlug: string }) {
  const otherGuides = Object.values(CAREER_GUIDES)
    .filter(g => g.slug !== currentSlug)
    .slice(0, 4);

  return (
    <section className="mb-12" data-testid="section-related-guides">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("allied.careerGuidePage.exploreOtherHealthcareCareers")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {otherGuides.map(guide => (
          <Link key={guide.slug} href={`/${guide.slug}`} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group" data-testid={`link-related-${guide.slug}`}>
            <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors mb-1">{guide.profession}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{guide.heroDescription}</p>
            <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium mt-3">
              Read Guide <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function CareerGuidePage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";

  const guide = Object.values(CAREER_GUIDES).find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center" data-testid="career-guide-not-found">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerGuidePage.careerGuideNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("allied.careerGuidePage.theCareerGuideYoureLooking")}</p>
        <Link href="/careers" className="text-teal-600 font-medium hover:underline" data-testid="link-back-careers">{t("allied.careerGuidePage.browseAllCareers")}</Link>
      </div>
    );
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": guide.profession, "item": `https://www.nursenest.ca/allied-health/${guide.slug}` },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.articleTitle,
    "description": guide.heroDescription,
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca/allied-health" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca/allied-health/${guide.slug}` },
  };

  const occupationData = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    "name": guide.profession,
    "description": guide.overview,
    "occupationLocation": [
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "United States" },
    ],
    "estimatedSalary": [
      { "@type": "MonetaryAmountDistribution", "name": "base", "currency": "USD", "median": guide.salary.median.split("/")[0]?.trim() },
    ],
    "educationRequirements": guide.educationPathway.steps.map(s => s.step).join(", "),
    "skills": guide.keySkills.join(", "),
    "qualifications": guide.licensingRequirements.usa?.exams.join(", ") || guide.licensingRequirements.canada?.exams.join(", "),
  };

  const jobPostingData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": guide.profession,
    "description": `Career opportunity as a ${guide.profession}. ${guide.overview}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca/allied-health",
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": parseInt(guide.salary.entryLevel.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
        "maxValue": parseInt(guide.salary.experienced.split(/[-–]/)[0]?.replace(/[^0-9]/g, "") || "0", 10),
        "unitText": "YEAR",
      },
    },
    "employmentType": "FULL_TIME",
    "educationRequirements": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": guide.licensingRequirements.usa?.exams[0] || guide.licensingRequirements.canada?.exams[0] || guide.profession,
    },
    "url": `https://www.nursenest.ca/allied-health/${guide.slug}`,
    "datePosted": "2025-01-15",
    "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };

  return (
    <div data-testid={`career-guide-${guide.slug}`}>
      <AlliedSEO
        title={guide.articleTitle}
        description={guide.heroDescription}
        keywords={`how to become a ${guide.profession.toLowerCase()}, ${guide.profession.toLowerCase()} career, ${guide.profession.toLowerCase()} salary, ${guide.profession.toLowerCase()} education, ${guide.profession.toLowerCase()} certification, ${guide.profession.toLowerCase()} job outlook`}
        canonicalPath={`/${guide.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[breadcrumbStructuredData, occupationData, jobPostingData]}
      />

      <HeroSection guide={guide} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TableOfContents />
        <OverviewSection guide={guide} />
        <EducationSection guide={guide} />
        <LicensingSection guide={guide} />
        <SalarySection guide={guide} />
        <JobOutlookSection guide={guide} />
        <WorkEnvironmentsSection guide={guide} />
        <DayInTheLifeSection guide={guide} />
        <KeySkillsSection guide={guide} />
        <GetStartedSection guide={guide} />
        <RelatedGuidesSection currentSlug={guide.slug} />
      </div>
    </div>
  );
}
