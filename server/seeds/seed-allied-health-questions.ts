import type { Pool } from "pg";
import path from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { logStartupDatabaseResolution } from "../db";

interface CareerQuestionInput {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  difficulty: number;
  category: string;
  topic: string;
}

interface SeedConfig {
  careerType: string;
  examTag?: string;
  importFn: () => Promise<CareerQuestionInput[]>;
}

function careerQuestionJsonPath(stem: string): string {
  return path.resolve(process.cwd(), "data", "career-questions", `${stem}.json`);
}

/**
 * Loads question arrays from `data/career-questions/<stem>.json` for each stem.
 * Missing files are skipped; non-empty arrays are concatenated. Returns null only
 * when no JSON file in the list contributed any questions (falls back to TS modules).
 */
async function tryLoadCareerQuestionsFromJson(stems: string[]): Promise<CareerQuestionInput[] | null> {
  const out: CareerQuestionInput[] = [];
  let loadedAny = false;

  for (const stem of stems) {
    const jsonPath = careerQuestionJsonPath(stem);
    if (!existsSync(jsonPath)) continue;
    const raw = await readFile(jsonPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) continue;
    out.push(...parsed);
    loadedAny = true;
  }

  return loadedAny ? out : null;
}

const SEED_CONFIGS: SeedConfig[] = [
  {
    careerType: "occupationalTherapy",
    examTag: "NBCOT COTA",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson(["ota-questions", "ota-questions-expansion"]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/ota-questions").then(m => m.otaQuestions),
        import("../../client/src/data/career-questions/ota-questions-expansion").then(m => m.otaQuestionsExpansion),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "occupationalTherapyAssistant",
    examTag: "NBCOT COTA",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "ota-questions",
        "ota-questions-batch2",
        "ota-questions-batch3",
        "ota-questions-batch4",
        "ota-questions-batch5",
        "ota-questions-batch6",
        "ota-questions-batch7",
        "ota-questions-batch8",
        "ota-questions-batch9",
        "ota-questions-batch10",
        "ota-questions-batch11",
        "ota-questions-batch12",
        "ota-questions-batch13",
        "ota-questions-batch14",
        "ota-questions-batch15",
        "ota-questions-expansion",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/ota-questions").then(m => m.otaQuestions),
        import("../../client/src/data/career-questions/ota-questions-batch2").then(m => m.otaQuestionsBatch2),
        import("../../client/src/data/career-questions/ota-questions-batch3").then(m => m.otaQuestionsBatch3),
        import("../../client/src/data/career-questions/ota-questions-batch4").then(m => m.otaQuestionsBatch4),
        import("../../client/src/data/career-questions/ota-questions-batch5").then(m => m.otaQuestionsBatch5),
        import("../../client/src/data/career-questions/ota-questions-batch6").then(m => m.otaQuestionsBatch6),
        import("../../client/src/data/career-questions/ota-questions-batch7").then(m => m.otaQuestionsBatch7),
        import("../../client/src/data/career-questions/ota-questions-batch8").then(m => m.otaQuestionsBatch8),
        import("../../client/src/data/career-questions/ota-questions-batch9").then(m => m.otaQuestionsBatch9),
        import("../../client/src/data/career-questions/ota-questions-batch10").then(m => m.otaQuestionsBatch10),
        import("../../client/src/data/career-questions/ota-questions-batch11").then(m => m.otaQuestionsBatch11),
        import("../../client/src/data/career-questions/ota-questions-batch12").then(m => m.otaQuestionsBatch12),
        import("../../client/src/data/career-questions/ota-questions-batch13").then(m => m.otaQuestionsBatch13),
        import("../../client/src/data/career-questions/ota-questions-batch14").then(m => m.otaQuestionsBatch14),
        import("../../client/src/data/career-questions/ota-questions-batch15").then(m => m.otaQuestionsBatch15),
        import("../../client/src/data/career-questions/ota-questions-expansion").then(m => m.otaQuestionsExpansion),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "physicalTherapy",
    examTag: "FSBPT PTA",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson(["pta-questions", "pta-questions-expansion"]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/pta-questions").then(m => m.ptaQuestions),
        import("../../client/src/data/career-questions/pta-questions-expansion").then(m => m.ptaQuestionsExpansion),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "physiotherapyAssistant",
    examTag: "FSBPT PTA",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "pta-questions",
        "pta-questions-batch1",
        "pta-questions-batch2",
        "pta-questions-batch3",
        "pta-questions-batch4",
        "pta-questions-batch5",
        "pta-questions-batch6",
        "pta-questions-batch7",
        "pta-questions-batch8",
        "pta-questions-batch9",
        "pta-questions-batch10",
        "pta-questions-batch11",
        "pta-questions-batch12",
        "pta-questions-batch13",
        "pta-questions-batch14",
        "pta-questions-batch15",
        "pta-questions-batch16",
        "pta-questions-batch17",
        "pta-questions-batch18",
        "pta-questions-batch19",
        "pta-questions-batch20",
        "pta-questions-batch21",
        "pta-questions-batch22",
        "pta-questions-batch23",
        "pta-questions-batch24",
        "pta-questions-batch25",
        "pta-questions-batch26",
        "pta-questions-batch27",
        "pta-questions-batch28",
        "pta-questions-batch29",
        "pta-questions-batch30",
        "pta-questions-batch31",
        "pta-questions-batch32",
        "pta-questions-batch33",
        "pta-questions-batch34",
        "pta-questions-batch35",
        "pta-questions-expansion",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/pta-questions").then(m => m.ptaQuestions),
        import("../../client/src/data/career-questions/pta-questions-batch1").then(m => m.ptaQuestionsBatch1),
        import("../../client/src/data/career-questions/pta-questions-batch2").then(m => m.ptaQuestionsBatch2),
        import("../../client/src/data/career-questions/pta-questions-batch3").then(m => m.ptaQuestionsBatch3),
        import("../../client/src/data/career-questions/pta-questions-batch4").then(m => m.ptaQuestionsBatch4),
        import("../../client/src/data/career-questions/pta-questions-batch5").then(m => m.ptaQuestionsBatch5),
        import("../../client/src/data/career-questions/pta-questions-batch6").then(m => m.ptaQuestionsBatch6),
        import("../../client/src/data/career-questions/pta-questions-batch7").then(m => m.ptaQuestionsBatch7),
        import("../../client/src/data/career-questions/pta-questions-batch8").then(m => m.ptaQuestionsBatch8),
        import("../../client/src/data/career-questions/pta-questions-batch9").then(m => m.ptaQuestionsBatch9),
        import("../../client/src/data/career-questions/pta-questions-batch10").then(m => m.ptaQuestionsBatch10),
        import("../../client/src/data/career-questions/pta-questions-batch11").then(m => m.ptaQuestionsBatch11),
        import("../../client/src/data/career-questions/pta-questions-batch12").then(m => m.ptaQuestionsBatch12),
        import("../../client/src/data/career-questions/pta-questions-batch13").then(m => m.ptaQuestionsBatch13),
        import("../../client/src/data/career-questions/pta-questions-batch14").then(m => m.ptaQuestionsBatch14),
        import("../../client/src/data/career-questions/pta-questions-batch15").then(m => m.ptaQuestionsBatch15),
        import("../../client/src/data/career-questions/pta-questions-batch16").then(m => m.ptaQuestionsBatch16),
        import("../../client/src/data/career-questions/pta-questions-batch17").then(m => m.ptaQuestionsBatch17),
        import("../../client/src/data/career-questions/pta-questions-batch18").then(m => m.ptaQuestionsBatch18),
        import("../../client/src/data/career-questions/pta-questions-batch19").then(m => m.ptaQuestionsBatch19),
        import("../../client/src/data/career-questions/pta-questions-batch20").then(m => m.ptaQuestionsBatch20),
        import("../../client/src/data/career-questions/pta-questions-batch21").then(m => m.ptaQuestionsBatch21),
        import("../../client/src/data/career-questions/pta-questions-batch22").then(m => m.ptaQuestionsBatch22),
        import("../../client/src/data/career-questions/pta-questions-batch23").then(m => m.ptaQuestionsBatch23),
        import("../../client/src/data/career-questions/pta-questions-batch24").then(m => m.ptaQuestionsBatch24),
        import("../../client/src/data/career-questions/pta-questions-batch25").then(m => m.ptaQuestionsBatch25),
        import("../../client/src/data/career-questions/pta-questions-batch26").then(m => m.ptaQuestionsBatch26),
        import("../../client/src/data/career-questions/pta-questions-batch27").then(m => m.ptaQuestionsBatch27),
        import("../../client/src/data/career-questions/pta-questions-batch28").then(m => m.ptaQuestionsBatch28),
        import("../../client/src/data/career-questions/pta-questions-batch29").then(m => m.ptaQuestionsBatch29),
        import("../../client/src/data/career-questions/pta-questions-batch30").then(m => m.ptaQuestionsBatch30),
        import("../../client/src/data/career-questions/pta-questions-batch31").then(m => m.ptaQuestionsBatch31),
        import("../../client/src/data/career-questions/pta-questions-batch32").then(m => m.ptaQuestionsBatch32),
        import("../../client/src/data/career-questions/pta-questions-batch33").then(m => m.ptaQuestionsBatch33),
        import("../../client/src/data/career-questions/pta-questions-batch34").then(m => m.ptaQuestionsBatch34),
        import("../../client/src/data/career-questions/pta-questions-batch35").then(m => m.ptaQuestionsBatch35),
        import("../../client/src/data/career-questions/pta-questions-expansion").then(m => m.ptaQuestionsExpansion),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "healthInfoMgmt",
    examTag: "AHIMA RHIT",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "him-questions",
        "him-questions-batch2",
        "him-questions-batch3",
        "him-questions-batch4",
        "him-questions-batch5",
        "him-questions-batch6",
        "him-questions-batch7",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/him-questions").then(m => m.himQuestions),
        import("../../client/src/data/career-questions/him-questions-batch2").then(m => m.himQuestionsBatch2),
        import("../../client/src/data/career-questions/him-questions-batch3").then(m => m.himQuestionsBatch3),
        import("../../client/src/data/career-questions/him-questions-batch4").then(m => m.himQuestionsBatch4),
        import("../../client/src/data/career-questions/him-questions-batch5").then(m => m.himQuestionsBatch5),
        import("../../client/src/data/career-questions/him-questions-batch6").then(m => m.himQuestionsBatch6),
        import("../../client/src/data/career-questions/him-questions-batch7").then(m => m.himQuestionsBatch7),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "surgicalTechnologist",
    examTag: "NBSTSA CST",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "surgical-technologist-questions",
        "surgical-technologist-questions-2",
        "surgical-technologist-questions-3",
        "surgical-technologist-questions-4",
        "surgical-technologist-questions-5",
        "surgical-technologist-questions-6",
        "surgical-technologist-questions-7",
        "surgical-technologist-questions-8",
        "surgical-technologist-questions-9",
        "surgical-technologist-questions-10",
        "surgical-technologist-questions-11",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/surgical-technologist-questions").then(m => m.surgicalTechnologistQuestions),
        import("../../client/src/data/career-questions/surgical-technologist-questions-2").then(m => m.surgicalTechnologistQuestionsPart2),
        import("../../client/src/data/career-questions/surgical-technologist-questions-3").then(m => m.surgicalTechnologistQuestionsPart3),
        import("../../client/src/data/career-questions/surgical-technologist-questions-4").then(m => m.surgicalTechnologistQuestionsPart4),
        import("../../client/src/data/career-questions/surgical-technologist-questions-5").then(m => m.surgicalTechnologistQuestionsPart5),
        import("../../client/src/data/career-questions/surgical-technologist-questions-6").then(m => m.surgicalTechnologistQuestionsPart6),
        import("../../client/src/data/career-questions/surgical-technologist-questions-7").then(m => m.surgicalTechnologistQuestionsPart7),
        import("../../client/src/data/career-questions/surgical-technologist-questions-8").then(m => m.surgicalTechnologistQuestionsPart8),
        import("../../client/src/data/career-questions/surgical-technologist-questions-9").then(m => m.surgicalTechnologistQuestionsPart9),
        import("../../client/src/data/career-questions/surgical-technologist-questions-10").then(m => m.surgicalTechnologistQuestionsPart10),
        import("../../client/src/data/career-questions/surgical-technologist-questions-11").then(m => m.surgicalTechnologistQuestionsPart11),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "diagnosticSonography",
    examTag: "ARDMS SPI",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "sonography-questions",
        "sonography-questions-batch2",
        "sonography-questions-batch3",
        "sonography-questions-batch4",
        "sonography-questions-batch5",
        "sonography-questions-batch6",
        "sonography-questions-batch7",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/sonography-questions").then(m => m.sonographyQuestions),
        import("../../client/src/data/career-questions/sonography-questions-batch2").then(m => m.sonographyQuestionsBatch2),
        import("../../client/src/data/career-questions/sonography-questions-batch3").then(m => m.sonographyQuestionsBatch3),
        import("../../client/src/data/career-questions/sonography-questions-batch4").then(m => m.sonographyQuestionsBatch4),
        import("../../client/src/data/career-questions/sonography-questions-batch5").then(m => m.sonographyQuestionsBatch5),
        import("../../client/src/data/career-questions/sonography-questions-batch6").then(m => m.sonographyQuestionsBatch6),
        import("../../client/src/data/career-questions/sonography-questions-batch7").then(m => m.sonographyQuestionsBatch7),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "cardiacSonographer",
    examTag: "ARDMS RDCS",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "cardiac-sonographer-questions",
        "cardiac-sonographer-questions-batch2",
        "cardiac-sonographer-questions-batch3",
        "cardiac-sonographer-questions-batch4",
        "cardiac-sonographer-questions-batch5",
        "cardiac-sonographer-questions-batch6",
        "cardiac-sonographer-questions-batch7",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/cardiac-sonographer-questions").then(m => m.cardiacSonographerQuestions),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch2").then(m => m.cardiacSonographerQuestionsBatch2),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch3").then(m => m.cardiacSonographerQuestionsBatch3),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch4").then(m => m.cardiacSonographerQuestionsBatch4),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch5").then(m => m.cardiacSonographerQuestionsBatch5),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch6").then(m => m.cardiacSonographerQuestionsBatch6),
        import("../../client/src/data/career-questions/cardiac-sonographer-questions-batch7").then(m => m.cardiacSonographerQuestionsBatch7),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "psychotherapist",
    examTag: "RP Qualifying",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "psychotherapist-questions",
        "psychotherapist-questions-batch2",
        "psychotherapist-questions-batch3",
        "psychotherapist-questions-batch4",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/psychotherapist-questions").then(m => m.psychotherapistQuestions),
        import("../../client/src/data/career-questions/psychotherapist-questions-batch2").then(m => m.psychotherapistQuestionsBatch2),
        import("../../client/src/data/career-questions/psychotherapist-questions-batch3").then(m => m.psychotherapistQuestionsBatch3),
        import("../../client/src/data/career-questions/psychotherapist-questions-batch4").then(m => m.psychotherapistQuestionsBatch4),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "addictionsCounsellor",
    examTag: "IC&RC CAC",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "addictions-counsellor-questions",
        "addictions-counsellor-questions-batch2",
        "addictions-counsellor-questions-batch3",
        "addictions-counsellor-questions-batch4",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/addictions-counsellor-questions").then(m => m.addictionsCounsellorQuestions),
        import("../../client/src/data/career-questions/addictions-counsellor-questions-batch2").then(m => m.addictionsCounsellorQuestionsBatch2),
        import("../../client/src/data/career-questions/addictions-counsellor-questions-batch3").then(m => m.addictionsCounsellorQuestionsBatch3),
        import("../../client/src/data/career-questions/addictions-counsellor-questions-batch4").then(m => m.addictionsCounsellorQuestionsBatch4),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "imaging",
    examTag: "ARRT Radiography",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "imaging-questions",
        "imaging-questions-expansion",
        "imaging-questions-batch2",
        "imaging-questions-batch3",
        "imaging-questions-batch4",
        "imaging-questions-batch5",
        "imaging-questions-batch6",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/imaging-questions").then(m => m.imagingQuestions),
        import("../../client/src/data/career-questions/imaging-questions-expansion").then(m => m.imagingQuestionsExpansion),
        import("../../client/src/data/career-questions/imaging-questions-batch2").then(m => m.imagingQuestionsBatch2),
        import("../../client/src/data/career-questions/imaging-questions-batch3").then(m => m.imagingQuestionsBatch3),
        import("../../client/src/data/career-questions/imaging-questions-batch4").then(m => m.imagingQuestionsBatch4),
        import("../../client/src/data/career-questions/imaging-questions-batch5").then(m => m.imagingQuestionsBatch5),
        import("../../client/src/data/career-questions/imaging-questions-batch6").then(m => m.imagingQuestionsBatch6),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "rrt",
    examTag: "NBRC TMC/CSE",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "rrt-questions",
        "rrt-questions-batch1",
        "rrt-questions-batch2",
        "rrt-questions-batch3",
        "rrt-questions-batch4",
        "rrt-questions-batch5",
        "rrt-questions-batch6",
        "rrt-questions-batch7",
        "rrt-questions-batch8",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/rrt-questions").then(m => m.rrtQuestions),
        import("../../client/src/data/career-questions/rrt-questions-batch1").then(m => m.rrtQuestionsBatch1),
        import("../../client/src/data/career-questions/rrt-questions-batch2").then(m => m.rrtQuestionsBatch2),
        import("../../client/src/data/career-questions/rrt-questions-batch3").then(m => m.rrtQuestionsBatch3),
        import("../../client/src/data/career-questions/rrt-questions-batch4").then(m => m.rrtQuestionsBatch4),
        import("../../client/src/data/career-questions/rrt-questions-batch5").then(m => m.rrtQuestionsBatch5),
        import("../../client/src/data/career-questions/rrt-questions-batch6").then(m => m.rrtQuestionsBatch6),
        import("../../client/src/data/career-questions/rrt-questions-batch7").then(m => m.rrtQuestionsBatch7),
        import("../../client/src/data/career-questions/rrt-questions-batch8").then(m => m.rrtQuestionsBatch8),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "paramedic",
    examTag: "NREMT Paramedic",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "paramedic-questions",
        "paramedic-questions-expansion",
        "paramedic-questions-batch2",
        "paramedic-questions-batch3",
        "paramedic-questions-batch4",
        "paramedic-questions-batch5",
        "paramedic-questions-batch6",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/paramedic-questions").then(m => m.paramedicQuestions),
        import("../../client/src/data/career-questions/paramedic-questions-expansion").then(m => m.paramedicQuestionsExpansion),
        import("../../client/src/data/career-questions/paramedic-questions-batch2").then(m => m.paramedicQuestionsBatch2),
        import("../../client/src/data/career-questions/paramedic-questions-batch3").then(m => m.paramedicQuestionsBatch3),
        import("../../client/src/data/career-questions/paramedic-questions-batch4").then(m => m.paramedicQuestionsBatch4),
        import("../../client/src/data/career-questions/paramedic-questions-batch5").then(m => m.paramedicQuestionsBatch5),
        import("../../client/src/data/career-questions/paramedic-questions-batch6").then(m => m.paramedicQuestionsBatch6),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "pharmacyTech",
    examTag: "PTCB CPHT",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "pharmacy-tech-questions",
        "pharmacy-tech-questions-batch2",
        "pharmacy-tech-questions-batch3",
        "pharmacy-tech-questions-batch4",
        "pharmacy-tech-questions-batch5",
        "pharmacy-tech-questions-batch6",
        "pharmacy-tech-questions-batch7",
        "pharmacy-tech-questions-batch8",
        "pharmacy-tech-questions-batch9",
        "pharmacy-tech-questions-extended",
        "pharmacy-tech-questions-pebc",
        "pharmacy-tech-questions-expansion",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/pharmacy-tech-questions").then(m => m.pharmacyTechQuestions),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch2").then(m => m.pharmacyTechQuestionsBatch2),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch3").then(m => m.pharmacyTechQuestionsBatch3),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch4").then(m => m.pharmacyTechQuestionsBatch4 as any),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch5").then(m => m.pharmacyTechQuestionsBatch5),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch6").then(m => m.pharmacyTechQuestionsBatch6),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch7").then(m => m.pharmacyTechQuestionsBatch7),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch8").then(m => m.pharmacyTechQuestionsBatch8),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-batch9").then(m => m.pharmacyTechQuestionsBatch9),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-extended").then(m => m.pharmacyTechQuestionsExtended),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-pebc").then(m => m.pharmacyTechQuestionsPEBC as any),
        import("../../client/src/data/career-questions/pharmacy-tech-questions-expansion").then(m => m.pharmacyTechQuestionsExpansion),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "mlt",
    examTag: "ASCP MLT",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "mlt-questions",
        "mlt-questions-batch2",
        "mlt-questions-expansion",
        "mlt-questions-batch3",
        "mlt-questions-batch4",
        "mlt-questions-batch5",
        "mlt-questions-batch6",
        "mlt-questions-batch7",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/mlt-questions").then(m => m.mltQuestions),
        import("../../client/src/data/career-questions/mlt-questions-batch2").then(m => m.mltQuestionsBatch2),
        import("../../client/src/data/career-questions/mlt-questions-expansion").then(m => m.mltQuestionsExpansion),
        import("../../client/src/data/career-questions/mlt-questions-batch3").then(m => m.mltQuestionsBatch3),
        import("../../client/src/data/career-questions/mlt-questions-batch4").then(m => m.mltQuestionsBatch4),
        import("../../client/src/data/career-questions/mlt-questions-batch5").then(m => m.mltQuestionsBatch5),
        import("../../client/src/data/career-questions/mlt-questions-batch6").then(m => m.mltQuestionsBatch6),
        import("../../client/src/data/career-questions/mlt-questions-batch7").then(m => m.mltQuestionsBatch7),
      ]);
      return parts.flat();
    },
  },
  {
    careerType: "socialWorker",
    examTag: "ASWB Clinical",
    importFn: async () => {
      const json = await tryLoadCareerQuestionsFromJson([
        "social-worker-questions",
        "social-worker-questions-batch2",
        "social-worker-questions-batch3",
        "social-worker-questions-batch4",
        "social-worker-questions-batch5",
        "social-worker-questions-batch6",
        "social-worker-questions-batch7",
        "social-worker-questions-batch8",
        "social-worker-questions-batch9",
        "social-worker-questions-batch10",
        "social-worker-questions-batch11",
        "social-worker-questions-batch12",
        "social-worker-questions-batch13",
        "social-worker-questions-batch14",
        "social-worker-questions-batch15",
        "social-worker-questions-batch16",
        "social-worker-questions-batch17",
        "social-worker-questions-batch18",
        "social-worker-questions-batch19",
        "social-worker-questions-batch20",
        "social-worker-questions-batch21",
        "social-worker-questions-batch22",
        "social-worker-questions-batch23",
        "social-worker-questions-batch24",
        "social-worker-questions-batch25",
        "social-worker-questions-batch26",
        "social-worker-questions-batch27",
      ]);
      if (json) return json;
      const parts = await Promise.all([
        import("../../client/src/data/career-questions/social-worker-questions").then(m => m.socialWorkerQuestions),
        import("../../client/src/data/career-questions/social-worker-questions-batch2").then(m => m.socialWorkerQuestionsBatch2),
        import("../../client/src/data/career-questions/social-worker-questions-batch3").then(m => m.socialWorkerQuestionsBatch3),
        import("../../client/src/data/career-questions/social-worker-questions-batch4").then(m => m.socialWorkerQuestionsBatch4),
        import("../../client/src/data/career-questions/social-worker-questions-batch5").then(m => m.socialWorkerQuestionsBatch5),
        import("../../client/src/data/career-questions/social-worker-questions-batch6").then(m => m.socialWorkerQuestionsBatch6),
        import("../../client/src/data/career-questions/social-worker-questions-batch7").then(m => m.socialWorkerQuestionsBatch7),
        import("../../client/src/data/career-questions/social-worker-questions-batch8").then(m => m.socialWorkerQuestionsBatch8),
        import("../../client/src/data/career-questions/social-worker-questions-batch9").then(m => m.socialWorkerQuestionsBatch9),
        import("../../client/src/data/career-questions/social-worker-questions-batch10").then(m => m.socialWorkerQuestionsBatch10),
        import("../../client/src/data/career-questions/social-worker-questions-batch11").then(m => m.socialWorkerQuestionsBatch11),
        import("../../client/src/data/career-questions/social-worker-questions-batch12").then(m => m.socialWorkerQuestionsBatch12),
        import("../../client/src/data/career-questions/social-worker-questions-batch13").then(m => m.socialWorkerQuestionsBatch13),
        import("../../client/src/data/career-questions/social-worker-questions-batch14").then(m => m.socialWorkerQuestionsBatch14),
        import("../../client/src/data/career-questions/social-worker-questions-batch15").then(m => m.socialWorkerQuestionsBatch15),
        import("../../client/src/data/career-questions/social-worker-questions-batch16").then(m => m.socialWorkerQuestionsBatch16),
        import("../../client/src/data/career-questions/social-worker-questions-batch17").then(m => m.socialWorkerQuestionsBatch17),
        import("../../client/src/data/career-questions/social-worker-questions-batch18").then(m => m.socialWorkerQuestionsBatch18),
        import("../../client/src/data/career-questions/social-worker-questions-batch19").then(m => m.socialWorkerQuestionsBatch19),
        import("../../client/src/data/career-questions/social-worker-questions-batch20").then(m => m.socialWorkerQuestionsBatch20),
        import("../../client/src/data/career-questions/social-worker-questions-batch21").then(m => m.socialWorkerQuestionsBatch21),
        import("../../client/src/data/career-questions/social-worker-questions-batch22").then(m => m.socialWorkerQuestionsBatch22),
        import("../../client/src/data/career-questions/social-worker-questions-batch23").then(m => m.socialWorkerQuestionsBatch23),
        import("../../client/src/data/career-questions/social-worker-questions-batch24").then(m => m.socialWorkerQuestionsBatch24),
        import("../../client/src/data/career-questions/social-worker-questions-batch25").then(m => m.socialWorkerQuestionsBatch25),
        import("../../client/src/data/career-questions/social-worker-questions-batch26").then(m => m.socialWorkerQuestionsBatch26),
        import("../../client/src/data/career-questions/social-worker-questions-batch27").then(m => m.socialWorkerQuestionsBatch27),
      ]);
      return parts.flat();
    },
  },
];

export async function seedAlliedHealthQuestions(pool: Pool): Promise<void> {
  logStartupDatabaseResolution();

  let careerTypesSkippedUpToDate = 0;
  let careerTypesSkippedImportFail = 0;
  let careerTypesAttempted = 0;
  let rowsInsertedTotal = 0;

  for (const config of SEED_CONFIGS) {
    try {
      const existingCount = await pool.query(
        "SELECT COUNT(*)::int AS cnt FROM allied_questions WHERE career_type = $1",
        [config.careerType]
      );
      const dbCount = existingCount.rows[0].cnt as number;

      let questions: CareerQuestionInput[];
      try {
        questions = await config.importFn();
      } catch {
        console.log(`[AlliedSeed] Skipping ${config.careerType}: import failed`);
        careerTypesSkippedImportFail++;
        continue;
      }

      if (dbCount >= questions.length) {
        console.log(`[AlliedSeed] ${config.careerType}: ${dbCount} questions in DB (>= ${questions.length} in source), skipping`);
        careerTypesSkippedUpToDate++;
        continue;
      }

      console.log(`[AlliedSeed] Seeding ${questions.length} questions for ${config.careerType}...`);
      careerTypesAttempted++;

      const BATCH_SIZE = 50;
      let rowsInsertedThisCareer = 0;

      for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        const values: (string | number | null)[] = [];
        const placeholders: string[] = [];
        let paramIdx = 1;

        for (const q of batch) {
          placeholders.push(
            `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++})`
          );
          values.push(
            config.careerType,
            q.id,
            q.stem,
            JSON.stringify(q.options),
            q.correctIndex,
            q.rationale,
            q.rationale.split(".")[0] || "",
            q.category,
            q.topic,
            q.difficulty,
            "recall",
            "multiple-choice",
            config.examTag || null
          );
        }

        const ins = await pool.query(
          `INSERT INTO allied_questions (career_type, blueprint_id, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_tag)
           VALUES ${placeholders.join(", ")}
           ON CONFLICT DO NOTHING`,
          values
        );
        rowsInsertedThisCareer += ins.rowCount ?? 0;
      }

      rowsInsertedTotal += rowsInsertedThisCareer;
      console.log(
        `[AlliedSeed] ${config.careerType}: rows inserted this run (ON CONFLICT excluded): ${rowsInsertedThisCareer} (batches covered ${questions.length} source rows)`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[AlliedSeed] Error seeding ${config.careerType}:`, message);
    }
  }

  const byCareer = await pool.query(
    `SELECT career_type, COUNT(*)::int AS cnt FROM allied_questions GROUP BY career_type ORDER BY career_type`,
  );
  const totalRow = await pool.query(`SELECT COUNT(*)::bigint AS c FROM allied_questions`);
  console.log("\n=== Allied seed verification ===");
  console.log(
    JSON.stringify({
      type: "allied_seed_verification",
      success: true,
      careerTypesSkippedUpToDate,
      careerTypesSkippedImportFail,
      careerTypesAttempted,
      rowsInsertedThisRun: rowsInsertedTotal,
      alliedQuestionsTotal: String(totalRow.rows[0]?.c ?? "0"),
      countsByCareerType: Object.fromEntries(byCareer.rows.map((r: { career_type: string; cnt: number }) => [r.career_type, r.cnt])),
    }),
  );
}
