import {
  fundamentalsSystems,
  delegationSystems,
  clinicalScenariosSystems,
  medMathSystems,
  preNursingSystems,
  freeCardiovascularSystems,
  freeEndocrineSystems,
  freeGIRenalSystems,
  freeMusculoskeletalSystems,
  freeMaternalSystems,
  freeImmuneSystems,
  freeMentalHealthSystems,
  freeOncologySystems,
  freePharmacologySystems,
  rpnSystems,
  rnSystems,
  npSystems,
} from "@/data/lesson-systems";
import { canonicalDisplayName } from "@/lib/canonical-display";

type LessonNavItem = { id: string; name: string };
type LessonNavResult = {
  prev: LessonNavItem | null;
  next: LessonNavItem | null;
  systemTitle: string;
  systemId: string;
};

type TierSystems = typeof rpnSystems;

const alliedFoundationsSystems: TierSystems = [
  {
    id: "allied-foundations",
    title: "Allied Health Foundations",
    icon: null as any,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    diseases: [
      { id: "allied-human-anatomy", name: "Human Anatomy", status: "Available" },
      { id: "allied-human-physiology", name: "Human Physiology", status: "Available" },
      { id: "allied-medical-terminology", name: "Medical Terminology", status: "Available" },
      { id: "allied-pharmacology-basics", name: "Pharmacology Basics", status: "Available" },
      { id: "allied-patient-assessment", name: "Patient Assessment", status: "Available" },
      { id: "allied-infection-control", name: "Infection Control", status: "Available" },
      { id: "allied-medical-ethics", name: "Medical Ethics", status: "Available" },
      { id: "allied-clinical-documentation", name: "Clinical Documentation", status: "Available" },
      { id: "allied-vital-signs", name: "Vital Signs", status: "Available" },
      { id: "allied-emergency-response", name: "Emergency Response Basics", status: "Available" },
      { id: "allied-lab-values", name: "Lab Values", status: "Available" },
      { id: "allied-imaging-basics", name: "Imaging Basics", status: "Available" },
      { id: "allied-medication-safety", name: "Medication Safety", status: "Available" },
      { id: "allied-patient-communication", name: "Patient Communication", status: "Available" },
      { id: "allied-healthcare-teamwork", name: "Healthcare Teamwork", status: "Available" },
    ]
  }
];

const tierSystemGroups: { tier: string; systems: TierSystems }[] = [
  { tier: "free", systems: [...preNursingSystems, ...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...freeCardiovascularSystems, ...freeEndocrineSystems, ...freeGIRenalSystems, ...freeMusculoskeletalSystems, ...freeMaternalSystems, ...freeImmuneSystems, ...freeMentalHealthSystems, ...freeOncologySystems, ...freePharmacologySystems] as TierSystems },
  { tier: "rpn", systems: rpnSystems },
  { tier: "rn", systems: rnSystems },
  { tier: "np", systems: npSystems },
  { tier: "allied", systems: alliedFoundationsSystems },
];

let navMap: Map<string, LessonNavResult> | null = null;
let tierMap: Map<string, string> | null = null;

function flattenSystems(systems: TierSystems): { id: string; name: string; systemTitle: string; systemId: string }[] {
  const flat: { id: string; name: string; systemTitle: string; systemId: string }[] = [];
  for (const system of systems) {
    for (const lesson of system.diseases) {
      flat.push({ id: lesson.id, name: canonicalDisplayName(lesson.name), systemTitle: system.title, systemId: system.id });
    }
  }
  return flat;
}

function buildMaps(): void {
  if (navMap && tierMap) return;
  navMap = new Map();
  tierMap = new Map();

  for (const group of tierSystemGroups) {
    const allLessons = flattenSystems(group.systems);

    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      if (navMap.has(lesson.id)) continue;

      tierMap.set(lesson.id, group.tier);

      const prev = i > 0 ? { id: allLessons[i - 1].id, name: allLessons[i - 1].name } : null;
      const next = i < allLessons.length - 1 ? { id: allLessons[i + 1].id, name: allLessons[i + 1].name } : null;

      navMap.set(lesson.id, {
        prev,
        next,
        systemTitle: lesson.systemTitle,
        systemId: lesson.systemId,
      });
    }
  }
}

export function getLessonNavigation(lessonId: string): LessonNavResult | null {
  buildMaps();
  return navMap!.get(lessonId) || null;
}

export function getLessonTier(lessonId: string): string {
  buildMaps();
  return tierMap!.get(lessonId) || "rpn";
}
