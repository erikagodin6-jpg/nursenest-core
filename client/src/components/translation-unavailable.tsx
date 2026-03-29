import { useI18n, LANGUAGES, TRANSLATION_UNAVAILABLE_MARKER, isTranslationUnavailable } from "@/lib/i18n";
import { Globe, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

const FALLBACK_MESSAGES: Record<string, string> = {
  en: "This content is not yet available in your selected language.",
  fr: "Ce contenu n'est pas encore disponible dans la langue sélectionnée.",
  es: "Este contenido aún no está disponible en el idioma seleccionado.",
  zh: "此内容尚未提供您所选语言的版本。",
  "zh-tw": "此內容尚未提供您所選語言的版本。",
  ar: "هذا المحتوى غير متوفر بعد باللغة المختارة.",
  hi: "यह सामग्री अभी आपकी चयनित भाषा में उपलब्ध नहीं है।",
  pt: "Este conteúdo ainda não está disponível no idioma selecionado.",
  tl: "Hindi pa available ang content na ito sa iyong napiling wika.",
  ko: "이 콘텐츠는 아직 선택한 언어로 제공되지 않습니다.",
  ja: "このコンテンツは選択された言語ではまだご利用いただけません。",
  de: "Dieser Inhalt ist in der ausgewählten Sprache noch nicht verfügbar.",
  vi: "Nội dung này chưa có sẵn bằng ngôn ngữ bạn đã chọn.",
  pa: "ਇਹ ਸਮੱਗਰੀ ਅਜੇ ਤੁਹਾਡੀ ਚੁਣੀ ਗਈ ਭਾਸ਼ਾ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
  ur: "یہ مواد ابھی آپ کی منتخب زبان میں دستیاب نہیں ہے۔",
  fa: "این محتوا هنوز به زبان انتخابی شما موجود نیست.",
  ht: "Kontni sa poko disponib nan lang ou chwazi a.",
  th: "เนื้อหานี้ยังไม่พร้อมให้บริการในภาษาที่คุณเลือก",
  tr: "Bu içerik henüz seçtiğiniz dilde mevcut değildir.",
  id: "Konten ini belum tersedia dalam bahasa yang Anda pilih.",
};

const SWITCH_LANGUAGE_LABELS: Record<string, string> = {
  en: "Switch language",
  fr: "Changer de langue",
  es: "Cambiar idioma",
  zh: "切换语言",
  "zh-tw": "切換語言",
  ar: "تغيير اللغة",
  hi: "भाषा बदलें",
  pt: "Mudar idioma",
  tl: "Palitan ang wika",
  ko: "언어 변경",
  ja: "言語を切り替え",
  de: "Sprache wechseln",
  vi: "Chuyển ngôn ngữ",
  pa: "ਭਾਸ਼ਾ ਬਦਲੋ",
  ur: "زبان تبدیل کریں",
  fa: "تغییر زبان",
  ht: "Chanje lang",
  th: "เปลี่ยนภาษา",
  tr: "Dil değiştir",
  id: "Ganti bahasa",
};

const REPORT_LABELS: Record<string, string> = {
  en: "Report missing translation",
  fr: "Signaler une traduction manquante",
  es: "Reportar traducción faltante",
  zh: "报告缺失翻译",
  "zh-tw": "回報缺少翻譯",
  ar: "الإبلاغ عن ترجمة مفقودة",
  hi: "गायब अनुवाद की रिपोर्ट करें",
  pt: "Relatar tradução ausente",
  tl: "I-report ang nawawalang pagsasalin",
  ko: "누락된 번역 신고",
  ja: "翻訳不足を報告",
  de: "Fehlende Übersetzung melden",
  vi: "Báo cáo bản dịch thiếu",
  pa: "ਗੁੰਮ ਅਨੁਵਾਦ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
  ur: "گمشدہ ترجمہ کی اطلاع دیں",
  fa: "گزارش ترجمه ناموجود",
  ht: "Rapòte tradiksyon ki manke",
  th: "รายงานการแปลที่ขาดหายไป",
  tr: "Eksik çeviriyi bildirin",
  id: "Laporkan terjemahan yang hilang",
};

interface TranslationUnavailableProps {
  translationKey?: string;
  compact?: boolean;
  className?: string;
}

export function TranslationUnavailable({ translationKey, compact = false, className = "" }: TranslationUnavailableProps) {
  const { language, setLanguage, reportMissingTranslation } = useI18n();

  if (language === "en") return null;

  const message = FALLBACK_MESSAGES[language] || FALLBACK_MESSAGES.en;
  const switchLabel = SWITCH_LANGUAGE_LABELS[language] || SWITCH_LANGUAGE_LABELS.en;
  const reportLabel = REPORT_LABELS[language] || REPORT_LABELS.en;

  const handleReport = () => {
    if (translationKey) {
      reportMissingTranslation(translationKey, "user_report");
    }
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-amber-600 text-sm italic ${className}`}
        data-testid="translation-unavailable-compact"
        title={message}
      >
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{message}</span>
      </span>
    );
  }

  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}
      data-testid="translation-unavailable"
    >
      <div className="flex items-start gap-3">
        <Globe className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-800 font-medium" data-testid="text-unavailable-message">
            {message}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-amber-600" htmlFor="translation-lang-switch">
                {switchLabel}:
              </label>
              <select
                id="translation-lang-switch"
                className="text-xs border border-amber-300 rounded px-2 py-1 bg-white text-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                data-testid="select-language-switch"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleReport}
              className="text-xs text-amber-600 underline hover:text-amber-800 transition-colors"
              data-testid="button-report-translation"
            >
              {reportLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TranslationGateProps {
  translationKey: string;
  children: ReactNode;
  fallback?: ReactNode;
  vars?: Record<string, string>;
}

export function TranslationGate({ translationKey, children, fallback, vars }: TranslationGateProps) {
  const { t } = useI18n();
  const text = t(translationKey, vars);

  if (isTranslationUnavailable(text)) {
    return <>{fallback || <TranslationUnavailable translationKey={translationKey} compact />}</>;
  }

  return <>{children}</>;
}

export function SafeTranslation({ translationKey, vars, compact = false }: { translationKey: string; vars?: Record<string, string>; compact?: boolean }) {
  const { tSafe } = useI18n();
  const result = tSafe(translationKey, vars);

  if (result.isUnavailable) {
    return <TranslationUnavailable translationKey={translationKey} compact={compact} />;
  }

  return <>{result.text}</>;
}
