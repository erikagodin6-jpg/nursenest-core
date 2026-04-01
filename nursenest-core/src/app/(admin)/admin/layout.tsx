import { AdminNavClient } from "@/components/admin/admin-nav-client";

export default function AdminSubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh]">
      <AdminNavClient />
      {children}
    </div>
  );
}
