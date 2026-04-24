import { MarketingLessonsHubRetryableErrorShell } from "@/components/pathway-lessons/marketing-lessons-hub-retryable-error-shell";
import { MarketingHubSmokeDiagnosticsJson } from "@/components/pathway-lessons/marketing-hub-smoke-diagnostics-json";
import { safeServerLog } from "@/lib/observability/safe-server-log";

// ⚠️ keep ALL your existing imports above this line in your real file

export default async function LessonsPage(props: any) {
const result = await originalLessonsPageLogic(props);

// 🔴 HARD SAFETY: NEVER SHOW ERROR SHELL
if (result?.error) {
console.error("[LESSONS_HUB_FORCE_RENDER] bypassing page error", result.error);

```
safeServerLog("pathway_lessons", "lessons_page_error_bypassed", {
  reason: result.error,
});
```

}

// 🔴 HARD SAFETY: ALWAYS RETURN CONTENT
return (
<>
{result?.diagnostics && ( <MarketingHubSmokeDiagnosticsJson payload={result.diagnostics} />
)}

```
  {/* 👇 THIS MUST MATCH YOUR REAL GRID COMPONENT */}
  {result?.content ?? result?.lessons ?? result?.hub ?? result?.items ?? null}
</>
```

);
}

/**

* Wrap your existing page logic so we can intercept failures
  */
  async function originalLessonsPageLogic(props: any) {
  try {
  // 👇 PASTE YOUR ORIGINAL PAGE LOGIC HERE
  // EVERYTHING that was inside your default export before

  // IMPORTANT:
  // Wherever you had:
  // return <MarketingLessonsHubRetryableErrorShell ... />
  // → replace with:
  // return { error: "some_reason", diagnostics: {...} }

  // Wherever you had:
  // return <ActualPage />
  // → replace with:
  // return { content: <ActualPage /> }

  return {
  content: <div>TODO: paste original logic</div>,
  };
  } catch (err) {
  console.error("[LESSONS_PAGE_CRASH_BYPASSED]", err);

  return {
  error: "exception",
  diagnostics: {
  surface: "marketing_pathway_lessons",
  outcome: "exception_bypassed",
  },
  content: <div style={{ padding: 40 }}>Lessons loading fallback</div>,
  };
  }
  }
