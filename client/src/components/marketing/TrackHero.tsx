import { useLocation } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type MarketingTrack, getMarketingCopy, resolveMarketingText } from "@/config/marketing-copy";
import { useRegion } from "@/hooks/use-region";

interface TrackHeroProps {
  track: MarketingTrack;
}

export function TrackHero({ track }: TrackHeroProps) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const [, setLocation] = useLocation();
  const copy = getMarketingCopy(track);
  const { hero } = copy;

  const handlePrimaryCta = () => {
    if (hero.primaryCtaPath.startsWith("#")) {
      const el = document.getElementById(hero.primaryCtaPath.slice(1));
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation(hero.primaryCtaPath);
    }
  };

  const handleSecondaryCta = () => {
    setLocation(hero.secondaryCtaPath);
  };

  return (
    <section
      className="relative overflow-hidden py-16 md:py-24"
      style={{ color: "#2E3A59" }}
      data-testid="track-hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#BFA6F6]/10 via-transparent to-[#BFA6F6]/5 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Badge variant="outline" className="mb-6 border-[#BFA6F6]/40 text-[#2E3A59]">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#BFA6F6]" />
          NurseNest Exam Prep
        </Badge>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
          style={{ color: "#2E3A59" }}
        >
          {r(hero.headline)}
        </h1>

        <p className="text-lg md:text-xl text-[#2E3A59]/70 max-w-3xl mx-auto mb-10 leading-relaxed">
          {r(hero.subheadline)}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            onClick={handlePrimaryCta}
            className="bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none px-8"
            data-testid="hero-primary-cta"
          >
            {hero.primaryCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleSecondaryCta}
            className="border-[#BFA6F6]/40 text-[#2E3A59] px-8"
            data-testid="hero-secondary-cta"
          >
            {hero.secondaryCta}
          </Button>
        </div>

        {hero.stats && hero.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {hero.stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-lg bg-white/60 border border-[#BFA6F6]/20"
                data-testid={`hero-stat-${index}`}
              >
                <div className="text-2xl font-bold text-[#BFA6F6]">{stat.value}</div>
                <div className="text-sm text-[#2E3A59]/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
