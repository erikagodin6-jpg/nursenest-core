#!/usr/bin/env node
/**
 * One-time / maintenance: fills pages.publicPracticeExams.cat* keys with locale-appropriate
 * copy (not English placeholders). Run from repo root: node script/patch-practice-exams-cat-translations.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = join(__dirname, "../tools/i18n/marketing/locale");

/** Protected names left as in English where standard: NCLEX, CAT */
const T = {
  fr: {
    "pages.publicPracticeExams.catLinkPracticeTests": "tests d’entraînement",
    "pages.publicPracticeExams.catP1": "Pour les filières prises en charge, NurseNest propose également des ",
    "pages.publicPracticeExams.catP1Strong": "tests par thème",
    "pages.publicPracticeExams.catP2":
      " dans l’application, y compris des sessions adaptatives (style TAO) lorsque le produit les offre. La disponibilité varie selon la filière et le pack de contenu — ouvrez les ",
    "pages.publicPracticeExams.catP3":
      " après connexion pour voir ce qu’inclut votre abonnement. Ceci ne remplace pas les règles ni la planification officielles du NCLEX ni des ordres professionnels.",
  },
  es: {
    "pages.publicPracticeExams.catLinkPracticeTests": "pruebas de práctica",
    "pages.publicPracticeExams.catP1": "En las rutas admitidas, NurseNest también ofrece ",
    "pages.publicPracticeExams.catP1Strong": "pruebas por tema",
    "pages.publicPracticeExams.catP2":
      " en la app, incluidas sesiones adaptativas (estilo CAT) cuando el producto las implemente. La disponibilidad varía según la ruta y el paquete de contenido: abra las ",
    "pages.publicPracticeExams.catP3":
      " tras iniciar sesión para ver qué incluye su suscripción. Esto no sustituye las reglas ni la programación oficiales del NCLEX ni de la junta.",
  },
  tl: {
    "pages.publicPracticeExams.catLinkPracticeTests": "practice tests",
    "pages.publicPracticeExams.catP1": "Para sa mga suportadong landas, nag-aalok din ang NurseNest ng ",
    "pages.publicPracticeExams.catP1Strong": "mga pagsusulit ayon sa paksa",
    "pages.publicPracticeExams.catP2":
      " sa app, kasama ang mga adaptive (CAT-style) session kung available ito sa produkto. Mag-iiba ang availability ayon sa landas at content pack — buksan ang mga ",
    "pages.publicPracticeExams.catP3":
      " pagkatapos mag-sign in para makita kung ano ang kasama sa subscription. Hindi ito kapalit ng opisyal na iskedyul o patakaran ng NCLEX o board.",
  },
  ar: {
    "pages.publicPracticeExams.catLinkPracticeTests": "اختبارات تدريبية",
    "pages.publicPracticeExams.catP1": "للمسارات المدعومة، يوفّر NurseNest أيضًا ",
    "pages.publicPracticeExams.catP1Strong": "اختبارات على مستوى الموضوع",
    "pages.publicPracticeExams.catP2":
      " داخل التطبيق، بما في ذلك جلسات تكيّفية (بأسلوب CAT) عندما يوفّرها المنتج. يختلف التوفّر حسب المسار وحزمة المحتوى — افتح ",
    "pages.publicPracticeExams.catP3":
      " بعد تسجيل الدخول لمعرفة ما يشمله اشتراكك. هذا لا يغني عن قواعد أو جدولة NCLEX الرسمية أو هيئة الاعتماد.",
  },
  hi: {
    "pages.publicPracticeExams.catLinkPracticeTests": "अभ्यास परीक्षाएँ",
    "pages.publicPracticeExams.catP1": "समर्थित पथों के लिए, NurseNest यह भी प्रदान करता है ",
    "pages.publicPracticeExams.catP1Strong": "विषय-स्तर पर",
    "pages.publicPracticeExams.catP2":
      " ऐप में अभ्यास परीक्षाएँ, जिनमें अनुकूली (CAT-शैली) सत्र भी शामिल हैं जहाँ उत्पाद उन्हें लागू करता है। उपलब्धता पथ और सामग्री पैक के अनुसार बदलती है — साइन-इन के बाद ",
    "pages.publicPracticeExams.catP3":
      " खोलें ताकि देख सकें कि आपकी सदस्यता में क्या शामिल है। यह आधिकारिक NCLEX या बोर्ड नियमों/अनुसूची का विकल्प नहीं है।",
  },
  ja: {
    "pages.publicPracticeExams.catLinkPracticeTests": "演習テスト",
    "pages.publicPracticeExams.catP1": "対象パスでは、NurseNest は次も提供します：",
    "pages.publicPracticeExams.catP1Strong": "トピック単位",
    "pages.publicPracticeExams.catP2":
      " のアプリ内演習（製品が実装する場合は CAT 方式のセッションを含む）。パスとコンテンツパックにより利用可否は異なります。サインイン後に ",
    "pages.publicPracticeExams.catP3":
      " を開き、サブスクリプション内容を確認してください。公式の NCLEX や試験委員会の日程・規則に代わるものではありません。",
  },
  ko: {
    "pages.publicPracticeExams.catLinkPracticeTests": "연습 시험",
    "pages.publicPracticeExams.catP1": "지원되는 경로에서는 NurseNest가 다음도 제공합니다. ",
    "pages.publicPracticeExams.catP1Strong": "주제별",
    "pages.publicPracticeExams.catP2":
      " 연습 시험(제품이 구현하는 경우 CAT 방식 세션 포함). 이용 가능 여부는 경로와 콘텐츠 팩에 따라 다릅니다. 로그인한 뒤 ",
    "pages.publicPracticeExams.catP3":
      " 을(를) 열어 구독에 포함된 항목을 확인하세요. 공식 NCLEX 또는 시험 당국의 일정·규정을 대체하지 않습니다.",
  },
  zh: {
    "pages.publicPracticeExams.catLinkPracticeTests": "练习测验",
    "pages.publicPracticeExams.catP1": "在受支持的路径下，NurseNest 还提供按",
    "pages.publicPracticeExams.catP1Strong": "主题",
    "pages.publicPracticeExams.catP2":
      " 的练习测验（含产品实现的自适应 CAT 式环节）。可用性因路径与内容包而异——登录后打开 ",
    "pages.publicPracticeExams.catP3":
      " 以查看订阅包含的内容。不能替代官方 NCLEX 或委员会的日程与规则。",
  },
  "zh-tw": {
    "pages.publicPracticeExams.catLinkPracticeTests": "練習測驗",
    "pages.publicPracticeExams.catP1": "在受支援的路徑下，NurseNest 另提供依",
    "pages.publicPracticeExams.catP1Strong": "主題",
    "pages.publicPracticeExams.catP2":
      " 的練習測驗（含產品實作時的自適應 CAT 式環節）。可用性因路徑與內容套件而異——登入後開啟 ",
    "pages.publicPracticeExams.catP3":
      " 以檢視訂閱內容。無法取代官方 NCLEX 或委員會之日程與規定。",
  },
  pt: {
    "pages.publicPracticeExams.catLinkPracticeTests": "testes práticos",
    "pages.publicPracticeExams.catP1": "Nas trilhas atendidas, o NurseNest também oferece ",
    "pages.publicPracticeExams.catP1Strong": "testes por tópico",
    "pages.publicPracticeExams.catP2":
      " no app, incluindo sessões adaptativas (estilo CAT) quando o produto as implementar. A disponibilidade varia por trilha e pacote de conteúdo — abra os ",
    "pages.publicPracticeExams.catP3":
      " após entrar para ver o que sua assinatura inclui. Isto não substitui regras ou agendamento oficial do NCLEX ou do conselho.",
  },
  de: {
    "pages.publicPracticeExams.catLinkPracticeTests": "Übungstests",
    "pages.publicPracticeExams.catP1": "Für unterstützte Pfade bietet NurseNest außerdem ",
    "pages.publicPracticeExams.catP1Strong": "themenbezogene",
    "pages.publicPracticeExams.catP2":
      " Übungstests in der App, einschließlich adaptiver (CAT-ähnlicher) Sitzungen, sofern das Produkt sie bereitstellt. Die Verfügbarkeit hängt von Pfad und Content-Paket ab — öffnen Sie nach der Anmeldung die ",
    "pages.publicPracticeExams.catP3":
      ", um zu sehen, was Ihr Abo umfasst. Dies ersetzt keine offiziellen NCLEX- oder Board-Regeln oder -termine.",
  },
  fa: {
    "pages.publicPracticeExams.catLinkPracticeTests": "آزمون‌های تمرینی",
    "pages.publicPracticeExams.catP1": "برای مسیرهای پشتیبانی‌شده، NurseNest همچنین ارائه می‌دهد ",
    "pages.publicPracticeExams.catP1Strong": "آزمون‌های سطح موضوع",
    "pages.publicPracticeExams.catP2":
      " در اپ؛ شامل جلسات تطبیقی (سبک CAT) جایی که محصول پیاده‌سازی کند. دسترسی بسته به مسیر و بستهٔ محتواست — پس از ورود، ",
    "pages.publicPracticeExams.catP3":
      " را باز کنید تا ببینید اشتراک شما چه شامل می‌شود. جایگزین قوانین یا زمان‌بندی رسمی NCLEX یا هیئت نیست.",
  },
  ht: {
    "pages.publicPracticeExams.catLinkPracticeTests": "tès pratik",
    "pages.publicPracticeExams.catP1": "Pou chemins ki sipòte, NurseNest ofri tou ",
    "pages.publicPracticeExams.catP1Strong": "tès pa sijè",
    "pages.publicPracticeExams.catP2":
      " nan aplikasyon an, gen sesyon adaptif (stil CAT) lè pwodwi a mete yo. Disponibilite varye selon chem ak pake kontni — apre w konekte, louvri ",
    "pages.publicPracticeExams.catP3":
      " pou wè sa abònman ou gen ladan. Sa pa ranplase règ ofisyèl NCLEX oswa konsèy.",
  },
  id: {
    "pages.publicPracticeExams.catLinkPracticeTests": "latihan ujian",
    "pages.publicPracticeExams.catP1": "Untuk jalur yang didukung, NurseNest juga menawarkan ",
    "pages.publicPracticeExams.catP1Strong": "latihan per topik",
    "pages.publicPracticeExams.catP2":
      " di aplikasi, termasuk sesi adaptif (bergaya CAT) bila produk menyediakannya. Ketersediaan bervariasi menurut jalur dan paket konten — buka ",
    "pages.publicPracticeExams.catP3":
      " setelah masuk untuk melihat apa yang termasuk langganan Anda. Ini bukan pengganti aturan atau jadwal resmi NCLEX atau dewan.",
  },
  it: {
    "pages.publicPracticeExams.catLinkPracticeTests": "test di pratica",
    "pages.publicPracticeExams.catP1": "Per i percorsi supportati, NurseNest offre anche ",
    "pages.publicPracticeExams.catP1Strong": "test per argomento",
    "pages.publicPracticeExams.catP2":
      " nell’app, incluse sessioni adattive (stile CAT) dove il prodotto le implementa. La disponibilità varia per percorso e pacchetto contenuti — apri i ",
    "pages.publicPracticeExams.catP3":
      " dopo l’accesso per vedere cosa include l’abbonamento. Non sostituisce regole o programmazione ufficiale NCLEX o del board.",
  },
  pa: {
    "pages.publicPracticeExams.catLinkPracticeTests": "ਅਭਿਆਸ ਟੈਸਟ",
    "pages.publicPracticeExams.catP1": "ਸਮਰਥਿਤ ਮਾਰਗਾਂ ਲਈ, NurseNest ਇਹ ਵੀ ਦਿੰਦਾ ਹੈ ",
    "pages.publicPracticeExams.catP1Strong": "ਵਿਸ਼ਾ-ਪੱਧਰ",
    "pages.publicPracticeExams.catP2":
      " ਐਪ ਵਿੱਚ ਅਭਿਆਸ ਟੈਸਟ, ਜਿਸ ਵਿੱਚ ਅਨੁਕੂਲ (CAT-ਸ਼ੈਲੀ) ਸੈਸ਼ਨ ਵੀ ਸ਼ਾਮਲ ਹਨ ਜਿੱਥੇ ਉਤਪਾਦ ਉਹਨਾਂ ਨੂੰ ਲਾਗੂ ਕਰਦਾ ਹੈ। ਉਪਲਬਧਤਾ ਮਾਰਗ ਅਤੇ ਸਮਗਰੀ ਪੈਕ ਅਨੁਸਾਰ ਬਦਲਦੀ ਹੈ — ਸਾਈਨ-ਇਨ ਤੋਂ ਬਾਅਦ ",
    "pages.publicPracticeExams.catP3":
      " ਖੋਲ੍ਹੋ ਤਾਂ ਜੋ ਦੇਖ ਸਕੋ ਕਿ ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਵਿੱਚ ਕੀ ਹੈ। ਇਹ ਅਧਿਕਾਰਤ NCLEX ਜਾਂ ਬੋਰ� ਨਿਯਮਾਂ/ਸਮਾਂ-ਸੂਚੀ ਦਾ ਵਿਕਲਪ ਨਹੀਂ।",
  },
  ru: {
    "pages.publicPracticeExams.catLinkPracticeTests": "тренировочные тесты",
    "pages.publicPracticeExams.catP1": "Для поддерживаемых траекторий NurseNest также предлагает ",
    "pages.publicPracticeExams.catP1Strong": "тематические",
    "pages.publicPracticeExams.catP2":
      " тренировочные тесты в приложении, включая адаптивные (в стиле CAT) сессии, если продукт их реализует. Доступность зависит от траектории и пакета контента — после входа откройте ",
    "pages.publicPracticeExams.catP3":
      ", чтобы увидеть, что входит в подписку. Это не замена официальным правилам или расписанию NCLEX или совета.",
  },
  tr: {
    "pages.publicPracticeExams.catLinkPracticeTests": "alıştırma testleri",
    "pages.publicPracticeExams.catP1": "Desteklenen yollar için NurseNest ayrıca şunu sunar: ",
    "pages.publicPracticeExams.catP1Strong": "konu düzeyinde",
    "pages.publicPracticeExams.catP2":
      " uygulama içi alıştırma testleri; ürün uyguladığında CAT tarzı uyarlanabilir oturumlar dahil. Kullanılabilirlik yola ve içerik paketine göre değişir — oturum açtıktan sonra ",
    "pages.publicPracticeExams.catP3":
      " öğesini açarak aboneliğinizde neler olduğunu görün. Resmî NCLEX veya kurul kuralları/takviminin yerine geçmez.",
  },
  ur: {
    "pages.publicPracticeExams.catLinkPracticeTests": "مشق کے ٹیسٹ",
    "pages.publicPracticeExams.catP1": "معاون راستوں کے لیے، NurseNest یہ بھی فراہم کرتا ہے ",
    "pages.publicPracticeExams.catP1Strong": "موضوع سطح",
    "pages.publicPracticeExams.catP2":
      " ایپ میں مشق کے ٹیسٹ، بشمول موافق (CAT-اسٹائل) سیشنز جہاں پروڈکٹ انہیں نافذ کرے۔ دستیابی راستے اور مواد کے پیک کے مطابق بدلتی ہے — سائن ان کے بعد ",
    "pages.publicPracticeExams.catP3":
      " کھولیں تاکہ دیکھیں سبسکرپشن میں کیا شامل ہے۔ یہ سرکاری NCLEX یا بورڈ کے قواعد/شیڈول کا متبادل نہیں۔",
  },
  vi: {
    "pages.publicPracticeExams.catLinkPracticeTests": "bài kiểm tra luyện tập",
    "pages.publicPracticeExams.catP1": "Đối với các lộ trình được hỗ trợ, NurseNest còn cung cấp ",
    "pages.publicPracticeExams.catP1Strong": "bài theo chủ đề",
    "pages.publicPracticeExams.catP2":
      " trong ứng dụng, gồm phiên thích ứng (kiểu CAT) khi sản phẩm triển khai. Mức độ khả dụng tùy lộ trình và gói nội dung — sau khi đăng nhập, mở ",
    "pages.publicPracticeExams.catP3":
      " để xem gói đăng ký gồm những gì. Đây không thay thế quy tắc hoặc lịch chính thức của NCLEX hoặc hội đồng.",
  },
  th: {
    "pages.publicPracticeExams.catLinkPracticeTests": "แบบทดสอบฝึกฝน",
    "pages.publicPracticeExams.catP1": "สำหรับเส้นทางที่รองรับ NurseNest ยังมี ",
    "pages.publicPracticeExams.catP1Strong": "แบบทดสอบตามหัวข้อ",
    "pages.publicPracticeExams.catP2":
      " ในแอป รวมถึงเซสชันแบบปรับตัว (สไตล์ CAT) เมื่อผลิตภัณฑ์รองรับ ความพร้อมใช้งานขึ้นกับเส้นทางและแพ็กเนื้อหา — หลังลงชื่อเข้าใช้ เปิด ",
    "pages.publicPracticeExams.catP3":
      " เพื่อดูว่าการสมัครสมาชิกครอบคลุมอะไร ไม่ใช่ทดแทนกฎหรือตารางอย่างเป็นทางการของ NCLEX หรือคณะกรรมการ",
  },
};

function patchFile(locale) {
  const patch = T[locale];
  if (!patch) return false;
  const fp = join(base, `marketing-${locale}.json`);
  const raw = readFileSync(fp, "utf8");
  const j = JSON.parse(raw);
  for (const [k, v] of Object.entries(patch)) {
    if (j[k] !== undefined) j[k] = v;
  }
  writeFileSync(fp, JSON.stringify(j, null, 2) + "\n", "utf8");
  return true;
}

for (const loc of Object.keys(T)) {
  patchFile(loc);
  console.log(`patched marketing-${loc}.json`);
}
