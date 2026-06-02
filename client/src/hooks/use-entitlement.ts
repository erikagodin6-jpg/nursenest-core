import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import type { EntitlementDecisionObject } from "@shared/schema";

export function useEntitlement(productType: string, productId?: string | null) {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<EntitlementDecisionObject>({
    queryKey: ["entitlement", user?.id, productType, productId],
    queryFn: async () => {
      const params = new URLSearchParams({ productType });
      if (productId) params.set("productId", productId);

      const headers: Record<string, string> = {};
      const token = localStorage.getItem("nursenest-user-token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const adminToken = localStorage.getItem("nn_admin_access_token");
      if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;

      const res = await fetch(`/api/entitlement/resolve?${params.toString()}`, { headers });
      if (!res.ok) {
        return {
          hasAccess: false,
          accessSource: "none" as const,
          planId: null,
          productType,
          productId: productId || null,
          region: null,
          locale: null,
          fallbackEligible: false,
          backupModesAvailable: [],
          lastVerifiedContentVersion: null,
          substituteEligible: false,
          expiresAt: null,
          accessDecisionReason: "fetch_failed",
          provisional: false,
        };
      }
      return res.json();
    },
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const decision: EntitlementDecisionObject = data || {
    hasAccess: false,
    accessSource: "none",
    planId: null,
    productType,
    productId: productId || null,
    region: null,
    locale: null,
    fallbackEligible: false,
    backupModesAvailable: [],
    lastVerifiedContentVersion: null,
    substituteEligible: false,
    expiresAt: null,
    accessDecisionReason: "loading",
    provisional: false,
  };

  return {
    ...decision,
    isLoading,
    error,
    refetch,
  };
}
