import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  CAREER_CONFIGS,
  CAREER_TYPES,
  getCareerBySlug,
  getEnabledCareers,
  type CareerType,
  type CareerConfig,
} from "@shared/careers";

interface CareerContextType {
  career: CareerConfig;
  careerType: CareerType;
  setCareer: (type: CareerType) => void;
  allCareers: CareerConfig[];
  isNursing: boolean;
  careerRoutePrefix: string;
}

const CareerContext = createContext<CareerContextType | null>(null);

const STORAGE_KEY = "nursenest-career";

const CAREER_SLUG_MAP: Record<string, CareerType> = {
  rrt: "rrt",
  paramedic: "paramedic",
  "pharmacy-tech": "pharmacyTech",
  mlt: "mlt",
  imaging: "imaging",
  "critical-care": "criticalCare",
  "emergency-nursing": "emergencyNursing",
  perioperative: "perioperative",
  "oncology-nursing": "oncologyNursing",
  "pediatric-cert": "pediatricCert",
  psychotherapist: "psychotherapist",
  "social-worker": "socialWorker",
  "addictions-counsellor": "addictionsCounsellor",
};

function detectCareerFromPath(path: string): CareerType | null {
  const segments = path.split("/").filter(Boolean);
  for (const seg of segments) {
    if (CAREER_SLUG_MAP[seg]) {
      return CAREER_SLUG_MAP[seg];
    }
  }
  return null;
}

export function CareerProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [careerType, setCareerType] = useState<CareerType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (CAREER_TYPES as readonly string[]).includes(stored)) {
      return stored as CareerType;
    }
    return "nursing";
  });

  useEffect(() => {
    const detected = detectCareerFromPath(window.location.pathname);
    if (detected && detected !== careerType) {
      setCareerType(detected);
      localStorage.setItem(STORAGE_KEY, detected);
    }
  }, [location]);

  const setCareer = (type: CareerType) => {
    setCareerType(type);
    localStorage.setItem(STORAGE_KEY, type);
  };

  const career = CAREER_CONFIGS[careerType];
  const allCareers = useMemo(() => getEnabledCareers(), []);
  const isNursing = careerType === "nursing";
  const careerRoutePrefix = career.routePrefix;

  return (
    <CareerContext.Provider
      value={{
        career,
        careerType,
        setCareer,
        allCareers,
        isNursing,
        careerRoutePrefix,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error("useCareer must be used within CareerProvider");
  return ctx;
}
