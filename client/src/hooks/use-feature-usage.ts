import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";

const DAILY_LIMIT = 10;

interface UsageState {
  count: number;
  limit: number;
  hasUnlimited: boolean;
  isLoading: boolean;
  isLocked: boolean;
  remaining: number;
}

export function useFeatureUsage(feature: string) {
  const { user } = useAuth();
  const [state, setState] = useState<UsageState>({
    count: 0,
    limit: DAILY_LIMIT,
    hasUnlimited: false,
    isLoading: true,
    isLocked: false,
    remaining: DAILY_LIMIT,
  });

  const localKey = `nursenest-usage-${feature}`;

  const getLocalUsage = useCallback((): number => {
    try {
      const stored = localStorage.getItem(localKey);
      if (!stored) return 0;
      const data = JSON.parse(stored);
      const today = new Date().toISOString().slice(0, 10);
      if (data.date !== today) return 0;
      return data.count || 0;
    } catch {
      return 0;
    }
  }, [localKey]);

  const setLocalUsage = useCallback((count: number) => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(localKey, JSON.stringify({ date: today, count }));
  }, [localKey]);

  useEffect(() => {
    async function fetchUsage() {
      if (user) {
        try {
          const res = await fetch(`/api/feature-usage/${user.id}/${feature}`);
          if (res.ok) {
            const data = await res.json();
            setState({
              count: data.count,
              limit: data.limit,
              hasUnlimited: data.hasUnlimited,
              isLoading: false,
              isLocked: !data.hasUnlimited && data.count >= data.limit,
              remaining: Math.max(0, data.limit - data.count),
            });
            return;
          }
        } catch {}
      }
      const localCount = getLocalUsage();
      setState({
        count: localCount,
        limit: DAILY_LIMIT,
        hasUnlimited: false,
        isLoading: false,
        isLocked: localCount >= DAILY_LIMIT,
        remaining: Math.max(0, DAILY_LIMIT - localCount),
      });
    }
    fetchUsage();
  }, [user, feature, getLocalUsage]);

  const recordUsage = useCallback(async (): Promise<boolean> => {
    if (state.hasUnlimited) return true;

    if (user) {
      try {
        const res = await fetch(`/api/feature-usage/${user.id}/${feature}/increment`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (data.hasUnlimited) return true;
          const newCount = data.count;
          setState((prev) => ({
            ...prev,
            count: newCount,
            isLocked: newCount >= prev.limit,
            remaining: Math.max(0, prev.limit - newCount),
          }));
          return newCount <= DAILY_LIMIT;
        }
      } catch {}
    }

    const newCount = getLocalUsage() + 1;
    setLocalUsage(newCount);
    setState((prev) => ({
      ...prev,
      count: newCount,
      isLocked: newCount >= DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - newCount),
    }));
    return newCount <= DAILY_LIMIT;
  }, [user, feature, state.hasUnlimited, getLocalUsage, setLocalUsage]);

  return { ...state, recordUsage };
}
