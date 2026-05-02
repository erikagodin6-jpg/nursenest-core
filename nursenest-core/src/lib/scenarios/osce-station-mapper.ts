import type { Prisma } from "@prisma/client";
import type { OSCESkillStation } from "@legacy-client/data/osce-skills-data";
import type { OsceStation } from "@prisma/client";

import type { OsceStationExtensionsV1, OsceStationPublicDto } from "./osce-station-types";
import { osceStepsFromJson } from "./osce-station-types";

function asExtensions(raw: unknown): OsceStationExtensionsV1 {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as OsceStationExtensionsV1;
  return {};
}

/**
 * Maps a merged legacy station into Prisma create/update input.
 * `importSource` should name the originating legacy module for migration logs.
 */
export function legacyOsceSkillStationToPrismaCreate(
  station: OSCESkillStation,
  importSource: string,
): Prisma.OsceStationCreateInput {
  const ext: OsceStationExtensionsV1 = {
    description: station.description,
    equipment: station.equipment,
    commonErrors: station.commonErrors,
    passingCriteria: station.passingCriteria,
    clinicalPearls: station.clinicalPearls,
    examinerQuestions: station.examinerQuestions,
    teachingPoints: station.teachingPoints,
    icon: station.icon,
    examLevel: station.examLevel,
    importSource,
  };
  const rationales = [...(station.clinicalPearls ?? []), ...(station.teachingPoints ?? [])];
  return {
    slug: station.id,
    title: station.title.trim(),
    description: (station.description ?? "").trim(),
    scenarioIntro: station.scenarioIntro.trim(),
    candidateInstructions: station.candidateInstructions?.trim() || null,
    patientScript: station.patientActorScript?.trim() || null,
    steps: station.steps as unknown as Prisma.InputJsonValue,
    examinerChecklist: (station.examinerChecklist ?? []) as unknown as Prisma.InputJsonValue,
    criticalFails: station.criticalFailCriteria ?? [],
    rationales: rationales as unknown as Prisma.InputJsonValue,
    timeLimit: station.timeLimit?.trim() || null,
    difficulty: station.difficulty,
    category: station.category,
    pathwayId: null,
    isPublished: true,
    domain: null,
    roleTrack: null,
    sourceLegacyPath: importSource,
    extensions: ext as unknown as Prisma.InputJsonValue,
  };
}

export function prismaOsceRowToSkillStation(row: OsceStation): OSCESkillStation {
  const ext = asExtensions(row.extensions);
  const steps = osceStepsFromJson(row.steps);
  const examinerChecklist = Array.isArray(row.examinerChecklist)
    ? (row.examinerChecklist as OSCESkillStation["examinerChecklist"])
    : [];

  return {
    id: row.slug,
    title: row.title,
    category: row.category as OSCESkillStation["category"],
    difficulty: row.difficulty as OSCESkillStation["difficulty"],
    icon: ext.icon ?? "ClipboardList",
    description: (row.description && row.description.trim().length > 0 ? row.description : ext.description) ?? "",
    scenarioIntro: row.scenarioIntro,
    equipment: ext.equipment ?? [],
    steps,
    commonErrors: ext.commonErrors ?? [],
    passingCriteria: ext.passingCriteria ?? "",
    clinicalPearls: ext.clinicalPearls ?? [],
    examLevel: ext.examLevel,
    timeLimit: row.timeLimit ?? undefined,
    candidateInstructions: row.candidateInstructions ?? undefined,
    patientActorScript: row.patientScript ?? undefined,
    examinerChecklist: examinerChecklist ?? [],
    criticalFailCriteria: row.criticalFails.length ? row.criticalFails : undefined,
    examinerQuestions: ext.examinerQuestions,
    teachingPoints: ext.teachingPoints,
  };
}

/** Public DTO without a DB row (legacy fallback for `/api/osce-stations`). */
export function skillStationToPublicDto(s: OSCESkillStation, dbId = ""): OsceStationPublicDto {
  return {
    dbId,
    id: s.id,
    title: s.title,
    category: s.category,
    difficulty: s.difficulty,
    icon: s.icon,
    description: s.description,
    scenarioIntro: s.scenarioIntro,
    equipment: s.equipment,
    steps: s.steps,
    commonErrors: s.commonErrors,
    passingCriteria: s.passingCriteria,
    clinicalPearls: s.clinicalPearls,
    examLevel: s.examLevel,
    timeLimit: s.timeLimit,
    candidateInstructions: s.candidateInstructions,
    examinerChecklist: s.examinerChecklist,
    criticalFailCriteria: s.criticalFailCriteria,
    examinerQuestions: s.examinerQuestions,
    teachingPoints: s.teachingPoints,
  };
}

export function prismaOsceRowToPublicDto(row: OsceStation): OsceStationPublicDto {
  const base = skillStationToPublicDto(prismaOsceRowToSkillStation(row), row.id);
  return {
    ...base,
    isPublished: row.isPublished,
    sourceLegacyPath: row.sourceLegacyPath,
  };
}

/** Deduplication key for migration: title + scenario intro body. */
export function osceMigrationDedupeKey(station: OSCESkillStation): string {
  return `${station.title.trim().toLowerCase()}\n${station.scenarioIntro.trim()}`;
}
