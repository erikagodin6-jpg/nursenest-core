/**
 * Static marketing navigation for public-static layout.
 * 
 * - No dynamic content
 * - No personalization
 * - Pure static links
 * - CDN/ISR friendly
 */

import Link from "next/link";

const STATIC_NAV_ITEMS = [
  { label: "Pathways", href: "/pathways" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

export function MarketingNavigation() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {STATIC_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
