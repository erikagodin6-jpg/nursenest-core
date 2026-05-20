import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { getTierTrust, type TierTestimonial } from "@shared/tier-messaging";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen,
  ClipboardList,
  Layers,
  Star,
  Users,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SocialProofBarProps {
  variant?: "default" | "compact" | "wide";
  tier?: string;
}

interface ContentCounts {
  lessons: number;
  questions: number;
  flashcards: number;
}

export function SocialProofBar({ variant = "default", tier }: SocialProofBarProps) {
  const { t } = useI18n();
  const { effectiveTier } = useAuth();
  const [counts, setCounts] = useState<ContentCounts>({ lessons: 240, questions: 1000, flashcards: 500 });
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const activeTier = tier || effectiveTier || "rpn";
  const normalizedTier = ["rpn", "rn", "np"].includes(activeTier) ? activeTier : "rpn";
  const trustData = getTierTrust(normalizedTier);
  const testimonials: TierTestimonial[] = trustData?.testimonials || [];

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [statsRes] = await Promise.all([
          fetch("/api/content-stats").catch(() => null),
        ]);
        if (statsRes?.ok) {
          const data = await statsRes.json();
          if (data.lessons || data.questions || data.flashcards) {
            setCounts({
              lessons: data.lessons || counts.lessons,
              questions: data.questions || counts.questions,
              flashcards: data.flashcards || counts.flashcards,
            });
          }
        }
      } catch {}
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setTestimonialIdx((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const formatCount = (n: number) => {
    if (n >= 1000) return `${Math.round(n / 100) / 10}K+`;
    return `${n}+`;
  };

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 px-4 bg-gray-50 rounded-xl border border-gray-100" data-testid="social-proof-bar-compact">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-900">{formatCount(counts.lessons)}</span> Lessons
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClipboardList className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-900">{formatCount(counts.questions)}</span> Questions
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-semibold text-gray-900">{formatCount(counts.flashcards)}</span> Flashcards
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">4.8/5</span>
        </div>
      </div>
    );
  }

  const currentTestimonial = testimonials[testimonialIdx];

  return (
    <div className="space-y-4" data-testid="social-proof-bar">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">{t("components.conversionFunnelSocialProofBar.trustedByStudents")}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-lessons-count">
          <BookOpen className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{formatCount(counts.lessons)}</p>
          <p className="text-xs text-gray-500">{t("components.conversionFunnelSocialProofBar.lessons")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-questions-count">
          <ClipboardList className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{formatCount(counts.questions)}</p>
          <p className="text-xs text-gray-500">{t("components.conversionFunnelSocialProofBar.questions")}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center" data-testid="stat-flashcards-count">
          <Layers className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900">{formatCount(counts.flashcards)}</p>
          <p className="text-xs text-gray-500">{t("components.conversionFunnelSocialProofBar.flashcards")}</p>
        </div>
      </div>

      {currentTestimonial && (
        <Card className="border-gray-100 bg-gray-50/50" data-testid="card-testimonial">
          <CardContent className="p-5">
            <Quote className="w-6 h-6 text-primary/30 mb-2" />
            <p className="text-sm text-gray-700 leading-relaxed mb-3 italic" data-testid="text-testimonial">
              "{currentTestimonial.text}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900" data-testid="text-testimonial-name">
                  {currentTestimonial.name}
                </p>
                <p className="text-xs text-gray-500">{currentTestimonial.role}</p>
              </div>
              <div className="flex items-center gap-1">
                {testimonials.length > 1 && (
                  <>
                    <button onClick={prevTestimonial} className="p-1 hover:bg-gray-200 rounded-md" data-testid="button-prev-testimonial">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={nextTestimonial} className="p-1 hover:bg-gray-200 rounded-md" data-testid="button-next-testimonial">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                )}
                <div className="flex items-center gap-0.5 ml-1">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
