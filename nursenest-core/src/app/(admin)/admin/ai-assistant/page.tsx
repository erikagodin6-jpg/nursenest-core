import { requireAdmin } from "@/lib/auth/guards";
import { AdminAiAssistantClient } from "@/components/admin/admin-ai-assistant-client";

export const dynamic = "force-dynamic";

export default async function AdminAiAssistantPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · AI</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">AI Assistant</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Internal drafting help for content, support, and operations. Review remains human; nothing here makes production changes
          on its own.
        </p>
      </div>

      <AdminAiAssistantClient />
    </main>
  );
}
