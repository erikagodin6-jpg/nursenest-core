import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { type MarketingTrack, getAllTrackCards, resolveMarketingText } from "@/config/marketing-copy";
import { useRegion } from "@/hooks/use-region";

interface TrackSelectorProps {
  onSelect: (track: MarketingTrack) => void;
}

const trackKeys: MarketingTrack[] = ["rpn", "rn", "np"];

export function TrackSelector({ onSelect }: TrackSelectorProps) {
  const region = useRegion();
  const r = (text: string) => resolveMarketingText(text, region);
  const cards = getAllTrackCards();

  return (
    <section className="py-12 md:py-16" data-testid="track-selector">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "#2E3A59" }}>
            Choose your study track
          </h2>
          <p className="text-[#2E3A59]/60 mt-3 max-w-2xl mx-auto">
            Select the path that matches your exam level for a personalized study experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const track = trackKeys[index];
            return (
              <Card
                key={track}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${card.accentClass}`}
                onClick={() => onSelect(track)}
                data-testid={`track-card-${track}`}
              >
                <CardHeader>
                  <CardTitle className="text-xl" style={{ color: "#2E3A59" }}>
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-[#2E3A59]/60 mt-2">
                    {card.audience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {card.benefits.slice(0, 4).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#2E3A59]/80">
                        <CheckCircle className="w-4 h-4 text-[#BFA6F6] mt-0.5 shrink-0" />
                        <span>{r(benefit)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(track);
                    }}
                    data-testid={`track-cta-${track}`}
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
