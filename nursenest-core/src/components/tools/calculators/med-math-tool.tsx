"use client";

import { useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function parsePositive(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function MedMathTool() {
  const { t } = useMarketingI18n();
  const [mode, setMode] = useState<"iv" | "dose">("iv");
  const [vol, setVol] = useState("100");
  const [mins, setMins] = useState("60");
  const [gtt, setGtt] = useState("15");
  const [ordered, setOrdered] = useState("500");
  const [have, setHave] = useState("250");
  const [per, setPer] = useState("5");

  const ivResult = useMemo(() => {
    const v = parsePositive(vol);
    const m = parsePositive(mins);
    const d = parsePositive(gtt);
    if (v === null || m === null || d === null) return null;
    return (v * d) / m;
  }, [vol, mins, gtt]);

  const doseMl = useMemo(() => {
    const o = parsePositive(ordered);
    const h = parsePositive(have);
    const p = parsePositive(per);
    if (o === null || h === null || p === null || h === 0) return null;
    return (o / h) * p;
  }, [ordered, have, per]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "iv" ? "bg-primary text-white" : "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"}`}
          onClick={() => setMode("iv")}
        >
          {t("tools.medMath.tabIv")}
        </Button>
        <Button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "dose" ? "bg-primary text-white" : "border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"}`}
          onClick={() => setMode("dose")}
        >
          {t("tools.medMath.tabDose")}
        </Button>
      </div>
      {mode === "iv" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.volume")}</span>
              <Input inputMode="decimal" value={vol} onChange={(e) => setVol(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.minutes")}</span>
              <Input inputMode="decimal" value={mins} onChange={(e) => setMins(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.dropFactor")}</span>
              <Input inputMode="numeric" value={gtt} onChange={(e) => setGtt(e.target.value)} />
            </label>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
            {ivResult === null ? (
              <p className="text-sm text-amber-700">{t("tools.medMath.validation.iv")}</p>
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
                {t("tools.medMath.rate")}: {ivResult.toFixed(1)} {t("tools.medMath.unitGttMin")}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[var(--theme-muted-text)]">{t("tools.medMath.doseHelp")}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.orderedMg")}</span>
              <Input inputMode="decimal" value={ordered} onChange={(e) => setOrdered(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.haveMg")}</span>
              <Input inputMode="decimal" value={have} onChange={(e) => setHave(e.target.value)} />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.medMath.haveMl")}</span>
              <Input inputMode="decimal" value={per} onChange={(e) => setPer(e.target.value)} />
            </label>
          </div>
          <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
            {doseMl === null ? (
              <p className="text-sm text-amber-700">{t("tools.medMath.validation.dose")}</p>
            ) : (
              <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
                {t("tools.medMath.volumeToGive")}: {doseMl.toFixed(2)} mL
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--theme-muted-text)]">{t("tools.disclaimer")}</p>
    </div>
  );
}
