import { GET as readyGet } from "../health/ready/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return readyGet(req);
}
