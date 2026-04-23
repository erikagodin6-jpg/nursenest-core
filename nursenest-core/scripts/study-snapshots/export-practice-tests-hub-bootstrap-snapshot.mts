/**
 * Export `/app/practice-tests` hub pathway bootstrap (builder inventory) for DB failover.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots npx tsx scripts/study-snapshots/export-practice-tests-hub-bootstrap-snapshot.mts <tier> <country> [referenceUserId]
 *
 * When `referenceUserId` is provided, learnerPath is read from that user (recommended for accurate defaults).
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CountryCode, TierCode } from "@prisma/client";

import type { AccessScope } from "../../src/lib/entitlements/user-access-types";
import { listPathwaysCompatibleWithSubscription } from "../../src/lib/exam-pathways/pathway-entitlements";
import { defaultPracticeTestPathwayId } from "../../src/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "../../src/lib/exam-pathways/pathway-entitlements-policy";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import type { PracticeTestsHubBootstrapSnapshotPayload } from "../../src/lib/study-content-failover/practice-tests-hub-bootstrap-snapshot-read";
import { prisma } from "../../src/lib/db";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";

async function main(): Promise<void> {
  const [, , tierRaw, countryRaw, referenceUserId] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }
  if (!tierRaw || !countryRaw) {
    console.error(
      "Usage: export-practice-tests-hub-bootstrap-snapshot.mts <tier> <country> [referenceUserId]",
    );
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
  let learnerPath: string | null = null;
  if (referenceUserId?.trim()) {
    const u = await prisma.user.findUnique({
      where: { id: referenceUserId.trim() },
      select: { learnerPath: true },
    });
    learnerPath = u?.learnerPath?.trim() ?? null;
  }

  const defaultPathwayId = await defaultPracticeTestPathwayId(compatible, learnerPath, countryRaw);
  const pathwayOptions = compatible.map((p) => ({
    id: p.id,
    label: `${p.shortName} — ${p.displayName}`,
    examFamily: String(p.examFamily),
    examCodeLabel: p.shortName.trim(),
  }));
  const catEligiblePathwayIds = compatible.filter(pathwayAllowsCatAdaptiveStart).map((p) => p.id);

  const payload: PracticeTestsHubBootstrapSnapshotPayload = {
    pathwayOptions,
    defaultPathwayId,
    catEligiblePathwayIds,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<PracticeTestsHubBootstrapSnapshotPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "practice_tests_hub_bootstrap",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const countrySeg = countryRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 16);
  const tierSeg = tierRaw.replace(/[^a-z0-9_-]/gi, "_").slice(0, 32);
  const relDir = path.join(baseDir, "practice-tests");
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `hub-bootstrap-${countrySeg}-${tierSeg}.json`);
  await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
  await touchStudySnapshotManifest(baseDir, "practice_tests_hub_bootstrap");
  console.log(`Wrote ${filePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
