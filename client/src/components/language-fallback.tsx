import { useI18n } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";

const FALLBACK_MESSAGES: Record<string, string> = {
  en: "This content is not yet available in your selected language.",
  fr: "Ce contenu n'est pas encore disponible dans la langue sélectionnée.",
  es: "Este contenido aún no está disponible en el idioma seleccionado.",
  zh: "此内容尚未提供所选语言的版本。",
  "zh-tw": "此內容尚未提供所選語言的版本。",
  ar: "هذا المحتوى غير متوفر بعد باللغة المحددة.",
  hi: "यह सामग्री अभी चयनित भाषा में उपलब्ध नहीं है।",
  pt: "Este conteúdo ainda não está disponível no idioma selecionado.",
  tl: "Hindi pa available ang content na ito sa napiling wika.",
  ko: "이 콘텐츠는 아직 선택한 언어로 제공되지 않습니다.",
  ja: "このコンテンツは選択された言語ではまだ利用できません。",
  de: "Dieser Inhalt ist in der gewählten Sprache noch nicht verfügbar.",
  vi: "Nội dung này chưa có sẵn bằng ngôn ngữ đã chọn.",
  pa: "ਇਹ ਸਮੱਗਰੀ ਅਜੇ ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
  ur: "یہ مواد ابھی منتخب زبان میں دستیاب نہیں ہے۔",
  fa: "این محتوا هنوز به زبان انتخاب شده در دسترس نیست.",
  th: "เนื้อหานี้ยังไม่พร้อมใช้งานในภาษาที่เลือก",
  tr: "Bu içerik seçilen dilde henüz mevcut değil.",
  id: "Konten ini belum tersedia dalam bahasa yang dipilih.",
  ht: "Kontni sa poko disponib nan lang ou chwazi a.",
};

interface LanguageFallbackProps {
  contentType?: string;
  contentId?: string;
  className?: string;
  compact?: boolean;
}

export function LanguageFallback({ contentType, contentId, className = "", compact = false }: LanguageFallbackProps) {
  const { language } = useI18n();
  const message = FALLBACK_MESSAGES[language] || FALLBACK_MESSAGES.en;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm py-1 ${className}`}
        data-testid={`fallback-language-${contentType || "generic"}`}
        data-content-id={contentId}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={`border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 ${className}`}
      data-testid={`fallback-language-${contentType || "generic"}`}
      data-content-id={contentId}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-700 dark:text-amber-300 font-medium text-sm">
            {message}
          </p>
          {contentType && (
            <p className="text-amber-600/70 dark:text-amber-400/70 text-xs mt-1">
              {contentType}{contentId ? ` #${contentId}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function useLanguageFallback() {
  const { language } = useI18n();

  const shouldShowFallback = (translationStatus?: string, hasContent?: boolean): boolean => {
    if (language === "en") return false;
    if (translationStatus === "missing") return true;
    if (hasContent === false) return true;
    return false;
  };

  const reportFallback = (contentType: string, contentId?: string) => {
    try {
      fetch("/api/language-health/report-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "fallback_activation",
          contentType,
          contentId,
          expectedLanguage: language,
          detail: `Fallback shown for ${contentType}${contentId ? ` #${contentId}` : ""}`,
        }),
      }).catch(() => {});
    } catch {}
  };

  return { shouldShowFallback, reportFallback, language };
}
