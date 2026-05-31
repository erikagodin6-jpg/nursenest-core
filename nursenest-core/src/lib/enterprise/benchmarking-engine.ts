export type BenchmarkInput = Readonly<{
  id: string;
  label: string;
  readinessScore: number;
  competencyScore: number;
  weakAreaCount: number;
}>;

export type BenchmarkResult = Readonly<{
  id: string;
  label: string;
  readinessRank: number;
  competencyRank: number;
  struggling: boolean;
}>;

export function benchmarkCohorts(inputs: readonly BenchmarkInput[]): readonly BenchmarkResult[] {
  const readinessSorted = [...inputs].sort((a, b) => b.readinessScore - a.readinessScore);
  const competencySorted = [...inputs].sort((a, b) => b.competencyScore - a.competencyScore);

  return inputs.map((input) => ({
    id: input.id,
    label: input.label,
    readinessRank: readinessSorted.findIndex((item) => item.id === input.id) + 1,
    competencyRank: competencySorted.findIndex((item) => item.id === input.id) + 1,
    struggling: input.readinessScore < 70 || input.competencyScore < 70 || input.weakAreaCount >= 5,
  }));
}
