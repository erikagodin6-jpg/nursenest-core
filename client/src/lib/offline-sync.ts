import { getUnsyncedProgress, markProgressSynced } from "./offline-store";

let syncInterval: ReturnType<typeof setInterval> | null = null;
let onlineListenerAdded = false;

export async function syncOfflineProgress(): Promise<{ synced: number; errors: number }> {
  const unsynced = await getUnsyncedProgress();
  if (unsynced.length === 0) return { synced: 0, errors: 0 };

  let synced = 0;
  let errors = 0;
  const syncedIds: string[] = [];

  const batches: typeof unsynced[] = [];
  for (let i = 0; i < unsynced.length; i += 50) {
    batches.push(unsynced.slice(i, i + 50));
  }

  for (const batch of batches) {
    try {
      const response = await fetch("/api/offline/sync-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progress: batch.map((p) => ({
            questionId: p.questionId,
            isCorrect: p.isCorrect,
            answeredAt: p.answeredAt,
          })),
        }),
      });

      if (response.ok) {
        syncedIds.push(...batch.map((b) => b.id));
        synced += batch.length;
      } else {
        errors += batch.length;
      }
    } catch {
      errors += batch.length;
    }
  }

  if (syncedIds.length > 0) {
    await markProgressSynced(syncedIds);
  }

  return { synced, errors };
}

const onlineHandler = async () => {
  try {
    await syncOfflineProgress();
  } catch (e) {
    console.error("Online sync error:", e);
  }
};

export function startAutoSync(intervalMs = 60000): void {
  if (syncInterval) return;

  syncInterval = setInterval(async () => {
    if (!navigator.onLine) return;
    try {
      await syncOfflineProgress();
    } catch (e) {
      console.error("Auto-sync error:", e);
    }
  }, intervalMs);

  if (!onlineListenerAdded) {
    window.addEventListener("online", onlineHandler);
    onlineListenerAdded = true;
  }
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  if (onlineListenerAdded) {
    window.removeEventListener("online", onlineHandler);
    onlineListenerAdded = false;
  }
}
