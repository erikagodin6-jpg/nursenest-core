"use client";

import Link from "next/link";
import { ALLIED_HEALTH_CAREERS, PRE_NURSING_GOAL, NEW_GRAD_GOAL } from "@shared/platform-manifest";
import { Briefcase, GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { getQuestionCount, getQuestionCountDisplay } from "@/legacy/data/career-question-counts";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

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
  const { t } = useMarketingI18n();
  const majorCareers = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "major");
  const midCareers = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "mid");

  return (
    <section
      className="bg-[var(--theme-page-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-allied-health-hero"
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-secondary/50 p-6 lg:p-8"
            data-testid="panel-pre-nursing"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                <BookOpen className="nn-accent-icon h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("components.heroAlliedHealth.prenursing")}</h3>
            </div>
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{PRE_NURSING_GOAL.goalQuestions.toLocaleString()}+</span>
              <span className="text-sm text-muted-foreground">{t("components.heroAlliedHealth.questionsGoal")}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {PRE_NURSING_GOAL.subjects.map((s) => (
                <span key={s} className="rounded-md border border-primary/15 bg-card/80 px-2 py-1 text-xs font-medium text-foreground">
                  {s}
                </span>
              ))}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{t("components.heroAlliedHealth.prepareForNursingSchoolSuccess")}</p>
            <Link
              href={mapLegacyMarketingHref(PRE_NURSING_GOAL.route)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline"
              data-testid="link-pre-nursing"
            >
              Explore lessons <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] to-secondary/45 p-6 lg:p-8"
            data-testid="panel-new-grad"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="nn-accent-icon-wrap flex h-10 w-10 items-center justify-center rounded-xl">
                <GraduationCap className="nn-accent-icon h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("components.heroAlliedHealth.newGraduate")}</h3>
            </div>
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{NEW_GRAD_GOAL.goalScenarios.toLocaleString()}+</span>
              <span className="text-sm text-muted-foreground">{t("components.heroAlliedHealth.careerreadinessScenariosGoal")}</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {NEW_GRAD_GOAL.sections.map((s) => (
                <span key={s} className="rounded-md border border-primary/15 bg-card/80 px-2 py-1 text-xs font-medium text-foreground">
                  {s}
                </span>
              ))}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{t("components.heroAlliedHealth.transitionFromStudentToConfident")}</p>
            <Link
              href={mapLegacyMarketingHref(NEW_GRAD_GOAL.route)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline"
              data-testid="link-new-grad"
            >
              New grad hub <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-allied-health-heading">
              Allied Health Exam Prep
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground lg:text-lg">
              Targeted question banks for major and mid-size allied health careers — from respiratory therapy to psychotherapy.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Major Careers — {computeCountRange(majorCareers)}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {majorCareers.map((career) => {
                  const slug = getSlugFromRoute(career.route);
                  const count = getQuestionCount(slug);
                  const display = getQuestionCountDisplay(slug);
                  return (
                    <Link
                      key={career.label}
                      href={mapLegacyMarketingHref(career.route)}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 no-underline shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                      data-testid={`allied-card-${career.label.toLowerCase().replace(/[\s()/]/g, "-")}`}
                    >
                      <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <Briefcase className="nn-accent-icon h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-[var(--theme-heading-text)]">{career.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {count > 0 ? (
                            <>
                              <span className="font-semibold text-[var(--theme-heading-text)]">{display}</span> {t("components.heroAlliedHealth.questions")}
                            </>
                          ) : (
                            <span className="font-semibold text-primary">{t("components.heroAlliedHealth.comingSoon")}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Mid-Size Careers — {computeCountRange(midCareers)}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {midCareers.map((career) => {
                  const slug = getSlugFromRoute(career.route);
                  const count = getQuestionCount(slug);
                  const display = getQuestionCountDisplay(slug);
                  return (
                    <Link
                      key={career.label}
                      href={mapLegacyMarketingHref(career.route)}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 no-underline shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                      data-testid={`allied-card-${career.label.toLowerCase().replace(/[\s()/]/g, "-")}`}
                    >
                      <div className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <Briefcase className="nn-accent-icon h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-[var(--theme-heading-text)]">{career.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {count > 0 ? (
                            <>
                              <span className="font-semibold text-[var(--theme-heading-text)]">{display}</span> {t("components.heroAlliedHealth.questions2")}
                            </>
                          ) : (
                            <span className="font-semibold text-primary">{t("components.heroAlliedHealth.comingSoon2")}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
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
