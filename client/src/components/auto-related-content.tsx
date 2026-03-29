import { useState, useEffect } from "react";
import { BookOpen, Brain, FlaskConical, FileText, ArrowRight, Lightbulb, Pill, TestTube, Stethoscope, type LucideIcon } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

interface RelatedItem {
  type: string;
  title: string;
  slug: string;
  href: string;
  description: string;
  bodySystem?: string;
  category?: string;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  lesson: BookOpen,
  blog: FileText,
  flashcard: Brain,
  "exam-question": FlaskConical,
  "clinical-clarity": Lightbulb,
  glossary: BookOpen,
  medication: Pill,
  "lab-value": TestTube,
  condition: Stethoscope,
};

const TYPE_COLORS: Record<string, string> = {
  lesson: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  blog: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
  flashcard: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  "exam-question": "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  "clinical-clarity": "bg-rose-50 text-rose-600 group-hover:bg-rose-100",
  glossary: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100",
  medication: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  "lab-value": "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
  condition: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
};

const TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  blog: "Article",
  flashcard: "Flashcards",
  "exam-question": "Practice Questions",
  "clinical-clarity": "Clinical Clarity",
  glossary: "Glossary",
  medication: "Medication",
  "lab-value": "Lab Value",
  condition: "Condition",
};

interface AutoRelatedContentProps {
  slug: string;
  contentType: "lesson" | "blog" | "flashcard-deck" | "exam-prep" | "allied-article" | "new-grad-guide" | "medication" | "lab-value" | "condition" | "comparison" | "specialty-hub";
  title?: string;
  bodySystem?: string;
  category?: string;
  tags?: string[];
  profession?: string;
  tier?: string;
  limit?: number;
  className?: string;
  sectionTitle?: string;
}

export function AutoRelatedContent({
  slug,
  contentType,
  title,
  bodySystem,
  category,
  tags,
  profession,
  tier,
  limit = 9,
  className = "",
  sectionTitle = "Explore Related Content",
}: AutoRelatedContentProps) {
  const [items, setItems] = useState<RelatedItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    const params = new URLSearchParams({ slug, contentType, limit: String(limit) });
    if (title) params.set("title", title);
    if (bodySystem) params.set("bodySystem", bodySystem);
    if (category) params.set("category", category);
    if (tags && tags.length > 0) params.set("tags", tags.join(","));
    if (profession) params.set("profession", profession);
    if (tier) params.set("tier", tier);

    fetch(`/api/related-content?${params}`)
      .then(r => r.ok ? r.json() : { related: [] })
      .then(data => setItems(data.related || []))
      .catch(() => {});
  }, [slug, contentType, title, bodySystem, category, tags?.join(","), profession, tier, limit]);

  if (items.length === 0) return null;

  return (
    <section className={`py-8 ${className}`} data-testid="auto-related-content">
      <h2 className="text-xl font-bold text-gray-900 mb-5" data-testid="text-auto-related-title">
        {sectionTitle}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => {
          const Icon = TYPE_ICONS[item.type] || BookOpen;
          const colorClass = TYPE_COLORS[item.type] || TYPE_COLORS.lesson;
          const label = TYPE_LABELS[item.type] || "Resource";
          return (
            <LocaleLink
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              data-testid={`link-auto-related-${i}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 mt-1 transition-colors" />
            </LocaleLink>
          );
        })}
      </div>
    </section>
  );
}

interface YouMayAlsoLikeProps {
  slug: string;
  contentType: "lesson" | "blog" | "flashcard-deck" | "exam-prep" | "allied-article" | "new-grad-guide" | "medication" | "lab-value" | "condition" | "comparison" | "specialty-hub";
  title?: string;
  bodySystem?: string;
  category?: string;
  tags?: string[];
  profession?: string;
  tier?: string;
  limit?: number;
  className?: string;
}

export function YouMayAlsoLike({
  slug,
  contentType,
  title,
  bodySystem,
  category,
  tags,
  profession,
  tier,
  limit = 5,
  className = "",
}: YouMayAlsoLikeProps) {
  const [items, setItems] = useState<RelatedItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    const params = new URLSearchParams({ slug, contentType, limit: String(limit) });
    if (title) params.set("title", title);
    if (bodySystem) params.set("bodySystem", bodySystem);
    if (category) params.set("category", category);
    if (tags && tags.length > 0) params.set("tags", tags.join(","));
    if (profession) params.set("profession", profession);
    if (tier) params.set("tier", tier);

    fetch(`/api/you-may-also-like?${params}`)
      .then(r => r.ok ? r.json() : { related: [] })
      .then(data => setItems(data.related || []))
      .catch(() => {});
  }, [slug, contentType, title, bodySystem, category, tags?.join(","), profession, tier, limit]);

  if (items.length === 0) return null;

  return (
    <section className={`py-8 border-t border-gray-100 ${className}`} data-testid="you-may-also-like">
      <h2 className="text-lg font-bold text-gray-900 mb-4" data-testid="text-you-may-also-like-title">
        You May Also Like
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const Icon = TYPE_ICONS[item.type] || BookOpen;
          const colorClass = TYPE_COLORS[item.type] || TYPE_COLORS.lesson;
          const label = TYPE_LABELS[item.type] || "Resource";
          return (
            <LocaleLink
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all"
              data-testid={`link-you-may-also-like-${i}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${colorClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary shrink-0 transition-colors" />
            </LocaleLink>
          );
        })}
      </div>
    </section>
  );
}
