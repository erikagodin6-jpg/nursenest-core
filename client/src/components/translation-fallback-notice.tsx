import { useI18n } from "@/lib/i18n";
import { TranslationUnavailable } from "./translation-unavailable";

export function TranslationFallbackNotice() {
  const { language, isFallback } = useI18n();

  if (language === "en") return null;

  const showNotice = isFallback("intl.hub.title");
  if (!showNotice) return null;

  return (
    <div className="mb-6" data-testid="translation-fallback-notice">
      <TranslationUnavailable translationKey="intl.hub.title" />
    </div>
  );
}
