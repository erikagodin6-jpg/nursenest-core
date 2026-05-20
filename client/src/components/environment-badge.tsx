import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Server } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface EnvironmentInfo {
  appMode: string;
  deploymentTarget: string;
  databaseTarget: string;
  devDbFingerprint: string;
  prodDbFingerprint: string;
  hasSeparateProd: boolean;
}

export function EnvironmentBadge() {
  const { t } = useI18n();
  const [info, setInfo] = useState<EnvironmentInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/environment/info", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setInfo(data))
      .catch(() => {});
  }, []);

  if (!info) return null;

  const envColor = info.appMode === "production"
    ? "bg-red-600 text-white"
    : info.appMode === "staging"
      ? "bg-yellow-500 text-black"
      : "bg-green-600 text-white";

  const envLabel = info.appMode.toUpperCase();
  const safeFingerprint = info.devDbFingerprint?.substring(0, 8) || "unknown";

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white shadow-sm" data-testid="environment-badge">
      <Shield className="w-4 h-4 text-gray-500" />
      <Badge className={`${envColor} text-xs font-bold px-2 py-0.5`} data-testid="badge-environment">
        {envLabel}
      </Badge>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Database className="w-3 h-3" />
        <span data-testid="badge-db-target">{info.hasSeparateProd ? "SEPARATE" : "SHARED"}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Server className="w-3 h-3" />
        <span className="font-mono" data-testid="badge-fingerprint">{safeFingerprint}</span>
      </div>
    </div>
  );
}

interface TargetSelectorProps {
  value: string;
  onChange: (target: string) => void;
  disabled?: boolean;
}

export function TargetSelector({ value, onChange, disabled }: TargetSelectorProps) {
  return (
    <div className="flex items-center gap-2" data-testid="target-selector">
      <label className="text-sm font-medium text-gray-700">{t("components.environmentBadge.target")}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white disabled:opacity-50"
        data-testid="select-target"
      >
        <option value="development">DEVELOPMENT</option>
        <option value="staging">STAGING</option>
        <option value="production">PRODUCTION</option>
      </select>
    </div>
  );
}

interface ProductionConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  target: string;
  writeSummary: string;
  itemCount: number;
  dbFingerprint?: string;
}

export function ProductionConfirmModal({
  open,
  onClose,
  onConfirm,
  target,
  writeSummary,
  itemCount,
  dbFingerprint,
}: ProductionConfirmModalProps) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!open) setApproved(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" data-testid="modal-production-confirm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-bold text-red-600">{t("components.environmentBadge.productionWriteConfirmation")}</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{t("components.environmentBadge.target2")}</span>
            <Badge className="bg-red-600 text-white" data-testid="modal-target">{target.toUpperCase()}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("components.environmentBadge.dbFingerprint")}</span>
            <span className="font-mono text-xs" data-testid="modal-fingerprint">{dbFingerprint || "unknown"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t("components.environmentBadge.itemsAffected")}</span>
            <span className="font-bold" data-testid="modal-item-count">{itemCount}</span>
          </div>
          <div>
            <span className="text-gray-600">{t("components.environmentBadge.summary")}</span>
            <p className="mt-1 text-gray-800 bg-gray-50 p-2 rounded" data-testid="modal-summary">{writeSummary}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={approved}
              onChange={(e) => setApproved(e.target.checked)}
              className="w-4 h-4"
              data-testid="checkbox-approve"
            />
            <span className="text-sm font-medium">
              I confirm this write to PRODUCTION is intentional
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!approved}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-confirm-production"
          >
            Confirm Production Write
          </button>
        </div>
      </div>
    </div>
  );
}
