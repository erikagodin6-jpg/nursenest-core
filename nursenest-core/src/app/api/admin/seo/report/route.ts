import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildSeoAuditContext,
  loadBrokenInternalLinks,
  loadLinkOpportunities,
  loadMetadataAudit,
  loadSlugCollisions,
  loadWeakInternalLinking,
} from "@/lib/admin/seo-audit-engine";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const KINDS = new Set(["metadata", "slugs", "linking", "broken", "opportunities", "all"]);

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "all";
  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const ctx = await buildSeoAuditContext(prisma);

  if (kind === "all") {
    const [metadata, slugs, linking, broken, opportunities] = await Promise.all([
      loadMetadataAudit(prisma),
      loadSlugCollisions(prisma),
      loadWeakInternalLinking(prisma),
      loadBrokenInternalLinks(prisma, ctx),
      loadLinkOpportunities(prisma),
    ]);
    return NextResponse.json({
      metadata,
      slugs,
      linking,
      broken,
      opportunities,
      generatedAt: new Date().toISOString(),
    });
  }

  if (kind === "metadata") {
    const metadata = await loadMetadataAudit(prisma);
    return NextResponse.json({ metadata, generatedAt: new Date().toISOString() });
  }
  if (kind === "slugs") {
    const slugs = await loadSlugCollisions(prisma);
    return NextResponse.json({ slugs, generatedAt: new Date().toISOString() });
  }
  if (kind === "linking") {
    const linking = await loadWeakInternalLinking(prisma);
    return NextResponse.json({ linking, generatedAt: new Date().toISOString() });
  }
  if (kind === "broken") {
    const broken = await loadBrokenInternalLinks(prisma, ctx);
    return NextResponse.json({ broken, generatedAt: new Date().toISOString() });
  }
  const opportunities = await loadLinkOpportunities(prisma);
  return NextResponse.json({ opportunities, generatedAt: new Date().toISOString() });
}
