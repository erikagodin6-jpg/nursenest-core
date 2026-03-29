import { Link } from "wouter";
import { CERTIFICATION_GOALS } from "@shared/platform-manifest";
import { Award, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
export default function HeroCertifications() {
  const { t } = useI18n();
  return (
    <section
      className="bg-gradient-to-b from-gray-50/80 to-white"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-certifications-hero"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-certifications-heading"
          >
            Nursing Certification Prep
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            Prepare for specialty certifications with targeted question banks ranging from 1,500 to 3,500 questions per certification.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CERTIFICATION_GOALS.map((cert) => (
            <Link
              key={cert.label}
              href={cert.route}
              className="group bg-white rounded-xl border border-gray-100 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 hover:-translate-y-0.5 p-4 no-underline"
              data-testid={`cert-card-${cert.label.toLowerCase().replace(/[\s()]/g, "-")}`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{cert.label}</h3>
              </div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{cert.goalQuestions.toLocaleString()}+</span> questions
              </p>
              <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                <span>{t("components.heroCertifications.startPrep")}</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/nursing-certifications"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            data-testid="link-all-certifications"
          >
            View all certifications
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
