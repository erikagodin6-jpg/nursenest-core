import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-pediatrics";
const PAGE_TITLE = "CNPLE Paediatrics — Canadian NP Exam Practice | NurseNest";
const PAGE_H1 = "CNPLE paediatric questions for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned paediatric practice questions for Canadian NP exam preparation. Growth and development, common paediatric presentations, immunisation schedules, and paediatric prescribing within Canadian NP scope.";

const FAQ_ITEMS = [
  {
    question: "What paediatric topics does the CNPLE cover?",
    answer:
      "Based on Canadian NP competency frameworks, CNPLE-relevant paediatric content includes growth and developmental surveillance (Rourke Baby Record, Nipissing Developmental Screen), common acute paediatric presentations (febrile illness, respiratory infections, otitis media, gastroenteritis), immunisation schedule adherence and contraindications, paediatric prescribing safety (weight-based dosing, age-appropriate formulations), and child and adolescent mental health screening.",
  },
  {
    question: "Are paediatric questions a major part of the CNPLE?",
    answer:
      "The CNPLE is based on a lifespan competency model for Canadian NPs. Paediatric content is integrated throughout the lifespan competency framework rather than siloed — expect paediatric presentations embedded in primary care scenarios across the full exam. Specific weighting has not been officially confirmed by CCRNR; NurseNest aligns preparation to published NP competency frameworks.",
  },
  {
    question: "What is the Rourke Baby Record and is it on the CNPLE?",
    answer:
      "The Rourke Baby Record is Canada's nationally-used evidence-based guide for well-baby visits, covering growth monitoring, developmental milestones, immunisations, anticipatory guidance, and screening for postnatal depression and family risk factors. It is a core tool in Canadian primary care paediatric practice and is therefore a relevant domain for CNPLE-aligned preparation.",
  },
  {
    question: "How does paediatric prescribing differ on the CNPLE?",
    answer:
      "Paediatric prescribing questions test weight-based dosing calculations, age-appropriate antibiotic selection (e.g., amoxicillin dosing by indication and age, azithromycin in atypical presentations), contraindications in specific paediatric populations (avoiding ASA in children for Reye syndrome risk, codeine in young children), and safe OTC medication counselling for parents. The emphasis is on safety and appropriate scope, not just drug name recall.",
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
          "CNPLE pediatrics",
          "CNPLE paediatrics",
          "Canadian NP pediatrics exam",
          "CNPLE child health questions",
          "Canadian NP paediatric practice",
          "CNPLE child development",
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

export default function CnplePediatricsPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned paediatric practice questions for Canadian NP exam preparation. The lifespan model of the CNPLE means paediatric reasoning — from well-child surveillance to acute presentations — appears throughout the exam, not in isolation."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
        { href: "/cnple-womens-health", label: "Women's Health" },
        { href: "/cnple-geriatrics", label: "Geriatrics" },
        { href: "/cnple-primary-care", label: "Primary Care" },
      ]}
      sections={[
        {
          id: "paediatric-scope",
          heading: "Paediatric NP scope in Canadian primary care",
          body: (
            <>
              <p>
                Canadian NPs in primary care settings routinely manage the full paediatric
                continuum — from newborn well-baby assessments through adolescent health. This
                includes growth and developmental surveillance, immunisation programme delivery and
                counselling, acute illness management, anticipatory guidance, and coordination with
                paediatric specialty services when the presentation exceeds primary care scope.
              </p>
              <p>
                The CNPLE reflects this scope. Paediatric competencies are not isolated to a single
                exam domain; they are embedded throughout the lifespan framework. A question about
                antibiotic selection for otitis media, a case presenting a child with developmental
                regression, and a scenario involving an adolescent with depression and suicidal
                ideation all test paediatric reasoning within the NP's independent practice scope.
              </p>
            </>
          ),
        },
        {
          id: "growth-development",
          heading: "Growth, development, and surveillance in Canadian primary care",
          body: (
            <>
              <p>
                Growth monitoring in Canada uses WHO growth charts for children under two and
                CDC-based references for older children. CNPLE-aligned preparation covers how to
                identify growth faltering, distinguish constitutional short stature from pathological
                causes, and determine when specialist referral is warranted — not just charting
                technique.
              </p>
              <p>
                Developmental surveillance uses the Rourke Baby Record at each well-baby visit and
                the Nipissing District Developmental Screen for age-specific milestone checking.
                CNPLE questions may ask the NP to identify a developmental red flag (no babbling
                by 12 months, no single words by 16 months, loss of previously acquired skills at
                any age), determine the urgency of the concern, and initiate the appropriate
                referral pathway. The Autism Spectrum Disorder screening context — M-CHAT-R/F at
                18 and 24 months — is a specific Canadian primary care standard relevant to CNPLE
                preparation.
              </p>
            </>
          ),
        },
        {
          id: "common-presentations",
          heading: "Common paediatric presentations for the CNPLE",
          body: (
            <>
              <p>
                Acute febrile illness in children requires the NP to distinguish benign viral
                illness from serious bacterial infection — applying age-specific risk stratification,
                recognising signs of sepsis or meningism, and selecting safe antipyretic management
                appropriate to the child's age and weight. Respiratory presentations including
                bronchiolitis (RSV season, supportive care principles), croup (stridor, severity
                assessment, dexamethasone use), and community-acquired pneumonia (clinical
                diagnosis, antibiotic selection by age and suspected organism) are consistently
                high-yield paediatric domains.
              </p>
              <p>
                Otitis media management tests antibiotic selection (amoxicillin first-line,
                dosing by indication, watchful waiting criteria in children over two years),
                while gastroenteritis questions test oral rehydration therapy protocols and red
                flags for dehydration severity requiring escalation. Each of these presentations
                has Canadian-specific management guidance that CNPLE-aligned preparation should
                address directly.
              </p>
            </>
          ),
        },
        {
          id: "paediatric-prescribing",
          heading: "Paediatric prescribing and safety considerations",
          body: (
            <>
              <p>
                Paediatric prescribing safety is a high-priority CNPLE domain. Weight-based
                dosing for common paediatric antibiotics (amoxicillin 40–90 mg/kg/day depending on
                indication, azithromycin, trimethoprim-sulfamethoxazole), appropriate formulation
                selection, and age-related contraindications (codeine in children under 12 due to
                ultra-rapid metaboliser risk, ASA avoidance for Reye syndrome) are all testable
                within NP prescriptive scope.
              </p>
              <p>
                Adolescent prescribing adds confidentiality and consent dimensions specific to
                Canadian provincial law — understanding when an adolescent can consent to their own
                treatment without parental involvement is both a legal and ethical NP competency
                that may be tested in CNPLE professional practice scenarios.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
