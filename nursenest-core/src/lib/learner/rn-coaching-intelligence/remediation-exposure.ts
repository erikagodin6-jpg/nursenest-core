export type RemediationExposureEntry = {
  exposureKey: string;
  kind: string;
  href: string;
  at: string;
  completed?: boolean;
};

function storageKey(userId: string) {
  return `nn_remediation_exposure_v1_${userId}`;
}

function readStore(userId: string): { entries: RemediationExposureEntry[] } {
  try {
    if (typeof window === "undefined" || !window.localStorage) return { entries: [] };
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as { entries: RemediationExposureEntry[] };
    return Array.isArray(parsed.entries) ? parsed : { entries: [] };
  } catch {
    return { entries: [] };
  }
}

export function countRemediationExposures(userId: string): number {
  return readStore(userId).entries.length;
}

export function recordRemediationExposure(
  userId: string,
  entry: Omit<RemediationExposureEntry, "at"> & { at?: string },
): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const store = readStore(userId);
    store.entries.push({ ...entry, at: entry.at ?? new Date().toISOString() });
    store.entries = store.entries.slice(-120);
    window.localStorage.setItem(storageKey(userId), JSON.stringify(store));
  } catch {
    /* quota */
  }
}

export function countExposureForKey(userId: string, exposureKey: string): number {
  const norm = exposureKey.trim().toLowerCase();
  return readStore(userId).entries.filter((e) => e.exposureKey.toLowerCase() === norm).length;
}

export function wasRecentlyExposed(userId: string, exposureKey: string, withinHours = 48): boolean {
  const norm = exposureKey.trim().toLowerCase();
  const cutoff = Date.now() - withinHours * 3600000;
  return readStore(userId).entries.some(
    (e) => e.exposureKey.toLowerCase() === norm && Date.parse(e.at) >= cutoff,
  );
}
