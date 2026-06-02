import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/seo";
import { useI18n } from "@/lib/i18n";
import {
  Search, MapPin, Briefcase, GraduationCap, Building2, DollarSign,
  ChevronLeft, ChevronRight, Star, Filter, X, ArrowRight, FileText, MessageSquare
} from "lucide-react";

function formatSalary(min?: number, max?: number, currency?: string) {
  if (!min && !max) return null;
  const fmt = (n: number) => {
    if (currency === "CAD") return `CA$${(n / 1000).toFixed(0)}K`;
    return `$${(n / 1000).toFixed(0)}K`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function formatExperienceLevel(level: string) {
  const map: Record<string, string> = {
    new_grad: "New Graduate",
    entry_level: "Entry Level",
    "1_2_years": "1-2 Years Experience",
  };
  return map[level] || level;
}

function useQueryParams() {
  const [location] = useLocation();
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("search") || "",
    location: params.get("location") || "",
    profession: params.get("profession") || "",
    experienceLevel: params.get("experienceLevel") || "",
    page: parseInt(params.get("page") || "1"),
  };
}

function updateQueryParams(updates: Record<string, string>) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  }
  if (updates.page === undefined && !updates.page) {
    params.delete("page");
  }
  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.pushState({}, "", newUrl);
}

export default function JobsHub() {
  const { t } = useI18n();
  const queryParams = useQueryParams();

  const [searchInput, setSearchInput] = useState(queryParams.search);
  const [locationFilter, setLocationFilter] = useState(queryParams.location);
  const [professionFilter, setProfessionFilter] = useState(queryParams.profession);
  const [experienceLevelFilter, setExperienceLevelFilter] = useState(queryParams.experienceLevel);
  const [currentPage, setCurrentPage] = useState(queryParams.page);
  const [showFilters, setShowFilters] = useState(false);

  const buildApiUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (locationFilter) params.set("location", locationFilter);
    if (professionFilter) params.set("profession", professionFilter);
    if (experienceLevelFilter) params.set("experienceLevel", experienceLevelFilter);
    params.set("page", String(currentPage));
    params.set("limit", "12");
    return `/api/jobs?${params.toString()}`;
  }, [searchInput, locationFilter, professionFilter, experienceLevelFilter, currentPage]);

  const { data: jobsData, isLoading } = useQuery<{
    jobs: any[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["jobs", searchInput, locationFilter, professionFilter, experienceLevelFilter, currentPage],
    queryFn: async () => {
      const res = await fetch(buildApiUrl());
      if (!res.ok) return { jobs: [], total: 0, page: 1, totalPages: 0 };
      return res.json();
    },
  });

  const { data: filtersData } = useQuery<{
    locations: string[];
    professions: string[];
    specialties: string[];
    experienceLevels: string[];
  }>({
    queryKey: ["job-filters"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/filters");
      if (!res.ok) return { locations: [], professions: [], specialties: [], experienceLevels: [] };
      return res.json();
    },
    staleTime: 300000,
  });

  const { data: featuredJobs } = useQuery<any[]>({
    queryKey: ["jobs-featured"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/featured");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 300000,
  });

  const hasActiveFilters = searchInput || locationFilter || professionFilter || experienceLevelFilter;

  const handleSearch = () => {
    setCurrentPage(1);
    updateQueryParams({
      search: searchInput,
      location: locationFilter,
      profession: professionFilter,
      experienceLevel: experienceLevelFilter,
      page: "",
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setLocationFilter("");
    setProfessionFilter("");
    setExperienceLevelFilter("");
    setCurrentPage(1);
    window.history.pushState({}, "", window.location.pathname);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateQueryParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jobs = jobsData?.jobs || [];
  const totalPages = jobsData?.totalPages || 0;
  const total = jobsData?.total || 0;

  const showFeatured = !hasActiveFilters && currentPage === 1 && (featuredJobs?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <SEO
        title={t("jobs.seoTitle")}
        description={t("jobs.seoDescription")}
        keywords="new grad nurse jobs, entry level healthcare jobs, new graduate nursing jobs, RN jobs, LPN jobs, nurse practitioner jobs, allied health jobs, healthcare careers"
        canonicalPath="/jobs"
      />

      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              <span data-testid="text-jobs-badge">{t("jobs.badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-jobs-title">
              {t("jobs.title")}
            </h1>
            <p className="text-blue-100 text-lg mb-8" data-testid="text-jobs-subtitle">
              {t("jobs.subtitle")}
            </p>

            <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("jobs.searchPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  data-testid="input-job-search"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                data-testid="button-job-search"
              >
                {t("jobs.searchButton")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg shadow-sm"
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4" />
              <span>{t("jobs.filters")}</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{t("pages.jobsHub.active")}</span>
              )}
            </button>
          </div>

          <aside className={`lg:w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-5 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{t("jobs.filters")}</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1" data-testid="button-clear-filters">
                    <X className="w-3 h-3" /> {t("jobs.clearFilters")}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1" /> {t("jobs.filterLocation")}
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-sm"
                  data-testid="select-location-filter"
                >
                  <option value="">{t("jobs.allLocations")}</option>
                  {filtersData?.locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <Briefcase className="w-4 h-4 inline mr-1" /> {t("jobs.filterProfession")}
                </label>
                <select
                  value={professionFilter}
                  onChange={(e) => { setProfessionFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-sm"
                  data-testid="select-profession-filter"
                >
                  <option value="">{t("jobs.allProfessions")}</option>
                  {filtersData?.professions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <GraduationCap className="w-4 h-4 inline mr-1" /> {t("jobs.filterExperience")}
                </label>
                <select
                  value={experienceLevelFilter}
                  onChange={(e) => { setExperienceLevelFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-sm"
                  data-testid="select-experience-filter"
                >
                  <option value="">{t("jobs.allExperience")}</option>
                  <option value="new_grad">{t("jobs.expNewGrad")}</option>
                  <option value="entry_level">{t("jobs.expEntryLevel")}</option>
                  <option value="1_2_years">{t("jobs.exp1to2Years")}</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                data-testid="button-apply-filters"
              >
                {t("jobs.applyFilters")}
              </button>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{t("jobs.careerTools")}</h4>
                <Link href="/newgrad/resume" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 group" data-testid="link-resume-builder">
                  <FileText className="w-4 h-4" />
                  <span>{t("jobs.resumeBuilder")}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="/newgrad/interview" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 group" data-testid="link-interview-prep">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t("jobs.interviewPrep")}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {showFeatured && (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2" data-testid="text-featured-heading">
                  <Star className="w-5 h-5 text-amber-500" />
                  {t("jobs.featuredListings")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {featuredJobs!.slice(0, 4).map((job: any) => (
                    <JobCard key={job.id || job.slug} job={job} featured />
                  ))}
                </div>
              </section>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" data-testid="text-all-jobs-heading">
                {hasActiveFilters ? t("jobs.searchResults") : t("jobs.allListings")}
                {total > 0 && <span className="text-gray-500 font-normal text-base ml-2">({total})</span>}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border p-5 animate-pulse">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2" data-testid="text-no-jobs-title">
                  {t("jobs.noJobsTitle")}
                </h3>
                <p className="text-gray-500 mb-4" data-testid="text-no-jobs-desc">{t("jobs.noJobsDesc")}</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-medium" data-testid="button-clear-all">
                    {t("jobs.clearAllFilters")}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {jobs.map((job: any) => (
                    <JobCard key={job.id || job.slug} job={job} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="p-2 rounded-lg border bg-white dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                            page === currentPage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          data-testid={`button-page-${page}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-2 rounded-lg border bg-white dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            <section className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2" data-testid="text-cta-heading">{t("jobs.ctaTitle")}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t("jobs.ctaDescription")}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/newgrad/resume" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors" data-testid="link-cta-resume">
                  <FileText className="w-4 h-4" />
                  {t("jobs.ctaResume")}
                </Link>
                <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg border transition-colors" data-testid="link-cta-interview">
                  <MessageSquare className="w-4 h-4" />
                  {t("jobs.ctaInterview")}
                </Link>
                <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg border transition-colors" data-testid="link-cta-newgrad">
                  <GraduationCap className="w-4 h-4" />
                  {t("jobs.ctaNewGrad")}
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, featured }: { job: any; featured?: boolean }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const daysAgo = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24));
  const postedLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  return (
    <Link href={`/jobs/${job.slug}`} data-testid={`card-job-${job.slug}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-xl border p-5 hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer h-full flex flex-col ${featured ? "ring-2 ring-amber-200 dark:ring-amber-800" : ""}`}>
        {featured && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full w-fit mb-2">
            <Star className="w-3 h-3" /> Featured
          </span>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2" data-testid={`text-job-title-${job.slug}`}>
          {job.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-1">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{job.employer}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{job.location}</span>
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            {job.profession}
          </span>
          {job.specialty && (
            <span className="text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
              {job.specialty}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
            {formatExperienceLevel(job.experienceLevel)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm">
          {salary && (
            <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> {salary}
            </span>
          )}
          <span className="text-gray-400 text-xs">{postedLabel}</span>
        </div>
      </div>
    </Link>
  );
}
