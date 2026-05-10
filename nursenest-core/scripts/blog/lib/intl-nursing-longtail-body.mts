import type { IntlNursingLangKey, IntlNursingLangSpec } from "./intl-nursing-longtail-spec.mts";
import { INTL_LONGTAIL_INTERNAL_SLUGS } from "./intl-nursing-longtail-spec.mts";
import { arSectionBlocks } from "./intl-body-ar.mts";
import { esSectionBlocks } from "./intl-body-es.mts";
import { frSectionBlocks } from "./intl-body-fr.mts";
import { hiSectionBlocks } from "./intl-body-hi.mts";
import { jaSectionBlocks } from "./intl-body-ja.mts";
import { ptSectionBlocks } from "./intl-body-pt.mts";
import { tlSectionBlocks } from "./intl-body-tl.mts";
import { zhHansSectionBlocks } from "./intl-body-zh-Hans.mts";

function sectionBlocksForLang(
  key: IntlNursingLangKey,
  ctx: { topicPhrase: string; examFrame: string; n: number },
): string[] {
  switch (key) {
    case "es":
      return esSectionBlocks(ctx);
    case "fr":
      return frSectionBlocks(ctx);
    case "pt":
      return ptSectionBlocks(ctx);
    case "ar":
      return arSectionBlocks(ctx);
    case "hi":
      return hiSectionBlocks(ctx);
    case "tl":
      return tlSectionBlocks(ctx);
    case "zh-Hans":
      return zhHansSectionBlocks(ctx);
    case "ja":
      return jaSectionBlocks(ctx);
    default: {
      const _x: never = key;
      return _x;
    }
  }
}

function internalLinksHtml(lang: IntlNursingLangKey, topicIndex: number): string {
  const labels: Record<IntlNursingLangKey, string[]> = {
    es: [
      "Guía CBT del NMC (Reino Unido)",
      "Ruta de registro NMC para enfermería formada en el extranjero",
      "AHPRA y registro en Australia (visión educativa)",
      "Sepsis en el NHS (panorama de enfermería)",
      "NEWS2 para enfermería en agudos del Reino Unido",
    ],
    fr: [
      "Guide CBT du NMC (Royaume-Uni)",
      "Parcours d’immatriculation NMC pour infirmiers formés à l’étranger",
      "AHPRA et immatriculation en Australie (aperçu éducatif)",
      "Sepsis dans le NHS (vue infirmière)",
      "NEWS2 pour les soins aigus au Royaume-Uni",
    ],
    pt: [
      "Guia CBT do NMC (Reino Unido)",
      "Caminho de registro NMC para enfermeiros formados no exterior",
      "AHPRA e registro na Austrália (visão educacional)",
      "Sepse no NHS (panorama de enfermagem)",
      "NEWS2 para cuidados agudos no Reino Unido",
    ],
    ar: [
      "دليل اختبار NMC على الحاسوب (المملكة المتحدة)",
      "مسار التسجيل في NMC للممرضين المدربين خارج المملكة المتحدة",
      "AHPRA والتسجيل في أستراليا (نظرة تعليمية)",
      "الإنتان في خدمة الصحة الوطنية (نظرة تمريضية)",
      "NEWS2 للرعاية الحادة في المملكة المتحدة",
    ],
    hi: [
      "NMC CBT गाइड (यूके)",
      "विदेश में प्रशिक्षित नर्सों के लिए NMC पंजीकरण पथ",
      "AHPRA और ऑस्ट्रेलिया में पंजीकरण (शैक्षिक अवलोकन)",
      "NHS में सेप्सिस (नर्सिंग अवलोकन)",
      "यूके तीव्र देखभाल में NEWS2",
    ],
    tl: [
      "NMC CBT gabay (UK)",
      "NMC registration pathway para sa internationally educated nurses",
      "AHPRA at registration sa Australia (edukasyonal na overview)",
      "Sepsis sa NHS (nursing overview)",
      "NEWS2 para sa UK acute care",
    ],
    "zh-Hans": [
      "英国 NMC 计算机考试（CBT）学习导读",
      "海外学历护士的 NMC 注册路径概览",
      "AHPRA 与澳大利亚注册（教育性概述）",
      "NHS 脓毒症护理概览",
      "英国急性照护中的 NEWS2",
    ],
    ja: [
      "英国 NMC の CBT 学習ガイド",
      "海外教育背景看護師の NMC 登録経路",
      "AHPRA とオーストラリア登録（教育的概観）",
      "NHS における敗血症の看護概観",
      "英国急性期ケアでの NEWS2",
    ],
  };
  const L = labels[lang];
  const items = INTL_LONGTAIL_INTERNAL_SLUGS.map((slug, i) => {
    const lab = L[i % L.length];
    return `  <li><a href="/blog/${slug}">${lab}</a></li>`;
  }).join("\n");
  const dashLabel =
    lang === "es"
      ? "Panel del estudiante NurseNest"
      : lang === "fr"
        ? "Tableau d’apprentissage NurseNest"
        : lang === "pt"
          ? "Painel do aprendiz NurseNest"
          : lang === "ar"
            ? "لوحة المتعلم NurseNest"
            : lang === "hi"
              ? "NurseNest शिक्षार्थी डैशबोर्ड"
              : lang === "tl"
                ? "NurseNest learner dashboard"
                : lang === "zh-Hans"
                  ? "NurseNest 学习者控制台"
                  : "NurseNest 学習者ダッシュボード";
  const trail =
    lang === "es"
      ? "para continuar el circuito de estudio adaptativo"
      : lang === "fr"
        ? "pour poursuivre la boucle d’étude adaptative"
        : lang === "pt"
          ? "para continuar o circuito de estudo adaptativo"
          : lang === "ar"
            ? "لمتابعة حلقة الدراسة التكيفية"
            : lang === "hi"
              ? "अनुकूल अध्ययन लूप जारी रखने के लिए"
              : lang === "tl"
                ? "para magpatuloy sa adaptive study loop"
                : lang === "zh-Hans"
                  ? "以继续自适应学习闭环"
                  : "適応型学習ループを続けるため";
  return `<h2>${lang === "es" ? "Enlaces internos sugeridos" : lang === "fr" ? "Liens internes suggérés" : lang === "pt" ? "Links internos sugeridos" : lang === "ar" ? "روابط داخلية مقترحة" : lang === "hi" ? "सुझाए गए आंतरिक लिंक" : lang === "tl" ? "Mga iminungkahing internal link" : lang === "zh-Hans" ? "建议站内链接" : "推奨内部リンク"}</h2>
<ul>
${items}
  <li><a href="/app/dashboard">${dashLabel}</a> — ${trail}</li>
</ul>`;
}

function faqAndSchemaJsonLd(lang: IntlNursingLangKey, topicPhrase: string, examFrame: string): string {
  const q1 =
    lang === "es"
      ? "¿Este artículo sustituye políticas locales o tutoría?"
      : lang === "fr"
        ? "Ce contenu remplace-t-il les politiques locales ou la supervision ?"
        : lang === "pt"
          ? "Este artigo substitui políticas locais ou supervisão?"
          : lang === "ar"
            ? "هل يحل هذا المقال محل السياسات المحلية أو الإشراف؟"
            : lang === "hi"
              ? "क्या यह लेख स्थानीय नीतियों या पर्यवेक्षण का स्थान लेता है?"
              : lang === "tl"
                ? "Pinapalitan ba ng artikulong ito ang lokal na patakaran o superbisyon?"
                : lang === "zh-Hans"
                  ? "本文是否替代本地规程或临床督导？"
                  : "この記事は院内手順や臨床指導に代わりますか？";
  const a1 =
    lang === "es"
      ? `No. Es material educativo de apoyo para ${topicPhrase} y para ${examFrame}; siga siempre el manual de su centro y la supervisión.`
      : lang === "fr"
        ? `Non. Il s’agit d’un support éducatif pour ${topicPhrase} ; suivez toujours votre institution et la supervision.`
        : lang === "pt"
          ? `Não. É apoio educativo para ${topicPhrase}; siga sempre o manual da instituição e a supervisão.`
          : lang === "ar"
            ? `لا. هذا دعم تعليمي لـ ${topicPhrase}؛ التزم دائمًا بسياسات المؤسسة والإشراف.`
            : lang === "hi"
              ? `नहीं। यह ${topicPhrase} के लिए शैक्षिक सहायक है; संस्थान की नीति और पर्यवेक्षण का पालन करें।`
              : lang === "tl"
                ? `Hindi. Edukasyong suporta ito para sa ${topicPhrase}; sundin ang patakaran ng institusyon at superbisyon.`
                : lang === "zh-Hans"
                  ? `否。本文为 ${topicPhrase} 的教育辅助材料；请遵循机构制度与督导。`
                  : `いいえ。${topicPhrase} の学習補助であり、施設手順と指導に従ってください。`;

  const q2 =
    lang === "es"
      ? "¿Cómo estudio §TOPIC§ sin memorizar listas aisladas?"
          .replace("§TOPIC§", topicPhrase)
      : lang === "fr"
        ? "Comment étudier §TOPIC§ sans listes isolées ?"
            .replace("§TOPIC§", topicPhrase)
        : lang === "pt"
          ? "Como estudar §TOPIC§ sem listas soltas?"
              .replace("§TOPIC§", topicPhrase)
          : lang === "ar"
            ? "كيف أذاكر §TOPIC§ دون قوائم منفصلة عن السياق؟"
                .replace("§TOPIC§", topicPhrase)
            : lang === "hi"
              ? "§TOPIC§ को अलग सूचियों के बिना कैसे पढ़ें?"
                  .replace("§TOPIC§", topicPhrase)
              : lang === "tl"
                ? "Paano mag-aral ng §TOPIC§ nang hindi isolated listahan?"
                    .replace("§TOPIC§", topicPhrase)
                : lang === "zh-Hans"
                  ? "如何学习 §TOPIC§ 而不仅背孤立条目？"
                      .replace("§TOPIC§", topicPhrase)
                  : "§TOPIC§ を孤立した暗記以外でどう学ぶ？".replace("§TOPIC§", topicPhrase);

  const a2 =
    lang === "es"
      ? "Use casos breves que obliguen a priorizar, documentar y educar; repita el mismo marco con datos distintos."
      : lang === "fr"
        ? "Utilisez de courtes vignettes forçant priorisation, documentation et éducation ; répétez le même cadre avec des données différentes."
        : lang === "pt"
          ? "Use vignettes curtas que forcem priorização, documentação e educação; repita o mesmo quadro com dados diferentes."
          : lang === "ar"
            ? "استخدم سيناريوهات قصيرة تفرض الأولويات والتوثيق والتثقيف؛ كرر الإطار نفسه ببيانات مختلفة."
            : lang === "hi"
              ? "छोटे केसों से प्राथमिकता, दस्तावेज़ीकरण और शिक्षा का अभ्यास करें; भिन्न डेटा पर वही ढांचा दोहराएँ।"
              : lang === "tl"
                ? "Gumamit ng maikling vignette na nag-uutos ng priyoridad, dokumentasyon, at edukasyon; ulitin ang parehong balangkas."
                : lang === "zh-Hans"
                  ? "用短案例训练优先级、记录与教育；在不同数据下重复同一框架。"
                  : "短い症例で優先順位・記録・教育を訓練し、異なるデータで同じ枠を繰り返す。";

  const q3 =
    lang === "es"
      ? "¿Qué hago si el examen presenta dos respuestas plausibles?"
      : lang === "fr"
        ? "Que faire si deux réponses semblent plausibles ?"
        : lang === "pt"
          ? "E se duas alternativas parecerem plausíveis?"
          : lang === "ar"
            ? "ماذا أفعل إذا بدت إجابتان معقولتين؟"
            : lang === "hi"
              ? "यदि दो उत्तर उचित लगें तो क्या करें?"
              : lang === "tl"
                ? "Ano ang gagawin kung dalawang sagot ay mukhang tama?"
                : lang === "zh-Hans"
                  ? "若两个选项都看似合理怎么办？"
                  : "2つの選択肢がともに妥当に見える場合は？";

  const a3 =
    lang === "es"
      ? "Elija primero la opción que elimine daño inmediato o estabilice riesgo vital, luego complete documentación y educación según el caso."
      : lang === "fr"
        ? "Choisissez d’abord ce qui supprime un danger immédiat ou stabilise un risque vital, puis documentez et éduquez selon le cas."
        : lang === "pt"
          ? "Primeiro o que elimina dano imediato ou estabiliza risco vital; depois documentação e educação conforme o caso."
          : lang === "ar"
            ? "اختر أولًا ما يلغي الضرر الفوري أو يثبت الخطر الحيوي، ثم أكمل التوثيق والتثقيف حسب الحالة."
            : lang === "hi"
              ? "पहले तत्काल हानि हटाने या जीवन-खतरा स्थिर करने वाला विकल्प चुनें, फिर दस्तावेज़ व शिक्षा पूरी करें।"
              : lang === "tl"
                ? "Unahin ang nag-aalis ng agarang pinsala o nagpapastabil ng banta sa buhay; sunod ang dokumentasyon at edukasyon."
                : lang === "zh-Hans"
                  ? "先选能消除即刻损害或稳定生命威胁的选项，再按情境完成记录与教育。"
                  : "まず即時の損害を除く／生命の脅威を安定化する選択を優先し、その後に記録と教育を整える。";

  const faqHeading =
    lang === "es"
      ? "Preguntas frecuentes (FAQ)"
      : lang === "fr"
        ? "Foire aux questions (FAQ)"
        : lang === "pt"
          ? "Perguntas frequentes (FAQ)"
          : lang === "ar"
            ? "أسئلة شائعة"
            : lang === "hi"
              ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)"
              : lang === "tl"
                ? "FAQ"
                : lang === "zh-Hans"
                  ? "常见问题（FAQ）"
                  : "よくある質問（FAQ）";

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: q1, acceptedAnswer: { "@type": "Answer", text: a1 } },
      { "@type": "Question", name: q2, acceptedAnswer: { "@type": "Answer", text: a2 } },
      { "@type": "Question", name: q3, acceptedAnswer: { "@type": "Answer", text: a3 } },
    ],
  };

  return `<h2>${faqHeading}</h2>
<h3>${q1}</h3><p>${a1}</p>
<h3>${q2}</h3><p>${a2}</p>
<h3>${q3}</h3><p>${a3}</p>
<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function referencesHtml(lang: IntlNursingLangKey): string {
  const h =
    lang === "es"
      ? "Referencias (APA 7, ejemplos educativos)"
      : lang === "fr"
        ? "Références (APA 7, exemples éducatifs)"
        : lang === "pt"
          ? "Referências (APA 7, exemplos educativos)"
          : lang === "ar"
            ? "مراجع (APA 7، أمثلة تعليمية)"
            : lang === "hi"
              ? "संदर्भ (APA 7, शैक्षिक उदाहरण)"
              : lang === "tl"
                ? "Sanggunian (APA 7, halimbawang pang-edukasyon)"
                : lang === "zh-Hans"
                  ? "参考文献（APA 7，教育示例）"
                  : "参考文献（APA 7，教育用例）";
  return `<h2>${h}</h2>
<p>World Health Organization. (2022). <em>Global strategic directions for nursing and midwifery</em>. WHO.</p>
<p>International Council of Nurses. (2021). <em>Guidelines on patient safety and quality of care</em> (policy and position statements). ICN.</p>
<p>Nursing and Midwifery Council. (2024). <em>The Code: Professional standards of practice and behaviour for nurses, midwives and nursing associates</em>. NMC.</p>`;
}

export function buildIntlLongtailBodyHtml(
  spec: IntlNursingLangSpec,
  topicPhrase: string,
  topicIndex: number,
  slug: string,
): string {
  const ctx = { topicPhrase, examFrame: spec.examFrame, n: topicIndex + 1 };
  const parts = sectionBlocksForLang(spec.key, ctx);
  const ctaTitle =
    spec.key === "es"
      ? "Llamada a la acción premium"
      : spec.key === "fr"
        ? "Appel à l’action premium"
        : spec.key === "pt"
          ? "Chamada para ação premium"
          : spec.key === "ar"
            ? "دعوة إلى المحتوى المميز"
            : spec.key === "hi"
              ? "प्रीमियम आह्वान"
              : spec.key === "tl"
                ? "Premium na panawagan"
                : spec.key === "zh-Hans"
                  ? "高级版行动号召"
                  : "プレミアムCTA";
  const cta = `<h2>${ctaTitle}</h2><p>${spec.premiumCta}</p>`;
  const links = internalLinksHtml(spec.key, topicIndex);
  const faq = faqAndSchemaJsonLd(spec.key, topicPhrase, spec.examFrame);
  const refs = referencesHtml(spec.key);
  return [...parts, links, cta, faq, refs].join("\n");
}
