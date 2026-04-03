"use client";

import { useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { Input } from "@/components/ui/input";

function parsePositive(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function IvInfusionTool() {
  const { t } = useMarketingI18n();
  const [mode, setMode] = useState<"pump" | "drip" | "duration">("pump");
  const [vol, setVol] = useState("500");
  const [hours, setHours] = useState("8");
  const [mins, setMins] = useState("0");
  const [gtt, setGtt] = useState("15");
  const [rateMlHr, setRateMlHr] = useState("125");

  const mlHrFromVolTime = useMemo(() => {
    const v = parsePositive(vol);
    const h = parseFloat(hours.replace(",", ".")) || 0;
    const m = parseFloat(mins.replace(",", ".")) || 0;
    const totalH = h + m / 60;
    if (v === null || totalH <= 0) return null;
    return v / totalH;
  }, [vol, hours, mins]);

  const gttFromMlHr = useMemo(() => {
    const r = parsePositive(rateMlHr);
    const d = parsePositive(gtt);
    if (r === null || d === null) return null;
    return (r * d) / 60;
  }, [rateMlHr, gtt]);

  const durationHrs = useMemo(() => {
    const v = parsePositive(vol);
    const r = parsePositive(rateMlHr);
    if (v === null || r === null) return null;
    return v / r;
  }, [vol, rateMlHr]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--theme-muted-text)]">
        Educational calculator. Always follow institutional policies, smart pumps, and provider orders.
      </p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["pump", t("tools.ivInfusion.tabPump")],
            ["drip", t("tools.ivInfusion.tabDrip")],
            ["duration", t("tools.ivInfusion.tabDuration")],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === k ? "bg-primary text-white" : "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "pump" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.volumeMl")}</span>
              <Input inputMode="decimal" value={vol} onChange={(e) => setVol(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.hours")}</span>
              <Input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.minutes")}</span>
              <Input inputMode="decimal" value={mins} onChange={(e) => setMins(e.target.value)} />
            </label>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
            {mlHrFromVolTime === null ? (
              <p className="text-sm text-amber-800">{t("tools.ivInfusion.validation")}</p>
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
                {t("tools.ivInfusion.rateMlHr")}: {mlHrFromVolTime.toFixed(1)} {t("tools.ivInfusion.unitMlHr")}
              </p>
            )}
          </div>
        </div>
      ) : null}

      {mode === "drip" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.rateMlHr")}</span>
              <Input inputMode="decimal" value={rateMlHr} onChange={(e) => setRateMlHr(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.dropFactor")}</span>
              <Input inputMode="decimal" value={gtt} onChange={(e) => setGtt(e.target.value)} />
            </label>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
            {gttFromMlHr === null ? (
              <p className="text-sm text-amber-800">{t("tools.ivInfusion.validation")}</p>
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
                {t("tools.ivInfusion.gttMin")}: {gttFromMlHr.toFixed(1)} gtt/min
              </p>
            )}
          </div>
        </div>
      ) : null}

      {mode === "duration" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.volumeMl")}</span>
              <Input inputMode="decimal" value={vol} onChange={(e) => setVol(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.ivInfusion.rateMlHr")}</span>
              <Input inputMode="decimal" value={rateMlHr} onChange={(e) => setRateMlHr(e.target.value)} />
            </label>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
            {durationHrs === null ? (
              <p className="text-sm text-amber-800">{t("tools.ivInfusion.validation")}</p>
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
                {t("tools.ivInfusion.infuseOver")}: {durationHrs.toFixed(2)} hours ({(durationHrs * 60).toFixed(0)} min)
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
