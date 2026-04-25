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
  onDone?: () => void;
  renderItem: (args: {
    code: string;
    name: string;
    flag: string;
    disabled: boolean;
    onSelect: () => void;
  }) => ReactNode;
};

export function MarketingLanguagePreferenceList({ onDone, renderItem }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [pending, startTransition] = useTransition();

  let barePath = "/";
  try {
    barePath = stripMarketingLocalePrefix(pathname).pathname || "/";
  } catch {
    barePath = pathname || "/";
  }

  const onExamHub = isExamHubMarketingPath(barePath) || isExamHubMarketingPath(pathname);
  const onAppShell = /^\/app(\/|$)/.test(pathname);

  function select(code: string) {
    startTransition(() => {
      void (async () => {
        try {
          const res = await preferMarketingLocale(code);
          if (!res?.ok) return;

          if (onExamHub || onAppShell) {
            router.refresh();
          } else {
            router.push(withMarketingLocale(code, barePath));
          }

          onDone?.();
        } catch {
          router.refresh();
        }
      })();
    });
  }

  let switcherLanguages: ReturnType<typeof getMarketingLanguagesForSwitcher> = [];

  try {
    switcherLanguages = getMarketingLanguagesForSwitcher();
  } catch {
    switcherLanguages = [];
  }

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