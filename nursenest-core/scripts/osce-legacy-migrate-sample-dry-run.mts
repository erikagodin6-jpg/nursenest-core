/**
 * Dry-run: plan inserting 5 legacy OSCE stations into `osce_stations`.
 * From nursenest-core/: `npx tsx scripts/osce-legacy-migrate-sample-dry-run.mts`
 * Default logs only. `--apply` inserts non-duplicate slugs (non-prod tooling).
 */
import { parseArgs } from "node:util";

import { prisma } from "../src/lib/db";
import { getMergedLegacyOsceSkillStations } from "../src/lib/scenarios/legacy-osce-stations-runtime";
import { legacyOsceSkillStationToPrismaCreate } from "../src/lib/scenarios/osce-station-mapper";

const SAMPLE = 5;

async function main() {
  const { values } = parseArgs({
    options: {
      apply: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });
  const apply = values.apply === true;

  const merged = getMergedLegacyOsceSkillStations().slice(0, SAMPLE);

  for (const station of merged) {
    const slug = station.id;
    const existing = await prisma.osceStation.findFirst({ where: { slug }, select: { id: true, slug: true } });
    const duplicate = Boolean(existing);
    const finalRoute = `/app/osce/${encodeURIComponent(slug)}`;
    console.log(
      JSON.stringify({
        slug,
        duplicate,
        existingId: existing?.id ?? null,
        newId: duplicate ? null : "(cuid on insert)",
        finalRoute,
        title: station.title,
      }),
    );

    if (!duplicate && apply) {
      const data = legacyOsceSkillStationToPrismaCreate(station, "sample-dry-run-migrate");
      const row = await prisma.osceStation.create({ data });
      console.log(JSON.stringify({ applied: true, slug, dbId: row.id, finalRoute }));
    }
  }

  if (!apply) {
    console.log(`Dry-run complete (${SAMPLE} rows). Add --apply to insert.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
