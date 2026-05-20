import {
  FlaskConical,
  ClipboardCheck,
  BarChart3,
  Brain,
  Shield,
  Target,
  Users,
  Stethoscope,
  Activity,
  Pill,
} from "lucide-react";
import { type MarketingTrack, getMarketingCopy, resolveMarketingText } from "@/config/marketing-copy";
import { useRegion } from "@/hooks/use-region";
import type { LucideIcon } from "lucide-react";

interface TrackFeaturesProps {
  track: MarketingTrack;
}

const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  ClipboardCheck,
  BarChart3,
  Brain,
  Shield,
  Target,
  Users,
  Stethoscope,
  Activity,
  Pill,
};

export function TrackFeatures({ track }: TrackFeaturesProps) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const copy = getMarketingCopy(track);
  const { solution } = copy;

  return (
    <section className="py-12 md:py-16" data-testid="track-features">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "#2E3A59" }}>
            {solution.headline}
          </h2>
          <p className="text-[#2E3A59]/60 mt-3 max-w-2xl mx-auto">
            {solution.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solution.features.slice(0, 4).map((feature, index) => {
            const Icon = iconMap[feature.icon] || FlaskConical;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl border border-[#BFA6F6]/20 bg-white/60 hover:shadow-md transition-shadow"
                data-testid={`feature-card-${index}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#BFA6F6]/10 mb-4">
                  <Icon className="w-6 h-6 text-[#BFA6F6]" />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "#2E3A59" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-[#2E3A59]/60 leading-relaxed">
                  {r(feature.description)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
