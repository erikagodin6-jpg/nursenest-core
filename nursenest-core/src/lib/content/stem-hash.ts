/** Deterministic short hash for duplicate stem detection (not cryptographic). */
export function stemHash(stem: string): string {
  const s = stem.trim().toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(16)}`;
}
