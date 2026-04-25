"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";

const FALLBACK_ADMIN_AI_GENERATION_GATE: AdminAiGenerationGate = {
  runnable: false,
  mode: "misconfigured",
  summaryLine: "AI generation is unavailable because the admin AI generation context was not loaded.",
};

const AdminAiGenerationContext = createContext<AdminAiGenerationGate | null>(null);

export function AdminAiGenerationProvider({
  value,
  children,
}: {
  value: AdminAiGenerationGate;
  children: ReactNode;
}) {
  return (
    <AdminAiGenerationContext.Provider value={value ?? FALLBACK_ADMIN_AI_GENERATION_GATE}>
      {children}
    </AdminAiGenerationContext.Provider>
  );
}

export function useAdminAiGenerationGate(): AdminAiGenerationGate {
  return useContext(AdminAiGenerationContext) ?? FALLBACK_ADMIN_AI_GENERATION_GATE;
}