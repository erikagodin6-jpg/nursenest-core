"use client";

import { useEffect, useMemo, useState } from "react";
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import {
  MEASUREMENT_PREFERENCE_COOKIE,
  MEASUREMENT_PREFERENCE_LOCAL_STORAGE_KEY,
  measurementSystemToPreference,
  parseMeasurementPreference,
  resolveMeasurementSystemPreference,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";

function readClientPreference(): MeasurementPreference | null {
  try {
    const local = parseMeasurementPreference(window.localStorage.getItem(MEASUREMENT_PREFERENCE_LOCAL_STORAGE_KEY));
    if (local) return local;
  } catch {}
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${MEASUREMENT_PREFERENCE_COOKIE}=([^;]+)`));
  return parseMeasurementPreference(match ? decodeURIComponent(match[1]) : null);
}

function persistClientPreference(preference: MeasurementPreference): void {
  try {
    window.localStorage.setItem(MEASUREMENT_PREFERENCE_LOCAL_STORAGE_KEY, preference);
  } catch {}
  document.cookie = `${MEASUREMENT_PREFERENCE_COOKIE}=${encodeURIComponent(preference)};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
}

export function useMeasurementPreference(
  fallbackSystem: MeasurementSystem,
  initialPreference?: MeasurementPreference | null,
) {
  const [preference, setPreferenceState] = useState<MeasurementPreference>(() => initialPreference ?? measurementSystemToPreference(fallbackSystem));

  useEffect(() => {
    const clientPreference = readClientPreference();
    if (clientPreference) {
      setPreferenceState(clientPreference);
      return;
    }
    if (initialPreference) {
      persistClientPreference(initialPreference);
    }
  }, [initialPreference]);

  const measurementSystem = useMemo(
    () => resolveMeasurementSystemPreference(fallbackSystem, preference),
    [fallbackSystem, preference],
  );

  function setPreference(next: MeasurementPreference) {
    setPreferenceState(next);
    persistClientPreference(next);
  }

  return { preference, measurementSystem, setPreference };
}
