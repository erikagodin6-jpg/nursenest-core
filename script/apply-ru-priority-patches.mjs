/**
 * Russian hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-ru-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "Что изучать дальше",
  "studyNext.primary": "Рекомендуемый следующий шаг",
  "studyNext.secondary": "Другие полезные действия",
  "studyNext.confidence.high": "Высокая уверенность",
  "studyNext.confidence.medium": "Средняя уверенность",
  "studyNext.confidence.low": "Ограниченные данные",
  "studyNext.cta.continue": "Продолжить",
  "studyNext.cta.practiceNow": "Практиковаться сейчас",
  "studyNext.cta.reviewNow": "Повторить сейчас",
  "studyNext.linkStudyPlan": "План обучения",
  "studyNext.openCta": "Открыть",
  "studyNext.reasons.continue_path_started": "Вы уже начали этот путь",
  "studyNext.reasons.pathway_progress_stalled":
    "Прогресс по этому пути замедлился",
  "studyNext.reasons.weak_topic_high_confidence":
    "Слабая область по этой теме хорошо подтверждается данными",
  "studyNext.reasons.weak_topic_recent_miss":
    "Недавние ошибки по этой теме",
  "studyNext.reasons.weak_topic_low_confidence":
    "Низкая уверенность по этой теме",
  "studyNext.reasons.practice_retest_weak_pool":
    "Повторите пул слабых вопросов",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "Начните со смешанной практики",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "Предпросмотр Study Next для подписчиков (примерные данные, заблокировано)",
  "conversion.lockedStudyNext.previewHint":
    "Пример интерфейса — после подписки рекомендации будут персонализироваться на основе вашей практики.",
  // Navigation
  "components.navigation.closeMenu": "Закрыть меню",
  "components.navigation.freeTools": "Бесплатные инструменты",
  "components.navigation.internationalNurses": "Международные медсестры",
  "components.navigation.npExamPreparation": "Подготовка к экзамену NP",
  "components.navigation.openMenu": "Открыть меню",
  "components.navigation.siConventionalConverter":
    "Конвертер SI ↔ Conventional",
  // Auth
  "auth.forgotPassword": "Забыли пароль",
  "auth.login": "Войти",
  "auth.resetPassword": "Сбросить пароль",
  "auth.signup": "Создать аккаунт",
  // CTAs
  "cta.continuePlan": "Продолжить план",
  "cta.improveWeakAreas": "Улучшить слабые темы",
  "cta.seePlansPricing": "Посмотреть планы и цены",
  "cta.unlockPlan": "Разблокировать персональный план обучения",
  // Footer
  "footer.about": "О NurseNest",
  "footer.acceptableUse": "Допустимое использование",
  "footer.allSpecialties": "Все специализации",
  "footer.alliedHealth": "Смежные медицинские специальности",
  "footer.alliedHealthExamPrep":
    "Подготовка к экзаменам по смежным медицинским специальностям",
  "footer.alliedHealthGuides":
    "Гайды по смежным медицинским специальностям",
  "footer.anatomyExplorer": "Атлас анатомии",
  "footer.applyNest": "Карьерные инструменты ApplyNest",
  "footer.blog": "Блог",
  "footer.caseSimulations": "Симуляции клинических случаев",
  "footer.caseStudies": "Клинические разборы",
  "footer.clinicalClarity": "Клиническая ясность",
  "footer.clinicalLessons": "Клинические уроки",
  "footer.clinicalTools": "Клинические инструменты",
  "footer.contact": "Контакты",
  "footer.disclaimer": "Отказ от ответственности",
  "footer.ecosystem": "Экосистема",
  "footer.ecosystemCareers": "Карьера в здравоохранении",
  "footer.ecosystemExamPrep": "Подготовка к экзаменам",
  "footer.ecosystemNewGrad": "Поддержка выпускников",
  "footer.educationEcosystem": "Образовательная экосистема",
  "footer.emailBannerPhase2":
    "Подписка на рассылку будет подключена к API подписки на этапе 2.",
  "footer.emailBannerSubtitle":
    "Выберите, как часто получать письма. Отписка в любое время.",
  "footer.emailBannerTitle":
    "Получайте клинически полезные вопросы на почту",
  "footer.examPrep": "Подготовка к экзаменам",
  "footer.faq": "FAQ",
  "footer.feedback": "Обратная связь",
  "footer.forSchools": "Для учебных заведений",
  "footer.healthcareJobs": "Вакансии в здравоохранении",
  "footer.icuGuide": "Гайд по ICU",
  "footer.imagingGuide": "Гайд по диагностической визуализации",
  "footer.labValues": "Лабораторные показатели",
  "footer.legal": "Правовая информация",
  "footer.legalDisclaimer":
    "NurseNest предоставляет образовательный контент для подготовки к экзаменам и не аффилирован с NCLEX, регулирующими колледжами или лицензирующими органами.",
  "footer.medLabTech": "Лабораторная диагностика",
  "footer.medMath": "Медицинские расчеты",
  "footer.medSurgGuide": "Гайд по медико-хирургическому уходу",
  "footer.medicationMastery": "Мастерство в фармакологии",
  "footer.mentalHealthGuide": "Гайд по психиатрической медсестринской помощи",
  "footer.mltGuide": "Гайд MLT",
  "footer.mockExams": "Пробные экзамены",
  "footer.nephroGuide": "Гайд по нефрологическому уходу",
  "footer.newGradHub": "Хаб для выпускников",
  "footer.newGradSupportSection": "Поддержка выпускников",
  "footer.nicuGuide": "Гайд по NICU",
  "footer.nursing": "Сестринское дело",
  "footer.nursingSpecialties": "Сестринские специализации",
  "footer.orthoGuide": "Гайд по ортопедическому уходу",
  "footer.otGuide": "Гайд по эрготерапии",
  "footer.palliativeGuide": "Гайд по паллиативной помощи",
  "footer.paramedic": "Парамедик",
  "footer.paramedicGuide": "Гайд для парамедиков",
  "footer.preNursing": "Подготовка к сестринскому делу",
  "footer.pricing": "Цены",
  "footer.privacy": "Конфиденциальность",
  "footer.ptGuide": "Гайд по физиотерапии",
  "footer.questionOfTheDay": "Вопрос дня",
  "footer.refundPolicy": "Политика возврата",
  "footer.resources": "Ресурсы",
  "footer.respiratoryTherapy": "Респираторная терапия",
  "footer.rights": "Все права защищены.",
  "footer.rrtGuide": "Гайд по респираторной терапии",
  "footer.studyInYourLanguage": "Изучайте сестринское дело на своем языке",
  "footer.studyTools": "Инструменты обучения",
  "footer.terms": "Условия",
  "footer.testBank": "Банк вопросов",
  "footer.toolsHub": "Центр инструментов",
  "footer.traumaGuide": "Гайд по травматологическому уходу",
  "footer.videoLectures": "Видеолекции",
  "footer.viewAllLanguages": "Посмотреть все языки →",
};

const ruPath = path.join(root, "nursenest-core/public/i18n/ru.json");
const clientPath = path.join(root, "client/public/i18n/ru.json");

const ru = JSON.parse(readFileSync(ruPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in ru)) console.warn("missing key in ru.json:", k);
  ru[k] = v;
}
const json = JSON.stringify(ru);
writeFileSync(ruPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Russian strings`);
