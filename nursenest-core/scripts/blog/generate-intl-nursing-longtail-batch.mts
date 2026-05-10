#!/usr/bin/env npx tsx
/**
 * Deterministic multilingual international-nursing long-tail batch.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-intl-nursing-longtail-batch.mts
 *
 * Count interpretation: target 140 posts × 8 languages = 1120 (see reports README).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import { buildIntlLongtailBodyHtml } from "./lib/intl-nursing-longtail-body.mts";
import { INTL_NURSING_LANGS, type IntlNursingLangKey } from "./lib/intl-nursing-longtail-spec.mts";
import {
  asciiSlugStem,
  INTL_LONGTAIL_POSTS_PER_LANGUAGE,
  topicPhraseFor,
  translationGroupIdForIndex,
} from "./lib/intl-nursing-longtail-topics.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** scripts/blog → app root is two levels up */
const APP_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

function disclaimerFor(lang: IntlNursingLangKey): string {
  const en = "Educational exam preparation support; not individualized medical advice.";
  const tail =
    lang === "es"
      ? "Material de estudio; no sustituye políticas locales ni tutoría clínica."
      : lang === "fr"
        ? "Support pédagogique ; ne remplace pas les politiques locales ni la supervision clinique."
        : lang === "pt"
          ? "Material de estudo; não substitui políticas locais nem supervisão clínica."
          : lang === "ar"
            ? "دعم تعليمي؛ لا يحل محل سياسات المؤسسة أو الإشراف السريري."
            : lang === "hi"
              ? "शैक्षिक सहायता; स्थानीय नीतियों या नैदानिक पर्यवेक्षण का स्थान नहीं लेता।"
              : lang === "tl"
                ? "Edukasyong suporta; hindi kapalit ng lokal na patakaran o klinikal na superbisyon."
                : lang === "zh-Hans"
                  ? "教育辅助材料；不替代本地规程或临床督导。"
                  : "教育用補助資料であり、院内手順や臨床指導に代わりません。";
  return `${en} ${tail}`;
}

function titleFor(lang: IntlNursingLangKey, i: number, topic: string): string {
  const n = i + 1;
  switch (lang) {
    case "es":
      return `Enfermería internacional (${n}): ${topic}`;
    case "fr":
      return `Soins infirmiers internationaux (${n}) : ${topic}`;
    case "pt":
      return `Enfermagem internacional (${n}): ${topic}`;
    case "ar":
      return `التمريض الدولي (${n}): ${topic}`;
    case "hi":
      return `अंतर्राष्ट्रीय नर्सिंग (${n}): ${topic}`;
    case "tl":
      return `Internasyonal na nursing (${n}): ${topic}`;
    case "zh-Hans":
      return `国际护理备考深读（${n}）：${topic}`;
    case "ja":
      return `国際看護の学習深掘り（${n}）：${topic}`;
    default: {
      const _e: never = lang;
      return _e;
    }
  }
}

function excerptFor(lang: IntlNursingLangKey, topic: string): string {
  switch (lang) {
    case "es":
      return `Panorama educativo de ${topic} con foco en seguridad del paciente, priorización y preparación de examen.`;
    case "fr":
      return `Vue éducative de ${topic} axée sur la sécurité patient, la priorisation et la préparation d’examen.`;
    case "pt":
      return `Visão educacional de ${topic} com foco em segurança do paciente, priorização e preparação para provas.`;
    case "ar":
      return `نظرة تعليمية حول ${topic} مع تركيز على سلامة المريض والأولويات والتحضير للامتحان.`;
    case "hi":
      return `${topic} पर शैक्षिक अवलोकन: मरीज़ सुरक्षा, प्राथमिकता और परीक्षा तैयारी।`;
    case "tl":
      return `Edukasyonal na overview ng ${topic} na may pokus sa kaligtasan ng pasyente, priyoridad, at paghahanda sa eksamen.`;
    case "zh-Hans":
      return `关于「${topic}」的教育性综述：患者安全、优先级与考试准备。`;
    case "ja":
      return `「${topic}」に関する教育的整理：患者安全、優先順位づけ、試験準備。`;
    default: {
      const _e: never = lang;
      return _e;
    }
  }
}

function seoTitleFor(lang: IntlNursingLangKey, i: number, topic: string): string {
  const n = i + 1;
  switch (lang) {
    case "es":
      return `${topic} | Guía ${n} NurseNest`;
    case "fr":
      return `${topic} | Guide ${n} NurseNest`;
    case "pt":
      return `${topic} | Guia ${n} NurseNest`;
    case "ar":
      return `${topic} | دليل ${n} NurseNest`;
    case "hi":
      return `${topic} | NurseNest गाइड ${n}`;
    case "tl":
      return `${topic} | NurseNest gabay ${n}`;
    case "zh-Hans":
      return `${topic} | NurseNest 指南 ${n}`;
    case "ja":
      return `${topic} | NurseNest ガイド ${n}`;
    default: {
      const _e: never = lang;
      return _e;
    }
  }
}

function seoDescriptionFor(lang: IntlNursingLangKey, topic: string): string {
  switch (lang) {
    case "es":
      return `Recurso educativo de NurseNest sobre ${topic}: valoración, intervenciones, farmacología contextual y repaso para examen.`;
    case "fr":
      return `Ressource NurseNest sur ${topic} : évaluation, interventions, pharmacologie contextuelle et révision d’examen.`;
    case "pt":
      return `Recurso NurseNest sobre ${topic}: avaliação, intervenções, farmacologia contextual e revisão de prova.`;
    case "ar":
      return `مورد NurseNest التعليمي حول ${topic}: التقييم، التدخلات، الدوائية السياقية ومراجعة الامتحان.`;
    case "hi":
      return `NurseNest शैक्षिक संसाधन: ${topic} — मूल्यांकन, हस्तक्षेप, संदर्भिक औषध विज्ञान और परीक्षा समीक्षा।`;
    case "tl":
      return `NurseNest edukasyonal na mapagkukunan tungkol sa ${topic}: pagsusuri, interbensyon, kontekstwal na farmakolohiya, at pagsusuri sa eksamen.`;
    case "zh-Hans":
      return `NurseNest 教育性内容：${topic}——评估、干预、情境药理与考试复习要点。`;
    case "ja":
      return `NurseNest 学習用コンテンツ：${topic}（評価、介入、文脈に沿った薬理、試験対策の要点）。`;
    default: {
      const _e: never = lang;
      return _e;
    }
  }
}

function tagsFor(lang: IntlNursingLangKey): string {
  const common =
    lang === "es"
      ? "enfermería internacional, examen, seguridad del paciente, priorización, farmacología, educación al paciente"
      : lang === "fr"
        ? "soins infirmiers internationaux, examen, sécurité patient, priorisation, pharmacologie, éducation thérapeutique"
        : lang === "pt"
          ? "enfermagem internacional, exame, segurança do paciente, priorização, farmacologia, educação em saúde"
          : lang === "ar"
            ? "التمريض الدولي, امتحان, سلامة المريض, أولويات, علم الأدوية, تثقيف صحي"
            : lang === "hi"
              ? "अंतर्राष्ट्रीय नर्सिंग, परीक्षा, मरीज़ सुरक्षा, प्राथमिकता, औषध विज्ञान, मरीज़ शिक्षा"
              : lang === "tl"
                ? "international nursing, exam, patient safety, priyoridad, farmakolohiya, edukasyon ng pasyente"
                : lang === "zh-Hans"
                  ? "国际护理, 考试, 患者安全, 优先级, 药理, 患者教育"
                  : "国際看護, 試験, 患者安全, 優先順位, 薬理, 患者教育";
  return common;
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true });
  const reportRows: string[] = [];
  reportRows.push("| language | locale | slug | words | translationGroupId |");
  reportRows.push("| --- | --- | --- | ---: | --- |");

  let total = 0;
  for (const spec of INTL_NURSING_LANGS) {
    for (let i = 0; i < INTL_LONGTAIL_POSTS_PER_LANGUAGE; i++) {
      const stem = asciiSlugStem(i);
      const slug = `${spec.slugPrefix}-${stem}`;
      const topic = topicPhraseFor(spec.key, i);
      const group = translationGroupIdForIndex(i);
      const title = titleFor(spec.key, i, topic);
      const excerpt = excerptFor(spec.key, topic);
      const seoTitle = seoTitleFor(spec.key, i, topic);
      const seoDescription = seoDescriptionFor(spec.key, topic);
      const body = buildIntlLongtailBodyHtml(spec, topic, i, slug);
      const words = countWordsFromHtml(body);
      const disclaimer = disclaimerFor(spec.key);
      const fm = `---
slug: ${slug}
title: ${JSON.stringify(title)}
excerpt: ${JSON.stringify(excerpt)}
category: ${JSON.stringify(spec.category)}
tags: ${tagsFor(spec.key)}
publishedAt: 2026-05-09
updatedAt: 2026-05-09
locale: ${spec.locale}
languageCode: ${spec.languageCode}
translationGroupId: ${group}
seoTitle: ${JSON.stringify(seoTitle)}
seoDescription: ${JSON.stringify(seoDescription)}
canonicalUrl: /blog/${slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: ${JSON.stringify(disclaimer)}
---

`;
      const fileName = `${slug}.md`;
      writeFileSync(join(OUT_DIR, fileName), `${fm}${body}\n`, "utf8");
      total++;
      reportRows.push(`| ${spec.key} | ${spec.locale} | ${slug} | ${words} | ${group} |`);
    }
  }

  const reportDir = join(APP_ROOT, "reports");
  mkdirSync(reportDir, { recursive: true });
  const readme = join(reportDir, "multilingual-longtail-batch-README.md");
  const part1 = join(reportDir, "multilingual-longtail-batch-part-01.md");
  writeFileSync(
    readme,
    `# Multilingual international nursing long-tail batch

## Interpretation of contradictory counts (user request)

- The user asked for **1110–1115 posts per language** across **8 languages** while also citing **1180–1120 total posts**; these are **mutually inconsistent** (1110×8 far exceeds 1180).
- **Adopted plan:** **${INTL_LONGTAIL_POSTS_PER_LANGUAGE} posts per language × 8 languages = ${INTL_LONGTAIL_POSTS_PER_LANGUAGE * 8} total**, aligning with the **1120–1180 total** band when **1110–1115 per language** is treated as a typo for **~110–115** or superseded by a **total-first** reading.

## Schema

- Extended \`BlogStaticLongtailRecord\` and loader with optional **locale**, **languageCode**, **translationGroupId** (frontmatter-driven).

## Output

- Markdown files under \`src/content/blog-static-longtail/\` with UTF-8, kebab-case ASCII slugs, bilingual disclaimer containing required English markers for validators.

## Validation commands (run from \`nursenest-core/\`)

1. \`npm run validate:blog-static-longtail\`
2. \`npm run diagnose:blog-slug-collisions -- --write-report\`
3. \`npm run typecheck:critical\`
4. \`npm run test:blog-recovery\`
5. \`npm run test:homepage\`

See \`multilingual-longtail-batch-part-01.md\` for the per-post index table (may be large).

Generator: \`scripts/blog/generate-intl-nursing-longtail-batch.mts\`
`,
    "utf8",
  );
  writeFileSync(part1, `${reportRows.join("\n")}\n`, "utf8");
  console.log(`Wrote ${total} markdown file(s) to ${OUT_DIR}`);
  console.log(`Report: ${readme}`);
  console.log(`Index table: ${part1}`);
}

main();
