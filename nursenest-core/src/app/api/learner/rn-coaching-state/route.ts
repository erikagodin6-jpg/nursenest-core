import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import {
  fingerprintLearnerState,
  type LearnerStateServerEnvelope,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  loadDurableLearnerCognitionEnvelope,
  persistLearnerCognitionToDatabase,
  saveDurableLearnerCognition,
  toLearnerStateServerEnvelope,
} from "@/lib/educational-cognition/learner-cognition-persistence";
import {
  buildCognitionVersionMetadata,
  cognitionVersionTelemetryProps,
} from "@/lib/educational-cognition/cognition-version-governance";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/rn-coaching-state", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/rn-coaching-state",
      feature: SERVER_FEATURE.question,
      userId: gate.userId,
    });

    const stored = await loadDurableLearnerCognitionEnvelope(gate.userId);
    const envelope: LearnerStateServerEnvelope | null = stored ? toLearnerStateServerEnvelope(stored) : null;
    const version = buildCognitionVersionMetadata({
      envelopeVersion: stored?.cognitionSnapshotVersion,
      migrationPath: stored?.migrationPath ?? null,
    });
    return NextResponse.json(
      {
        envelope,
        cognitionVersion: version,
        integrityTier: stored?.integrityTier ?? "valid",
        repairReport: stored?.repairReport ?? null,
      },
      { headers: { "Cache-Control": "private, no-store, must-revalidate" } },
    );
  });
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/rn-coaching-state", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/rn-coaching-state",
      feature: SERVER_FEATURE.question,
      userId: gate.userId,
    });

    let body: { snapshot?: RnLearnerStateSnapshot };
    try {
      body = (await req.json()) as { snapshot?: RnLearnerStateSnapshot };
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const snapshot = body.snapshot;
    if (!snapshot || snapshot.version !== 1) {
      return NextResponse.json({ error: "snapshot required (version 1)" }, { status: 400 });
    }

    const envelope = saveDurableLearnerCognition(gate.userId, snapshot);
    if (envelope.stateFingerprint !== fingerprintLearnerState(snapshot)) {
      /* drift ok — accept newer client state */
    }
    await persistLearnerCognitionToDatabase(gate.userId, envelope);

    const version = buildCognitionVersionMetadata({
      envelopeVersion: envelope.cognitionSnapshotVersion,
      migrationPath: envelope.migrationPath ?? null,
    });

    return NextResponse.json(
      {
        ok: true,
        stateFingerprint: envelope.stateFingerprint,
        cognitionVersion: version,
        integrityTier: envelope.integrityTier ?? "valid",
        telemetry: cognitionVersionTelemetryProps(version),
      },
      { headers: { "Cache-Control": "private, no-store, must-revalidate" } },
    );
  });
}
