import { requireAdmin } from "@/lib/admin/ensure-admin";
import { handleBlogBatchScheduleAdminPost } from "@/lib/blog/blog-batch-schedule-admin-post";

/** Slot preview (dry run) — separate path for dedicated rate limits vs save/run. */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  return handleBlogBatchScheduleAdminPost(req, gate, "preview");
}
