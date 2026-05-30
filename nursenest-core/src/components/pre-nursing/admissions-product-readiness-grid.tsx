import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import {
  ADMISSIONS_PRODUCT_READINESS,
  getAdmissionsProductCompletionPercent,
} from "@/lib/pre-nursing/admissions-product-readiness";

export function AdmissionsProductReadinessGrid() {
  return (
    <section className="space-y-4" aria-labelledby="admissions-product-readiness-heading">
      <div className="max-w-3xl">
        <p className="nn-premium-home-eyebrow">Admissions Products</p>
        <h2 id="admissions-product-readiness-heading" className="nn-marketing-h2 text-balance text-[var(--palette-heading)]">
          HESI A2, ATI TEAS, and CASPer status
        </h2>
        <p className="nn-marketing-body-sm mt-3 text-pretty text-[var(--semantic-text-secondary)]">
          These pathways are being built as dedicated products. Until each launch checklist is complete, NurseNest labels
          them clearly and does not route learners into a generic Pre-Nursing substitute.
        </p>
      </div>
      <ul className="grid list-none gap-4 p-0 md:grid-cols-3" data-testid="admissions-product-readiness-grid">
        {ADMISSIONS_PRODUCT_READINESS.map((product) => (
          <li
            key={product.slug}
            className="nn-surface-elevated rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-accent)]">
                  {product.statusLabel}
                </p>
                <h3 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{product.shortLabel}</h3>
              </div>
              <ClipboardCheck className="h-5 w-5 shrink-0 text-[var(--semantic-accent)]" aria-hidden />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)]">{product.summary}</p>
            <div className="mt-4 rounded-xl bg-[var(--semantic-panel-muted)] p-3 text-sm text-[var(--semantic-text-primary)]">
              Product completion: {getAdmissionsProductCompletionPercent(product)}%
            </div>
            <Link
              href={product.canonicalPath}
              className="nn-btn-secondary mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
            >
              View status
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
