import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserBetaFeatures } from "@/lib/beta/beta-access";
import { betaFeaturesToLabels } from "@/lib/beta/beta-feature-options";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseUrlConfigured()) return NextResponse.json({ features: [], labels: [], betaTester: false });
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
  if (!userId) return NextResponse.json({ features: [], labels: [], betaTester: false }, { status: 401 });
  const features = await getUserBetaFeatures(userId).catch(() => []);
  return NextResponse.json({ features, labels: betaFeaturesToLabels(features), betaTester: features.length > 0 });
}
