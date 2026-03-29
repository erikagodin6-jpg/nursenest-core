import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { microbiologyTopics } from "@/data/seo-microbiology";
import {
  ArrowRight,
  ChevronRight,
  Bug,
  BookOpen,
  Shield,
  Printer,
} from "lucide-react";

const QUICK_REFERENCE_SECTIONS = [
  {
    title: "Gram Stain Quick Reference",
    items: [
      { label: "Gram-Positive", value: "Purple | Thick peptidoglycan | No outer membrane | Staph, Strep, Enterococcus" },
      { label: "Gram-Negative", value: "Pink/Red | Thin peptidoglycan | Outer membrane + LPS | E. coli, Klebsiella, Pseudomonas" },
      { label: "Critical Step", value: "Decolorization (acetone-alcohol) — over-decolorization = GP appears GN" },
      { label: "Stain Order", value: "Crystal Violet → Iodine → Decolorizer → Safranin" },
    ],
  },
  {
    title: "Key Biochemical Tests",
    items: [
      { label: "Catalase", value: "Staphylococcus (+) vs Streptococcus (−) — 3% H₂O₂, bubbles = positive" },
      { label: "Coagulase", value: "S. aureus (+) vs CoNS (−) — rabbit plasma, clot = positive" },
      { label: "Oxidase", value: "Pseudomonas (+) vs Enterobacteriaceae (−) — separates non-fermenters from fermenters" },
      { label: "Optochin", value: "S. pneumoniae (sensitive) vs Viridans strep (resistant)" },
      { label: "Bile Solubility", value: "S. pneumoniae (soluble) vs Viridans strep (insoluble)" },
      { label: "Indole", value: "E. coli (+) vs Klebsiella (−) — tryptophan metabolism, red color = positive" },
      { label: "CAMP Test", value: "Group B Strep (S. agalactiae) positive — arrowhead hemolysis with S. aureus" },
      { label: "PYR", value: "Group A Strep (+) and Enterococcus (+) — differentiates from other beta-hemolytic strep" },
    ],
  },
  {
    title: "Culture Media Cheat Sheet",
    items: [
      { label: "Blood Agar (BAP)", value: "Universal primary medium — shows alpha/beta/gamma hemolysis" },
      { label: "Chocolate Agar", value: "Heated blood agar — Haemophilus (factors X + V), Neisseria" },
      { label: "MacConkey", value: "Selective/differential GNR — pink = lactose fermenter, colorless = non-fermenter" },
      { label: "EMB", value: "Selective/differential GNR — E. coli = green metallic sheen" },
      { label: "MSA", value: "Selective for Staph (7.5% NaCl) — S. aureus = yellow (mannitol+)" },
      { label: "Thayer-Martin", value: "Selective for Neisseria — VCN antibiotics suppress normal flora" },
      { label: "Mueller-Hinton", value: "Standard for disk diffusion AST — controlled cation concentration" },
      { label: "Sabouraud (SDA)", value: "Selective for fungi — low pH (5.6) inhibits bacteria" },
    ],
  },
  {
    title: "Classic Organism Identification Patterns",
    items: [
      { label: "GPC clusters, catalase+, coagulase+", value: "Staphylococcus aureus" },
      { label: "GPC chains, catalase−, beta-hemolytic, bacitracin-sensitive", value: "Group A Strep (S. pyogenes)" },
      { label: "GPC diplococci, alpha-hemolytic, optochin-sensitive", value: "S. pneumoniae" },
      { label: "GNR, lactose+, green metallic sheen on EMB", value: "E. coli" },
      { label: "GNR, lactose+, mucoid colonies, IMViC − − + +", value: "Klebsiella pneumoniae" },
      { label: "GNR, oxidase+, blue-green pigment, grape-like odor", value: "Pseudomonas aeruginosa" },
      { label: "GNR, lactose−, H₂S+, motile", value: "Salmonella species" },
      { label: "GN diplococci, oxidase+, from CSF", value: "Neisseria meningitidis" },
    ],
  },
  {
    title: "Resistance Detection Quick Reference",
    items: [
      { label: "MRSA", value: "Cefoxitin zone ≤21 mm OR PBP2a positive → ALL beta-lactams resistant" },
      { label: "ESBL", value: "Cephalosporin zone increased ≥5 mm with clavulanate → ALL cephalosporins resistant" },
      { label: "VRE", value: "Vancomycin MIC ≥32 µg/mL → vanA/vanB genes" },
      { label: "D-zone test", value: "Clindamycin zone flattened toward erythromycin → inducible resistance → report R" },
      { label: "CRE", value: "Carbapenem-resistant Enterobacteriaceae — modified CIM test or molecular" },
    ],
  },
  {
    title: "Special Microbiology",
    items: [
      { label: "Fungal: Germ tube+", value: "Candida albicans (serum, 37°C, 2-3 hours)" },
      { label: "Fungal: India ink+ CSF", value: "Cryptococcus neoformans (encapsulated yeast)" },
      { label: "Fungal: Septate 45° branching", value: "Aspergillus; Non-septate 90° branching = Mucor/Rhizopus" },
      { label: "Dimorphic fungi", value: "Mold in cold (25°C), yeast in heat (37°C) — Histo, Blasto, Cocci, Sporo" },
      { label: "Parasite: Thick/thin smear", value: "Malaria (Plasmodium) — Giemsa stain is gold standard" },
      { label: "Parasite: Acid-fast oocysts", value: "Cryptosporidium — pink on modified Kinyoun stain" },
      { label: "Parasite: Scotch tape test", value: "Enterobius (pinworm) — NOT standard O&P" },
    ],
  },
];

const QUICK_GUIDE_FAQS = [
  { q: "What is the best way to use this microbiology quick guide?", a: "Print or bookmark this page for quick reference during study sessions. Use it alongside the full topic pages for deeper explanations and practice questions. The guide covers Gram stain, biochemical tests, culture media, organism identification, resistance detection, and special microbiology." },
  { q: "Does this guide cover everything on the MLT microbiology exam?", a: "This guide covers the highest-yield microbiology concepts tested on CSMLS and ASCP certification exams. For comprehensive coverage including practice questions, comparison tables, and detailed rationales, visit the individual topic pages linked at the bottom." },
  { q: "How do I memorize all the culture media and biochemical tests?", a: "Focus on the clinical logic: selective media inhibit (MacConkey = bile salts inhibit GP), differential media distinguish (hemolysis on BAP), enrichment media enhance (chocolate agar for fastidious organisms). Use the organism identification patterns section to connect media reactions to specific organisms." },
];

export function MltMicrobiologyQuickGuide() {
  const handlePrint = () => {
    window.print();
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUICK_GUIDE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Microbiology Quick Guide for MLT Exam — Printable Reference",
    description: "Printable microbiology quick reference for MLT exam prep. Gram stain, biochemical tests, culture media, organism identification, resistance detection, and special microbiology at a glance.",
    author: { "@type": "Organization", name: "NurseNest Allied" },
    publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.nursenest.ca/allied-health/mlt/microbiology/quick-guide",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: "MLT", item: "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", position: 3, name: "Microbiology", item: "https://www.nursenest.ca/allied-health/mlt/microbiology" },
      { "@type": "ListItem", position: 4, name: "Quick Guide", item: "https://www.nursenest.ca/allied-health/mlt/microbiology/quick-guide" },
    ],
  };

  return (
    <>
      <AlliedSEO
        title="Microbiology Quick Guide for MLT Exam | Printable Reference Sheet"
        description="Free printable microbiology quick reference for MLT certification exams. Gram stain procedure, key biochemical tests, culture media selection, classic organism identification patterns, resistance detection, and special microbiology at a glance."
        keywords="microbiology quick guide MLT, microbiology reference sheet, gram stain cheat sheet, bacterial identification chart, culture media reference, MLT exam microbiology review"
        canonicalPath="/allied-health/mlt/microbiology/quick-guide"
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mlt-micro-quick-guide">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6 print:hidden" data-testid="breadcrumbs">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/allied-health" className="hover:text-purple-600">Allied Health</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt/microbiology" className="hover:text-purple-600">Microbiology</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">Quick Guide</li>
          </ol>
        </nav>

        <section className="text-center py-8 print:py-4" data-testid="quick-guide-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-3">
            <Shield className="w-4 h-4" />
            <span>MLT Exam Prep — Free Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight" data-testid="h1-title">
            Microbiology Quick Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Your at-a-glance reference for clinical microbiology on the MLT certification exam. Print it, bookmark it, share it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
              data-testid="button-print"
            >
              <Printer className="w-4 h-4" /> Print This Guide
            </button>
            <Link
              href="/allied-health/mlt/microbiology"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              data-testid="cta-full-topics"
            >
              Full Microbiology Topics
            </Link>
          </div>
        </section>

        <div className="space-y-8 mb-12">
          {QUICK_REFERENCE_SECTIONS.map((section, si) => (
            <section key={si} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`quick-section-${si}`}>
              <div className="bg-purple-50 px-6 py-3 border-b border-purple-100">
                <h2 className="text-lg font-bold text-purple-900">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, ii) => (
                  <div key={ii} className="px-6 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4" data-testid={`quick-item-${si}-${ii}`}>
                    <span className="font-semibold text-gray-800 text-sm sm:w-1/3 flex-shrink-0">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mb-12 print:hidden" data-testid="quick-guide-cta">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to Test Your Knowledge?</h2>
            <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
              Each microbiology topic page includes 3-5 embedded practice questions with detailed rationales. Dive deeper into any topic to practice applying these concepts.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/allied-health/mlt/microbiology"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                data-testid="cta-explore-topics"
              >
                Explore Microbiology Topics <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/allied-health/mlt/questions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                data-testid="cta-qbank"
              >
                MLT Question Bank
              </Link>
              <Link
                href="/allied-health/mlt/lab-values"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                data-testid="cta-lab-values"
              >
                Lab Values Reference
              </Link>
              <Link
                href="/allied-health/mlt/blood-bank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                data-testid="cta-blood-bank"
              >
                Blood Bank Guide
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12 print:hidden" data-testid="quick-guide-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {QUICK_GUIDE_FAQS.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-lg overflow-hidden group" data-testid={`faq-item-${i}`}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-gray-800 text-sm hover:bg-gray-50 transition-colors" data-testid={`faq-toggle-${i}`}>
                  {faq.q}
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`faq-answer-${i}`}>{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-8 print:hidden" data-testid="topic-links-grid">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Dive Deeper — Individual Topic Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {microbiologyTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/allied-health/mlt/microbiology/${topic.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all"
                data-testid={`link-topic-${topic.slug}`}
              >
                <Bug className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{topic.name}</div>
                  <div className="text-xs text-gray-500">{topic.practiceQuestions.length} practice questions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
