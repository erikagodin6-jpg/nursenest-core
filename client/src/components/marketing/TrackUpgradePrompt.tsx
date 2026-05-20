import { useLocation } from "wouter";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { type MarketingTrack, getMarketingCopy } from "@/config/marketing-copy";

interface TrackUpgradePromptProps {
  track: MarketingTrack;
}

export function TrackUpgradePrompt({ track }: TrackUpgradePromptProps) {
  const [, setLocation] = useLocation();
  const copy = getMarketingCopy(track);
  const { upgrade } = copy;

  const handleUpgrade = () => {
    setLocation(`/pricing/${track}`);
  };

  return (
    <Card
      className="border-2 border-[#BFA6F6]/30 bg-gradient-to-br from-[#BFA6F6]/5 to-transparent"
      data-testid="track-upgrade-prompt"
    >
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-[#BFA6F6]" />
          <CardTitle className="text-lg" style={{ color: "#2E3A59" }}>
            {upgrade.headline}
          </CardTitle>
        </div>
        <CardDescription className="text-[#2E3A59]/60">
          {upgrade.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {upgrade.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-[#2E3A59]/80">
              <CheckCircle className="w-4 h-4 text-[#BFA6F6] mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none"
          onClick={handleUpgrade}
          data-testid="upgrade-cta"
        >
          {upgrade.cta}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
