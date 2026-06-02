"use client";

/**
 * Lesson active recall context.
 *
 * Provides a lesson-scoped toggle for showing or hiding all recall blocks.
 * Persists preference in localStorage so the user's choice carries across sessions.
 *
 * Pattern: wrap the lesson sections with <LessonRecallProvider>; recall components
 * use useLessonRecall() to read the enabled state and adjust their rendering.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "nn-lesson-recall";

type LessonRecallContextValue = {
  /** Whether interactive recall blocks are currently visible. */
  enabled: boolean;
  /** Toggle recall blocks on/off and persist the preference. */
  toggle: () => void;
};

const LessonRecallContext = createContext<LessonRecallContextValue>({
  enabled: true,
  toggle: () => {},
});

export function LessonRecallProvider({ children }: { children: ReactNode }) {
  // Default to enabled so SSR and first paint are consistent.
  // localStorage read happens client-side in useEffect to avoid hydration mismatch.
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "off") setEnabled(false);
    } catch {
      // localStorage unavailable (e.g. private browsing with strict settings) — ignore.
    }
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <LessonRecallContext.Provider value={{ enabled, toggle }}>
      {children}
    </LessonRecallContext.Provider>
  );
}

export function useLessonRecall(): LessonRecallContextValue {
  return useContext(LessonRecallContext);
}
