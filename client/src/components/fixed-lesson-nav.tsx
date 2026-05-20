import { ChevronLeft, ChevronRight } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { getLessonNavigation } from "@/lib/lesson-navigation";

import { useI18n } from "@/lib/i18n";
interface FixedLessonNavProps {
  lessonId: string;
}

export function FixedLessonNav({ lessonId }: FixedLessonNavProps) {
  const { t } = useI18n();
  const nav = getLessonNavigation(lessonId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]" data-testid="fixed-lesson-nav">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {nav?.prev ? (
            <LocaleLink href={`/lessons/${nav.prev.id}`}>
              <span className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer max-w-full group" data-testid="button-prev-lesson-fixed">
                <ChevronLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline truncate" title={nav.prev.name}>{nav.prev.name}</span>
                <span className="sm:hidden">{t("components.fixedLessonNav.previous")}</span>
              </span>
            </LocaleLink>
          ) : (
            <span className="text-sm text-transparent select-none" aria-hidden="true">{t("components.fixedLessonNav.prev")}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 flex justify-end">
          {nav?.next ? (
            <LocaleLink href={`/lessons/${nav.next.id}`}>
              <span className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer max-w-full group" data-testid="button-next-lesson-fixed">
                <span className="hidden sm:inline truncate" title={nav.next.name}>{nav.next.name}</span>
                <span className="sm:hidden">{t("components.fixedLessonNav.next")}</span>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </LocaleLink>
          ) : (
            <span className="text-sm text-transparent select-none" aria-hidden="true">{t("components.fixedLessonNav.next2")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
