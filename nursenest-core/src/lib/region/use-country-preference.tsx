"use client";

/**
 * Country preference context — wraps the 5-country selection and derives NursenestRegion.
 *
 * Hierarchy:
 *   1. Authenticated user profile (most trusted)
 *   2. Cookie `nn_country_preference`
 *   3. localStorage `nn_country_preference`
 *   4. Inferred from existing `NursenestRegion` ("CA" → "canada", "US" → "us")
 *   5. Default: "us"
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type CountryPreference,
  COUNTRY_CONFIGS,
  COUNTRY_PREFERENCE_OPTIONS,
  countryPreferenceToNursenestRegion,
  parseCountryPreference,
  persistCountryPreference,
  resolveClientCountryPreference,
} from "@/lib/region/country-preference";
import { useNursenestRegion, type NursenestRegion } from "@/lib/region/use-nursenest-region";

export type { CountryPreference };

const DEFAULT_COUNTRY: CountryPreference = "us";
const CHANGE_EVENT = "countryPreferenceChange";

/** Infer the initial country from an existing legacy NursenestRegion value when no explicit pref exists. */
function inferCountryFromRegion(region: NursenestRegion): CountryPreference {
  return region === "CA" ? "canada" : "us";
}

type CountryPreferenceContextValue = {
  country: CountryPreference;
  setCountry: (next: CountryPreference) => void;
};

const CountryPreferenceContext = createContext<CountryPreferenceContextValue | null>(null);

/**
 * Wrap anywhere `useCountryPreference` is needed — in practice this is placed inside
 * `NursenestRegionRoot` so both hooks coexist in the same tree.
 */
export function CountryPreferenceRoot({
  /** Initial value from the server (cookie-read by the layout). Pass null to let the client resolve. */
  serverCountry,
  children,
}: {
  serverCountry: CountryPreference | null;
  children: ReactNode;
}) {
  const { region, setRegion } = useNursenestRegion();

  const [country, setCountryState] = useState<CountryPreference>(() => {
    // SSR: use the server-supplied value if available.
    if (serverCountry) return serverCountry;
    return inferCountryFromRegion(region);
  });

  // On mount: reconcile with client-side stored preference.
  useEffect(() => {
    const clientPref = resolveClientCountryPreference();
    if (clientPref) {
      setCountryState(clientPref);
      // Sync the underlying NursenestRegion if it drifted.
      const derivedRegion = countryPreferenceToNursenestRegion(clientPref);
      if (derivedRegion !== region) setRegion(derivedRegion);
    } else if (serverCountry) {
      setCountryState(serverCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab sync.
  useEffect(() => {
    const handler = () => {
      const pref = resolveClientCountryPreference();
      if (pref) setCountryState(pref);
    };
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setCountry = useCallback(
    (next: CountryPreference) => {
      setCountryState(next);
      persistCountryPreference(next);
      // Drive the binary NursenestRegion so exam routing stays aligned.
      setRegion(countryPreferenceToNursenestRegion(next));
      try {
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        /* ignore */
      }
    },
    [setRegion],
  );

  const value = useMemo(() => ({ country, setCountry }), [country, setCountry]);

  return (
    <CountryPreferenceContext.Provider value={value}>
      {children}
    </CountryPreferenceContext.Provider>
  );
}

export function useCountryPreference(): CountryPreferenceContextValue {
  const ctx = useContext(CountryPreferenceContext);
  if (!ctx) {
    // Graceful fallback when rendered outside the provider (e.g. storybook / isolated tests).
    return { country: DEFAULT_COUNTRY, setCountry: () => {} };
  }
  return ctx;
}

// Re-export helpers so consumers don't need to import from both files.
export { COUNTRY_CONFIGS, COUNTRY_PREFERENCE_OPTIONS, parseCountryPreference };
