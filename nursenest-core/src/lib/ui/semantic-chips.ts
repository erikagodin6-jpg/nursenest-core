export type TopicStrengthChipTone = "weak" | "watch" | "stable" | "strong";

export function topicStrengthChipClass(tone: TopicStrengthChipTone): string {
  switch (tone) {
    case "strong":
    case "stable":
      return "nn-badge-semantic-success";
    case "watch":
      return "nn-badge-semantic-warning";
    case "weak":
      return "nn-badge-semantic-danger";
  }
}
