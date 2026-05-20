import { LocaleLink } from "@/lib/LocaleLink";
import { ArrowRight } from "lucide-react";
import { getTierCta } from "@shared/tier-messaging";

export function LessonLibraryCTA({ activeTier }: { activeTier: string }) {
  const content = getTierCta(activeTier);

  return (
    <>
      <section data-testid="how-it-helps-section" className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 data-testid="how-it-helps-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            How NurseNest Helps You Pass
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.steps.map((step, index) => (
              <div key={index} data-testid={`step-${index + 1}`} className="flex flex-col items-center text-center">
                <div data-testid={`step-number-${index + 1}`} className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-4 text-lg">
                  {index + 1}
                </div>
                <h3 data-testid={`step-title-${index + 1}`} className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p data-testid={`step-description-${index + 1}`} className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-testid="final-cta-section" className="bg-gradient-to-r from-primary/5 via-white to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="rounded-2xl py-16">
            <h2 data-testid="final-cta-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {content.heading}
            </h2>
            <p data-testid="final-cta-subtext" className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {content.subtext}
            </p>
            <LocaleLink href="/register" data-testid="final-cta-button">
              <span className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold shadow-lg hover:opacity-90 transition-opacity">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </span>
            </LocaleLink>
          </div>
        </div>
      </section>
    </>
  );
}
