import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { microbiologyTopics } from "@/data/seo-microbiology";
import {
  Microscope,
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Search,
  FileText,
  Bug,
  FlaskConical,
  HelpCircle,
  Shield,
  Pill,
  Stethoscope,
} from "lucide-react";

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-accordion">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const HUB_FAQS = [
  { q: "What microbiology topics are tested on the MLT certification exam?", a: "The MLT exam covers bacteriology (gram-positive cocci, gram-negative rods, anaerobes, mycobacteria), mycology (yeasts, molds, dimorphic fungi), parasitology (protozoa, helminths), virology (molecular detection, serology), staining techniques (Gram, AFB, India ink, calcofluor white), culture media selection, and antimicrobial susceptibility testing. Microbiology typically represents 15-20% of the CSMLS and ASCP exam content." },
  { q: "How should I study microbiology for the CSMLS exam?", a: "Focus on the bacterial identification algorithm: Gram stain → catalase/oxidase → selective/differential media → biochemical tests → AST. Learn the key differentiating tests for each organism group. Practice with Gram stain images and colony morphology photos. Use comparison tables (gram-positive vs gram-negative, Staph vs Strep) for efficient memorization. Our practice questions test application, not just memorization." },
  { q: "What are the most commonly tested microbiology concepts?", a: "The most high-yield topics include: Gram stain procedure and interpretation, catalase and coagulase tests for gram-positive cocci, MacConkey/EMB agar reactions, IMViC pattern for E. coli vs Klebsiella, MRSA detection methods, antibiotic susceptibility testing (disk diffusion, MIC), culture media selection, and specimen processing requirements." },
  { q: "How is microbiology different from other MLT exam sections?", a: "Microbiology is unique because it requires both knowledge (organism characteristics, staining, culture) and clinical reasoning (choosing the right media, interpreting mixed cultures, correlating Gram stain with culture). It also requires visual identification skills — many exam questions include images of Gram stains, colony morphology, or microscopic preparations." },
  { q: "What's the difference between selective, differential, and enrichment media?", a: "Selective media contain inhibitors that prevent growth of certain organisms (e.g., MacConkey uses bile salts to inhibit gram-positives). Differential media contain indicators that distinguish organisms based on reactions (e.g., hemolysis on blood agar). Enrichment media provide enhanced nutrients for fastidious organisms (e.g., chocolate agar for Haemophilus). Many media serve dual roles — MacConkey is both selective AND differential." },
];

const TOPIC_ICONS: Record<string, typeof Bug> = {
  "gram-positive-vs-gram-negative": Microscope,
  "staphylococcus-vs-streptococcus": Bug,
  "e-coli-identification": FlaskConical,
  "culture-media-explained": FlaskConical,
  "antibiotic-sensitivity-testing": Pill,
  "viral-vs-bacterial-infections": Stethoscope,
  "fungal-infections-overview": Bug,
  "parasites-in-lab-diagnosis": Bug,
};

export function MltMicrobiologyHub() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = microbiologyTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Microbiology for MLT Certification — Complete Study Guide",
    description: "Comprehensive microbiology study hub for MLT certification. Organism identification, staining techniques, culture media, antibiotic sensitivity testing, and practice questions.",
    url: "https://www.nursenest.ca/allied-health/mlt/microbiology",
    publisher: { "@type": "Organization", name: "NurseNest Allied" },
    hasPart: microbiologyTopics.map((t) => ({
      "@type": "Article",
      name: t.h1Title,
      url: `https://www.nursenest.ca/allied-health/mlt/microbiology/${t.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: "MLT", item: "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", position: 3, name: "Microbiology", item: "https://www.nursenest.ca/allied-health/mlt/microbiology" },
    ],
  };

  return (
    <>
      <AlliedSEO
        title="Microbiology for MLT Certification | Organism ID, Staining & Culture Guide"
        description="Complete microbiology study hub for MLT certification exams. Gram stain interpretation, bacterial identification flowcharts, culture media selection, antibiotic susceptibility testing, and embedded practice questions with detailed rationales for CSMLS and ASCP exam prep."
        keywords="microbiology MLT certification study, Gram stain interpretation guide, bacterial identification flowchart, culture media selective differential, antibiotic susceptibility testing, MRSA detection methods"
        canonicalPath="/allied-health/mlt/microbiology"
        structuredData={collectionPageSchema}
        additionalStructuredData={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mlt-microbiology-hub">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/allied-health" className="hover:text-purple-600">Allied Health</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">Microbiology</li>
          </ol>
        </nav>

        <section className="text-center py-12" data-testid="hub-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-4">
            <Microscope className="w-4 h-4" />
            <span>MLT Exam Prep — CSMLS & ASCP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="hub-h1">
            Microbiology for MLT Certification
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Master clinical microbiology for the CSMLS and ASCP certification exams. Each topic covers organism characteristics, lab identification steps, staining methods, culture findings, disease associations, antibiotic considerations, comparison tables, exam tips, and embedded practice questions with detailed rationales.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/allied-health/mlt/microbiology/quick-guide"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
              data-testid="cta-quick-guide"
            >
              Microbiology Quick Guide <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/allied-health/mlt/questions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              data-testid="cta-question-bank"
            >
              MLT Question Bank
            </Link>
          </div>
        </section>

        <section className="mb-8" data-testid="hub-search">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search microbiology topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
              data-testid="input-search"
            />
          </div>
        </section>

        <section className="mb-8" data-testid="hub-feature-badges">
          <div className="flex flex-wrap justify-center gap-3">
            {["Organism Identification", "Staining Techniques", "Culture Media", "AST / MIC", "Comparison Tables", "Practice Questions"].map((feat) => (
              <div key={feat} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {feat}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12" data-testid="hub-topic-grid">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Microbiology Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((topic) => {
              const Icon = TOPIC_ICONS[topic.slug] || Bug;
              return (
                <Link
                  key={topic.slug}
                  href={`/allied-health/mlt/microbiology/${topic.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-purple-200 hover:shadow-md transition-all"
                  data-testid={`card-topic-${topic.slug}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors text-sm">{topic.name}</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{topic.metaDescription}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                    <span>{topic.practiceQuestions.length} practice questions</span>
                    <span className="text-gray-300">|</span>
                    <span>{topic.comparisonTable.rows.length}-row comparison table</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100" data-testid="hub-study-path">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Recommended Study Path</h2>
          <p className="text-sm text-gray-600 text-center mb-6 max-w-2xl mx-auto">
            Follow the clinical logic flow for microbiology: start with organism classification, then learn identification techniques, and finish with treatment considerations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "1", label: "Classification", desc: "Gram positive vs negative", href: "/allied-health/mlt/microbiology/gram-positive-vs-gram-negative" },
              { step: "2", label: "Identification", desc: "Staph vs Strep, E. coli", href: "/allied-health/mlt/microbiology/staphylococcus-vs-streptococcus" },
              { step: "3", label: "Lab Methods", desc: "Culture media & AST", href: "/allied-health/mlt/microbiology/culture-media-explained" },
              { step: "4", label: "Special Organisms", desc: "Fungi, viruses, parasites", href: "/allied-health/mlt/microbiology/fungal-infections-overview" },
            ].map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all border border-purple-100"
                data-testid={`study-path-${item.step}`}
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold mx-auto mb-2">{item.step}</div>
                <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12" data-testid="hub-cross-links">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Related MLT Study Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/allied-health/mlt/lab-values"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-lab-values"
            >
              <FlaskConical className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">MLT Lab Values</div>
                <div className="text-xs text-gray-500">Normal ranges in SI & conventional units</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/blood-bank"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-blood-bank"
            >
              <Shield className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">Blood Bank & Transfusion</div>
                <div className="text-xs text-gray-500">ABO/Rh typing, crossmatch & antibody ID</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/questions"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-questions"
            >
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">MLT Question Bank</div>
                <div className="text-xs text-gray-500">1,000+ practice questions with rationales</div>
              </div>
            </Link>
            <Link
              href="/allied-health/mlt/exam-prep"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
              data-testid="link-exam-prep"
            >
              <FileText className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 text-sm">MLT Exam Prep</div>
                <div className="text-xs text-gray-500">CSMLS & ASCP certification preparation</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="mb-8" data-testid="hub-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={HUB_FAQS} />
        </section>
      </div>
    </>
  );
}
