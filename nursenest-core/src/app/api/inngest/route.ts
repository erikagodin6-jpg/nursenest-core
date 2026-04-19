import { serve } from "inngest/next";
import { inngest, inngestFunctions } from "@/lib/server/inngest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: inngestFunctions,
});
