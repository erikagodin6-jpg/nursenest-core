export function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleOptions(options: string[], correctAnswerIndex: number): { shuffledOptions: string[]; newCorrectIndex: number; permutation: number[] } {
  if (!options || options.length === 0) return { shuffledOptions: options, newCorrectIndex: correctAnswerIndex, permutation: [] };
  const indices = options.map((_, i) => i);
  const permutation = fisherYatesShuffle(indices);
  const shuffledOptions = permutation.map(i => options[i]);
  const newCorrectIndex = permutation.indexOf(correctAnswerIndex);
  return { shuffledOptions, newCorrectIndex, permutation };
}

export function weightedInterleaveShuffle<T>(items: T[], getWeight: (item: T) => number): T[] {
  const tiers: Map<number, T[]> = new Map();
  for (const item of items) {
    const w = getWeight(item);
    if (!tiers.has(w)) tiers.set(w, []);
    tiers.get(w)!.push(item);
  }

  const sortedWeights = Array.from(tiers.keys()).sort((a, b) => b - a);

  for (const w of sortedWeights) {
    tiers.set(w, fisherYatesShuffle(tiers.get(w)!));
  }

  const result: T[] = [];
  const tierArrays = sortedWeights.map(w => ({ items: tiers.get(w)!, idx: 0 }));

  while (tierArrays.some(t => t.idx < t.items.length)) {
    for (const tier of tierArrays) {
      if (tier.idx < tier.items.length) {
        result.push(tier.items[tier.idx]);
        tier.idx++;
      }
    }
  }

  return result;
}
