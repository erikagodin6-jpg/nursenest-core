import { useMemo } from "react";
import { useLocation } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildBreadcrumbs, type BreadcrumbItem } from "@/lib/breadcrumb-builder";

import { useI18n } from "@/lib/i18n";
interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  title?: string;
  className?: string;
}

export function BreadcrumbNav({ items: customItems, title, className = "" }: BreadcrumbNavProps) {
  const { t } = useI18n();
  const [location] = useLocation();

  const items = useMemo(() => {
    if (customItems && customItems.length > 0) return customItems;
    return buildBreadcrumbs(location, { title });
  }, [customItems, location, title]);

  if (items.length < 2) return null;

  const DOMAIN = "https://www.nursenest.ca";

  return (
    <nav aria-label={t("components.breadcrumbNav.breadcrumb")} className={`mb-4 text-sm text-gray-500 ${className}`} data-testid="nav-breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const itemUrl = item.url || "/";
          const localPath = itemUrl.startsWith(DOMAIN) ? itemUrl.slice(DOMAIN.length) || "/" : itemUrl;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300" aria-hidden="true">/</span>}
              {isLast ? (
                <span className="text-gray-700 font-medium" aria-current="page">{item.name}</span>
              ) : (
                <LocaleLink href={localPath} className="hover:text-primary transition-colors">{item.name}</LocaleLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
