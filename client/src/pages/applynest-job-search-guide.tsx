import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MapPin, BookOpen, ArrowRight, ChevronRight, FileText, DollarSign, Clock, Briefcase } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const guideIcons: Record<string, any> = {
  "where-to-find-healthcare-jobs": MapPin,
  "how-to-evaluate-healthcare-job-offers": DollarSign,
  "salary-negotiation-healthcare": Briefcase,
  "credentialing-timeline": Clock,
};

export default function ApplyNestJobSearchGuide() {
  const { t } = useI18n();
  const { data: guides, isLoading } = useQuery({
    queryKey: ["/api/applynest/career-guides"],
    queryFn: async () => {
      const res = await fetch("/api/applynest/career-guides");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Link href="/applynest" className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to ApplyNest
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" data-testid="text-guide-title">
            Healthcare Job Search Guide
          </h1>
          <p className="text-blue-100 text-lg max-w-3xl" data-testid="text-guide-subtitle">
            Everything you need to find, evaluate, and land your ideal healthcare position. From job boards to salary negotiation and credentialing timelines.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{t("pages.applynestJobSearchGuide.loadingGuides")}</div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-testid="grid-guide-nav">
              {(guides || []).map((guide: any) => {
                const Icon = guideIcons[guide.slug] || BookOpen;
                return (
                  <a key={guide.id} href={`#${guide.slug}`} className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all" data-testid={`nav-guide-${guide.slug}`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{guide.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{guide.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                  </a>
                );
              })}
            </div>

            {(guides || []).map((guide: any) => {
              const Icon = guideIcons[guide.slug] || BookOpen;
              const content = guide.content || [];
              return (
                <article key={guide.id} id={guide.slug} className="scroll-mt-8" data-testid={`article-${guide.slug}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{guide.title}</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{guide.summary}</p>

                  <div className="space-y-6">
                    {content.map((section: any, i: number) => (
                      <div key={i} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900" data-testid={`section-content-${guide.slug}-${i}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">{section.heading}</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.body}</p>
                      </div>
                    ))}
                  </div>

                  <hr className="my-10 border-gray-200 dark:border-gray-800" />
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.applynestJobSearchGuide.relatedResources")}</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/applynest/resume-templates" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-resume-from-guide">
              Resume Templates <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest/interview-prep" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-interview-from-guide">
              Interview Prep <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/applynest" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline">
              All Career Guides <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/new-grad" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:underline" data-testid="link-new-grad-from-guide">
              New Grad Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
