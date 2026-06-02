"use client";

/**
 * Phase 2 — Progress Protection
 * IndexedDB-backed progress queue that accumulates events when the backend is
 * unavailable and syncs them automatically when connectivity is restored.
 *
 * Covers: lesson completion, flashcard mastery, question history, confidence
 * ratings, adaptive learning data, CAT results, clinical skills progress.
 */

const DB_NAME = "nursenest-progress-v2";
const DB_VERSION = 2;
const STORE_QUEUE = "progress_queue";
const STORE_SNAPSHOTS = "session_snapshots";

export type ProgressEventType =
  | "lesson_complete"
  | "flashcard_mastery"
  | "question_answered"
  | "confidence_rating"
  | "cat_result"
  | "clinical_skill_complete"
  | "pharmacology_progress"
  | "ecg_progress"
  | "adaptive_signal"
  | "study_session_end";

export interface ProgressEvent {
  id: string;
  type: ProgressEventType;
  userId: string;
  payload: Record<string, unknown>;
  createdAt: number;
  retries: number;
  synced: boolean;
  lastError?: string;
}

function openProgressDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        const qs = db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
        qs.createIndex("synced", "synced", { unique: false });
        qs.createIndex("userId", "userId", { unique: false });
        qs.createIndex("createdAt", "createdAt", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        const ss = db.createObjectStore(STORE_SNAPSHOTS, { keyPath: "key" });
        ss.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };
  });
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function enqueueProgressEvent(
  type: ProgressEventType,
  userId: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openProgressDB();
    const event: ProgressEvent = {
      id: generateId(),
      type,
      userId,
      payload,
      createdAt: Date.now(),
      retries: 0,
      synced: false,
    };
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      tx.objectStore(STORE_QUEUE).put(event);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn("[ProgressSync] Enqueue failed:", e);
  }
}

export async function getPendingProgressEvents(userId: string): Promise<ProgressEvent[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await openProgressDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readonly");
      const idx = tx.objectStore(STORE_QUEUE).index("synced");
      const req = idx.getAll(IDBKeyRange.only(false));
      req.onsuccess = () => resolve((req.result as ProgressEvent[]).filter((e) => e.userId === userId));
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function markProgressEventSynced(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openProgressDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const event = getReq.result as ProgressEvent;
        if (event) {
          event.synced = true;
          store.put(event);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch {}
}

export async function incrementRetry(id: string, error: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openProgressDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const event = getReq.result as ProgressEvent;
        if (event) {
          event.retries += 1;
          event.lastError = error;
          store.put(event);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  } catch {}
}

export async function pruneOldSyncedEvents(olderThanMs = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const db = await openProgressDB();
    const cutoff = Date.now() - olderThanMs;
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, "readwrite");
      const store = tx.objectStore(STORE_QUEUE);
      const idx = store.index("createdAt");
      const range = IDBKeyRange.upperBound(cutoff);
      const req = idx.openCursor(range);
      req.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) { resolve(); return; }
        const e = cursor.value as ProgressEvent;
        if (e.synced) cursor.delete();
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

const SYNC_API_ENDPOINT = "/api/progress/sync-batch";
const MAX_RETRIES = 5;
let syncInProgress = false;

export async function syncProgressQueue(userId: string): Promise<{ synced: number; failed: number }> {
  if (typeof window === "undefined" || syncInProgress) return { synced: 0, failed: 0 };
  syncInProgress = true;
  let synced = 0;
  let failed = 0;

  try {
    const pending = await getPendingProgressEvents(userId);
    if (!pending.length) return { synced: 0, failed: 0 };

    const batch = pending.filter((e) => e.retries < MAX_RETRIES).slice(0, 50);

    const response = await fetch(SYNC_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const result = await response.json();
      const syncedIds: string[] = result.syncedIds || batch.map((e) => e.id);
      await Promise.all(syncedIds.map((id) => markProgressEventSynced(id)));
      synced = syncedIds.length;
    } else {
      await Promise.all(batch.map((e) => incrementRetry(e.id, `HTTP ${response.status}`)));
      failed = batch.length;
    }
  } catch (e: any) {
    failed = 1;
  } finally {
    syncInProgress = false;
    await pruneOldSyncedEvents();
  }

  return { synced, failed };
}

export function setupProgressSyncListeners(userId: string): () => void {
  if (typeof window === "undefined") return () => {};

  const onOnline = () => syncProgressQueue(userId).catch(() => {});
  const onCustomSync = () => syncProgressQueue(userId).catch(() => {});

  window.addEventListener("online", onOnline);
  window.addEventListener("nursenest:progress-sync", onCustomSync);

  // Periodic sync every 2 minutes when online
  const interval = setInterval(() => {
    if (navigator.onLine) syncProgressQueue(userId).catch(() => {});
  }, 2 * 60 * 1000);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("nursenest:progress-sync", onCustomSync);
    clearInterval(interval);
  };
}
