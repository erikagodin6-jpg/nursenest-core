"use client";

import { useCallback, useEffect, useState } from "react";
import { MARKETING_REGION_COOKIE } from "@/lib/region/marketing-region-cookie";

export type NursenestRegion = "US" | "CA";

const STORAGE_KEY = "nursenest-region";
const CHANGE_EVENT = "regionChange";
const REGION_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 400;

function writeRegionCookie(next: NursenestRegion) {
  try {
    document.cookie = `${MARKETING_REGION_COOKIE}=${next};path=/;max-age=${REGION_COOKIE_MAX_AGE_SEC};SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

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
    const initial = readRegion();
    setRegionState(initial);
    writeRegionCookie(initial);
  }, []);

  useEffect(() => {
    const handler = () => setRegionState(readRegion());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  const setRegion = useCallback((next: NursenestRegion) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
      writeRegionCookie(next);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      /* ignore */
    }
    setRegionState(next);
  }, []);

  return { region, setRegion };
}
