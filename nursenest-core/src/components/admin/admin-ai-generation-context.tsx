"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

const AdminAiGenerationContext = createContext<AdminAiGenerationGate | null>(null);

export function AdminAiGenerationProvider({
  value,
  children,
}: {
  value: AdminAiGenerationGate;
  children: ReactNode;
}) {
  return <AdminAiGenerationContext.Provider value={value}>{children}</AdminAiGenerationContext.Provider>;
}

export function useAdminAiGenerationGate(): AdminAiGenerationGate {
  const v = useContext(AdminAiGenerationContext);
  if (!v) {
    throw new Error("useAdminAiGenerationGate must be used under /admin (AdminAiGenerationProvider).");
  }
  return v;
}
