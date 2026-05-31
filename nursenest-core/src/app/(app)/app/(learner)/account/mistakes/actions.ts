"use server";

import { loadMistakeNotebook } from "@/lib/mistakes/mistake-store";
import { analyzeMistakePatterns } from "@/lib/mistakes/mistake-patterns";
import type { MistakeNotebookData } from "@/lib/mistakes/mistake-types";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export async function loadMistakeNotebookAction(userId: string): Promise<MistakeNotebookData> {
  if (!isDatabaseUrlConfigured()) {
    return {
      entries: [],
      totalMisses: 0,
      taggedCount: 0,
      mostCommonErrorType: null,
      topTopics: [],
      topBodySystems: [],
      patterns: [],
      reasonCounts: {},
      improvementOverTime: [],
      hasHistoricalData: false,
    };
  }
  const entries = await loadMistakeNotebook(userId);
  return analyzeMistakePatterns(entries);
}
