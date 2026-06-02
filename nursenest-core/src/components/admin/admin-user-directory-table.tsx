import Link from "next/link";
import type { AdminUserDirectoryRow } from "@/lib/admin/load-admin-user-directory";

export function AdminUserDirectoryTable({
  rows,
  nextCursor,
  querySuffix,
}: {
  rows: AdminUserDirectoryRow[];
  nextCursor: string | null;
  /** Preserve filters in “next page” link, e.g. `paid=paid&pathway=…` */
  querySuffix: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No learners match these filters.</p>;
  }

  const nextHref =
    nextCursor != null
      ? `/admin/users?${querySuffix ? `${querySuffix}&` : ""}after=${encodeURIComponent(nextCursor)}`
      : null;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Tier</th>
              <th className="py-2">Pathway</th>
              <th className="py-2">Paid</th>
              <th className="py-2">Weak topics</th>
              <th className="py-2">Updated</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="py-2 pr-2">{u.name}</td>
                <td className="py-2 font-mono text-xs">{u.email}</td>
                <td className="py-2">{u.tier}</td>
                <td className="py-2 text-xs">{u.targetExamPathwayId ?? "—"}</td>
                <td className="py-2">{u.paidSubscriptionActive ? "Yes" : "No"}</td>
                <td className="py-2">{u.weakTopicSignal ? "Signal" : "—"}</td>
                <td className="py-2 text-xs">{u.updatedAt.slice(0, 10)}</td>
                <td className="py-2">
                  <Link href={`/admin/users/${encodeURIComponent(u.id)}`} className="text-primary underline">
                    Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nextHref ? (
        <p className="mt-4 text-sm">
          <Link href={nextHref} className="font-semibold text-primary underline">
            Next page →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
