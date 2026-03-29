import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/lib/LocaleLink";
import { ArrowRight, Eye, Sparkles } from "lucide-react";

import { useI18n } from "@/lib/i18n";
type TrustItem =
  | { id: string; type: "image"; title: string; caption?: string; src: string; href?: string; tag?: string; alt: string }
  | { id: string; type: "snippet"; title: string; excerpt: string; href: string; tag?: string };

function SkeletonCard() {
  const { t } = useI18n();
  return (
    <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[16/10] bg-gray-100 skeleton-pulse" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-100 rounded skeleton-pulse w-1/3" />
          <div className="h-5 bg-gray-100 rounded skeleton-pulse w-2/3" />
          <div className="h-4 bg-gray-100 rounded skeleton-pulse w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function ImageCard({ item }: { item: Extract<TrustItem, { type: "image" }> }) {
  const [loaded, setLoaded] = useState(false);

  const content = (
    <Card className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden h-full cursor-pointer" data-testid={`card-trust-${item.id}`}>
      <CardContent className="p-0">
        <div className="aspect-[16/10] overflow-hidden bg-gray-50 relative">
          {!loaded && <div className="absolute inset-0 bg-gray-100 skeleton-pulse" />}
          <img
            src={item.src}
            alt={item.alt}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            data-testid={`img-trust-${item.id}`}
          />
        </div>
        <div className="p-5">
          {item.tag && (
            <Badge variant="secondary" className="text-xs rounded-full px-2.5 py-0.5 mb-2 font-medium" data-testid={`badge-trust-tag-${item.id}`}>
              {item.tag}
            </Badge>
          )}
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors" data-testid={`text-trust-title-${item.id}`}>
            {item.title}
          </h3>
          {item.caption && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.caption}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (item.href) {
    return <LocaleLink href={item.href} className="block h-full">{content}</LocaleLink>;
  }
  return content;
}

function SnippetCard({ item }: { item: Extract<TrustItem, { type: "snippet" }> }) {
  return (
    <LocaleLink href={item.href} className="block h-full">
      <Card className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden h-full cursor-pointer" data-testid={`card-trust-${item.id}`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            {item.tag && (
              <Badge variant="secondary" className="text-xs rounded-full px-2.5 py-0.5 font-medium" data-testid={`badge-trust-tag-${item.id}`}>
                {item.tag}
              </Badge>
            )}
            <Eye className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0 ml-auto" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors" data-testid={`text-trust-title-${item.id}`}>
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2" data-testid={`text-trust-excerpt-${item.id}`}>
            {item.excerpt}
          </p>
          <div className="mt-4 pt-3 border-t border-gray-50">
            <span className="inline-flex items-center text-xs font-medium text-primary group-hover:gap-2 transition-all gap-1">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </LocaleLink>
  );
}

export function TrustShowcase() {
  const [items, setItems] = useState<TrustItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trust-showcase")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50/50 border-t border-gray-100" data-testid="section-trust-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("components.trustShowcase.insideNursenest")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-trust-heading">
            See What You'll Get
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-trust-subtitle">
            Explore real tools, lessons, and study resources before you commit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map(item =>
                item.type === "image"
                  ? <ImageCard key={item.id} item={item} />
                  : <SnippetCard key={item.id} item={item as Extract<TrustItem, { type: "snippet" }>} />
              )
          }
        </div>
      </div>
    </section>
  );
}
