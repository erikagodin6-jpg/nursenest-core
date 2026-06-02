import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type MarketingTrack, getTestimonialsForTrack } from "@/config/marketing-copy";

interface TrackTestimonialsProps {
  track: MarketingTrack;
}

export function TrackTestimonials({ track }: TrackTestimonialsProps) {
  const testimonials = getTestimonialsForTrack(track);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16" data-testid="track-testimonials">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: "#2E3A59" }}>
            What learners are saying
          </h2>
          <p className="text-[#2E3A59]/60 mt-3 max-w-2xl mx-auto">
            Real feedback from nursing learners who chose NurseNest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card
              key={index}
              className="border border-[#BFA6F6]/20 bg-white/60"
              data-testid={`testimonial-card-${index}`}
            >
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-[#BFA6F6]/30 mb-4" />
                <blockquote className="text-sm text-[#2E3A59]/80 leading-relaxed mb-6">
                  {testimonial.quote}
                </blockquote>
                <div className="border-t border-[#BFA6F6]/10 pt-4">
                  <p className="font-semibold text-sm" style={{ color: "#2E3A59" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#2E3A59]/50 mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
