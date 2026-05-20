export type ParsedDraftBatchTopics = {
  topics: string[];
  droppedShortLines: number;
};

/** One topic per line; trim; drop empties and lines under 3 chars. Preserves duplicate lines as separate items. */
export function parseDraftBatchTopicLines(raw: string): ParsedDraftBatchTopics {
  const lines = raw.split(/\r?\n/);
  const topics: string[] = [];
  let droppedShortLines = 0;
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 3) {
      if (t.length > 0) droppedShortLines += 1;
      continue;
    }
    topics.push(t);
  }
  return { topics, droppedShortLines };
}
