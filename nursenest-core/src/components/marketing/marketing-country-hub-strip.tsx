"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const HUBS = [
  { label: "Canada", path: "/canada" },
  { label: "US", path: "/us" },
  { label: "Philippines", path: "/philippines" },
  { label: "Middle East", path: "/middle-east" },
] as const;

export type MarketingCountryHubStripSurface = "light" | "darkUtility";

export function MarketingCountryHubStrip({ surface = "light" }: { surface?: MarketingCountryHubStripSurface }) {
  const { locale } = useMarketingI18n();
  const pathname = usePathname() || "/";
  const { pathname: stripped } = stripMarketingLocalePrefix(pathname);

  const onDarkUtility = surface === "darkUtility";

  return (
    <nav
      aria-label="Country hubs"
      className={
        onDarkUtility
          ? "hidden min-[1280px]:flex max-w-[min(100%,28rem)] flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[11px] font-medium leading-tight text-white min-[1440px]:max-w-none"
          : "hidden min-[1280px]:flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[11px] font-medium leading-tight text-[var(--theme-heading-text)] opacity-90 min-[1440px]:max-w-none"
      }
    >
      <span
        className={
          onDarkUtility
            ? "whitespace-nowrap text-[color-mix(in_srgb,white_70%,transparent)]"
            : "whitespace-nowrap text-[color-mix(in_srgb,var(--theme-heading-text)_72%,transparent)]"
        }
      >
        Hubs
      </span>
      {HUBS.map((h) => {
        const href = withMarketingLocale(locale, h.path);
        const active = stripped === h.path || stripped.startsWith(`${h.path}/`);
        return (
          <Link
            key={h.path}
            href={href}
            className={
              onDarkUtility
                ? active
                  ? "whitespace-nowrap rounded-md bg-[color-mix(in_srgb,white_16%,transparent)] px-1.5 py-0.5 text-white underline-offset-2"
                  : "whitespace-nowrap rounded-md px-1.5 py-0.5 text-[color-mix(in_srgb,white_88%,transparent)] underline-offset-2 hover:underline"
                : active
                  ? "whitespace-nowrap rounded-md bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] px-1.5 py-0.5 text-[var(--semantic-brand)] underline-offset-2"
                  : "whitespace-nowrap rounded-md px-1.5 py-0.5 underline-offset-2 hover:underline"
            }
          >
            {h.label}
          </Link>
        );
      })}
    </nav>
  );
}
