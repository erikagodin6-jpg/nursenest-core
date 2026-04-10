import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  Crosshair,
  GraduationCap,
  LayoutList,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

/**
 * Legacy parity: monolith dashboard `quick_links` + “jump into study tools” row.
 * Uses semantic multi-color accents (chart + info/success/warning) — not brand-only.
 */
const DEFAULT_STUDY_LINKS: {
  href: string;
  labelKey: string;
  icon: typeof Crosshair;
  accent: "cat" | "exams" | "bank" | "lessons" | "flashcards" | "planner" | "report" | "readiness" | "review";
}[] = [
  { href: "/app/practice-tests/start", labelKey: "learner.profile.quickLinks.catPractice", icon: Crosshair, accent: "cat" },
  { href: "/app/exams", labelKey: "nav.practiceExams", icon: GraduationCap, accent: "exams" },
  { href: "/app/questions", labelKey: "nav.questionBank", icon: LayoutList, accent: "bank" },
  { href: "/app/lessons", labelKey: "learner.profile.quickLinks.lessons", icon: BookOpen, accent: "lessons" },
  { href: "/app/flashcards", labelKey: "learner.profile.quickLinks.flashcards", icon: Brain, accent: "flashcards" },
  { href: "/app/study-plan", labelKey: "learner.profile.quickLinks.studyPlanner", icon: ListTodo, accent: "planner" },
  { href: "/app/account/report-card", labelKey: "learner.account.nav.reportCard", icon: BarChart3, accent: "report" },
  { href: "/app/account/readiness", labelKey: "learner.account.nav.readiness", icon: Target, accent: "readiness" },
  { href: "/app/account/review-queue", labelKey: "learner.account.nav.reviewQueue", icon: ClipboardList, accent: "review" },
];

export function LearnerStudyQuickLinksCard({
  t,
  id = "learner-study-quick-links",
  catHref,
}: {
  t: LearnerMarketingT;
  /** Optional anchor id for skip links / aria */
  id?: string;
  catHref?: string;
}) {
  const studyLinks = DEFAULT_STUDY_LINKS.map((link) =>
    link.accent === "cat" && catHref?.trim() ? { ...link, href: catHref.trim() } : link,
  );

  return (
    <section
      className="nn-card nn-learner-quick-links-section nn-product-surface-accent relative overflow-hidden border-[var(--semantic-border-soft)] pt-7 shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex flex-wrap items-start gap-2 px-6">
        <Sparkles className="nn-learner-quick-links-heading-icon mt-0.5 h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />
        <div>
          <h2 id={`${id}-heading`} className="text-lg font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.profile.quickLinks.heading")}
          </h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.profile.quickLinks.subtitle")}</p>
        </div>
      </div>
      <ul className="mt-5 grid list-none gap-3 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {studyLinks.map(({ href, labelKey, icon: Icon, accent }) => (
          <li key={href}>
            <Link
              href={href}
              data-study-accent={accent}
              className="nn-study-link-tile group flex min-h-[3.25rem] items-center gap-3 px-3 py-2.5"
            >
              <span className="nn-study-link-icon-wrap" aria-hidden>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 break-words text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">
                {t(labelKey)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
