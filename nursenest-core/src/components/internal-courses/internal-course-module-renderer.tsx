import type { InternalCourseModule } from "@prisma/client";
import type { InternalDecisionTreeContent } from "@/components/internal-courses/internal-course-decision-tree-module";
import { InternalCourseDecisionTreeModule } from "@/components/internal-courses/internal-course-decision-tree-module";
import type { InternalEcgModuleContent } from "@/components/internal-courses/internal-course-ecg-module";
import { InternalCourseEcgModule } from "@/components/internal-courses/internal-course-ecg-module";
import type { InternalQuizModuleContent } from "@/components/internal-courses/internal-course-quiz-module";
import { InternalCourseQuizModule } from "@/components/internal-courses/internal-course-quiz-module";
import type { InternalScenarioModuleContent } from "@/components/internal-courses/internal-course-scenario-module";
import { InternalCourseScenarioModule } from "@/components/internal-courses/internal-course-scenario-module";

export function InternalCourseModuleRenderer(props: {
  mod: InternalCourseModule;
  lessonAppHref: string | null;
}) {
  const { mod, lessonAppHref } = props;
  const raw = mod.content;
  if (mod.type === "ecg") {
    return <InternalCourseEcgModule lessonAppHref={lessonAppHref} content={raw as InternalEcgModuleContent} />;
  }
  if (mod.type === "scenario") {
    return (
      <InternalCourseScenarioModule lessonAppHref={lessonAppHref} content={raw as InternalScenarioModuleContent} />
    );
  }
  if (mod.type === "quiz") {
    return <InternalCourseQuizModule lessonAppHref={lessonAppHref} content={raw as InternalQuizModuleContent} />;
  }
  if (mod.type === "decision_tree") {
    return (
      <InternalCourseDecisionTreeModule
        lessonAppHref={lessonAppHref}
        content={raw as InternalDecisionTreeContent}
      />
    );
  }
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      Unsupported module type.
    </div>
  );
}
