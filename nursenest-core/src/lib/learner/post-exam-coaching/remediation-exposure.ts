/**
 * Client-side remediation exposure ledger — rotates recommendations without DB schema changes.
 */

export type RemediationExposureEntry = {
  exposureKey: string;
  kind: string;
  href: string;
  at: string;
  completed?: boolean;
};

type ExposureStore = { entries: RemediationExposureEntry[] };

function storageKey(userId: string) {
  return `nn_remediation_exposure_v1_${userId}`;
}

function readStore(userId: string): ExposureStore {
  try {
    if (typeof window === "undefined" || !window.localStorage) return { entries: [] };
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as ExposureStore;
    return Array.isArray(parsed.entries) ? parsed : { entries: [] };
  } catch {
    return { entries: [] };
  }
}

function writeStore(userId: string, store: ExposureStore): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    store.entries = store.entries.slice(-120);
    window.localStorage.setItem(storageKey(userId), JSON.stringify(store));
  } catch {
    /* quota */
  }
}

export function recordRemediationExposure(
  userId: string,
  entry: Omit<RemediationExposureEntry, "at"> & { at?: string },
): void {
  const store = readStore(userId);
  store.entries.push({
    ...entry,
    at: entry.at ?? new Date().toISOString(),
  });
  writeStore(userId, store);
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
