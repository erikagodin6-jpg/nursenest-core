import { AdminNavClient } from "@/components/admin/admin-nav-client";

export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] flex-col bg-[var(--theme-bg)] lg:min-h-screen lg:flex-row">
      <AdminNavClient />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
