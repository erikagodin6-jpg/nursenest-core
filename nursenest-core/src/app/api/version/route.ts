import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BuildMeta = {
  commit?: string | null;
  branch?: string | null;
  recordedAt?: string | null;
};

export async function GET() {
  const filePath = join(process.cwd(), "public", "nn-build-meta.json");
  try {
    const raw = await readFile(filePath, "utf8");
    const meta = JSON.parse(raw) as BuildMeta;
    return Response.json({
      ok: true,
      commit: meta.commit ?? null,
      branch: meta.branch ?? null,
      recordedAt: meta.recordedAt ?? null,
    });
  } catch {
    return Response.json({
      ok: false,
      commit: null,
      branch: null,
      recordedAt: null,
      message: "nn-build-meta.json missing; run a production build (prebuild writes this file).",
    });
  }
}
