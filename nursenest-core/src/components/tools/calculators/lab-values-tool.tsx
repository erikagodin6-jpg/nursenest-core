"use client";

import { useMemo, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { Input } from "@/components/ui/input";

type Row = { id: string; nameKey: string; rangeKey: string; unitKey: string };

const ROWS: Row[] = [
  { id: "na", nameKey: "tools.labValues.row.na.name", rangeKey: "tools.labValues.row.na.range", unitKey: "tools.labValues.row.na.unit" },
  { id: "k", nameKey: "tools.labValues.row.k.name", rangeKey: "tools.labValues.row.k.range", unitKey: "tools.labValues.row.k.unit" },
  { id: "cl", nameKey: "tools.labValues.row.cl.name", rangeKey: "tools.labValues.row.cl.range", unitKey: "tools.labValues.row.cl.unit" },
  { id: "co2", nameKey: "tools.labValues.row.co2.name", rangeKey: "tools.labValues.row.co2.range", unitKey: "tools.labValues.row.co2.unit" },
  { id: "bun", nameKey: "tools.labValues.row.bun.name", rangeKey: "tools.labValues.row.bun.range", unitKey: "tools.labValues.row.bun.unit" },
  { id: "cr", nameKey: "tools.labValues.row.cr.name", rangeKey: "tools.labValues.row.cr.range", unitKey: "tools.labValues.row.cr.unit" },
  { id: "glu", nameKey: "tools.labValues.row.glu.name", rangeKey: "tools.labValues.row.glu.range", unitKey: "tools.labValues.row.glu.unit" },
  { id: "wbc", nameKey: "tools.labValues.row.wbc.name", rangeKey: "tools.labValues.row.wbc.range", unitKey: "tools.labValues.row.wbc.unit" },
  { id: "hb", nameKey: "tools.labValues.row.hb.name", rangeKey: "tools.labValues.row.hb.range", unitKey: "tools.labValues.row.hb.unit" },
  { id: "plt", nameKey: "tools.labValues.row.plt.name", rangeKey: "tools.labValues.row.plt.range", unitKey: "tools.labValues.row.plt.unit" },
];

export default function LabValuesTool() {
  const { t } = useMarketingI18n();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ROWS;
    return ROWS.filter((r) => t(r.nameKey).toLowerCase().includes(s));
  }, [q, t]);

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-[var(--theme-heading-text)]">{t("tools.labValues.search")}</span>
        <Input className="mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("tools.labValues.searchPlaceholder")} />
      </label>
      <div className="overflow-x-auto rounded-xl border border-[var(--theme-card-border)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-[var(--theme-page-bg)] text-[var(--theme-heading-text)]">
            <tr>
              <th className="px-3 py-2 font-semibold">{t("tools.labValues.colName")}</th>
              <th className="px-3 py-2 font-semibold">{t("tools.labValues.colRange")}</th>
              <th className="px-3 py-2 font-semibold">{t("tools.labValues.colUnit")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-[var(--theme-separator)]">
                <td className="px-3 py-2">{t(r.nameKey)}</td>
                <td className="px-3 py-2 text-[var(--theme-muted-text)]">{t(r.rangeKey)}</td>
                <td className="px-3 py-2 text-[var(--theme-muted-text)]">{t(r.unitKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--theme-muted-text)]">{t("tools.labValues.note")}</p>
      <p className="text-xs text-[var(--theme-muted-text)]">{t("tools.disclaimer")}</p>
    </div>
  );
}
