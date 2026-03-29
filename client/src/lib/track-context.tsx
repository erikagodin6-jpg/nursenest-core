import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type MarketingTrack, resolveTrackFromParams } from "@/config/marketing-copy";
import { useAuth } from "@/lib/auth";

const TRACK_STORAGE_KEY = "nursenest-preferred-track";

interface TrackContextValue {
  track: MarketingTrack;
  setTrack: (track: MarketingTrack) => void;
  hasExplicitTrack: boolean;
}

const TrackContext = createContext<TrackContextValue>({
  track: "general",
  setTrack: () => {},
  hasExplicitTrack: false,
});

export function TrackProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [explicitTrack, setExplicitTrack] = useState<MarketingTrack | null>(() => {
    try {
      const stored = localStorage.getItem(TRACK_STORAGE_KEY);
      if (stored && ["rpn", "rn", "np"].includes(stored)) return stored as MarketingTrack;
    } catch {}
    return null;
  });

  const resolvedTrack = resolveTrackFromParams({
    urlTrack: undefined,
    userTier: user?.tier,
    storedTrack: explicitTrack || undefined,
  });

  const setTrack = useCallback((newTrack: MarketingTrack) => {
    setExplicitTrack(newTrack);
    try {
      if (newTrack === "general") {
        localStorage.removeItem(TRACK_STORAGE_KEY);
      } else {
        localStorage.setItem(TRACK_STORAGE_KEY, newTrack);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (user?.tier && ["rpn", "rn", "np"].includes(user.tier) && !explicitTrack) {
      setExplicitTrack(user.tier as MarketingTrack);
    }
  }, [user?.tier, explicitTrack]);

  return (
    <TrackContext.Provider value={{ track: resolvedTrack, setTrack, hasExplicitTrack: !!explicitTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  return useContext(TrackContext);
}
