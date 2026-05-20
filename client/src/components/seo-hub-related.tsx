import { ArrowRight, BookOpen, FlaskConical, Pill, Activity, BarChart3, Brain, FileText, type LucideIcon } from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
interface RelatedArticle {
  title: string;
  href: string;
  type?: string;
  description?: string;
}

interface SeoHubRelatedProps {
  articles: RelatedArticle[];
  title?: string;
  className?: string;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  condition: Activity,
  "lab-value": FlaskConical,
  medication: Pill,
  comparison: BarChart3,
  strategy: Brain,
  "question-bank-landing": BookOpen,
  default: FileText,
};

const TYPE_COLORS: Record<string, string> = {
  condition: "bg-red-50 text-red-600",
  "lab-value": "bg-blue-50 text-blue-600",
  medication: "bg-purple-50 text-purple-600",
  comparison: "bg-amber-50 text-amber-600",
  strategy: "bg-emerald-50 text-emerald-600",
  "question-bank-landing": "bg-cyan-50 text-cyan-600",
  default: "bg-gray-50 text-gray-600",
};

export function SeoHubRelatedArticles({ articles, title = "Related Resources", className = "" }: SeoHubRelatedProps) {
  const { t } = useI18n();
  if (!articles || articles.length === 0) return null;

  return (
    <section className={`${className}`} data-testid="seo-hub-related">
      <h2 className="text-xl font-bold text-gray-900 mb-5">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {articles.map((article, i) => {
          const Icon = TYPE_ICONS[article.type || "default"] || TYPE_ICONS.default;
          const colorClass = TYPE_COLORS[article.type || "default"] || TYPE_COLORS.default;
          const typeLabel = (article.type || "resource").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

          return (
            <LocaleLink
              key={i}
              href={article.href}
              className="group flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              data-testid={`link-related-${i}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{typeLabel}</span>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{article.description}</p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 mt-1 transition-colors" />
            </LocaleLink>
          );
        })}
      </div>
    </section>
  );
}

interface InternalLinkSectionProps {
  parentHub: { title: string; href: string };
  siblings?: RelatedArticle[];
  questionBankLink?: { title: string; href: string };
  pricingLink?: boolean;
  storedLinks?: { title: string; href: string }[];
}

export function SeoHubInternalLinks({ parentHub, siblings, questionBankLink, pricingLink = true, storedLinks }: InternalLinkSectionProps) {
  const validStoredLinks = (storedLinks || []).filter(
    (l) => l && l.title && l.href && l.href !== parentHub.href
  );

  return (
    <nav className="bg-gray-50 rounded-xl p-5 border border-gray-200" data-testid="seo-hub-internal-links">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("components.seoHubRelated.exploreMore")}</h3>
      <ul className="space-y-2">
        <li>
          <LocaleLink href={parentHub.href} className="flex items-center gap-2 text-sm text-primary hover:underline" data-testid="link-parent-hub">
            <ArrowRight className="w-3 h-3" />
            {parentHub.title}
          </LocaleLink>
        </li>
        {validStoredLinks.map((link, i) => (
          <li key={`stored-${i}`}>
            <LocaleLink href={link.href} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors" data-testid={`link-stored-${i}`}>
              <ArrowRight className="w-3 h-3" />
              {link.title}
            </LocaleLink>
          </li>
        ))}
        {siblings?.map((sib, i) => (
          <li key={i}>
            <LocaleLink href={sib.href} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors" data-testid={`link-sibling-${i}`}>
              <ArrowRight className="w-3 h-3" />
              {sib.title}
            </LocaleLink>
          </li>
        ))}
        {questionBankLink && (
          <li>
            <LocaleLink href={questionBankLink.href} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors" data-testid="link-question-bank">
              <BookOpen className="w-3 h-3" />
              {questionBankLink.title}
            </LocaleLink>
          </li>
        )}
        {pricingLink && (
          <li>
            <LocaleLink href="/pricing" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors" data-testid="link-pricing">
              <ArrowRight className="w-3 h-3" />
              View Pricing & Plans
            </LocaleLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
