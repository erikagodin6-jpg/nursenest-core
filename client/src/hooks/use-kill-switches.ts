import { useState, useEffect, useCallback } from "react";

export interface KillSwitchConfig {
  exams: boolean;
  flashcards: boolean;
  lessons: boolean;
  downloads: boolean;
  cat: boolean;
  qbank: boolean;
  mockExams: boolean;
  [key: string]: boolean;
}

const DEFAULT_CONFIG: KillSwitchConfig = {
  exams: false,
  flashcards: false,
  lessons: false,
  downloads: false,
  cat: false,
  qbank: false,
  mockExams: false,
};

const CACHE_KEY = "nursenest-kill-switches";
const CACHE_TTL = 5 * 60 * 1000;

let globalCache: { config: KillSwitchConfig; fetchedAt: number } | null = null;

function loadFromStorage(): KillSwitchConfig | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt < CACHE_TTL) {
      return parsed.config;
    }
  } catch {}
  return null;
}

function saveToStorage(config: KillSwitchConfig) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ config, fetchedAt: Date.now() }));
  } catch {}
}

export function useKillSwitches(): {
  killSwitches: KillSwitchConfig;
  isFeatureKilled: (feature: string) => boolean;
  loading: boolean;
  refetch: () => void;
} {
  const [config, setConfig] = useState<KillSwitchConfig>(() => {
    if (globalCache && Date.now() - globalCache.fetchedAt < CACHE_TTL) {
      return globalCache.config;
    }
    return loadFromStorage() || DEFAULT_CONFIG;
  });
  const [loading, setLoading] = useState(!globalCache);

  const fetchKillSwitches = useCallback(async () => {
    try {
      const res = await fetch("/api/kill-switches", {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        const merged = { ...DEFAULT_CONFIG, ...data };
        globalCache = { config: merged, fetchedAt: Date.now() };
        saveToStorage(merged);
        setConfig(merged);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (globalCache && Date.now() - globalCache.fetchedAt < CACHE_TTL) {
      setLoading(false);
      return;
    }
    fetchKillSwitches();
  }, [fetchKillSwitches]);

  const isFeatureKilled = useCallback(
    (feature: string) => !!config[feature],
    [config]
  );

  return { killSwitches: config, isFeatureKilled, loading, refetch: fetchKillSwitches };
}
