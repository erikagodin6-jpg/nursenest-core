import type { ComponentType } from "react";
import { ATPPathwayModule } from "@/content/pre-nursing/modules/pre-nursing-atp-pathway";
import { AnatomyPhysiologyModule } from "@/content/pre-nursing/modules/pre-nursing-anatomy";
import { ChemistryModule } from "@/content/pre-nursing/modules/pre-nursing-chemistry";
import { CommunicationModule } from "@/content/pre-nursing/modules/pre-nursing-communication";
import { CulturalCompetencyModule } from "@/content/pre-nursing/modules/pre-nursing-cultural-competency";
import { CellularInjuryModule } from "@/content/pre-nursing/modules/pre-nursing-cellular-injury";
import { DiagnosticsModule } from "@/content/pre-nursing/modules/pre-nursing-diagnostics";
import { EthicsLegalModule } from "@/content/pre-nursing/modules/pre-nursing-ethics-legal";
import { FluidsElectrolytesModule } from "@/content/pre-nursing/modules/pre-nursing-fluids-electrolytes";
import { HealthAssessmentModule } from "@/content/pre-nursing/modules/pre-nursing-health-assessment";
import { HealthcareStructureModule } from "@/content/pre-nursing/modules/pre-nursing-healthcare-structure";
import { HumanFactorsModule } from "@/content/pre-nursing/modules/pre-nursing-human-factors";
import { InfectionControlModule } from "@/content/pre-nursing/modules/pre-nursing-infection-control";
import { InflammationModule } from "@/content/pre-nursing/modules/pre-nursing-inflammation";
import { MedicalTerminologyModule } from "@/content/pre-nursing/modules/pre-nursing-terminology";
import { MicrobiologyModule } from "@/content/pre-nursing/modules/pre-nursing-microbiology";
import { NutritionFoundationsModule } from "@/content/pre-nursing/modules/pre-nursing-nutrition-foundations";
import { OxygenationModule } from "@/content/pre-nursing/modules/pre-nursing-oxygenation";
import { ResearchReadingModule } from "@/content/pre-nursing/modules/pre-nursing-research-reading";
import { ResearchStatisticsModule } from "@/content/pre-nursing/modules/pre-nursing-research";
import { ScienceFoundationsModule } from "@/content/pre-nursing/modules/pre-nursing-science";
import { StudyStrategiesModule } from "@/content/pre-nursing/modules/pre-nursing-study-strategies";
import {
  CellBiologyModule,
  PathophysiologyModule,
  PharmacologyModule,
  PhysiologyModule,
  TerminologyModule,
} from "@/content/pre-nursing/pre-nursing-inline-modules";

const MAP: Record<string, ComponentType> = {
  "study-strategies": StudyStrategiesModule,
  terminology: TerminologyModule,
  "medical-terminology": MedicalTerminologyModule,
  chemistry: ChemistryModule,
  "cell-biology": CellBiologyModule,
  "science-foundations": ScienceFoundationsModule,
  microbiology: MicrobiologyModule,
  "anatomy-physiology": AnatomyPhysiologyModule,
  physiology: PhysiologyModule,
  pathophysiology: PathophysiologyModule,
  "infection-control": InfectionControlModule,
  "fluids-electrolytes": FluidsElectrolytesModule,
  pharmacology: PharmacologyModule,
  communication: CommunicationModule,
  "ethics-legal": EthicsLegalModule,
  "research-statistics": ResearchStatisticsModule,
  "health-assessment": HealthAssessmentModule,
  "nutrition-foundations": NutritionFoundationsModule,
  "cultural-competency": CulturalCompetencyModule,
  inflammation: InflammationModule,
  "cellular-injury": CellularInjuryModule,
  oxygenation: OxygenationModule,
  diagnostics: DiagnosticsModule,
  "healthcare-structure": HealthcareStructureModule,
  "research-reading": ResearchReadingModule,
  "human-factors": HumanFactorsModule,
  "atp-pathway": ATPPathwayModule,
};

export function getPreNursingModuleComponent(slug: string): ComponentType | null {
  return MAP[slug] ?? null;
}

export const PRE_NURSING_SLUGS = Object.keys(MAP) as (keyof typeof MAP)[];
