import { type ReactNode } from "react";
import { useI18n } from "../lib/i18n";

interface FallbackOverlayProps {
  translationKey: string;
  children: ReactNode;
}

export function I18nFallbackOverlay({ translationKey, children }: FallbackOverlayProps) {
  const { isFallback, language } = useI18n();

  if (!import.meta.env.DEV || language === "en" || !isFallback(translationKey)) {
    return <>{children}</>;
  }

  return (
    <span
      data-testid={`i18n-fallback-${translationKey}`}
      title={`Missing translation for key "${translationKey}" in language "${language}"`}
      style={{
        border: "2px dashed #ef4444",
        borderRadius: "2px",
        padding: "1px 3px",
        position: "relative",
        display: "inline",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
      }}
    >
      {children}
    </span>
  );
}

export function useTranslateWithOverlay() {
  const { t, isFallback, language } = useI18n();

  return function tOverlay(key: string, vars?: Record<string, string>): { text: string; isFallback: boolean } {
    return {
      text: t(key, vars),
      isFallback: language !== "en" && isFallback(key),
    };
  };
}
