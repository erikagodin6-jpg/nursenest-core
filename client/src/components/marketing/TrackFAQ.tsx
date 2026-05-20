import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type MarketingTrack, getMarketingCopy } from "@/config/marketing-copy";

interface TrackFAQProps {
  track: MarketingTrack;
}

export function TrackFAQ({ track }: TrackFAQProps) {
  const copy = getMarketingCopy(track);
  const { faq } = copy;

  if (faq.length === 0) return null;

  return (
    <section className="py-12 md:py-16" data-testid="track-faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "#2E3A59" }}>
            Frequently asked questions
          </h2>
          <p className="text-[#2E3A59]/60 mt-3">
            Find answers about NurseNest exam prep.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faq.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger
                className="text-left font-medium"
                style={{ color: "#2E3A59" }}
                data-testid={`faq-trigger-${index}`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#2E3A59]/70 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
