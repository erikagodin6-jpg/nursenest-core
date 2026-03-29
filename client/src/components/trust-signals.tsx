import { Shield, Award, Users, Star, CheckCircle } from "lucide-react";
import { getTierTrust, type TierTestimonial } from "@shared/tier-messaging";

import { useI18n } from "@/lib/i18n";
const TIER_HEADINGS: Record<string, { heading: string; subtext: string }> = {
  rpn: {
    heading: "Trusted by Practical Nursing Students Across Canada",
    subtext: "Real results from real students preparing for the REx-PN exam.",
  },
  rn: {
    heading: "Trusted by RN Students Across North America",
    subtext: "Real results from real students preparing for the NCLEX-RN exam.",
  },
  np: {
    heading: "Trusted by Nurse Practitioner Students",
    subtext: "Real results from NP students preparing for AANP, ANCC, and CNPE certification exams.",
  },
};

const DEFAULT_HEADING = {
  heading: "Trusted by Nursing Students Across North America",
  subtext: "Real results from real students preparing for their nursing exams.",
};

interface TrustSignalsProps {
  testimonials?: TierTestimonial[];
  showStats?: boolean;
  className?: string;
  activeTier?: string;
}

export function TrustSignals({ testimonials, showStats = true, className = "", activeTier }: TrustSignalsProps) {
  const { t } = useI18n();
  const normalizedTier = activeTier === "pharmacology" ? "rpn" : activeTier;
  const trustConfig = normalizedTier ? getTierTrust(normalizedTier) : null;
  const tierTestimonials = trustConfig?.testimonials || [];
  const allTestimonials = ["rpn", "rn", "np"].flatMap(t => getTierTrust(t)?.testimonials || []);
  const displayTestimonials = testimonials || (tierTestimonials.length > 0 ? tierTestimonials : allTestimonials);
  const headings = normalizedTier && TIER_HEADINGS[normalizedTier] ? TIER_HEADINGS[normalizedTier] : DEFAULT_HEADING;

  return (
    <section className={`py-16 ${className}`} data-testid="trust-signals-section">
      {showStats && (
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustConfig?.stats ? (
              <>
                {trustConfig.stats.map((s, i) => (
                  <StatCard key={i} icon={<Award className="w-6 h-6 text-primary" />} value={s.value} label={s.label} testId={`stat-tier-${i}`} />
                ))}
                <StatCard icon={<Shield className="w-6 h-6 text-primary" />} value="100%" label={t("components.trustSignals.evidencebasedContent")} testId="stat-evidence" />
              </>
            ) : (
              <>
                <StatCard icon={<Users className="w-6 h-6 text-primary" />} value="12,000+" label={t("components.trustSignals.activeStudents")} testId="stat-students" />
                <StatCard icon={<Award className="w-6 h-6 text-primary" />} value="8,000+" label={t("components.trustSignals.practiceQuestions")} testId="stat-questions" />
                <StatCard icon={<Award className="w-6 h-6 text-primary" />} value="94%" label={t("components.trustSignals.firstattemptPassRate")} testId="stat-pass-rate" />
                <StatCard icon={<Shield className="w-6 h-6 text-primary" />} value="100%" label={t("components.trustSignals.evidencebasedContent2")} testId="stat-evidence" />
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2" data-testid="text-testimonials-heading">
          {headings.heading}
        </h2>
        <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
          {headings.subtext}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {displayTestimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label, testId }: { icon: React.ReactNode; value: string; label: string; testId: string }) {
  return (
    <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm" data-testid={testId}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: TierTestimonial; index: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow" data-testid={`testimonial-card-${index}`}>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed mb-4 italic">"{testimonial.text}"</p>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
