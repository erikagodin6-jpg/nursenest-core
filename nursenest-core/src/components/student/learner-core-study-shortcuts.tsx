import Link from "next/link";
import {
  buildLearnerPrimaryNavItems,
  learnerPrimaryNavLabelKey,
  type LearnerPrimaryNavItem,
} from "@/lib/navigation/learner-primary-nav";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { formatTitleCase } from "@/lib/format/text-case";

const CORE_KEYS = new Set<LearnerPrimaryNavItem["key"]>(["lessons", "practice", "flashcards", "cat"]);

/**
 * Legacy `dashboard.tsx` "quick links" / study surfaces row: Lessons → Practice → Flashcards → CAT.
 * Uses the same routes as {@link LearnerShellDesktopStudyLinks} (canonical learner nav).
 */
export function LearnerCoreStudyShortcuts({
  pathwayId,
  examsLabel,
  t,
  locale,
}: {
  pathwayId: string | null;
  examsLabel: "CAT Exams" | "Exams";
  t: LearnerMarketingT;
  locale: string;
}) {
  const items = buildLearnerPrimaryNavItems(pathwayId, { examsLabel }).filter((row) => CORE_KEYS.has(row.key));

  return (
    <ul className="nn-dash-core-shortcuts__list">
      {items.map((item) => {
        const labelKey = learnerPrimaryNavLabelKey(item.key);
        let label = formatTitleCase(t(labelKey), locale);
        if (item.key === "cat" && examsLabel === "Exams") {
          label = formatTitleCase(t("learner.shell.nav.examsSurface"), locale);
        }
        return (
          <li key={item.key}>
            <Link href={item.href} className="nn-dash-core-shortcuts__link">
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
