/**
 * Import merged legacy OSCE skill stations into osce_stations (single write path).
 *
 *   cd nursenest-core && npx tsx scripts/migrate-osce-stations.mts --dry-run
 *   cd nursenest-core && npx tsx scripts/migrate-osce-stations.mts --apply
 *   cd nursenest-core && npx tsx scripts/migrate-osce-stations.mts --apply --verify-base-url=http://127.0.0.1:3000
 */
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { osceSkillStations } from "@legacy-client/data/osce-skills-data";
import { osceSkillStations2 } from "@legacy-client/data/osce-skills-data-2";
import { osceSkillStations3 } from "@legacy-client/data/osce-skills-data-3";
import { osceSkillStations4 } from "@legacy-client/data/osce-skills-data-4";
import { osceSkillStations5 } from "@legacy-client/data/osce-skills-data-5";
import { osceSkillStations6 } from "@legacy-client/data/osce-skills-data-6";
import { osceSkillStations7 } from "@legacy-client/data/osce-skills-data-7";

import { legacyOsceSkillStationToPrismaCreate, osceMigrationDedupeKey } from "@/lib/scenarios/osce-station-mapper";

const BUNDLES = [
  { source: "@legacy-client/data/osce-skills-data", stations: osceSkillStations },
  { source: "@legacy-client/data/osce-skills-data-2", stations: osceSkillStations2 },
  { source: "@legacy-client/data/osce-skills-data-3", stations: osceSkillStations3 },
  { source: "@legacy-client/data/osce-skills-data-4", stations: osceSkillStations4 },
  { source: "@legacy-client/data/osce-skills-data-5", stations: osceSkillStations5 },
  { source: "@legacy-client/data/osce-skills-data-6", stations: osceSkillStations6 },
  { source: "@legacy-client/data/osce-skills-data-7", stations: osceSkillStations7 },
] as const;

function parseArgs() {
  const argv = process.argv.slice(2);
  return {
    apply: argv.includes("--apply"),
    verifyBaseUrl: (() => {
      const a = argv.find((x) => x.startsWith("--verify-base-url="));
      return a?.split("=", 2)[1]?.trim() ?? null;
    })(),
  };
}

async function verifyPublicApi(baseUrl: string): Promise<{ ok: boolean; detail: string }> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/osce-stations`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, detail: `GET ${url} → ${res.status}` };
    const json = (await res.json()) as { readSource?: string; count?: number };
    if (json.readSource !== "db") return { ok: false, detail: `readSource=${json.readSource} (expected db)` };
    if (!json.count || json.count < 1) return { ok: false, detail: "empty stations from API" };
    return { ok: true, detail: `GET ${url} readSource=db count=${json.count}` };
  } catch (e) {
    return { ok: false, detail: String(e) };
  }
}

async function main() {
  const { apply, verifyBaseUrl } = parseArgs();
  if (apply) {
    await import("@/lib/db/env-bootstrap");
  }

  const prisma = apply ? new PrismaClient() : null;

  let migrated = 0;
  let skippedDup = 0;
  let skippedSlug = 0;
  const seenDedupe = new Set<string>();
  const seenSlugs = new Set<string>();

  try {
    for (const bundle of BUNDLES) {
      for (const station of bundle.stations) {
        const dedupe = osceMigrationDedupeKey(station);
        if (seenDedupe.has(dedupe)) {
          skippedDup += 1;
          console.log(`skip_duplicate_title_intro\t${bundle.source}\t${station.id}`);
          continue;
        }
        if (seenSlugs.has(station.id)) {
          skippedSlug += 1;
          console.log(`skip_duplicate_slug\t${bundle.source}\t${station.id}`);
          continue;
        }
        seenDedupe.add(dedupe);
        seenSlugs.add(station.id);

        const data = legacyOsceSkillStationToPrismaCreate(station, bundle.source);

        if (!apply || !prisma) {
          console.log(`would_insert\t${bundle.source}\t${station.id}\t${station.title}`);
          continue;
        }

        const existing = await prisma.osceStation.findUnique({ where: { slug: station.id } });
        if (existing) {
          console.log(`skip_existing_slug\t${bundle.source}\t${existing.id}\t${station.id}`);
          continue;
        }

        const created = await prisma.osceStation.create({ data });
        migrated += 1;
        console.log(`inserted\t${bundle.source}\t${created.id}\t${station.id}`);
      }
    }

    console.log("\n--- Migration summary ---");
    console.log("migrated:", migrated);
    console.log("skipped (title+intro dedupe):", skippedDup);
    console.log("skipped (slug collision):", skippedSlug);
    console.log("apply:", apply);

    if (!apply || !prisma) {
      return;
    }

    const n = await prisma.osceStation.count();
    if (verifyBaseUrl) {
      const v = await verifyPublicApi(verifyBaseUrl);
      console.log("public API verify:", v.detail, v.ok ? "OK" : "FAIL");
      if (apply && v.ok && n > 0) {
        console.log("\nOSCE SOURCE OF TRUTH VERIFIED");
      }
    } else if (apply && migrated > 0 && n > 0) {
      console.log("\nOSCE SOURCE OF TRUTH VERIFIED");
    }
  } finally {
    if (prisma) await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
