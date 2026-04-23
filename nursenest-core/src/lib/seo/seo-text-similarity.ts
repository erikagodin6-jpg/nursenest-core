/** Sørensen–Dice coefficient on character bigrams (cheap fuzzy similarity). */
export function stringSimilarityDice(a: string, b: string): number {
  const x = a
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const y = b
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!x.length && !y.length) return 1;
  if (!x.length || !y.length) return 0;
  if (x === y) return 1;
  const bigrams = (s: string): Map<string, number> => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const A = bigrams(x);
  const B = bigrams(y);
  let inter = 0;
  for (const [g, n] of A) {
    const o = B.get(g) ?? 0;
    if (o > 0) inter += Math.min(n, o);
  }
  const sumA = [...A.values()].reduce((s, v) => s + v, 0);
  const sumB = [...B.values()].reduce((s, v) => s + v, 0);
  if (sumA + sumB === 0) return x === y ? 1 : 0;
  return (2 * inter) / (sumA + sumB);
}
