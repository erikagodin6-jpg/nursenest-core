"use client";

import Link from "next/link";
import { CERTIFICATION_GOALS } from "@shared/platform-manifest";
import { Award, ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { MARKETING_TERTIARY_LINK_CLASS } from "@/lib/theme/marketing-hero-pattern";

export default function HeroCertifications() {
  const { t } = useMarketingI18n();
  return (
    <section
      className="bg-gradient-to-b from-muted/80 to-[var(--theme-card-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-certifications-hero"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 nn-marketing-h2" data-testid="text-certifications-heading">
            Nursing Certification Prep
          </h2>
          <p className="mx-auto max-w-2xl nn-marketing-body text-muted-foreground">
            Prepare for specialty certifications with targeted question banks ranging from 1,500 to 3,500 questions per certification.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CERTIFICATION_GOALS.map((cert) => (
            <Link
              key={cert.label}
              href={mapLegacyMarketingHref(cert.route)}
              className="group no-underline rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`cert-card-${cert.label.toLowerCase().replace(/[\s()]/g, "-")}`}
            >
              <div className="mb-2.5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Award className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="nn-marketing-h4 leading-tight">{cert.label}</h3>
              </div>
              <p className="nn-marketing-caption text-muted-foreground">
                <span className="tabular-nums text-[var(--theme-heading-text)]">{cert.goalQuestions.toLocaleString()}+</span> questions
              </p>
              <div className="mt-2 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>{t("components.heroCertifications.startPrep")}</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={mapLegacyMarketingHref("/nursing-certifications")}
            className={`${MARKETING_TERTIARY_LINK_CLASS} gap-2 px-0 hover:underline`}
            data-testid="link-all-certifications"
          >
            View all certifications
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
