export function remediationTopicDrillHref(topic: string): string {
  return `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topic)}`;
}

export function remediationWeakModeTestHref(topic?: string): string {
  const base = "/app/practice-tests?focus=weak";
  if (!topic) return base;
  return `${base}&topic=${encodeURIComponent(topic)}`;
}

