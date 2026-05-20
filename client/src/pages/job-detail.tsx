import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { SEO } from "@/components/seo";
import { useI18n } from "@/lib/i18n";
import { fetchWithOptionalRetry } from "@/lib/fetch-utils";
import {
  MapPin, Building2, DollarSign, Clock, Briefcase, GraduationCap,
  CheckCircle2, ArrowLeft, FileText, MessageSquare, ArrowRight,
  Star, Heart, ExternalLink, Share2
} from "lucide-react";

function formatSalary(min?: number, max?: number, currency?: string, period?: string) {
  if (!min && !max) return null;
  const fmt = (n: number) => {
    if (currency === "CAD") return `CA$${n.toLocaleString()}`;
    return `$${n.toLocaleString()}`;
  };
  const periodLabel = period === "hour" ? "/hr" : "/yr";
  if (min && max) return `${fmt(min)} – ${fmt(max)}${periodLabel}`;
  if (min) return `From ${fmt(min)}${periodLabel}`;
  return `Up to ${fmt(max!)}${periodLabel}`;
}

function formatExperienceLevel(level: string) {
  const map: Record<string, string> = {
    new_grad: "New Graduate",
    entry_level: "Entry Level",
    "1_2_years": "1-2 Years Experience",
  };
  return map[level] || level;
}

function formatEmploymentType(type: string) {
  const map: Record<string, string> = {
    full_time: "Full-Time",
    part_time: "Part-Time",
    contract: "Contract",
    per_diem: "Per Diem",
  };
  return map[type] || type;
}

function buildJobPostingJsonLd(job: any) {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt ? new Date(job.postedAt).toISOString().split("T")[0] : undefined,
    employmentType: ({ full_time: "FULL_TIME", part_time: "PART_TIME", contract: "CONTRACTOR", per_diem: "PER_DIEM" } as Record<string, string>)[job.employmentType] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer,
      description: job.employerDescription,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location?.split(",")[0]?.trim(),
        addressRegion: job.state || job.location?.split(",")[1]?.trim(),
        addressCountry: job.country || "US",
      },
    },
    qualifications: job.qualifications?.join(". "),
    experienceRequirements: formatExperienceLevel(job.experienceLevel),
    occupationalCategory: job.profession,
  };

  if (job.salaryMin || job.salaryMax) {
    data.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salaryCurrency || "USD",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salaryMin && job.salaryMax
          ? { minValue: job.salaryMin, maxValue: job.salaryMax }
          : job.salaryMin
          ? { value: job.salaryMin }
          : { value: job.salaryMax }),
        unitText: job.salaryPeriod === "hour" ? "HOUR" : "YEAR",
      },
    };
  }

  if (job.expiresAt) {
    data.validThrough = new Date(job.expiresAt).toISOString().split("T")[0];
  }

  return data;
}

type JobLoadResult =
  | { status: "ok"; job: Record<string, unknown> }
  | { status: "not_found" }
  | { status: "unavailable" }
  | { status: "network" };

async function loadJob(slug: string): Promise<JobLoadResult> {
  let res: Response;
  try {
    res = await fetchWithOptionalRetry(`/api/jobs/by-slug/${encodeURIComponent(slug)}`);
  } catch {
    return { status: "network" };
  }
  if (res.status === 404) return { status: "not_found" };
  if (!res.ok) return { status: "unavailable" };
  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return { status: "unavailable" };
  }
  if (!raw || typeof raw !== "object") return { status: "not_found" };
  return { status: "ok", job: raw as Record<string, unknown> };
}

export default function JobDetail() {
  const { t } = useI18n();
  const [, params] = useRoute("/jobs/:slug");
  const slug = params?.slug || "";

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["job", slug],
    queryFn: () => loadJob(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.status === "not_found") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2" data-testid="text-job-not-found">
            {t("jobs.notFoundTitle")}
          </h1>
          <p className="text-gray-500 mb-6">{t("jobs.notFoundDesc")}</p>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium" data-testid="link-back-to-jobs">
            {t("jobs.backToJobs")}
          </Link>
        </div>
      </div>
    );
  }

  if (data.status !== "ok") {
    const isNet = data.status === "network";
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Briefcase className="w-16 h-16 text-amber-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            {isNet ? "Connection problem" : "Job couldn’t be loaded"}
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            {isNet ? "Check your connection and try again." : "Please try again in a moment."}
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 mr-3"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying…" : "Try again"}
          </button>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium text-sm" data-testid="link-back-to-jobs-error">
            {t("jobs.backToJobs")}
          </Link>
        </div>
      </div>
    );
  }

  const job = data.job;
  const title = typeof job.title === "string" ? job.title : "Job posting";
  const employer = typeof job.employer === "string" ? job.employer : "Employer";
  const profession = typeof job.profession === "string" ? job.profession : "";
  const specialty = typeof job.specialty === "string" ? job.specialty : "";
  const location = typeof job.location === "string" ? job.location : "";
  const description = typeof job.description === "string" ? job.description : "";
  const slugOut = typeof job.slug === "string" ? job.slug : slug;
  const postedAtRaw = job.postedAt;
  const postedDate =
    typeof postedAtRaw === "string" || postedAtRaw instanceof Date ? new Date(postedAtRaw as string | Date) : null;
  const postedMs = postedDate && !Number.isNaN(postedDate.getTime()) ? postedDate.getTime() : Date.now();
  const daysAgo = Math.floor((Date.now() - postedMs) / (1000 * 60 * 60 * 24));
  const postedLabel = daysAgo === 0 ? "Posted today" : daysAgo === 1 ? "Posted yesterday" : `Posted ${daysAgo} days ago`;

  const salary = formatSalary(
    typeof job.salaryMin === "number" ? job.salaryMin : undefined,
    typeof job.salaryMax === "number" ? job.salaryMax : undefined,
    typeof job.salaryCurrency === "string" ? job.salaryCurrency : undefined,
    typeof job.salaryPeriod === "string" ? job.salaryPeriod : undefined,
  );
  const jsonLd = buildJobPostingJsonLd({
    ...job,
    title,
    employer,
    description,
    profession,
    specialty,
    location,
    postedAt: postedDate && !Number.isNaN(postedDate.getTime()) ? postedDate.toISOString() : job.postedAt,
    employmentType: typeof job.employmentType === "string" ? job.employmentType : "full_time",
    salaryMin: typeof job.salaryMin === "number" ? job.salaryMin : undefined,
    salaryMax: typeof job.salaryMax === "number" ? job.salaryMax : undefined,
    salaryCurrency: typeof job.salaryCurrency === "string" ? job.salaryCurrency : undefined,
    salaryPeriod: typeof job.salaryPeriod === "string" ? job.salaryPeriod : undefined,
    state: typeof job.state === "string" ? job.state : undefined,
    country: typeof job.country === "string" ? job.country : undefined,
    qualifications: Array.isArray(job.qualifications) ? job.qualifications : undefined,
    experienceLevel: typeof job.experienceLevel === "string" ? job.experienceLevel : "",
    expiresAt: job.expiresAt,
    employerDescription: typeof job.employerDescription === "string" ? job.employerDescription : undefined,
  });

  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities.filter((x): x is string => typeof x === "string")
    : [];
  const requirements = Array.isArray(job.requirements)
    ? job.requirements.filter((x): x is string => typeof x === "string")
    : [];
  const qualificationsList = Array.isArray(job.qualifications)
    ? job.qualifications.filter((x): x is string => typeof x === "string")
    : [];
  const benefits = Array.isArray(job.benefits) ? job.benefits.filter((x): x is string => typeof x === "string") : [];
  const employerDescription =
    typeof job.employerDescription === "string" ? job.employerDescription : "";
  const experienceLevelStr = typeof job.experienceLevel === "string" ? job.experienceLevel : "";
  const employmentTypeStr = typeof job.employmentType === "string" ? job.employmentType : "full_time";
  const featured = Boolean(job.featured);
  const descSnippet = description ? `${description.slice(0, 120)}${description.length > 120 ? "…" : ""}` : "";
  const kwProfession = profession || "nursing";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <SEO
        title={`${title} at ${employer} | NurseNest Jobs`}
        description={`${title} - ${employer} in ${location}. ${descSnippet}`}
        keywords={`${kwProfession} jobs, ${specialty ? `${specialty} jobs, ` : ""}${location} healthcare jobs, new grad ${kwProfession.toLowerCase()} jobs`}
        canonicalPath={`/jobs/${slugOut}`}
        structuredData={jsonLd}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-6 group" data-testid="link-back-jobs">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("jobs.backToJobs")}
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 sm:p-8 border-b">
            <div className="flex flex-wrap gap-2 mb-3">
              {featured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              {profession ? (
                <span className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  {profession}
                </span>
              ) : null}
              {specialty ? (
                <span className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                  {specialty}
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3" data-testid="text-job-detail-title">
              {title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> {employer}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {location || "Location TBD"}
              </span>
              {salary && (
                <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">
                  <DollarSign className="w-4 h-4" /> {salary}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" /> {formatExperienceLevel(experienceLevelStr)}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> {formatEmploymentType(employmentTypeStr)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {postedLabel}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-3" data-testid="text-section-about">{t("jobs.aboutRole")}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{description || "—"}</p>
            </section>

            {responsibilities.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" data-testid="text-section-responsibilities">{t("jobs.responsibilities")}</h2>
                <ul className="space-y-2">
                  {responsibilities.map((item, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {requirements.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" data-testid="text-section-requirements">{t("jobs.requirements")}</h2>
                <ul className="space-y-2">
                  {requirements.map((item, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {qualificationsList.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" data-testid="text-section-qualifications">{t("jobs.qualifications")}</h2>
                <ul className="space-y-2">
                  {qualificationsList.map((item, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {benefits.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-3" data-testid="text-section-benefits">{t("jobs.benefits")}</h2>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, i: number) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                      <Heart className="w-3.5 h-3.5" /> {benefit}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {employerDescription ? (
              <section>
                <h2 className="text-lg font-semibold mb-3" data-testid="text-section-employer">{t("jobs.aboutEmployer")}</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{employerDescription}</p>
              </section>
            ) : null}
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-100 dark:border-blue-900">
          <h3 className="text-xl font-bold mb-2" data-testid="text-applying-cta-heading">{t("jobs.applyingCtaTitle")}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("jobs.applyingCtaDescription")}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/newgrad/resume" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border hover:shadow-md transition-all group" data-testid="link-detail-resume">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{t("jobs.ctaResumeBuild")}</h4>
                <p className="text-xs text-gray-500">{t("jobs.ctaResumeDesc")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
            <Link href="/newgrad/interview" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border hover:shadow-md transition-all group" data-testid="link-detail-interview">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{t("jobs.ctaInterviewPrep")}</h4>
                <p className="text-xs text-gray-500">{t("jobs.ctaInterviewDesc")}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium text-sm" data-testid="link-browse-more">
            {t("jobs.browseMore")}
          </Link>
        </div>
      </div>
    </div>
  );
}
