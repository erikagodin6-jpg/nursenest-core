/**
 * Japanese hand patches for high-traffic keys (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-ja-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "次の学習",
  "studyNext.primary": "おすすめの次のステップ",
  "studyNext.secondary": "その他のおすすめ",
  "studyNext.confidence.high": "信頼度：高",
  "studyNext.confidence.medium": "信頼度：中",
  "studyNext.confidence.low": "根拠は限定的",
  "studyNext.cta.continue": "続ける",
  "studyNext.cta.practiceNow": "演習する",
  "studyNext.cta.reviewNow": "復習する",
  "studyNext.linkStudyPlan": "学習プラン",
  "studyNext.openCta": "開く",
  "studyNext.reasons.continue_path_started": "このパスを始めています",
  "studyNext.reasons.pathway_progress_stalled": "パスの進捗が止まっています",
  "studyNext.reasons.weak_topic_high_confidence": "このトピックの弱点は十分なデータで裏付けられています",
  "studyNext.reasons.weak_topic_recent_miss": "このトピックで最近ミスが多いです",
  "studyNext.reasons.weak_topic_low_confidence": "このトピックの信頼度が低いです",
  "studyNext.reasons.practice_retest_weak_pool": "苦手問題プールを復習する",
  "studyNext.reasons.insufficient_signals_mixed_bank": "ミックス演習から始める",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "購読者向け「次の学習」のプレビュー（サンプルデータ、ロック中）",
  "conversion.lockedStudyNext.previewHint":
    "表示例です。購読後は、あなたの演習データに基づいておすすめが個別化されます。",
  // Navigation
  "components.navigation.closeMenu": "メニューを閉じる",
  "components.navigation.freeTools": "無料ツール",
  "components.navigation.internationalNurses": "海外出身の看護師の方へ",
  "components.navigation.npExamPreparation": "NP 試験対策",
  "components.navigation.openMenu": "メニューを開く",
  "components.navigation.siConventionalConverter": "SI ↔ 従来単位 換算",
  // Auth
  "auth.forgotPassword": "パスワードをお忘れですか",
  "auth.login": "ログイン",
  "auth.resetPassword": "パスワードを再設定",
  "auth.signup": "アカウントを作成",
  // CTAs
  "cta.continuePlan": "プランを続ける",
  "cta.improveWeakAreas": "苦手分野を伸ばす",
  "cta.seePlansPricing": "プランと料金を見る",
  "cta.unlockPlan": "あなた専用の学習プランを解放する",
  // Footer
  "footer.about": "NurseNest について",
  "footer.acceptableUse": "許容される利用",
  "footer.allSpecialties": "全専門",
  "footer.alliedHealth": "アライドヘルス",
  "footer.alliedHealthExamPrep": "アライドヘルス試験対策",
  "footer.alliedHealthGuides": "アライドヘルスガイド",
  "footer.anatomyExplorer": "解剖エクスプローラー",
  "footer.applyNest": "ApplyNest キャリアツール",
  "footer.blog": "ブログ",
  "footer.caseSimulations": "症例シミュレーション",
  "footer.caseStudies": "症例スタディ",
  "footer.clinicalClarity": "臨床の要点",
  "footer.clinicalLessons": "臨床レッスン",
  "footer.clinicalTools": "臨床ツール",
  "footer.contact": "お問い合わせ",
  "footer.disclaimer": "免責事項",
  "footer.ecosystem": "エコシステム",
  "footer.ecosystemCareers": "医療・介護のキャリア",
  "footer.ecosystemExamPrep": "試験対策",
  "footer.ecosystemNewGrad": "新卒サポート",
  "footer.educationEcosystem": "教育エコシステム",
  "footer.emailBannerPhase2":
    "ニュースレター登録はフェーズ2で購読APIと連携予定です。",
  "footer.emailBannerSubtitle":
    "配信頻度を選べます。いつでも配信停止できます。",
  "footer.emailBannerTitle": "臨床に役立つ問題をメールで受け取る",
  "footer.examPrep": "試験対策",
  "footer.faq": "よくある質問",
  "footer.feedback": "フィードバック",
  "footer.forSchools": "教育機関の方へ",
  "footer.healthcareJobs": "医療・介護の求人",
  "footer.icuGuide": "ICU ガイド",
  "footer.imagingGuide": "画像診断ガイド",
  "footer.labValues": "検査値",
  "footer.legal": "法的情報",
  "footer.legalDisclaimer":
    "NurseNest は試験対策向けの教育コンテンツを提供しており、NCLEX、規制当局、または免許団体とは提携していません。",
  "footer.medLabTech": "臨床検査技師",
  "footer.medMath": "薬剤計算",
  "footer.medSurgGuide": "メッドサージ看護ガイド",
  "footer.medicationMastery": "薬物療法マスタリー",
  "footer.mentalHealthGuide": "精神保健看護ガイド",
  "footer.mltGuide": "MLT ガイド",
  "footer.mockExams": "模擬試験",
  "footer.nephroGuide": "腎臓内科看護ガイド",
  "footer.newGradHub": "新卒ハブ",
  "footer.newGradSupportSection": "新卒サポート",
  "footer.nicuGuide": "NICU ガイド",
  "footer.nursing": "看護",
  "footer.nursingSpecialties": "看護の専門分野",
  "footer.orthoGuide": "整形外科看護ガイド",
  "footer.otGuide": "作業療法ガイド",
  "footer.palliativeGuide": "緩和ケアガイド",
  "footer.paramedic": "救急救命士",
  "footer.paramedicGuide": "救急救命士ガイド",
  "footer.preNursing": "看護学生・受験前",
  "footer.pricing": "料金",
  "footer.privacy": "プライバシー",
  "footer.ptGuide": "理学療法ガイド",
  "footer.questionOfTheDay": "今日の1問",
  "footer.refundPolicy": "返金ポリシー",
  "footer.resources": "リソース",
  "footer.respiratoryTherapy": "呼吸療法",
  "footer.rights": "無断転載を禁じます。",
  "footer.rrtGuide": "呼吸療法士ガイド",
  "footer.studyInYourLanguage": "母語で看護を学ぶ",
  "footer.studyTools": "学習ツール",
  "footer.terms": "利用規約",
  "footer.testBank": "問題バンク",
  "footer.toolsHub": "ツールハブ",
  "footer.traumaGuide": "外傷看護ガイド",
  "footer.videoLectures": "動画レクチャー",
  "footer.viewAllLanguages": "すべての言語を見る →",
  // Resume tip — was empty in bundle; mirrors en quantified-accomplishments copy
  "newGrad.resume.tip2Desc":
    "「患者ケアを担当した」のような曖昧な表現ではなく、「メッドサージ病棟でシフトごとに4〜6名の患者を担当した」のように、数値と文脈を入れて具体的に書きましょう。",
};

const jaPath = path.join(root, "nursenest-core/public/i18n/ja.json");
const clientPath = path.join(root, "client/public/i18n/ja.json");

const ja = JSON.parse(readFileSync(jaPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in ja)) console.warn("missing key in ja.json:", k);
  ja[k] = v;
}
const json = JSON.stringify(ja);
writeFileSync(jaPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Japanese strings`);
