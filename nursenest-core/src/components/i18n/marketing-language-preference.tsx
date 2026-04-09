"use client";

import { Fragment, useTransition, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { preferMarketingLocale } from "@/app/actions/marketing-locale";
import {
  getMarketingLanguagesForSwitcher,
  marketingLanguageDisplayNameForSwitcher,
} from "@/lib/i18n/marketing-languages";
import { isExamHubMarketingPath } from "@/lib/i18n/exam-hub-path";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";

type Props = {
  /** Invoked after navigation/refresh (e.g. close mobile drawer). */
  onDone?: () => void;
  /** Per-language control (button or styled link-like). */
  renderItem: (args: {
    code: string;
    name: string;
    flag: string;
    disabled: boolean;
    onSelect: () => void;
  }) => ReactNode;
};

/**
 * Sets `MARKETING_LOCALE_COOKIE`, then:
 * - **Exam hubs** (`/us/…`, `/canada/…`): `router.refresh()` — URLs cannot take a `/{lang}/…` prefix.
 * - **Other marketing paths**: `router.push(withMarketingLocale(code, barePath))` so the URL matches
 *   the `(marketing)/[locale]/…` tree and refresh keeps the same language.
 */
export function MarketingLanguagePreferenceList({ onDone, renderItem }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [pending, startTransition] = useTransition();
  const { pathname: barePath } = stripMarketingLocalePrefix(pathname);
  const basePath = barePath || "/";
  /** Prefer stripped path so `/fr/us/…` is treated like an exam hub (cookie + refresh, no bad `push`). */
  const onExamHub = isExamHubMarketingPath(barePath) || isExamHubMarketingPath(pathname);
  /** `/app/…` URLs are not under `(marketing)/[locale]`; keep path stable and rely on the cookie + refresh. */
  const onAppShell = /^\/app(\/|$)/.test(pathname);

  function select(code: string) {
    startTransition(() => {
      void (async () => {
        const res = await preferMarketingLocale(code);
        if (!res.ok) return;
        if (onExamHub || onAppShell) {
          router.refresh();
        } else {
          router.push(withMarketingLocale(code, basePath));
        }
        onDone?.();
      })();
    });
  }

  const switcherLanguages = getMarketingLanguagesForSwitcher();

  return (
    <>
      {switcherLanguages.map((lang) => (
        <Fragment key={lang.code}>
          {renderItem({
            code: lang.code,
            name: marketingLanguageDisplayNameForSwitcher(lang),
            flag: lang.flag,
            disabled: pending,
            onSelect: () => select(lang.code),
          })}
        </Fragment>
      ))}
    </>
  );
}
