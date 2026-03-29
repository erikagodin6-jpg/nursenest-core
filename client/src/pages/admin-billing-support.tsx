import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CreditCard, Shield, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface BillingProfile {
  user: {
    id: string;
    username: string;
    email: string;
    tier: string;
    isLifetime: boolean;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    subscriptionStatus: string | null;
    planExpiresAt: string | null;
  };
  currentPlan: {
    id: string;
    tier: string;
    status: string;
    purchaseSource: string;
    billingInterval: string;
    stripeSubscriptionId: string | null;
    stripeCustomerId: string | null;
    isLifetime: boolean;
    currency: string;
    amount: number | null;
    activeFrom: string | null;
    expiresAt: string | null;
    renewsAt: string | null;
    lastVerifiedAt: string | null;
  } | null;
  entitlements: Record<string, boolean>;
  subscriptionHistory: Array<{
    id: string;
    tier: string;
    status: string;
    purchaseSource: string;
    billingInterval: string;
    isLifetime: boolean;
    createdAt: string;
    canceledAt: string | null;
  }>;
  recentWebhookEvents: Array<{
    id: string;
    eventId: string;
    eventType: string;
    status: string;
    createdAt: string;
  }>;
  recentEntitlementEvents: Array<{
    id: string;
    eventType: string;
    tier: string;
    createdAt: string;
  }>;
}

export default function AdminBillingSupport() {
  const [, navigate] = useLocation();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("admin_token");

  const fetchProfile = async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError(null);
    setProfile(null);
    try {
      const res = await fetch(`/api/admin/billing-profile/${userId.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch billing profile");
      }
      const data = await res.json();
      setProfile(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string | null) => {
    if (!status) return "secondary";
    switch (status) {
      case "active": return "default";
      case "trialing": return "default";
      case "past_due": return "destructive";
      case "canceled": return "destructive";
      default: return "secondary";
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleString();
  };

  const formatAmount = (amount: number | null, currency: string) => {
    if (amount == null) return "N/A";
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} data-testid="button-back-admin">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold" data-testid="text-billing-support-title">Billing Support</h1>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter User ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProfile()}
                data-testid="input-user-id"
              />
              <Button onClick={fetchProfile} disabled={loading} data-testid="button-search-user">
                <Search className="w-4 h-4 mr-1" /> {loading ? "Loading..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span data-testid="text-billing-error">{error}</span>
            </CardContent>
          </Card>
        )}

        {profile && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> User Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Username:</span>
                    <span className="ml-2 font-medium" data-testid="text-user-username">{profile.user.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium" data-testid="text-user-email">{profile.user.email || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tier:</span>
                    <Badge className="ml-2" data-testid="text-user-tier">{profile.user.tier}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={statusColor(profile.user.subscriptionStatus)} className="ml-2" data-testid="text-user-status">
                      {profile.user.subscriptionStatus || "none"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-500">Lifetime:</span>
                    <span className="ml-2 font-medium" data-testid="text-user-lifetime">{profile.user.isLifetime ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Stripe Customer:</span>
                    <span className="ml-2 font-mono text-xs" data-testid="text-stripe-customer-id">{profile.user.stripeCustomerId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Stripe Sub:</span>
                    <span className="ml-2 font-mono text-xs" data-testid="text-stripe-subscription-id">{profile.user.stripeSubscriptionId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Plan Expires:</span>
                    <span className="ml-2 font-medium">{formatDate(profile.user.planExpiresAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile.currentPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Plan Tier:</span>
                      <Badge className="ml-2" data-testid="text-plan-tier">{profile.currentPlan.tier}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <Badge variant={statusColor(profile.currentPlan.status)} className="ml-2" data-testid="text-plan-status">
                        {profile.currentPlan.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Purchase Source:</span>
                      <Badge variant="outline" className="ml-2" data-testid="text-plan-source">{profile.currentPlan.purchaseSource}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-500">Billing Interval:</span>
                      <span className="ml-2 font-medium">{profile.currentPlan.billingInterval || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium">{formatAmount(profile.currentPlan.amount, profile.currentPlan.currency)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Lifetime:</span>
                      <span className="ml-2 font-medium">{profile.currentPlan.isLifetime ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Active From:</span>
                      <span className="ml-2 font-medium">{formatDate(profile.currentPlan.activeFrom)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Verified:</span>
                      <span className="ml-2 font-medium" data-testid="text-plan-last-verified">{formatDate(profile.currentPlan.lastVerifiedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Entitlements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profile.entitlements).map(([feature, allowed]) => (
                    <Badge
                      key={feature}
                      variant={allowed ? "default" : "secondary"}
                      className={`text-xs ${allowed ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}
                      data-testid={`badge-entitlement-${feature}`}
                    >
                      {feature}: {allowed ? "Yes" : "No"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Subscription History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.subscriptionHistory.length === 0 ? (
                  <p className="text-gray-500 text-sm">No subscription history</p>
                ) : (
                  <div className="space-y-2">
                    {profile.subscriptionHistory.map((s) => (
                      <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 text-sm" data-testid={`row-subscription-${s.id}`}>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusColor(s.status)}>{s.status}</Badge>
                          <span className="font-medium">{s.tier}</span>
                          <Badge variant="outline" className="text-xs">{s.purchaseSource}</Badge>
                          {s.isLifetime && <Badge className="bg-purple-100 text-purple-800 text-xs">Lifetime</Badge>}
                        </div>
                        <span className="text-gray-400 text-xs">{formatDate(s.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Webhook Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.recentWebhookEvents.length === 0 ? (
                    <p className="text-gray-500 text-xs">No webhook events</p>
                  ) : (
                    <div className="space-y-1">
                      {profile.recentWebhookEvents.map((e) => (
                        <div key={e.id} className="text-xs border-b pb-1" data-testid={`row-webhook-${e.id}`}>
                          <div className="flex justify-between">
                            <span className="font-medium">{e.eventType}</span>
                            <Badge variant="outline" className="text-[10px]">{e.status}</Badge>
                          </div>
                          <span className="text-gray-400">{formatDate(e.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Recent Entitlement Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.recentEntitlementEvents.length === 0 ? (
                    <p className="text-gray-500 text-xs">No entitlement events</p>
                  ) : (
                    <div className="space-y-1">
                      {profile.recentEntitlementEvents.map((e) => (
                        <div key={e.id} className="text-xs border-b pb-1" data-testid={`row-entitlement-${e.id}`}>
                          <div className="flex justify-between">
                            <span className="font-medium">{e.eventType}</span>
                            {e.tier && <Badge variant="outline" className="text-[10px]">{e.tier}</Badge>}
                          </div>
                          <span className="text-gray-400">{formatDate(e.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
