/**
 * Same contract as `GET /api/health/ready` — bounded Prisma `SELECT 1` when `DATABASE_URL` is set.
 * Alias path for load balancers that expect `/api/healthz` with DB readiness.
 */
export { GET, dynamic, runtime } from "../health/ready/route";
