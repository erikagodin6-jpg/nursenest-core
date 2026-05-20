import type { InternalCourseModule } from "@prisma/client";
import { InternalCourseDecisionTreeModule } from "@/components/internal-courses/internal-course-decision-tree-module";
import { InternalCourseEcgModule } from "@/components/internal-courses/internal-course-ecg-module";
import { InternalCourseQuizModule } from "@/components/internal-courses/internal-course-quiz-module";
import { InternalCourseScenarioModule } from "@/components/internal-courses/internal-course-scenario-module";
import { validateInternalCourseModuleContent } from "@/lib/internal-courses/module-content-schema";

function InvalidModuleCard(props: { moduleId: string; issues: string[] }) {
  return (
    <div
      className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,transparent)] p-4 sm:p-5"
      role="alert"
    >
      <p className="text-sm font-semibold text-foreground">This module could not be loaded safely.</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Content failed validation. Ask staff to fix the stored JSON for module <span className="font-mono">{props.moduleId}</span>.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        {props.issues.slice(0, 8).map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export function InternalCourseModuleRenderer(props: {
  mod: InternalCourseModule;
  lessonAppHref: string | null;
}) {
  const { mod, lessonAppHref } = props;
  const validated = validateInternalCourseModuleContent(mod.type, mod.content);
  if (!validated.ok) {
    return <InvalidModuleCard moduleId={mod.id} issues={validated.issues} />;
  }
  if (validated.type === "ecg") {
    return <InternalCourseEcgModule lessonAppHref={lessonAppHref} content={validated.data} />;
  }
  if (validated.type === "scenario") {
    return <InternalCourseScenarioModule lessonAppHref={lessonAppHref} content={validated.data} />;
  }
  if (validated.type === "quiz") {
    return <InternalCourseQuizModule lessonAppHref={lessonAppHref} content={validated.data} />;
  }
  if (validated.type === "decision_tree") {
    return <InternalCourseDecisionTreeModule lessonAppHref={lessonAppHref} content={validated.data} />;
  }
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      Unsupported module type.
    </div>
  );
}
