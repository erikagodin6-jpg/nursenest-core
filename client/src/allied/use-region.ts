import { useState, useCallback } from "react";
import {
  type Region,
  getRegionConfig as getConfig,
  type RegionExamConfig,
  type LegalModule,
  convertLabValue as convertLab,
  getLabReference,
  getLabUnit,
  LAB_CONVERSIONS,
} from "@shared/region-config";

const STORAGE_KEY = "allied-region";

function getStoredRegion(): Region {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "US" || stored === "CA") return stored;
  } catch {}
  return "US";
}

export function useRegion() {
  const [region, setRegionState] = useState<Region>(getStoredRegion);

  const setRegion = useCallback((newRegion: Region) => {
    setRegionState(newRegion);
    try {
      localStorage.setItem(STORAGE_KEY, newRegion);
    } catch {}
  }, []);

  const getRegionConfig = useCallback(
    (careerSlug: string): RegionExamConfig | null => {
      return getConfig(careerSlug, region);
    },
    [region]
  );

  const getLegalModules = useCallback(
    (careerSlug: string): LegalModule[] => {
      const config = getConfig(careerSlug, region);
      return config?.legalModules || [];
    },
    [region]
  );

  const convertLabForRegion = useCallback(
    (value: number, labKey: string) => {
      return convertLab(value, labKey, region);
    },
    [region]
  );

  const getLabRef = useCallback(
    (labKey: string) => {
      return getLabReference(labKey, region);
    },
    [region]
  );

  const getUnit = useCallback(
    (labKey: string) => {
      return getLabUnit(labKey, region);
    },
    [region]
  );

  return {
    region,
    setRegion,
    getRegionConfig,
    getLegalModules,
    convertLab: convertLabForRegion,
    getLabRef,
    getUnit,
    labConversions: LAB_CONVERSIONS,
    isUS: region === "US",
    isCA: region === "CA",
    regionLabel: region === "US" ? "United States" : "Canada",
  };
}
