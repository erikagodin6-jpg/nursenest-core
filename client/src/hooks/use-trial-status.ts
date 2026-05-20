import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export interface TrialStatus {
  hasTrial: boolean;
  eligible: boolean;
  trialId?: string;
  selectedTier?: string;
  trialStatus?: "active" | "expired" | "canceled" | "blocked" | "pending_payment" | "converted";
  trialStartedAt?: string;
  trialEndsAt?: string;
  isActive: boolean;
  consumptionCounters?: {
    questions: number;
    flashcards: number;
    lessons: number;
    mockExams: number;
  };
  consumptionLimits?: {
    questions: number;
    flashcards: number;
    lessons: number;
    mockExams: number;
  };
}

export function useTrialStatus() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery<TrialStatus>({
    queryKey: ["trial-sub-status", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/trial-sub/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nursenest-user-token") || ""}`,
        },
      });
      if (!res.ok) {
        return { hasTrial: false, eligible: false, isActive: false };
      }
      return res.json();
    },
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const trialStatus: TrialStatus = data || {
    hasTrial: false,
    eligible: false,
    isActive: false,
  };

  const isOnTrial = trialStatus.isActive && trialStatus.trialStatus === "active";

  const remainingMs = trialStatus.trialEndsAt
    ? Math.max(0, new Date(trialStatus.trialEndsAt).getTime() - Date.now())
    : 0;

  return {
    ...trialStatus,
    isOnTrial,
    remainingMs,
    isLoading,
    refetch,
  };
}

export const ENABLE_COPY_PROTECTION = (() => {
  try {
    return localStorage.getItem("nursenest-disable-copy-protection") !== "true";
  } catch {
    return true;
  }
})();
