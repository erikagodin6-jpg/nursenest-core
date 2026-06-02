import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAlliedHealthProfession,
  type AlliedHealthProfession,
} from "@/allied/data/allied-health-professions";
import { getArticleTopicsForProfession } from "@/allied/data/allied-health-article-topics";
import { useI18n } from "@/lib/i18n";
import {
  Wind, Ambulance, Pill, Microscope, ScanLine, Monitor, HeartPulse,
  Hand, Activity, Scissors, ArrowRight, BookOpen, GraduationCap,
  TrendingUp, MapPin, Briefcase, Users, Award, ChevronRight,
  FileText, Brain, Layers, CheckCircle2, DollarSign, Clock
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Wind, Ambulance, Pill, Microscope, ScanLine, Monitor, HeartPulse,
  Hand, Activity, Scissors,
};

function setMetaTags(profession: AlliedHealthProfession) {
  const { t } = useI18n();
  document.title = profession.seo.title + " | NurseNest";
  const setMeta = (attr: string, name: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };
  const fullTitle = profession.seo.title + " | NurseNest";
  setMeta("name", "description", profession.seo.description);
  setMeta("name", "keywords", profession.seo.keywords);
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", profession.seo.description);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:url", `https://www.nursenest.ca/allied-health/${profession.slug}`);
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", profession.seo.description);
  setMeta("name", "twitter:card", "summary_large_image");

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `https://www.nursenest.ca/allied-health/${profession.slug}`;

  const existingLd = document.querySelectorAll('script[id^="allied-profession-ld"]');
  existingLd.forEach((el) => el.remove());

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": profession.name, "item": `https://www.nursenest.ca/allied-health/${profession.slug}` },
    ]
  };

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${profession.name} Certification Prep`,
    "description": profession.description,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca"
    },
    "url": `https://www.nursenest.ca/allied-health/${profession.slug}`,
  };

  [breadcrumbLd, courseLd].forEach((data, i) => {
    const script = document.createElement("script");
    script.id = `allied-profession-ld-${i}`;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
}

export default function AlliedHealthProfessionPage() {
  const params = useParams<{ profession: string }>();
  const profession = getAlliedHealthProfession(params.profession || "");
  const topics = getArticleTopicsForProfession(params.profession || "");

  const { data: articles } = useQuery({
    queryKey: ["/api/allied-health/articles/by-profession", params.profession],
    queryFn: async () => {
      const res = await fetch(`/api/allied-health/articles/by-profession/${params.profession}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!params.profession,
  });

  useEffect(() => {
    if (profession) setMetaTags(profession);
    return () => {
      document.querySelectorAll('script[id^="allied-profession-ld"]').forEach((el) => el.remove());
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
    };
  }, [profession]);

  if (!profession) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="profession-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.alliedHealthProfession.professionNotFound")}</h1>
          <p className="text-gray-500 mb-4">{t("pages.alliedHealthProfession.theProfessionYoureLookingFor")}</p>
          <Link href="/allied-health" className="text-teal-600 font-medium hover:text-teal-700" data-testid="link-back-hub">
            Back to Allied Health Hub
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[profession.icon] || BookOpen;
  const publishedArticles = articles || [];

  return (
    <div className="min-h-screen bg-white" data-testid={`profession-page-${profession.slug}`}>
      <nav className="bg-gray-50 border-b border-gray-100 py-3 px-4" data-testid="breadcrumb-nav">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-home">{t("pages.alliedHealthProfession.home")}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/allied-health" className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-allied">{t("pages.alliedHealthProfession.alliedHealth")}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-900 font-medium" data-testid="breadcrumb-current">{profession.name}</span>
        </div>
      </nav>

      <section className="relative overflow-hidden py-12 sm:py-20" data-testid="profession-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${profession.colorAccent}, white)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: profession.colorAccent, border: `2px solid ${profession.color}20` }}
              >
                <Icon className="w-8 h-8" style={{ color: profession.color }} />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-profession-title">
                {profession.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl" data-testid="text-profession-tagline">
                {profession.tagline}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {profession.examNames.map((exam) => (
                  <span key={exam} className="px-3 py-1 bg-white/80 border border-gray-200 rounded-full text-sm font-medium text-gray-700" data-testid={`badge-exam-${exam.replace(/\s+/g, "-").toLowerCase()}`}>
                    {exam}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={profession.studyResources.questionBanks.link} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors" data-testid="button-question-bank">
                  {profession.studyResources.questionBanks.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href={profession.studyResources.mockExams.link} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-mock-exams">
                  {profession.studyResources.mockExams.label}
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full lg:w-auto">
              {[
                { icon: DollarSign, label: "Salary Range", value: profession.salaryRange },
                { icon: TrendingUp, label: "Job Growth", value: profession.jobOutlook.split(" ")[0] },
              ].map((item) => (
                <div key={item.label} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-gray-100 min-w-[140px]" data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <item.icon className="w-5 h-5 text-teal-500 mb-1" />
                  <div className="text-base font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" data-testid="profession-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="heading-overview">{t("pages.alliedHealthProfession.overview")}</h2>
              <p className="text-gray-600 leading-relaxed mb-8" data-testid="text-overview">{profession.overview}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="heading-where-they-work">
                <MapPin className="w-5 h-5 inline mr-2 text-teal-500" />
                Where They Work
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {profession.whereTheyWork.map((place, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm" data-testid={`work-place-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    {place}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="heading-responsibilities">
                <Briefcase className="w-5 h-5 inline mr-2 text-teal-500" />
                Common Responsibilities
              </h2>
              <ul className="space-y-2 mb-8">
                {profession.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm" data-testid={`responsibility-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4" data-testid="heading-patients">
                <Users className="w-5 h-5 inline mr-2 text-teal-500" />
                Typical Patient Populations
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {profession.patientPopulations.map((pop, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm" data-testid={`patient-pop-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                    {pop}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100" data-testid="card-education">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <GraduationCap className="w-5 h-5 inline mr-2 text-teal-500" />
                  Education Pathways
                </h3>
                <ul className="space-y-2">
                  {profession.educationPathways.map((path, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600" data-testid={`education-${i}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                      {path}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100" data-testid="card-certification">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <Award className="w-5 h-5 inline mr-2 text-teal-500" />
                  Certification Overview
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed" data-testid="text-certification">
                  {profession.certificationOverview}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100" data-testid="card-career-info">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("pages.alliedHealthProfession.careerInformation")}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.alliedHealthProfession.salaryRange")}</span>
                    <p className="text-sm font-medium text-gray-900" data-testid="text-salary">{profession.salaryRange}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{t("pages.alliedHealthProfession.jobOutlook")}</span>
                    <p className="text-sm font-medium text-gray-900" data-testid="text-job-outlook">{profession.jobOutlook}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-teal-50/50 to-white" data-testid="profession-study-resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" data-testid="heading-study-resources">{t("pages.alliedHealthProfession.studyResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { ...profession.studyResources.questionBanks, icon: BookOpen, color: "blue" },
              { ...profession.studyResources.flashcards, icon: Layers, color: "purple" },
              { ...profession.studyResources.mockExams, icon: FileText, color: "green" },
              { ...profession.studyResources.clinicalCases, icon: Brain, color: "orange" },
            ].map((resource) => (
              <Link
                key={resource.label}
                href={resource.link}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
                data-testid={`resource-${resource.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <resource.icon className="w-8 h-8 text-teal-500 mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">{resource.label}</h3>
                <span className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium">
                  Start Studying <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {publishedArticles.length > 0 && (
        <section className="py-12" data-testid="profession-articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-articles">
              Articles & Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedArticles.map((article: any) => (
                <Link
                  key={article.id}
                  href={`/allied-health/${article.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
                  data-testid={`article-card-${article.id}`}
                >
                  {article.primaryCategory && (
                    <span className="text-xs font-medium text-teal-600 uppercase tracking-wider">{article.primaryCategory}</span>
                  )}
                  <h3 className="text-base font-semibold text-gray-900 mt-1 mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.metaDescription && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.metaDescription}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {article.wordCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.ceil(article.wordCount / 250)} min read
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {profession.relatedProfessions.length > 0 && (
        <section className="py-12 bg-gray-50" data-testid="profession-related">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-related">
              Related Professions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profession.relatedProfessions.map((slug) => {
                const related = getAlliedHealthProfession(slug);
                if (!related) return null;
                const RelatedIcon = ICON_MAP[related.icon] || BookOpen;
                return (
                  <Link
                    key={slug}
                    href={`/allied-health/${slug}`}
                    className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all group flex items-center gap-4"
                    data-testid={`related-${slug}`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: related.colorAccent }}>
                      <RelatedIcon className="w-5 h-5" style={{ color: related.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{related.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{related.shortName} Certification Prep</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
