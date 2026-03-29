"use client";

import { useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function parseNum(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Returns i18n key for primary acid-base interpretation (simplified). */
function classify(pH: number, pco2: number, hco3: number): string {
  const acid = pH < 7.35;
  const alk = pH > 7.45;
  if (!acid && !alk) return "tools.electrolyteAbg.result.normal";

  if (acid) {
    if (pco2 > 45 && hco3 >= 22) return "tools.electrolyteAbg.result.respAcid";
    if (hco3 < 22 && pco2 <= 45) return "tools.electrolyteAbg.result.metAcid";
    return "tools.electrolyteAbg.result.mixedOrComp";
  }
  if (pco2 < 35 && hco3 <= 26) return "tools.electrolyteAbg.result.respAlk";
  if (hco3 > 26 && pco2 >= 35) return "tools.electrolyteAbg.result.metAlk";
  return "tools.electrolyteAbg.result.mixedOrComp";
}

export default function ElectrolyteAbgTool() {
  const { t } = useMarketingI18n();
  const [ph, setPh] = useState("7.42");
  const [pco2, setPco2] = useState("40");
  const [hco3, setHco3] = useState("24");

  const resultKey = useMemo(() => {
    const p = parseNum(ph);
    const c = parseNum(pco2);
    const h = parseNum(hco3);
    if (p === null || c === null || h === null) return null;
    return classify(p, c, h);
  }, [ph, pco2, hco3]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--theme-muted-text)]">{t("tools.electrolyteAbg.intro")}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.electrolyteAbg.ph")}</span>
          <Input inputMode="decimal" value={ph} onChange={(e) => setPh(e.target.value)} placeholder={t("tools.electrolyteAbg.phPlaceholder")} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.electrolyteAbg.paco2")}</span>
          <Input inputMode="decimal" value={pco2} onChange={(e) => setPco2(e.target.value)} placeholder={t("tools.electrolyteAbg.paco2Placeholder")} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.electrolyteAbg.hco3")}</span>
          <Input inputMode="decimal" value={hco3} onChange={(e) => setHco3(e.target.value)} placeholder={t("tools.electrolyteAbg.hco3Placeholder")} />
        </label>
      </div>
      <div className="rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-page-bg)] p-4">
        {resultKey === null ? (
          <p className="text-sm text-amber-700">{t("tools.electrolyteAbg.validation")}</p>
        ) : (
          <p className="text-lg font-semibold text-[var(--theme-heading-text)]">{t(resultKey)}</p>
        )}
      </div>
      <Button type="button" variant="outline" onClick={() => { setPh("7.42"); setPco2("40"); setHco3("24"); }}>
        {t("tools.electrolyteAbg.reset")}
      </Button>
      <p className="text-xs text-[var(--theme-muted-text)]">{t("tools.electrolyteAbg.caveat")}</p>
      <p className="text-xs text-[var(--theme-muted-text)]">{t("tools.disclaimer")}</p>
    </div>
  );
}
