"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MARKETING_REGION_COOKIE } from "@/lib/region/marketing-region-cookie";

export type NursenestRegion = "US" | "CA";

const STORAGE_KEY = "nursenest-region";
const CHANGE_EVENT = "regionChange";
const REGION_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 400;

type RegionContextValue = { region: NursenestRegion; setRegion: (next: NursenestRegion) => void };

const NursenestRegionContext = createContext<RegionContextValue | null>(null);

function writeRegionCookie(next: NursenestRegion) {
  try {
    document.cookie = `${MARKETING_REGION_COOKIE}=${next};path=/;max-age=${REGION_COOKIE_MAX_AGE_SEC};SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

function readLocalStorageRegion(): NursenestRegion | null {
  try {
    const r = localStorage.getItem(STORAGE_KEY) as NursenestRegion | null;
    return r === "CA" || r === "US" ? r : null;
  } catch {
    return null;
  }
}

/**
 * Wrap marketing chrome + pages. `serverRegion` comes from the marketing layout (cookie-aware).
 *
 * When `trustClientPersistedRegion` is false, the client must not override `serverRegion` with
 * `localStorage` — used on unprefixed marketing where no `nn_marketing_region` cookie means a
 * Canada-first default (stale `nursenest-region` US would otherwise win after hydration).
 */
export function NursenestRegionRoot({
  serverRegion,
  trustClientPersistedRegion = true,
  children,
}: {
  serverRegion: NursenestRegion;
  /** When false, ignore `localStorage` for region and sync storage + cookie from `serverRegion`. */
  trustClientPersistedRegion?: boolean;
  children: ReactNode;
}) {
  const [region, setRegionState] = useState<NursenestRegion>(serverRegion);

  useEffect(() => {
    if (!trustClientPersistedRegion) {
      setRegionState(serverRegion);
      writeRegionCookie(serverRegion);
      try {
        localStorage.setItem(STORAGE_KEY, serverRegion);
      } catch {
        /* ignore */
      }
      return;
    }
    const ls = readLocalStorageRegion();
    if (ls) {
      setRegionState(ls);
      writeRegionCookie(ls);
      return;
    }
    setRegionState(serverRegion);
    writeRegionCookie(serverRegion);
  }, [serverRegion, trustClientPersistedRegion]);

  useEffect(() => {
    if (!trustClientPersistedRegion) return;
    const handler = () => {
      const ls = readLocalStorageRegion();
      if (ls) setRegionState(ls);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, [trustClientPersistedRegion]);

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

  const value = useMemo(() => ({ region, setRegion }), [region, setRegion]);

  return <NursenestRegionContext.Provider value={value}>{children}</NursenestRegionContext.Provider>;
}

export function useNursenestRegion(): RegionContextValue {
  const ctx = useContext(NursenestRegionContext);
  if (!ctx) {
    throw new Error("useNursenestRegion must be used within NursenestRegionRoot");
  }
  return ctx;
}
