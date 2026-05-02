import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isOsceLegacyFallbackWhenDbEmptyEnabled } from "@/lib/scenarios/osce-legacy-fallback";
import {
  getLegacyOsceHubListItems,
  getLegacyOsceSkillStationById,
  getMergedLegacyOsceSkillStations,
  legacyOsceStationsToListItems,
} from "@/lib/scenarios/legacy-osce-stations-runtime";
import {
  prismaOsceRowToPublicDto,
  prismaOsceRowToSkillStation,
  skillStationToPublicDto,
} from "@/lib/scenarios/osce-station-mapper";
import type { OsceStationPublicDto } from "@/lib/scenarios/osce-station-types";

import type { LegacyOsceStationListItem } from "./legacy-osce-stations-runtime";
import type { OSCESkillStation } from "@legacy-client/data/osce-skills-data";

export type OsceStationReadSource = "db" | "legacy" | "empty";

export type OscePublicReadDiagnostics = {
  readSource: OsceStationReadSource;
  /** True when reads used the published-DB primary path (legacy merge blocked for this request). */
  usedDbPublishedPrimary: boolean;
};

let lastOscePublicReadDiagnostics: OscePublicReadDiagnostics | null = null;

/** Last public/learner OSCE resolve outcome (for tests + ops; reset in test teardown). */
export function getLastOscePublicReadDiagnostics(): OscePublicReadDiagnostics | null {
  return lastOscePublicReadDiagnostics;
}

export function resetOscePublicReadDiagnosticsForTests(): void {
  lastOscePublicReadDiagnostics = null;
}

function recordPublicOsceRead(d: OscePublicReadDiagnostics) {
  lastOscePublicReadDiagnostics = d;
  if (d.readSource === "legacy") {
    safeServerLog("osce", "read_path_legacy_fallback", { usedDbPublishedPrimary: d.usedDbPublishedPrimary });
    if (process.env.NODE_ENV !== "production") {
      console.info("[osce] public read path used LEGACY (OSCE_LEGACY_FALLBACK and no published DB rows)");
    }
  }
}

/** True when at least one OSCE station row exists (any publish state). Admin inventory + migration hints. */
export async function isOsceDatabasePopulated(): Promise<boolean> {
  const first = await prisma.osceStation.findFirst({ select: { id: true } });
  return first != null;
}

/**
 * True when at least one **published** row exists. Public + learner surfaces use DB only when this is true
 * (legacy is never merged, even for missing slugs).
 */
export async function hasAnyPublishedOsceStation(): Promise<boolean> {
  const first = await prisma.osceStation.findFirst({ where: { isPublished: true }, select: { id: true } });
  return first != null;
}

const OSCE_LIST_CAP = 200;

/**
 * Hub list items: DB when populated, otherwise legacy bundled JSON (temporary fallback).
 */
export async function getOsceHubListItemsResolved(): Promise<{
  items: LegacyOsceStationListItem[];
  readSource: OsceStationReadSource;
}> {
  if (await hasAnyPublishedOsceStation()) {
    const rows = await prisma.osceStation.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
      take: OSCE_LIST_CAP,
    });
    recordPublicOsceRead({ readSource: "db", usedDbPublishedPrimary: true });
    return {
      items: legacyOsceStationsToListItems(rows.map(prismaOsceRowToSkillStation)),
      readSource: "db",
    };
  }
  if (isOsceLegacyFallbackWhenDbEmptyEnabled()) {
    recordPublicOsceRead({ readSource: "legacy", usedDbPublishedPrimary: false });
    return { items: getLegacyOsceHubListItems(), readSource: "legacy" };
  }
  recordPublicOsceRead({ readSource: "empty", usedDbPublishedPrimary: false });
  return { items: [], readSource: "empty" };
}

/**
 * Detail station: DB slug match when DB populated; otherwise legacy lookup by `OSCESkillStation.id`.
 */
export async function getOsceSkillStationResolved(slug: string): Promise<{
  station: OSCESkillStation | null;
  readSource: OsceStationReadSource;
}> {
  const key = slug.trim();
  if (!key) return { station: null, readSource: "empty" };
  if (await hasAnyPublishedOsceStation()) {
    const row = await prisma.osceStation.findFirst({
      where: { slug: key, isPublished: true },
    });
    recordPublicOsceRead({ readSource: "db", usedDbPublishedPrimary: true });
    return {
      station: row ? prismaOsceRowToSkillStation(row) : null,
      readSource: "db",
    };
  }
  if (isOsceLegacyFallbackWhenDbEmptyEnabled()) {
    recordPublicOsceRead({ readSource: "legacy", usedDbPublishedPrimary: false });
    return { station: getLegacyOsceSkillStationById(key), readSource: "legacy" };
  }
  recordPublicOsceRead({ readSource: "empty", usedDbPublishedPrimary: false });
  return { station: null, readSource: "empty" };
}

/** Public API payload (bounded list). */
export async function loadPublicOsceStationsDtos(): Promise<{
  readSource: OsceStationReadSource;
  stations: OsceStationPublicDto[];
}> {
  if (await hasAnyPublishedOsceStation()) {
    const rows = await prisma.osceStation.findMany({
      where: { isPublished: true },
      orderBy: { title: "asc" },
      take: OSCE_LIST_CAP,
    });
    recordPublicOsceRead({ readSource: "db", usedDbPublishedPrimary: true });
    return { readSource: "db", stations: rows.map(prismaOsceRowToPublicDto) };
  }
  if (isOsceLegacyFallbackWhenDbEmptyEnabled()) {
    const merged = getMergedLegacyOsceSkillStations();
    recordPublicOsceRead({ readSource: "legacy", usedDbPublishedPrimary: false });
    return {
      readSource: "legacy",
      stations: merged.map((s) => skillStationToPublicDto(s, "")),
    };
  }
  recordPublicOsceRead({ readSource: "empty", usedDbPublishedPrimary: false });
  return { readSource: "empty", stations: [] };
}

/** Public single station by slug or DB id (published only). */
export async function loadPublicOsceStationDtoByIdOrSlug(
  idOrSlug: string,
): Promise<{ readSource: OsceStationReadSource; station: OsceStationPublicDto | null }> {
  const key = idOrSlug.trim();
  if (!key) return { readSource: "empty", station: null };

  if (await hasAnyPublishedOsceStation()) {
    const row = await prisma.osceStation.findFirst({
      where: {
        isPublished: true,
        OR: [{ id: key }, { slug: key }],
      },
    });
    recordPublicOsceRead({ readSource: "db", usedDbPublishedPrimary: true });
    if (row) return { readSource: "db", station: prismaOsceRowToPublicDto(row) };
    return { readSource: "db", station: null };
  }

  if (isOsceLegacyFallbackWhenDbEmptyEnabled()) {
    const legacy = getLegacyOsceSkillStationById(key);
    recordPublicOsceRead({ readSource: "legacy", usedDbPublishedPrimary: false });
    if (legacy) return { readSource: "legacy", station: skillStationToPublicDto(legacy, "") };
    return { readSource: "legacy", station: null };
  }

  recordPublicOsceRead({ readSource: "empty", usedDbPublishedPrimary: false });
  return { readSource: "empty", station: null };
}
