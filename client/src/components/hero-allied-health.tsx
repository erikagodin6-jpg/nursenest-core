import { Link } from "wouter";
import { ALLIED_HEALTH_CAREERS, PRE_NURSING_GOAL, NEW_GRAD_GOAL } from "@shared/platform-manifest";
import { Briefcase, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { getQuestionCount, getQuestionCountDisplay } from "@/data/career-questions/question-counts";

import { useI18n } from "@/lib/i18n";
function getSlugFromRoute(route: string): string {

  return route.split("/").pop() || "";
}

function computeCountRange(careers: typeof ALLIED_HEALTH_CAREERS): string {
  const counts = careers.map((c) => getQuestionCount(getSlugFromRoute(c.route))).filter((n) => n > 0);
  if (counts.length === 0) return "Coming Soon";
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const roundDown = (n: number) => Math.floor(n / 100) * 100;
  if (min === max) return `${roundDown(min).toLocaleString()}+ questions each`;
  return `${roundDown(min).toLocaleString()} to ${roundDown(max).toLocaleString()}+ questions each`;
}

export default function HeroAlliedHealth() {
  const { t } = useI18n();
  const majorCareers = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "major");
  const midCareers = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "mid");

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-allied-health-hero"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-6 lg:p-8" data-testid="panel-pre-nursing">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("components.heroAlliedHealth.prenursing")}</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-extrabold text-gray-900">{PRE_NURSING_GOAL.goalQuestions.toLocaleString()}+</span>
              <span className="text-sm text-gray-500">{t("components.heroAlliedHealth.questionsGoal")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {PRE_NURSING_GOAL.subjects.map((s) => (
                <span key={s} className="px-2 py-1 rounded-md bg-white/80 border border-sky-100 text-xs font-medium text-gray-600">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-4">{t("components.heroAlliedHealth.prepareForNursingSchoolSuccess")}</p>
            <Link
              href={PRE_NURSING_GOAL.route}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline no-underline"
              data-testid="link-pre-nursing"
            >
              Explore lessons <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 p-6 lg:p-8" data-testid="panel-new-grad">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t("components.heroAlliedHealth.newGraduate")}</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-extrabold text-gray-900">{NEW_GRAD_GOAL.goalScenarios.toLocaleString()}+</span>
              <span className="text-sm text-gray-500">{t("components.heroAlliedHealth.careerreadinessScenariosGoal")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {NEW_GRAD_GOAL.sections.map((s) => (
                <span key={s} className="px-2 py-1 rounded-md bg-white/80 border border-purple-100 text-xs font-medium text-gray-600">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-4">{t("components.heroAlliedHealth.transitionFromStudentToConfident")}</p>
            <Link
              href={NEW_GRAD_GOAL.route}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline no-underline"
              data-testid="link-new-grad"
            >
              New grad hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2
              className="font-bold text-gray-900 mb-2"
              style={{ fontSize: "var(--text-section)" }}
              data-testid="text-allied-health-heading"
            >
              Allied Health Exam Prep
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
              Targeted question banks for major and mid-size allied health careers — from respiratory therapy to psychotherapy.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Major Careers — {computeCountRange(majorCareers)}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {majorCareers.map((career) => {
                  const slug = getSlugFromRoute(career.route);
                  const count = getQuestionCount(slug);
                  const display = getQuestionCountDisplay(slug);
                  return (
                    <Link
                      key={career.label}
                      href={career.route}
                      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:-translate-y-0.5 p-4 no-underline"
                      data-testid={`allied-card-${career.label.toLowerCase().replace(/[\s()\/]/g, "-")}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{career.label}</h4>
                        <p className="text-xs text-gray-500">
                          {count > 0 ? (
                            <><span className="font-semibold text-gray-700">{display}</span> {t("components.heroAlliedHealth.questions")}</>
                          ) : (
                            <span className="font-semibold text-amber-600">{t("components.heroAlliedHealth.comingSoon")}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Mid-Size Careers — {computeCountRange(midCareers)}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {midCareers.map((career) => {
                  const slug = getSlugFromRoute(career.route);
                  const count = getQuestionCount(slug);
                  const display = getQuestionCountDisplay(slug);
                  return (
                    <Link
                      key={career.label}
                      href={career.route}
                      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:-translate-y-0.5 p-4 no-underline"
                      data-testid={`allied-card-${career.label.toLowerCase().replace(/[\s()\/]/g, "-")}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{career.label}</h4>
                        <p className="text-xs text-gray-500">
                          {count > 0 ? (
                            <><span className="font-semibold text-gray-700">{display}</span> {t("components.heroAlliedHealth.questions2")}</>
                          ) : (
                            <span className="font-semibold text-amber-600">{t("components.heroAlliedHealth.comingSoon2")}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
