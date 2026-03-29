import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap, Activity, Shield, Users } from "lucide-react";

export default function AdminVipStatus() {
  const queryClient = useQueryClient();
  const [newThreshold, setNewThreshold] = useState("");
  const [newMaxRequests, setNewMaxRequests] = useState("");

  const { data: vipStatus, isLoading, isError } = useQuery({
    queryKey: ["/api/admin/vip-status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vip-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    refetchInterval: 5000,
    retry: 1,
  });

  const updateConfig = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch("/api/admin/vip-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vip-status"] });
    },
  });

  if (isLoading && !isError) return <div className="p-6">Loading...</div>;
  if (isError && !vipStatus) return <div className="p-6 text-red-500">Failed to load VIP status. Admin access required.</div>;

  const loadPercent = Math.round((vipStatus?.currentLoad || 0) * 100);
  const thresholdPercent = Math.round((vipStatus?.loadThreshold || 0.85) * 100);

  return (
    <div className="container mx-auto p-6 max-w-5xl" data-testid="page-vip-status">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="h-8 w-8 text-amber-500" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">VIP Prioritization</h1>
          <p className="text-muted-foreground">Subscriber priority under load and load shedding status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 text-center">
            <div className={`text-3xl font-bold ${vipStatus?.loadSheddingActive ? "text-red-600" : "text-green-600"}`} data-testid="text-load-status">
              {vipStatus?.loadSheddingActive ? "ACTIVE" : "NORMAL"}
            </div>
            <div className="text-sm text-muted-foreground">Load Shedding</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className={`text-3xl font-bold ${loadPercent > thresholdPercent ? "text-red-600" : "text-green-600"}`} data-testid="text-current-load">
              {loadPercent}%
            </div>
            <div className="text-sm text-muted-foreground">Current Load</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-blue-600" data-testid="text-active-requests">{vipStatus?.activeRequests || 0}</div>
            <div className="text-sm text-muted-foreground">Active Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <div className="text-3xl font-bold text-amber-600" data-testid="text-vip-served">{vipStatus?.vipRequestsServed || 0}</div>
            <div className="text-sm text-muted-foreground">VIP Requests Served</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Background Requests Shed</span>
              <Badge variant="destructive" data-testid="text-bg-shed">{vipStatus?.backgroundRequestsShed || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Max Concurrent Requests</span>
              <span className="font-medium" data-testid="text-max-requests">{vipStatus?.maxConcurrentRequests || 200}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Load Threshold</span>
              <span className="font-medium" data-testid="text-threshold">{thresholdPercent}%</span>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Load Bar</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${loadPercent > thresholdPercent ? "bg-red-500" : loadPercent > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(loadPercent, 100)}%` }}
                  data-testid="bar-load-progress"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>VIP Prioritization Enabled</Label>
              <Switch
                checked={vipStatus?.enabled}
                onCheckedChange={(checked) => updateConfig.mutate({ enabled: checked })}
                data-testid="switch-enabled"
              />
            </div>

            <div className="space-y-2">
              <Label>Load Threshold (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="50"
                  max="99"
                  placeholder={String(thresholdPercent)}
                  value={newThreshold}
                  onChange={e => setNewThreshold(e.target.value)}
                  data-testid="input-threshold"
                />
                <Button
                  variant="outline"
                  disabled={!newThreshold}
                  onClick={() => {
                    const val = parseInt(newThreshold);
                    if (val >= 50 && val <= 99) {
                      updateConfig.mutate({ loadThreshold: val / 100 });
                      setNewThreshold("");
                    }
                  }}
                  data-testid="button-update-threshold"
                >
                  Update
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Max Concurrent Requests</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="50"
                  max="1000"
                  placeholder={String(vipStatus?.maxConcurrentRequests || 200)}
                  value={newMaxRequests}
                  onChange={e => setNewMaxRequests(e.target.value)}
                  data-testid="input-max-requests"
                />
                <Button
                  variant="outline"
                  disabled={!newMaxRequests}
                  onClick={() => {
                    const val = parseInt(newMaxRequests);
                    if (val >= 50 && val <= 1000) {
                      updateConfig.mutate({ maxConcurrentRequests: val });
                      setNewMaxRequests("");
                    }
                  }}
                  data-testid="button-update-max-requests"
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> VIP Critical Paths</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(vipStatus?.config?.vipPaths || []).map((path: string, i: number) => (
                <Badge key={i} variant="outline" data-testid={`badge-vip-path-${i}`}>{path}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Sheddable Background Paths</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(vipStatus?.config?.backgroundPaths || []).map((path: string, i: number) => (
                <Badge key={i} variant="secondary" data-testid={`badge-bg-path-${i}`}>{path}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
