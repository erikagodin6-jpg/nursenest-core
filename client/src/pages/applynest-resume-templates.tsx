import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, FileText, Download, Tag, ArrowRight, Briefcase } from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
export default function ApplyNestResumeTemplates() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/applynest/resume-templates"],
    queryFn: async () => {
      const res = await fetch("/api/applynest/resume-templates");
      return res.json();
    },
  });

  const categories = [
    { key: "all", label: "All Templates" },
    { key: "new-grad", label: "New Graduate" },
    { key: "experienced", label: "Experienced" },
    { key: "transition", label: "Specialty Transition" },
    { key: "specialty", label: "Specialty-Specific" },
  ];

  const filtered = activeCategory === "all"
    ? (templates || [])
    : (templates || []).filter((t: any) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Link href="/applynest" className="inline-flex items-center gap-1 text-purple-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to ApplyNest
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" data-testid="text-resume-title">
            Healthcare Resume Templates
          </h1>
          <p className="text-purple-100 text-lg max-w-3xl" data-testid="text-resume-subtitle">
            Professional resume templates designed specifically for healthcare professionals. New graduate, experienced, and specialty transition formats.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8" data-testid="filter-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              data-testid={`button-category-${cat.key}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{t("pages.applynestResumeTemplates.loadingTemplates")}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t("pages.applynestResumeTemplates.noTemplatesFoundInThis")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="grid-templates">
            {filtered.map((template: any) => (
              <div key={template.id} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all bg-white dark:bg-gray-900" data-testid={`card-template-${template.slug}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <Tag className="w-3 h-3" />
                    {template.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2" data-testid={`text-template-title-${template.slug}`}>
                  {template.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4" data-testid={`text-template-desc-${template.slug}`}>
                  {template.description}
                </p>

                {template.profession && (
                  <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 mb-4">
                    <Briefcase className="w-3 h-3" />
                    {template.profession}
                  </div>
                )}

                {template.templateContent?.sections && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t("pages.applynestResumeTemplates.sectionsIncluded")}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {template.templateContent.sections.map((section: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {template.tips && template.tips.length > 0 && (
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 mb-4">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1.5">{t("pages.applynestResumeTemplates.tips")}</p>
                    <ul className="space-y-1">
                      {template.tips.slice(0, 3).map((tip: string, i: number) => (
                        <li key={i} className="text-xs text-purple-600 dark:text-purple-400 flex items-start gap-1.5">
                          <span className="mt-1 w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.applynestResumeTemplates.needMoreHelp")}</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/applynest/interview-prep" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-interview-from-resume">
              Interview Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest/job-search-guide" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-job-search-from-resume">
              Job Search Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline">
              All Career Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
