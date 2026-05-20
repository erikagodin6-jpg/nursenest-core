const CHECKPOINT_PREFIX = "session-checkpoint-";
const CHECKPOINT_INTERVAL = 30000;

export interface CheckpointData {
  sessionType: string;
  sessionId: string;
  currentIndex: number;
  answers: Record<string, any>;
  flagged?: string[];
  timeSpent: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

function getAuthHeaders(): Record<string, string> {
  try {
    const creds = localStorage.getItem("nursenest-credentials");
    if (creds) {
      const { username, password } = JSON.parse(creds);
      return { "x-username": username, "x-password": password };
    }
  } catch {}
  return {};
}

function getLocalKey(sessionType: string, sessionId: string): string {
  return `${CHECKPOINT_PREFIX}${sessionType}-${sessionId}`;
}

export function saveCheckpointLocal(data: CheckpointData): void {
  try {
    const key = getLocalKey(data.sessionType, data.sessionId);
    localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch {}
}

export function loadCheckpointLocal(sessionType: string, sessionId: string): CheckpointData | null {
  try {
    const key = getLocalKey(sessionType, sessionId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as CheckpointData;
    const age = Date.now() - (data.timestamp || 0);
    if (age > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearCheckpointLocal(sessionType: string, sessionId: string): void {
  try {
    localStorage.removeItem(getLocalKey(sessionType, sessionId));
  } catch {}
}

export async function saveCheckpointServer(data: CheckpointData): Promise<boolean> {
  try {
    const res = await fetch("/api/session-checkpoint/save", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        sessionType: data.sessionType,
        sessionId: data.sessionId,
        checkpointData: data,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loadCheckpointServer(sessionType: string, sessionId?: string): Promise<CheckpointData | null> {
  try {
    const params = new URLSearchParams({ sessionType });
    if (sessionId) params.set("sessionId", sessionId);
    const res = await fetch(`/api/session-checkpoint/restore?${params}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.found) return null;
    return data.checkpoint.checkpointData as CheckpointData;
  } catch {
    return null;
  }
}

export async function clearCheckpointServer(sessionType: string, sessionId: string): Promise<void> {
  try {
    await fetch("/api/session-checkpoint/clear", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ sessionType, sessionId }),
    });
  } catch {}
}

export async function getActiveCheckpoints(): Promise<{ sessionType: string; sessionId: string; updatedAt: string }[]> {
  try {
    const res = await fetch("/api/session-checkpoint/active", {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions || [];
  } catch {
    return [];
  }
}

export function findLocalCheckpoints(): CheckpointData[] {
  const results: CheckpointData[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CHECKPOINT_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const data = JSON.parse(raw) as CheckpointData;
          const age = Date.now() - (data.timestamp || 0);
          if (age <= 24 * 60 * 60 * 1000) {
            results.push(data);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch {}
  return results;
}

export function createCheckpointManager(sessionType: string, sessionId: string) {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let lastData: CheckpointData | null = null;

  function save(data: Omit<CheckpointData, "sessionType" | "sessionId" | "timestamp">) {
    const checkpoint: CheckpointData = {
      ...data,
      sessionType,
      sessionId,
      timestamp: Date.now(),
    };
    lastData = checkpoint;
    saveCheckpointLocal(checkpoint);
    saveCheckpointServer(checkpoint).catch(() => {});
  }

  function startAutoSave(getState: () => Omit<CheckpointData, "sessionType" | "sessionId" | "timestamp">) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      const state = getState();
      save(state);
    }, CHECKPOINT_INTERVAL);
  }

  function stopAutoSave() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  async function clear() {
    stopAutoSave();
    clearCheckpointLocal(sessionType, sessionId);
    await clearCheckpointServer(sessionType, sessionId);
  }

  async function restore(): Promise<CheckpointData | null> {
    const local = loadCheckpointLocal(sessionType, sessionId);
    const server = await loadCheckpointServer(sessionType, sessionId);

    if (local && server) {
      return (local.timestamp || 0) >= (server.timestamp || 0) ? local : server;
    }
    return local || server || null;
  }

  return { save, startAutoSave, stopAutoSave, clear, restore };
}
