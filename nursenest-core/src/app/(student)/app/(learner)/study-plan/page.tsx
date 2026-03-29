import { StudyPlanToolGateway } from "@/components/student/study-plan-tool-gateway";

export default function StudyPlanPage() {
  return (
    <main className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Study plan generator</h1>
        <p className="mt-2 text-sm text-muted">
          AI-assisted weekly structure for exam prep. Enable server-side with{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">AI_STUDY_PLAN_ENABLED=true</code> and an OpenAI-compatible API
          key. Not medical advice.
        </p>
      </div>
      <StudyPlanToolGateway />
    </main>
  );
}
