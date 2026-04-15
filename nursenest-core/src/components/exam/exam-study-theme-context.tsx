"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/** Session-only study theme override (scoped via `data-theme` on exam shells). */
export const EXAM_STUDY_THEME_STORAGE_KEY = "nn-exam-study-theme";

const THEME_EVENT = "nn-exam-study-theme-change";

function readSessionThemeFromStorage(): string | null {
  try {
    const v = localStorage.getItem(EXAM_STUDY_THEME_STORAGE_KEY);
    if (v && v !== "inherit" && v.length > 0) return v;
  } catch {
    /* ignore */
  }
  return null;
}

function subscribeSessionTheme(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === EXAM_STUDY_THEME_STORAGE_KEY || e.key === null) onChange();
  };
  const onCustom = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onCustom);
  };
}

export type ExamStudyThemeContextValue = {
  sessionTheme: string | null;
  setSessionTheme: (id: string | null) => void;
  themePickerOpen: boolean;
  setThemePickerOpen: (open: boolean) => void;
  /** Bumps when the picker opens so the modal can remount a fresh preview selection. */
  themePickerNonce: number;
};

const ExamStudyThemeContext = createContext<ExamStudyThemeContextValue | null>(null);

export function ExamStudyThemeProvider({ children }: { children: ReactNode }) {
  const sessionTheme = useSyncExternalStore(
    subscribeSessionTheme,
    readSessionThemeFromStorage,
    () => null,
  );

  const [themePickerOpen, setThemePickerOpenState] = useState(false);
  const [themePickerNonce, setThemePickerNonce] = useState(0);

  const setSessionTheme = useCallback((id: string | null) => {
    try {
      if (id == null) localStorage.removeItem(EXAM_STUDY_THEME_STORAGE_KEY);
      else localStorage.setItem(EXAM_STUDY_THEME_STORAGE_KEY, id);
      window.dispatchEvent(new Event(THEME_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  const setThemePickerOpen = useCallback((open: boolean) => {
    setThemePickerOpenState(open);
    if (open) setThemePickerNonce((n) => n + 1);
  }, []);

  const value = useMemo(
    (): ExamStudyThemeContextValue => ({
      sessionTheme,
      setSessionTheme,
      themePickerOpen,
      setThemePickerOpen,
      themePickerNonce,
    }),
    [sessionTheme, setSessionTheme, themePickerOpen, setThemePickerOpen, themePickerNonce],
  );

  return (
    <ExamStudyThemeContext.Provider value={value}>{children}</ExamStudyThemeContext.Provider>
  );
}

export function useExamStudyTheme(): ExamStudyThemeContextValue {
  const v = useContext(ExamStudyThemeContext);
  if (!v) {
    throw new Error("useExamStudyTheme must be used within ExamStudyThemeProvider");
  }
  return v;
}

export function useExamStudyThemeOptional(): ExamStudyThemeContextValue | null {
  return useContext(ExamStudyThemeContext);
}
