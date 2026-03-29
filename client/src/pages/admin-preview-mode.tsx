import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye, EyeOff, Smartphone, Globe, Wifi, WifiOff,
  Monitor, Shield, Play, Square, User, Settings,
  AlertTriangle, CheckCircle2, Gauge, ArrowLeft,
} from "lucide-react";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("nn_admin_access_token") || localStorage.getItem("nursenest-user-token");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

function RoleSelector({ value, options, onChange }: {
  value: string;
  options: { value: string; label: string; description: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
            value === opt.value ? "border-blue-400 bg-blue-50" : "hover:border-slate-300"
          }`}
          onClick={() => onChange(opt.value)}
          data-testid={`role-option-${opt.value}`}
        >
          <div className="flex items-center gap-2">
            <User className={`w-4 h-4 ${value === opt.value ? "text-blue-500" : "text-slate-400"}`} />
            <span className="font-medium text-sm">{opt.label}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{opt.description}</p>
        </div>
      ))}
    </div>
  );
}

function LiteModePanel() {
  const queryClient = useQueryClient();

  const { data: liteStatus } = useQuery({
    queryKey: ["lite-status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/lite/status", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const activateLite = useMutation({
    mutationFn: async (reason: string) => {
      const res = await fetch("/api/admin/lite/activate", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lite-status"] }),
  });

  const deactivateLite = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/lite/deactivate", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lite-status"] }),
  });

  const rebuildPayloads = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/lite/rebuild-payloads", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lite-status"] }),
  });

  const [reason, setReason] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" /> NurseNest Lite Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge className={liteStatus?.config?.active ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                  {liteStatus?.config?.active ? "ACTIVE" : "STANDBY"}
                </Badge>
                {liteStatus?.config?.autoActivated && (
                  <Badge className="bg-amber-100 text-amber-800">Auto-Activated</Badge>
                )}
              </div>
              {liteStatus?.config?.active && (
                <div className="mt-1 text-sm text-slate-500">
                  <p>Activated: {new Date(liteStatus.config.activatedAt).toLocaleString()}</p>
                  <p>Reason: {liteStatus.config.reason}</p>
                  <p>By: {liteStatus.config.activatedBy || "auto"}</p>
                </div>
              )}
            </div>
          </div>

          {liteStatus?.payloadStats && (
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(liteStatus.payloadStats).map(([type, count]) => (
                <div key={type} className="text-center p-2 bg-slate-50 rounded">
                  <p className="text-lg font-bold" data-testid={`text-payload-count-${type}`}>{count as number}</p>
                  <p className="text-xs text-slate-500">{type}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {!liteStatus?.config?.active ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  placeholder="Reason for activation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  data-testid="input-lite-reason"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => activateLite.mutate(reason || "Manual activation")}
                  disabled={activateLite.isPending}
                  data-testid="button-activate-lite"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" /> Activate Lite Mode
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deactivateLite.mutate()}
                disabled={deactivateLite.isPending}
                data-testid="button-deactivate-lite"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Deactivate Lite Mode
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => rebuildPayloads.mutate()}
              disabled={rebuildPayloads.isPending}
              data-testid="button-rebuild-payloads"
            >
              Rebuild Payloads from DB
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPreviewModePage() {
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [previewConfig, setPreviewConfig] = useState({
    role: "free" as string,
    language: "en",
    fallbackMode: false,
    networkThrottle: "none" as string,
    mobileView: false,
    mobileDevice: "iphone-14",
    degradationLevel: 0,
  });

  const { data: config } = useQuery({
    queryKey: ["preview-mode-config"],
    queryFn: async () => {
      const res = await fetch("/api/admin/preview-mode/config", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to load config");
      return res.json();
    },
  });

  const startPreview = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/preview-mode/start", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(previewConfig),
      });
      if (!res.ok) throw new Error("Failed to start preview");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
      queryClient.invalidateQueries({ queryKey: ["preview-mode-config"] });
    },
  });

  const stopPreview = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/preview-mode/stop", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ sessionId: activeSession?.id }),
      });
      if (!res.ok) throw new Error("Failed to stop preview");
      return res.json();
    },
    onSuccess: () => {
      setActiveSession(null);
      queryClient.invalidateQueries({ queryKey: ["preview-mode-config"] });
    },
  });

  const updatePreview = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch("/api/admin/preview-mode/update", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ sessionId: activeSession?.id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" data-testid="text-page-title">
          <Eye className="w-6 h-6" /> Preview Mode & Lite Backup
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simulate the app as different roles, languages, and conditions before publishing
        </p>
      </div>

      {activeSession && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-blue-800">Preview Active</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge className="bg-blue-100 text-blue-800">Role: {activeSession.role}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Lang: {activeSession.language}</Badge>
                    {activeSession.fallbackMode && <Badge className="bg-amber-100 text-amber-800">Fallback</Badge>}
                    {activeSession.networkThrottle !== "none" && (
                      <Badge className="bg-orange-100 text-orange-800">{activeSession.networkThrottle}</Badge>
                    )}
                    {activeSession.mobileView && (
                      <Badge className="bg-purple-100 text-purple-800">{activeSession.mobileDevice}</Badge>
                    )}
                    {activeSession.degradationLevel > 0 && (
                      <Badge className="bg-red-100 text-red-800">Degradation L{activeSession.degradationLevel}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => stopPreview.mutate()}
                disabled={stopPreview.isPending}
                data-testid="button-stop-preview"
              >
                <EyeOff className="w-4 h-4 mr-1" /> Stop Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" /> Role Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoleSelector
              value={activeSession?.role || previewConfig.role}
              options={config?.roles || []}
              onChange={(role) => {
                if (activeSession) {
                  updatePreview.mutate({ role });
                } else {
                  setPreviewConfig({ ...previewConfig, role });
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5" /> Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(config?.languages || []).map((lang: any) => (
                <button
                  key={lang.code}
                  className={`border rounded-lg p-2 text-center text-sm transition-colors ${
                    (activeSession?.language || previewConfig.language) === lang.code
                      ? "border-blue-400 bg-blue-50"
                      : "hover:border-slate-300"
                  }`}
                  onClick={() => {
                    if (activeSession) {
                      updatePreview.mutate({ language: lang.code });
                    } else {
                      setPreviewConfig({ ...previewConfig, language: lang.code });
                    }
                  }}
                  data-testid={`button-lang-${lang.code}`}
                >
                  <span className="font-medium">{lang.code.toUpperCase()}</span>
                  <p className="text-xs text-slate-500">{lang.name}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="w-5 h-5" /> Network Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(config?.networkOptions || []).map((opt: any) => (
                <div
                  key={opt.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    (activeSession?.networkThrottle || previewConfig.networkThrottle) === opt.value
                      ? "border-blue-400 bg-blue-50"
                      : "hover:border-slate-300"
                  }`}
                  onClick={() => {
                    if (activeSession) {
                      updatePreview.mutate({ networkThrottle: opt.value });
                    } else {
                      setPreviewConfig({ ...previewConfig, networkThrottle: opt.value });
                    }
                  }}
                  data-testid={`network-option-${opt.value}`}
                >
                  <div className="flex items-center gap-2">
                    {opt.value === "offline" ? (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Wifi className={`w-4 h-4 ${opt.value === "none" ? "text-green-500" : "text-amber-500"}`} />
                    )}
                    <span className="font-medium text-sm">{opt.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-6">{opt.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5" /> Mobile Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable Mobile View</span>
              <Button
                variant={(activeSession?.mobileView ?? previewConfig.mobileView) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newVal = !(activeSession?.mobileView ?? previewConfig.mobileView);
                  if (activeSession) {
                    updatePreview.mutate({ mobileView: newVal });
                  } else {
                    setPreviewConfig({ ...previewConfig, mobileView: newVal });
                  }
                }}
                data-testid="button-toggle-mobile"
              >
                {(activeSession?.mobileView ?? previewConfig.mobileView) ? (
                  <><Smartphone className="w-4 h-4 mr-1" /> On</>
                ) : (
                  <><Monitor className="w-4 h-4 mr-1" /> Off</>
                )}
              </Button>
            </div>
            {config?.mobileDevices && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(config.mobileDevices).map(([key, device]: [string, any]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-2 cursor-pointer text-center text-sm transition-colors ${
                      (activeSession?.mobileDevice || previewConfig.mobileDevice) === key
                        ? "border-blue-400 bg-blue-50"
                        : "hover:border-slate-300"
                    }`}
                    onClick={() => {
                      if (activeSession) {
                        updatePreview.mutate({ mobileDevice: key, mobileView: true });
                      } else {
                        setPreviewConfig({ ...previewConfig, mobileDevice: key, mobileView: true });
                      }
                    }}
                    data-testid={`device-option-${key}`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                    <p className="font-medium">{device.userAgent}</p>
                    <p className="text-xs text-slate-400">{device.width}×{device.height}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" /> Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Fallback Mode</span>
              <p className="text-xs text-slate-500">Simulate content fallback behavior</p>
            </div>
            <Button
              variant={(activeSession?.fallbackMode ?? previewConfig.fallbackMode) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newVal = !(activeSession?.fallbackMode ?? previewConfig.fallbackMode);
                if (activeSession) {
                  updatePreview.mutate({ fallbackMode: newVal });
                } else {
                  setPreviewConfig({ ...previewConfig, fallbackMode: newVal });
                }
              }}
              data-testid="button-toggle-fallback"
            >
              {(activeSession?.fallbackMode ?? previewConfig.fallbackMode) ? "On" : "Off"}
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium">Degradation Level</span>
                <p className="text-xs text-slate-500">Simulate platform degradation</p>
              </div>
              <Badge>{activeSession?.degradationLevel ?? previewConfig.degradationLevel}</Badge>
            </div>
            <div className="flex gap-1">
              {(config?.degradationLevels || []).map((dl: any) => (
                <button
                  key={dl.level}
                  className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                    (activeSession?.degradationLevel ?? previewConfig.degradationLevel) === dl.level
                      ? dl.level === 0 ? "bg-green-500 text-white"
                      : dl.level <= 2 ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  onClick={() => {
                    if (activeSession) {
                      updatePreview.mutate({ degradationLevel: dl.level });
                    } else {
                      setPreviewConfig({ ...previewConfig, degradationLevel: dl.level });
                    }
                  }}
                  title={dl.description}
                  data-testid={`button-degradation-${dl.level}`}
                >
                  L{dl.level}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {!activeSession && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => startPreview.mutate()}
            disabled={startPreview.isPending}
            data-testid="button-start-preview"
          >
            <Play className="w-5 h-5 mr-2" /> Start Preview Session
          </Button>
        </div>
      )}

      <LiteModePanel />
    </div>
  );
}
