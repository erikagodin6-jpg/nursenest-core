"use client";

import { useCallback, useEffect, useState } from "react";

export type NursenestRegion = "US" | "CA";

const STORAGE_KEY = "nursenest-region";
const CHANGE_EVENT = "regionChange";

function readRegion(): NursenestRegion {
  try {
    const r = localStorage.getItem(STORAGE_KEY) as NursenestRegion | null;
    return r === "CA" || r === "US" ? r : "US";
  } catch {
    return "US";
  }
}

/** Shared Canada/U.S. preference (legacy-compatible). */
export function useNursenestRegion() {
  const [region, setRegionState] = useState<NursenestRegion>("US");

  useEffect(() => {
    setRegionState(readRegion());
  }, []);

  useEffect(() => {
    const handler = () => setRegionState(readRegion());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const setRegion = useCallback((next: NursenestRegion) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      /* ignore */
    }
    setRegionState(next);
  }, []);

  return { region, setRegion };
}
