/** FNV-1a + xorshift32 — deterministic from opaque session salt strings (no crypto dependency). */

export function hashSeedToUint32(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  let state = h >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return state;
}

function nextUnitFloat(state: { s: number }): number {
  let x = state.s;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  state.s = x >>> 0;
  return (x >>> 0) / 0xffffffff;
}

/** Uniform index in `[0, span)` from `seed` (stable for the same seed). */
export function seededIndexInRange(seed: string, span: number): number {
  if (span <= 0) return 0;
  const state = { s: hashSeedToUint32(seed) };
  return Math.floor(nextUnitFloat(state) * span);
}

export function shuffleSeeded<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  const state = { s: hashSeedToUint32(seed) };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(nextUnitFloat(state) * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
