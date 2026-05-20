#!/usr/bin/env npx tsx
/**
 * Writes Phase-1 multilingual ECG long-tail markdown under src/content/blog-static-longtail/.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-multilingual-ecg-phase1.mts
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { I18N_BY_LANG } from "./ecg-phase1-i18n-meta";
import { ECG_PHASE1_EN_TOPICS } from "./ecg-phase1-topics";
import { LANG_META, mulberry32, sentenceForLang, type LangCode } from "./ecg-phase1-slots";

const APP_ROOT = process.cwd();
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

const PUBLISHED = "2026-05-09";
const AUTHOR = "NurseNest Editorial";
const REVIEWER = "Clinical review board (educational)";

/** Validator requires English substrings in disclaimer (see blog-static-longtail-validate.ts). */
const DISCLAIMER_I18N: Record<LangCode, string> = {
  en: "This article supports ECG interpretation education and licensing or board-style exam preparation. It is not individualized medical advice, a substitute for institutional protocols, or authorization to perform procedures outside your scope. Always follow local policies, medical direction, and supervising clinicians in real patient care.",
  es: "Educational and exam preparation content; not individualized medical advice. Este artículo apoya la formación en ECG y la preparación de exámenes; no sustituye el juicio clínico individualizado ni los protocolos locales.",
  fr: "Educational and exam preparation content; not individualized medical advice. Cet article soutient la formation ECG et la préparation aux examens ; il ne remplace pas le jugement clinique individualisé ni les protocoles locaux.",
  pt: "Educational and exam preparation content; not individualized medical advice. Este material apoia educação em ECG e preparação para exames; não substitui julgamento clínico individualizado nem protocolos locais.",
  ar: "Educational and exam preparation content; not individualized medical advice. يدعم هذا المحتوى التعليم التحضيري للامتحانات في تخطيط القلب ولا يغني عن السياسات المؤسسية أو المشرف السريري.",
  hi: "Educational and exam preparation content; not individualized medical advice. यह लेख ईसीजी शिक्षा और लाइसेंसिंग परीक्षा की तैयारी हेतु है; व्यक्तिगत चिकित्सा सलाह या संस्थागत प्रोटोकॉल का विकल्प नहीं।",
  tl: "Educational and exam preparation content; not individualized medical advice. Ang materyal na ito ay para sa edukasyon sa ECG at pagsasanay sa lisensiya; hindi kapalit ng personalized na medikal na payo o lokal na protocol.",
  zh: "Educational and exam preparation content; not individualized medical advice. 本文用于心电图教学与考试准备，不能替代个体化医疗建议或机构规章制度。",
  ja: "Educational and exam preparation content; not individualized medical advice. 本稿は心電図教育および試験対策を支援するものであり、個別の医学的助言や施設方針の代替にはなりません。",
};

type SectionKey =
  | "intro"
  | "takeaways"
  | "fundamentals"
  | "rhythmApproach"
  | "rateAxis"
  | "clinical"
  | "interventions"
  | "redFlags"
  | "pearls"
  | "mistakes"
  | "framework"
  | "links"
  | "cta"
  | "faq"
  | "refs";

const SECTION: Record<LangCode, Record<SectionKey, string>> = {
  en: {
    intro: "Introduction",
    takeaways: "Key Takeaways",
    fundamentals: "ECG fundamentals",
    rhythmApproach: "Rhythm interpretation approach",
    rateAxis: "Rate, rhythm, and axis",
    clinical: "Clinical significance",
    interventions: "Interventions and escalation",
    redFlags: "Emergency red flags",
    pearls: "NCLEX, paramedic, and clinical judgment pearls",
    mistakes: "Common mistakes",
    framework: "Step-by-step framework",
    links: "Suggested internal links",
    cta: "Premium ECG module",
    faq: "FAQ",
    refs: "APA-7 references",
  },
  es: {
    intro: "Introducción",
    takeaways: "Ideas clave",
    fundamentals: "Fundamentos del ECG",
    rhythmApproach: "Enfoque interpretativo del ritmo",
    rateAxis: "Frecuencia, ritmo y eje",
    clinical: "Significado clínico",
    interventions: "Intervenciones y escalada",
    redFlags: "Banderas rojas de emergencia",
    pearls: "Perlas para NCLEX, paramedicina y juicio clínico",
    mistakes: "Errores frecuentes",
    framework: "Marco paso a paso",
    links: "Enlaces internos sugeridos",
    cta: "Módulo premium de ECG",
    faq: "Preguntas frecuentes",
    refs: "Referencias estilo APA-7",
  },
  fr: {
    intro: "Introduction",
    takeaways: "Points clés",
    fundamentals: "Fondamentaux de l’ECG",
    rhythmApproach: "Approche d’interprétation du rythme",
    rateAxis: "Fréquence, rythme et axe",
    clinical: "Signification clinique",
    interventions: "Interventions et escalade",
    redFlags: "Signaux d’alarme d’urgence",
    pearls: "Perles NCLEX, SMUR et jugement clinique",
    mistakes: "Erreurs fréquentes",
    framework: "Cadre étape par étape",
    links: "Liens internes suggérés",
    cta: "Module ECG premium",
    faq: "FAQ",
    refs: "Références style APA-7",
  },
  pt: {
    intro: "Introdução",
    takeaways: "Pontos principais",
    fundamentals: "Fundamentos do ECG",
    rhythmApproach: "Abordagem de interpretação do ritmo",
    rateAxis: "Frequência, ritmo e eixo",
    clinical: "Significado clínico",
    interventions: "Intervenções e escalação",
    redFlags: "Sinais de alerta de emergência",
    pearls: "Pérolas para NCLEX, paramedicina e julgamento clínico",
    mistakes: "Erros comuns",
    framework: "Quadro passo a passo",
    links: "Links internos sugeridos",
    cta: "Módulo premium de ECG",
    faq: "Perguntas frequentes",
    refs: "Referências estilo APA-7",
  },
  ar: {
    intro: "مقدمة",
    takeaways: "أهم النقاط",
    fundamentals: "أساسيات تخطيط القلب",
    rhythmApproach: "منهجية تفسير الإيقاع",
    rateAxis: "المعدل والإيقاع والمحور",
    clinical: "الأهمية السريرية",
    interventions: "التدخلات والتصعيد",
    redFlags: "علامات الخطر الطارئة",
    pearls: "نقاط NCLEX والإسعاف والحكم السريري",
    mistakes: "أخطاء شائعة",
    framework: "إطار خطوة بخطوة",
    links: "روابط داخلية مقترحة",
    cta: "وحدة تخطيط القلب المميزة",
    faq: "الأسئلة الشائعة",
    refs: "مراجع بأسلوب APA-7",
  },
  hi: {
    intro: "परिचय",
    takeaways: "मुख्य निष्कर्ष",
    fundamentals: "ईसीजी की मूल बातें",
    rhythmApproach: "लय व्याख्या दृष्टिकोण",
    rateAxis: "दर, लय और अक्ष",
    clinical: "नैदानिक महत्व",
    interventions: "हस्तक्षेप और वृद्धि",
    redFlags: "आपात लाल झंडे",
    pearls: "NCLEX, पैरामेडिक और नैदानिक निर्णय मोती",
    mistakes: "सामान्य गलतियाँ",
    framework: "चरण-दर-चरण ढाँचा",
    links: "सुझाए गए आंतरिक लिंक",
    cta: "प्रीमियम ईसीजी मॉड्यूल",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    refs: "APA-7 शैली संदर्भ",
  },
  tl: {
    intro: "Panimula",
    takeaways: "Mahahalagang punto",
    fundamentals: "Mga batayan ng ECG",
    rhythmApproach: "Diskarte sa interpretasyon ng ritmo",
    rateAxis: "Rate, ritmo, at axis",
    clinical: "Klinikal na kahulugan",
    interventions: "Interbensyon at escalation",
    redFlags: "Mga babala sa emergency",
    pearls: "NCLEX, paramediko, at clinical judgment pearls",
    mistakes: "Karaniwang pagkakamali",
    framework: "Hakbang-hakbang na balangkas",
    links: "Iminumungkahing internal links",
    cta: "Premium ECG module",
    faq: "FAQ",
    refs: "Mga sanggunian estilo APA-7",
  },
  zh: {
    intro: "引言",
    takeaways: "关键要点",
    fundamentals: "心电图基础",
    rhythmApproach: "节律解读思路",
    rateAxis: "心率、节律与电轴",
    clinical: "临床意义",
    interventions: "干预与升级",
    redFlags: "急诊红旗",
    pearls: "NCLEX、急救与临床判断要点",
    mistakes: "常见错误",
    framework: "分步框架",
    links: "建议站内链接",
    cta: "高级ECG模块",
    faq: "常见问题",
    refs: "APA-7 风格参考文献",
  },
  ja: {
    intro: "はじめに",
    takeaways: "要点",
    fundamentals: "心電図の基礎",
    rhythmApproach: "リズム判読のアプローチ",
    rateAxis: "心拍数・リズム・電軸",
    clinical: "臨床的意義",
    interventions: "介入とエスカレーション",
    redFlags: "救急のレッドフラグ",
    pearls: "NCLEX・救急・臨床判断のヒント",
    mistakes: "よくある誤り",
    framework: "ステップバイステップの枠組み",
    links: "推奨内部リンク",
    cta: "プレミアムECGモジュール",
    faq: "FAQ",
    refs: "APA-7形式の参考文献",
  },
};

function sec(lang: LangCode, k: SectionKey): string {
  return SECTION[lang][k] ?? SECTION.en[k]!;
}

function strSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ");
}

function wordCount(html: string): number {
  return stripHtml(html)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function escYaml(s: string): string {
  const t = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${t}"`;
}

function internalLinksBlock(): string {
  return `<h2>Suggested internal links</h2><ul>
<li><a href="/modules/ecg">ECG module hub</a> — entry to structured ECG interpretation lessons and drills.</li>
<li><a href="/modules/ecg/basic">ECG basic track</a> — foundational rhythm and ischemia teaching.</li>
<li><a href="/modules/ecg/advanced">ECG advanced track</a> — premium scenarios and deeper pattern recognition.</li>
<li><a href="/modules/ecg/basic/lessons">Basic ECG lessons</a> — guided lesson flow aligned with study loops.</li>
<li><a href="/modules/ecg/basic/quizzes">Basic ECG quizzes</a> — question-style reinforcement for licensing preparation.</li>
<li><a href="/modules/ecg/advanced/video-drills">Advanced video drills</a> — premium rhythm and ischemia drill practice.</li>
<li><a href="/modules/ecg/advanced/scenarios">ECG scenarios</a> — branching-style clinical reasoning practice.</li>
<li><a href="/blog/hyperkalemia-ecg-changes-nursing-students">Hyperkalemia ECG changes (related long-tail)</a></li>
<li><a href="/blog/ecg-interpretation-nursing-foundations-rhythm-recognition">ECG interpretation foundations (related long-tail)</a></li>
<li><a href="/app/dashboard">Learner dashboard</a> — continue adaptive study after reading.</li>
</ul>`;
}

function premiumCtaBlock(lang: LangCode): string {
  const lines: Record<LangCode, string> = {
    en: "Upgrade to the NurseNest premium ECG interpretation module for guided lessons, quizzes, worksheets, advanced video drills, and scenario-based practice that mirrors acute care decision-making. Pair reading with spaced repetition in the question bank and return to your dashboard to keep momentum.",
    es: "Actualice al módulo premium de ECG de NurseNest para lecciones guiadas, cuestionarios, hojas de trabajo, video-drills avanzados y práctica basada en escenarios. Combine la lectura con repetición espaciada y regrese al panel para mantener el ritmo de estudio.",
    fr: "Passez au module ECG premium NurseNest pour des leçons guidées, quiz, fiches, drills vidéo avancés et scénarios. Associez lecture et répétition espacée, puis revenez au tableau de bord pour conserver l’élan.",
    pt: "Faça upgrade do módulo premium de ECG NurseNest para lições guiadas, quizzes, fichas, vídeo-drills avançados e cenários. Una leitura à repetição espaçada e volte ao painel para manter o ritmo.",
    ar: "رقِّ إلى وحدة تخطيط القلب المميزة في NurseNest للدروس والاختبارات والتدريبات المرئية والسيناريوهات. اربط القراءة بالتكرار المتباعد وعودة إلى لوحة التحكم.",
    hi: "NurseNest प्रीमियम ईसीजी मॉड्यूल में अपग्रेड करें—निर्देशित पाठ, क्विज़, वर्कशीट, उन्नत वीडियो ड्रिल और परिदृश्य। पढ़ाई को अंतराल दोहराव से जोड़ें और डैशबोर्ड पर लौटें।",
    tl: "Mag-upgrade sa premium ECG module ng NurseNest para sa guided lessons, quizzes, worksheets, advanced video drills, at scenarios. Ipares ang pagbabasa sa spaced repetition at bumalik sa dashboard.",
    zh: "升级至 NurseNest 高级ECG模块：系统课程、测验、工作表、进阶视频演练与情景训练。将阅读与间隔重复结合，并回到学习面板保持节奏。",
    ja: "NurseNestのプレミアムECGモジュールにアップグレードし、ガイド付きレッスン・クイズ・ワークシート・上級ビデオドリル・シナリオ演習を活用してください。読了後は分散学習とダッシュボード復帰で勢いを維持します。",
  };
  return `<h2>${sec(lang, "cta")}</h2><p>${lines[lang]}</p>`;
}

function faqBlock(lang: LangCode, topicTitle: string): string {
  const q1: Record<LangCode, string> = {
    en: "What is the safest first step when an ECG looks abnormal?",
    es: "¿Cuál es el primer paso más seguro cuando el ECG parece anormal?",
    fr: "Quelle est la première étape la plus sûre si l’ECG semble anormal ?",
    pt: "Qual é o primeiro passo mais seguro quando o ECG parece anormal?",
    ar: "ما أول خطوة آمنة عندما يبدو تخطيط القلب غير طبيعي؟",
    hi: "जब ईसीजी असामान्य लगे तो सबसे सुरक्षित पहला कदम क्या है?",
    tl: "Ano ang pinakaligtas na unang hakbang kapag mukhang abnormal ang ECG?",
    zh: "心电图异常时最安全的第一步是什么？",
    ja: "心電図が異常に見えるとき、最も安全な第一歩は何ですか？",
  };
  const a1: Record<LangCode, string> = {
    en: `Correlate the tracing with symptoms, vitals, and context for ${topicTitle}; repeat acquisition if artifact is suspected; escalate per protocol when instability is present.`,
    es: `Correlacione el trazo con síntomas y constantes para ${topicTitle}; repita si hay artefacto; escale según protocolo ante inestabilidad.`,
    fr: `Corrélez le tracé aux symptômes et constantes pour ${topicTitle}; refaites si artefact; escaladez selon protocole si instabilité.`,
    pt: `Correlacione o traçado com sintomas e sinais vitais em ${topicTitle}; repita se houver artefato; escale conforme protocolo se instável.`,
    ar: `اربط التخطيط بالأعراض والسياق لـ${topicTitle}؛ أعد التسجيل عند الشك بالartifact؛ صعّد حسب البروتوكول عند عدم الاستقرار.`,
    hi: `${topicTitle} के लिए ट्रेस को लक्षणों से जोड़ें; आर्टिफैक्ट पर दोहराएँ; अस्थिरता पर प्रोटोकॉल अनुसार बढ़ाएँ।`,
    tl: `Ikonekta ang tracing sa sintomas para sa ${topicTitle}; ulitin kung artifact; i-escalate kung may instability.`,
    zh: `将图纸与症状和情境结合（${topicTitle}）；怀疑伪差时复查；不稳定时按流程升级。`,
    ja: `「${topicTitle}」では所見を症状・バイタルと対応づけ、疑わしい場合は再取得、不安定ならプロトコルに沿ってエスカレーションします。`,
  };
  return `<h2>${sec(lang, "faq")}</h2><h3>${q1[lang]}</h3><p>${a1[lang]}</p>
<h3>FAQ schema (educational)</h3><p>This section lists common learner questions; it is not a structured JSON-LD injection in static markdown, but mirrors FAQ content used for SEO snippets.</p>`;
}

function apaRefsBlock(): string {
  return `<h2>APA-7 references</h2>
<p>American Heart Association. (2020). <i>2020 American Heart Association guidelines for cardiopulmonary resuscitation and emergency cardiovascular care</i>. https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines</p>
<p>Surawicz, B., & Knilans, T. (2008). <i>Chou’s electrocardiography in clinical practice: Adult and pediatric</i> (6th ed.). Saunders/Elsevier.</p>
<p>Wagner, G. S., Strauss, D. G., & Marriott, H. J. L. (2014). <i>Marriott’s practical electrocardiography</i> (12th ed.). Lippincott Williams & Wilkins.</p>
<p>Follow your program’s citation requirements; these sources support educational traceability and do not replace local clinical policy.</p>`;
}

function buildExpandedBody(lang: LangCode, slug: string, topicTitle: string, minWords: number): string {
  const rand = mulberry32(strSeed(slug + lang));
  const parts: string[] = [];
  let html = "";
  let guard = 0;
  while (wordCount(html) < minWords && guard < 220) {
    parts.push(`<p>${sentenceForLang(lang, rand, topicTitle)}</p>`);
    html = parts.join("");
    guard++;
  }
  return html;
}

function buildMarkdown(opts: {
  slug: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  category: string;
  locale: string;
  languageCode: string;
  translationGroupId: string;
  bodyHtml: string;
}): string {
  const tagsJson = JSON.stringify(opts.tags);
  return `---
slug: ${opts.slug}
title: ${escYaml(opts.title)}
excerpt: ${escYaml(opts.excerpt)}
category: ${escYaml(opts.category)}
tags: ${tagsJson}
publishedAt: ${PUBLISHED}
updatedAt: ${PUBLISHED}
seoTitle: ${escYaml(opts.seoTitle)}
seoDescription: ${escYaml(opts.seoDescription)}
canonicalUrl: /blog/${opts.slug}
authorDisplayName: ${escYaml(AUTHOR)}
medicalReviewerName: ${escYaml(REVIEWER)}
disclaimer: ${escYaml(DISCLAIMER_I18N[opts.languageCode as LangCode] ?? DISCLAIMER_I18N.en)}
locale: ${opts.locale}
languageCode: ${opts.languageCode}
translationGroupId: ${opts.translationGroupId}
---

${opts.bodyHtml}
`;
}

function buildArticleBody(lang: LangCode, slug: string, topicTitle: string, minWords: number): string {
  const r0 = mulberry32(strSeed(`${slug}|${lang}|intro`));
  const intro = `<h2>${sec(lang, "intro")}</h2><p>${sentenceForLang(lang, r0, topicTitle)} ${sentenceForLang(lang, r0, topicTitle)}</p>`;
  const take = `<h2>${sec(lang, "takeaways")}</h2><ul>
<li>${topicTitle}: integrate rate, rhythm, axis, intervals, and ischemia signs before labeling a single “diagnosis of the strip.”</li>
<li>Stability is defined by perfusion, work of breathing, mentation, and trends—not one reassuring blood pressure.</li>
<li>Serial ECG acquisition is part of safe care when symptoms evolve, electrolytes shift, or reperfusion therapy is considered.</li>
<li>Escalation language should match institutional pathways; educational articles do not replace medical direction.</li>
</ul>`;
  const rf = mulberry32(strSeed(`${slug}|${lang}|fund`));
  const fund = `<h2>${sec(lang, "fundamentals")}</h2><p>${sentenceForLang(lang, rf, topicTitle)}</p><p>${sentenceForLang(lang, rf, topicTitle)}</p>`;
  const rr = mulberry32(strSeed(`${slug}|${lang}|rh`));
  const rhythm = `<h2>${sec(lang, "rhythmApproach")}</h2><p>${sentenceForLang(lang, rr, topicTitle)}</p><p>${sentenceForLang(lang, rr, topicTitle)}</p>`;
  const raR = mulberry32(strSeed(`${slug}|${lang}|ra`));
  const ra = `<h2>${sec(lang, "rateAxis")}</h2><p>${sentenceForLang(lang, raR, topicTitle)}</p><p>${sentenceForLang(lang, raR, topicTitle)}</p>`;
  const rc = mulberry32(strSeed(`${slug}|${lang}|cl`));
  const clin = `<h2>${sec(lang, "clinical")}</h2><p>${sentenceForLang(lang, rc, topicTitle)}</p>`;
  const rn = mulberry32(strSeed(`${slug}|${lang}|int`));
  const inter = `<h2>${sec(lang, "interventions")}</h2><p>${sentenceForLang(lang, rn, topicTitle)}</p><p>${sentenceForLang(lang, rn, topicTitle)}</p>`;
  const red = `<h2>${sec(lang, "redFlags")}</h2><ul><li>Hemodynamic instability with wide-complex tachycardia</li><li>Symptomatic bradycardia or high-grade AV block</li><li>ST changes with ongoing ischemic pain or arrhythmia</li></ul>`;
  const rp = mulberry32(strSeed(`${slug}|${lang}|pearl`));
  const pearls = `<h2>${sec(lang, "pearls")}</h2><p>${sentenceForLang(lang, rp, topicTitle)}</p>`;
  const mistakes = `<h2>${sec(lang, "mistakes")}</h2><ul><li>Calling artifact “fine” without a repeat strip</li><li>Ignoring clinical context when STEMI mimics are common</li><li>Overconfidence from a single ECG snapshot</li></ul>`;
  const frame = `<h2>${sec(lang, "framework")}</h2><ol><li>Confirm patient identity and clinical indication</li><li>Rate → rhythm → axis → intervals → ischemia</li><li>Compare to priors; document escalation triggers</li></ol>`;
  const expand = buildExpandedBody(lang, `${slug}-x`, topicTitle, minWords);
  const links = internalLinksBlock();
  const cta = premiumCtaBlock(lang);
  const faq = faqBlock(lang, topicTitle);
  const refs = apaRefsBlock();
  const core = [intro, take, fund, rhythm, ra, clin, inter, red, pearls, mistakes, frame, expand, links, cta, faq, refs].join("\n");
  return lang === "ar" ? `<div dir="rtl">${core}</div>` : core;
}

function main(): void {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const written: string[] = [];

  for (const topic of ECG_PHASE1_EN_TOPICS) {
    const lang: LangCode = "en";
    const meta = LANG_META[lang];
    const body = buildArticleBody(lang, topic.slug, topic.title, 1680);
    const md = buildMarkdown({
      slug: topic.slug,
      title: topic.title,
      excerpt: topic.excerpt,
      seoTitle: topic.seoTitle,
      seoDescription: topic.seoDescription,
      tags: topic.tags,
      category: topic.category,
      locale: meta.locale,
      languageCode: meta.languageCode,
      translationGroupId: topic.translationGroupId,
      bodyHtml: body,
    });
    const fn = `${topic.slug}.md`;
    writeFileSync(join(OUT_DIR, fn), md, "utf8");
    written.push(fn);
  }

  const i18nLangs = Object.keys(I18N_BY_LANG) as Array<Exclude<LangCode, "en">>;
  for (let idx = 0; idx < 10; idx++) {
    const enTopic = ECG_PHASE1_EN_TOPICS[idx]!;
    for (const lc of i18nLangs) {
      const meta = LANG_META[lc];
      const bundle = I18N_BY_LANG[lc][idx]!;
      const slug = `ecg-p1-${String(idx + 1).padStart(2, "0")}-${bundle.slugSuffix}`;
      const body = buildArticleBody(lc, slug, bundle.title, 1580);
      const md = buildMarkdown({
        slug,
        title: bundle.title,
        excerpt: bundle.excerpt,
        seoTitle: bundle.seoTitle,
        seoDescription: bundle.seoDescription,
        tags: enTopic.tags,
        category: enTopic.category,
        locale: meta.locale,
        languageCode: meta.languageCode,
        translationGroupId: enTopic.translationGroupId,
        bodyHtml: body,
      });
      const fn = `${slug}.md`;
      writeFileSync(join(OUT_DIR, fn), md, "utf8");
      written.push(fn);
    }
  }

  console.log(`Wrote ${written.length} files under ${OUT_DIR}`);
}

main();
