import { GET as readyGet } from "../health/ready/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // 🔒 FIX: do not pass req
  return readyGet();
}