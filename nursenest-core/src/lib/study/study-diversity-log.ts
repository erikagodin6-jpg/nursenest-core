import { safeServerLog } from "@/lib/observability/safe-server-log";
import { studyDiversityDebugEnabled } from "@/lib/study/study-diversity-config";

export function logStudyDiversity(event: string, meta: Record<string, string | number | boolean | undefined>): void {
  if (!studyDiversityDebugEnabled()) return;
  safeServerLog("study_diversity", event, meta);
}
