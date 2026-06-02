import { useState } from "react";
import { Link, useParams } from "wouter";
import { BookOpen, ChevronRight, Search, ArrowRight, ArrowLeft, Target, Lightbulb, GraduationCap } from "lucide-react";
import { socialWorkLessons, SOCIAL_WORK_DOMAINS, type SocialWorkLesson } from "@/data/social-work-lessons";

import { useI18n } from "@/lib/i18n";
function LessonDetail({ slug }: { slug: string }) {
  const { t } = useI18n();
  const lesson = socialWorkLessons.find(l => l.slug === slug);

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-lesson-not-found">{t("pages.socialWorkerLessons.lessonNotFound")}</h1>
        <Link href="/social-worker/lessons" className="text-cyan-600 hover:underline" data-testid="link-back-lessons">{t("pages.socialWorkerLessons.backToLessons")}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/social-worker" className="hover:text-cyan-600" data-testid="link-breadcrumb-home">{t("pages.socialWorkerLessons.socialWork")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/social-worker/lessons" className="hover:text-cyan-600" data-testid="link-breadcrumb-lessons">{t("pages.socialWorkerLessons.lessons")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyan-700 font-medium">{lesson.title}</span>
      </div>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-medium mb-3" data-testid="text-lesson-domain">{lesson.domain}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-lesson-title">{lesson.title}</h1>
        <p className="text-gray-600 text-lg" data-testid="text-lesson-summary">{lesson.summary}</p>
      </div>

      <div className="bg-cyan-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t("pages.socialWorkerLessons.learningObjectives")}</h2>
        </div>
        <ul className="space-y-2">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-cyan-600 font-bold mt-0.5">{i + 1}.</span>
              <span data-testid={`text-objective-${i}`}>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="prose prose-gray max-w-none mb-8" data-testid="text-lesson-content">
        {lesson.content.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{line.replace("## ", "")}</h2>;
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-semibold text-gray-800 mt-4">{line.replace(/\*\*/g, "")}</p>;
          }
          if (line.startsWith("- **")) {
            const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
            if (match) {
              return (
                <div key={i} className="flex items-start gap-2 ml-4 my-1">
                  <span className="text-cyan-500 mt-1">&#8226;</span>
                  <span className="text-sm"><strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</span>
                </div>
              );
            }
          }
          if (line.startsWith("- ")) {
            return (
              <div key={i} className="flex items-start gap-2 ml-4 my-1">
                <span className="text-cyan-500 mt-1">&#8226;</span>
                <span className="text-sm text-gray-700">{line.replace("- ", "")}</span>
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            return <p key={i} className="ml-4 my-1 text-sm text-gray-700">{line}</p>;
          }
          if (line.trim() === "") return <div key={i} className="h-2" />;
          return <p key={i} className="text-gray-700 my-2 text-sm leading-relaxed">{line}</p>;
        })}
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t("pages.socialWorkerLessons.keyTerms")}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {lesson.keyTerms.map((term, i) => (
            <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700" data-testid={`tag-term-${i}`}>{term}</span>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t("pages.socialWorkerLessons.examTips")}</h2>
        </div>
        <ul className="space-y-3">
          {lesson.examTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-amber-500 mt-0.5 font-bold">{t("pages.socialWorkerLessons.bull")}</span>
              <span data-testid={`text-exam-tip-${i}`}>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <Link href="/social-worker/lessons" className="flex items-center gap-2 text-cyan-600 hover:underline" data-testid="link-all-lessons">
          <ArrowLeft className="w-4 h-4" /> All Lessons
        </Link>
        <Link href="/allied-health/social-worker/test-bank" className="flex items-center gap-2 text-cyan-600 hover:underline" data-testid="link-practice-questions">
          Practice Questions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function LessonLibrary() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");

  const filtered = socialWorkLessons.filter(l => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !l.summary.toLowerCase().includes(search.toLowerCase())) return false;
    if (domain && l.domain !== domain) return false;
    return true;
  });

  const domainCounts = SOCIAL_WORK_DOMAINS.map(d => ({
    name: d,
    count: socialWorkLessons.filter(l => l.domain === d).length,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="social-work-lessons-page">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/social-worker" className="hover:text-cyan-600" data-testid="link-breadcrumb-sw">{t("pages.socialWorkerLessons.socialWork2")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyan-700 font-medium">{t("pages.socialWorkerLessons.lessons2")}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-lessons-title">{t("pages.socialWorkerLessons.socialWorkLessons")}</h1>
          <p className="text-gray-500 text-sm mt-1">{socialWorkLessons.length} lessons across {SOCIAL_WORK_DOMAINS.length} ASWB domains</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("pages.socialWorkerLessons.searchLessons")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              data-testid="input-search-lessons"
            />
          </div>
          <select
            value={domain}
            onChange={e => setDomain(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
            data-testid="select-domain"
          >
            <option value="">{t("pages.socialWorkerLessons.allDomains")}</option>
            {domainCounts.map(d => <option key={d.name} value={d.name}>{d.name} ({d.count})</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("pages.socialWorkerLessons.noLessonsFound")}</h3>
          <p className="text-gray-500 text-sm">{t("pages.socialWorkerLessons.tryAdjustingYourSearchOr")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(lesson => (
            <Link
              key={lesson.id}
              href={`/social-worker/lessons/${lesson.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-cyan-200 transition-all"
              data-testid={`card-lesson-${lesson.slug}`}
            >
              <span className="inline-block px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-xs font-medium mb-3">{lesson.domain}</span>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors">{lesson.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{lesson.summary}</p>
              <span className="text-cyan-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Lesson <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SocialWorkerLessonsPage() {
  const params = useParams<{ slug?: string }>();

  if (params.slug) {
    return <LessonDetail slug={params.slug} />;
  }

  return <LessonLibrary />;
}
