import { DirectPracticeQuestionLauncherClient } from "@/components/student/direct-practice-question-launcher-client";
import { loadPathwayPracticeBodySystemHubAggregates, mergePracticeHubPoolForApi } from "@/lib/questions/pathway-practice-body-system-aggregates";
import { parsePracticeHubIdsParam } from "@/lib/questions/normalize-question-body-system";
import type { PracticeTestSelectionMode } from "@/lib/practice-tests/types";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseQuestionCount(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n)) return 20;
  return Math.max(5, Math.min(100, n));
}

function parseSelectionMode(raw: string): Exclude<PracticeTestSelectionMode, "cat" | "targeted"> {
  const value = raw.trim().toLowerCase();
  if (value === "weak") return "weak";
  if (value === "incorrect" || value === "missed") return "missed";
  if (value === "bookmarked" || value === "starred") return "starred";
  if (value === "unseen") return "unseen";
  return "random";
}

function parseTopicNames(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const out = new Set<string>();
  for (const item of raw) {
    for (const part of String(item).split(",")) {
      const topic = part.trim();
      if (topic) out.add(topic);
    }
  }
  return [...out].slice(0, 30);
}

export default async function DirectPracticeQuestionStartPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const pathwayId = firstParam(sp.pathwayId).trim();
  const questionCount = parseQuestionCount(firstParam(sp.count));
  const selectionMode = parseSelectionMode(firstParam(sp.studyFilter) || firstParam(sp.focus) || firstParam(sp.mode));
  const practiceHubIds = parsePracticeHubIdsParam(firstParam(sp.practiceHubIds));
  let topicNames = parseTopicNames(sp.topicNames ?? sp.topic);

  if (pathwayId && practiceHubIds.length > 0) {
    try {
      const aggregates = await loadPathwayPracticeBodySystemHubAggregates(pathwayId);
      const merged = mergePracticeHubPoolForApi(aggregates, practiceHubIds);
      topicNames = [...new Set([...topicNames, ...merged.topics])].slice(0, 30);
    } catch {
      topicNames = topicNames.slice(0, 30);
    }
  }

  return (
    <DirectPracticeQuestionLauncherClient
      pathwayId={pathwayId}
      questionCount={questionCount}
      selectionMode={selectionMode}
      topicNames={topicNames}
      practiceHubIds={practiceHubIds}
    />
  );
}
