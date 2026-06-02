import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-womens-health";
const PAGE_TITLE = "CNPLE Women's Health — Canadian NP Exam Practice | NurseNest";
const PAGE_H1 = "CNPLE women's health questions for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned women's health practice questions for Canadian NP exam preparation. Reproductive health, prenatal and postnatal care, gynaecological presentations, contraception, menopause, and cancer screening — scoped to Canadian NP practice.";

const FAQ_ITEMS = [
  {
    question: "What women's health topics are on the CNPLE?",
    answer:
      "CNPLE-aligned women's health content includes contraception counselling and initiation (combined oral contraceptives, progestin-only options, IUDs, barrier methods, emergency contraception), reproductive health management (STI screening and treatment, vaginal discharge, pelvic inflammatory disease), prenatal and postnatal care within NP scope, gynaecological presentations (abnormal uterine bleeding, dysmenorrhoea, pelvic pain), menopause management, and cancer screening (cervical, breast, ovarian risk factors).",
  },
  {
    question: "How much prenatal care content is on the CNPLE?",
    answer:
      "Canadian NPs manage prenatal care independently within their scope in many practice settings. CNPLE-aligned prenatal content covers routine antenatal care structure, common first and second trimester complications (hyperemesis, threatened miscarriage, gestational hypertension), screening test interpretation (NIPT, integrated prenatal screening, glucose challenge test), and appropriate referral thresholds. Intrapartum management is generally outside primary care NP scope and is less likely to be tested.",
  },
  {
    question: "How does contraception counselling appear on the CNPLE?",
    answer:
      "Contraception questions test NP decision-making: selecting the most appropriate method given the patient's history and preferences, identifying contraindications (combined hormonal contraceptives in migraine with aura, hypertension, or hypercoagulable states), managing common side effects, and providing evidence-based counselling. Canadian Medical Eligibility Criteria and the Society of Obstetricians and Gynaecologists of Canada guidelines frame the clinical evidence.",
  },
  {
    question: "Is menopause management tested on the CNPLE?",
    answer:
      "Yes. Menopause management within Canadian NP scope is a relevant competency: identifying perimenopause, assessing symptom burden, initiating and managing menopausal hormone therapy (indications, contraindications, regimen selection), non-hormonal options for patients who cannot use hormone therapy, and osteoporosis prevention and screening in the postmenopausal period.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("canada"),
        keywords: [
          "CNPLE women's health",
          "Canadian NP women's health exam",
          "CNPLE reproductive health",
          "Canadian NP gynaecology",
          "CNPLE prenatal questions",
          "Canadian NP contraception",
          "CNPLE menopause",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.cnple_seo_hub" },
  );
}

export default function CnpleWomensHealthPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned women's health practice questions spanning reproductive care, gynaecological presentations, contraception, prenatal care within NP scope, cancer screening, and menopause management — all framed within the Canadian NP competency model."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        { href: "/cnple-pediatrics", label: "Paediatrics" },
        { href: "/cnple-geriatrics", label: "Geriatrics" },
        { href: "/cnple-prescribing-questions", label: "Prescribing Questions" },
        CNPLE_RELATED_LINKS[10],
      ]}
      sections={[
        {
          id: "womens-health-scope",
          heading: "Women's health scope for Canadian nurse practitioners",
          body: (
            <>
              <p>
                Canadian NPs in primary care settings manage a comprehensive range of women's
                health needs — from adolescent reproductive health through menopause and beyond.
                This includes contraception counselling and prescribing, routine gynaecological
                assessments, STI screening and treatment, prenatal care coordination, postnatal
                follow-up, and cancer screening programme delivery. The CNPLE tests these
                competencies within the autonomous NP practice model.
              </p>
              <p>
                Women's health on the CNPLE is not a discrete section — it is integrated throughout
                lifespan care scenarios. A question presenting a 28-year-old seeking contraception
                counselling, a 34-year-old with abnormal uterine bleeding, a 42-year-old with
                perimenopausal symptoms, and a 58-year-old requiring osteoporosis screening all
                test women's health competencies in primary care NP context.
              </p>
            </>
          ),
        },
        {
          id: "contraception",
          heading: "Contraception and reproductive health planning",
          body: (
            <>
              <p>
                Contraception counselling on the CNPLE tests decision-making, not catalogue
                memorisation. Given a patient's reproductive goals, medical history, and
                preferences, the NP selects the most appropriate method and explains relevant
                advantages, limitations, and contraindications. Key clinical decision points
                include combined hormonal contraceptive contraindications (migraine with aura,
                uncontrolled hypertension, DVT/PE history, prolonged immobility), IUD candidacy
                in nulliparous patients, and emergency contraception timing and efficacy.
              </p>
              <p>
                STI screening protocols — who to screen, which tests to order, how to interpret
                results, and how to treat common infections including chlamydia, gonorrhoea,
                syphilis, and BV within Canadian NP prescriptive scope — appear in reproductive
                health scenarios. SOGC and PHAC guidelines provide the evidence framework that
                Canadian NPs are expected to apply.
              </p>
            </>
          ),
        },
        {
          id: "cancer-screening",
          heading: "Cancer screening and preventive gynaecology",
          body: (
            <>
              <p>
                Cervical cancer screening in Canada has shifted to primary HPV testing in most
                provinces — CNPLE-aligned preparation covers the transition from Pap smear to
                HPV-based screening, result interpretation, colposcopy referral thresholds, and
                HPV vaccination counselling within the national immunisation schedule. Breast
                cancer screening involves understanding provincial mammography programme
                eligibility, risk stratification for early or more intensive surveillance, and
                BRCA mutation counselling at the primary care level.
              </p>
              <p>
                Abnormal uterine bleeding — one of the most common presentations in women's
                health primary care — requires systematic assessment (structural vs. non-structural
                causes using the PALM-COEIN classification), appropriate investigation (endometrial
                biopsy thresholds, pelvic ultrasound indications), and management options within
                NP scope including hormonal regulation, referral for endometrial evaluation, and
                iron supplementation for associated anaemia.
              </p>
            </>
          ),
        },
        {
          id: "menopause",
          heading: "Menopause and perimenopausal management",
          body: (
            <>
              <p>
                Perimenopause identification and symptom assessment are primary care NP
                competencies. CNPLE-aligned preparation covers vasomotor symptom severity
                assessment, the cardiovascular and bone health implications of oestrogen decline,
                and evidence-based decision-making around menopausal hormone therapy initiation —
                including which patients are appropriate candidates, which regimens to consider
                (oestrogen alone vs. combined, systemic vs. local), and when hormone therapy is
                contraindicated.
              </p>
              <p>
                Non-hormonal management options for patients who cannot or choose not to use
                hormone therapy — SSRIs and SNRIs for vasomotor symptoms, gabapentin, clonidine,
                and vaginal lubricants and moisturisers for genitourinary syndrome — are part of
                the CNPLE competency picture. Osteoporosis prevention and FRAX-based fracture risk
                assessment in postmenopausal women, along with calcium and vitamin D
                supplementation counselling, complete the menopause management domain.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
