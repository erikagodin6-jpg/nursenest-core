import { LocaleLink } from "@/lib/LocaleLink";
import { ChevronRight, Home } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function AlliedBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useI18n();
  const allItems: BreadcrumbItem[] = [
    { label: "NurseNest", href: "/" },
    { label: "Allied Health", href: "/allied-health" },
    ...items,
  ];

  return (
    <nav aria-label={t("components.alliedBreadcrumb.breadcrumb")} className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="allied-breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        {allItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
            {idx === 0 && <Home className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
            {item.href && idx < allItems.length - 1 ? (
              <LocaleLink
                href={item.href}
                className="hover:text-primary transition-colors whitespace-nowrap"
                data-testid={`breadcrumb-link-${idx}`}
              >
                {item.label}
              </LocaleLink>
            ) : (
              <span
                className={idx === allItems.length - 1 ? "text-gray-900 font-medium whitespace-nowrap" : "whitespace-nowrap"}
                data-testid={`breadcrumb-text-${idx}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
