/**
 * Normalized blueprint key for CAT balancing — combines body system, topic, and subtopic
 * so the engine can avoid over-pulling a single facet when difficulty match is strong.
 */
export function blueprintBalanceKey(row: {
  bodySystem: string | null;
  topic: string | null;
  subtopic?: string | null;
}): string {
  const sub = row.subtopic?.trim();
  if (sub && sub.length > 0) return `st:${sub.slice(0, 80)}`;
  const body = row.bodySystem?.trim();
  if (body && body.length > 0) return `bs:${body.slice(0, 80)}`;
  const topic = row.topic?.trim();
  if (topic && topic.length > 0) return `tp:${topic.slice(0, 80)}`;
  return "general";
}
