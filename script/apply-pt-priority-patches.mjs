/**
 * Portuguese hand patches for high-traffic keys
 * (Study Next, nav, auth, CTAs, footer).
 * Run after merge/Lingva: node script/apply-pt-priority-patches.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PATCHES = {
  // Study Next
  "studyNext.title": "Próximo estudo",
  "studyNext.primary": "Próximo passo recomendado",
  "studyNext.secondary": "Outras ações úteis",
  "studyNext.confidence.high": "Alta confiança",
  "studyNext.confidence.medium": "Confiança média",
  "studyNext.confidence.low": "Evidência limitada",
  "studyNext.cta.continue": "Continuar",
  "studyNext.cta.practiceNow": "Praticar agora",
  "studyNext.cta.reviewNow": "Revisar agora",
  "studyNext.linkStudyPlan": "Plano de estudo",
  "studyNext.openCta": "Abrir",
  "studyNext.reasons.continue_path_started": "Você já iniciou esta trilha",
  "studyNext.reasons.pathway_progress_stalled":
    "O progresso da sua trilha está estagnado",
  "studyNext.reasons.weak_topic_high_confidence":
    "A fraqueza neste tópico está bem sustentada por dados",
  "studyNext.reasons.weak_topic_recent_miss":
    "Erros recentes neste tópico",
  "studyNext.reasons.weak_topic_low_confidence":
    "Baixa confiança neste tópico",
  "studyNext.reasons.practice_retest_weak_pool":
    "Revise seu conjunto de áreas fracas",
  "studyNext.reasons.insufficient_signals_mixed_bank":
    "Comece com prática mista",
  // Conversion preview
  "conversion.lockedStudyNext.ariaLabel":
    "Prévia do Study Next para assinantes (dados de exemplo, bloqueado)",
  "conversion.lockedStudyNext.previewHint":
    "Exemplo de layout — após assinar, suas recomendações serão personalizadas com base na sua prática.",
  // Navigation
  "components.navigation.closeMenu": "Fechar menu",
  "components.navigation.freeTools": "Ferramentas grátis",
  "components.navigation.internationalNurses": "Enfermeiros internacionais",
  "components.navigation.npExamPreparation": "Preparação para exame NP",
  "components.navigation.openMenu": "Abrir menu",
  "components.navigation.siConventionalConverter":
    "Conversor SI ↔ Convencional",
  // Auth
  "auth.forgotPassword": "Esqueci a senha",
  "auth.login": "Entrar",
  "auth.resetPassword": "Redefinir senha",
  "auth.signup": "Criar conta",
  // CTAs
  "cta.continuePlan": "Continuar seu plano",
  "cta.improveWeakAreas": "Melhorar suas áreas fracas",
  "cta.seePlansPricing": "Ver planos e preços",
  "cta.unlockPlan": "Desbloquear seu plano de estudo personalizado",
  // Footer
  "footer.about": "Sobre a NurseNest",
  "footer.acceptableUse": "Uso aceitável",
  "footer.allSpecialties": "Todas as especialidades",
  "footer.alliedHealth": "Saúde aliada",
  "footer.alliedHealthExamPrep": "Preparação para exames de saúde aliada",
  "footer.alliedHealthGuides": "Guias de saúde aliada",
  "footer.anatomyExplorer": "Explorador de anatomia",
  "footer.applyNest": "Ferramentas de carreira ApplyNest",
  "footer.blog": "Blog",
  "footer.caseSimulations": "Simulações de casos",
  "footer.caseStudies": "Estudos de caso",
  "footer.clinicalClarity": "Clareza clínica",
  "footer.clinicalLessons": "Aulas clínicas",
  "footer.clinicalTools": "Ferramentas clínicas",
  "footer.contact": "Contato",
  "footer.disclaimer": "Aviso legal",
  "footer.ecosystem": "Ecossistema",
  "footer.ecosystemCareers": "Carreiras em saúde",
  "footer.ecosystemExamPrep": "Preparação para exames",
  "footer.ecosystemNewGrad": "Suporte para recém-formados",
  "footer.educationEcosystem": "Ecossistema educacional",
  "footer.emailBannerPhase2":
    "A inscrição na newsletter será conectada à API de assinatura na Fase 2.",
  "footer.emailBannerSubtitle":
    "Escolha com que frequência quer receber mensagens. Cancele quando quiser.",
  "footer.emailBannerTitle":
    "Receba perguntas clinicamente úteis no seu e-mail",
  "footer.examPrep": "Preparação para exames",
  "footer.faq": "FAQ",
  "footer.feedback": "Feedback",
  "footer.forSchools": "Para instituições de ensino",
  "footer.healthcareJobs": "Vagas em saúde",
  "footer.icuGuide": "Guia de UTI",
  "footer.imagingGuide": "Guia de diagnóstico por imagem",
  "footer.labValues": "Valores laboratoriais",
  "footer.legal": "Legal",
  "footer.legalDisclaimer":
    "A NurseNest oferece conteúdo educacional para preparação de exames e não é afiliada ao NCLEX, a conselhos regulatórios ou a órgãos de licenciamento.",
  "footer.medLabTech": "Técnico em análises clínicas",
  "footer.medMath": "Cálculo de medicação",
  "footer.medSurgGuide": "Guia de enfermagem médico-cirúrgica",
  "footer.medicationMastery": "Domínio de medicação",
  "footer.mentalHealthGuide": "Guia de enfermagem em saúde mental",
  "footer.mltGuide": "Guia MLT",
  "footer.mockExams": "Simulados",
  "footer.nephroGuide": "Guia de enfermagem em nefrologia",
  "footer.newGradHub": "Hub de recém-formados",
  "footer.newGradSupportSection": "Suporte ao recém-formado",
  "footer.nicuGuide": "Guia de UTI neonatal",
  "footer.nursing": "Enfermagem",
  "footer.nursingSpecialties": "Especialidades de enfermagem",
  "footer.orthoGuide": "Guia de enfermagem ortopédica",
  "footer.otGuide": "Guia de terapia ocupacional",
  "footer.palliativeGuide": "Guia de cuidados paliativos",
  "footer.paramedic": "Paramédico",
  "footer.paramedicGuide": "Guia de paramédico",
  "footer.preNursing": "Pré-enfermagem",
  "footer.pricing": "Preços",
  "footer.privacy": "Privacidade",
  "footer.ptGuide": "Guia de fisioterapia",
  "footer.questionOfTheDay": "Pergunta do dia",
  "footer.refundPolicy": "Política de reembolso",
  "footer.resources": "Recursos",
  "footer.respiratoryTherapy": "Terapia respiratória",
  "footer.rights": "Todos os direitos reservados.",
  "footer.rrtGuide": "Guia de terapia respiratória",
  "footer.studyInYourLanguage": "Estude enfermagem no seu idioma",
  "footer.studyTools": "Ferramentas de estudo",
  "footer.terms": "Termos",
  "footer.testBank": "Banco de questões",
  "footer.toolsHub": "Central de ferramentas",
  "footer.traumaGuide": "Guia de enfermagem em trauma",
  "footer.videoLectures": "Aulas em vídeo",
  "footer.viewAllLanguages": "Ver todos os idiomas →",
};

const ptPath = path.join(root, "nursenest-core/public/i18n/pt.json");
const clientPath = path.join(root, "client/public/i18n/pt.json");

const pt = JSON.parse(readFileSync(ptPath, "utf8"));
for (const [k, v] of Object.entries(PATCHES)) {
  if (!(k in pt)) console.warn("missing key in pt.json:", k);
  pt[k] = v;
}
const json = JSON.stringify(pt);
writeFileSync(ptPath, json);
writeFileSync(clientPath, json);
console.log(`Patched ${Object.keys(PATCHES).length} Portuguese strings`);
