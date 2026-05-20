/**
 * Export `/app/flashcards` pathway bootstrap for DB failover.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots npx tsx scripts/study-snapshots/export-flashcards-hub-bootstrap-snapshot.mts <tier> <country>
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import { listPathwaysCompatibleWithSubscription } from "../../src/lib/exam-pathways/pathway-entitlements";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import type { FlashcardsHubPathwayBootstrapSnapshotPayload } from "../../src/lib/study-content-failover/flashcards-hub-bootstrap-snapshot-read";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";

async function main(): Promise<void> {
  const [, , tierRaw, countryRaw] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }
  if (!tierRaw || !countryRaw) {
    console.error("Usage: export-flashcards-hub-bootstrap-snapshot.mts <tier> <country>");
    process.exit(1);
  }

  const scope: AccessScope = {
    hasAccess: true,
    reason: "active_subscription",
    tier: tierRaw as TierCode,
    country: countryRaw as CountryCode,
    alliedCareer: null,
  };

  const compatible = await listPathwaysCompatibleWithSubscription(scope);

  const compatibleRows = compatible.map((p) => ({ id: p.id, shortName: p.shortName }));
  const pathwayOptions = compatible.map((p) => ({
    id: p.id,
    label: p.displayName ?? p.shortName,
  }));

  const payload: FlashcardsHubPathwayBootstrapSnapshotPayload = {
    pathwayOptions,
    compatibleRows,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<FlashcardsHubPathwayBootstrapSnapshotPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "flashcards_hub_pathway_bootstrap",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const countrySeg = countryRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const tierSeg = tierRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const relDir = path.join(baseDir, "flashcards");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `hub-bootstrap-${countrySeg}-${tierSeg}.json`);
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
  await touchStudySnapshotManifest(baseDir, "flashcards_hub_pathway_bootstrap");
  console.log(`Wrote ${filePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
