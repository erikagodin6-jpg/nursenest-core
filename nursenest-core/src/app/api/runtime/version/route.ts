import { buildRuntimeVersionPayload, readBuildMeta, runtimeVersionHeaders } from "@/lib/build/runtime-version";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const meta = await readBuildMeta();
  return Response.json(
    buildRuntimeVersionPayload(meta, {
      nodeEnv: process.env.NODE_ENV ?? null,
      deploymentMode: process.env.NN_APP_PLATFORM_BUILD === "true" ? "digitalocean-app-platform" : "standalone",
    }),
    {
      headers: runtimeVersionHeaders(),
    },
  );
}
