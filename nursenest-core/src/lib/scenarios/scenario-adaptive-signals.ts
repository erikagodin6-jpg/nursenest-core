/**
 * Weak-topic signals that benefit from clinical scenarios / OSCE-style judgment practice (`/app/clinical-scenarios`, `/app/osce`).
 */
const SCENARIO_FOCUS_SIGNAL =
  /\b(delegat|prioriti|prioritization|safety|infection\s+control|therapeutic\s+communication|clinical\s+judgment|ngn|judgment|scenario|osce|simulation|patient\s+deteriorat|deterioration|rapid\s+response|code\s+team|assessment|intervention|cluster|bowtie|matrix|multiple\s+patient|conflict|ethical|leadership\s+and\s+management)\b/i;

export function weakTopicSuggestsScenarioFocus(topicKey: string): boolean {
  const s = topicKey?.trim() ?? "";
  if (!s) return false;
  return SCENARIO_FOCUS_SIGNAL.test(s);
}

export function anyWeakTopicsSuggestScenarios(topics: readonly string[]): boolean {
  return topics.some((t) => weakTopicSuggestsScenarioFocus(t));
}
