import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import {
  Droplets,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Thermometer,
  Clock,
  Lock,
  Share2,
  BookOpen,
  FileText,
} from "lucide-react";

const ABO_TABLE = [
  { type: "A", antigens: "A", antibodies: "Anti-B", forward_A: "+", forward_B: "0", reverse_A1: "0", reverse_B: "+" },
  { type: "B", antigens: "B", antibodies: "Anti-A", forward_A: "0", forward_B: "+", reverse_A1: "+", reverse_B: "0" },
  { type: "AB", antigens: "A & B", antibodies: "None", forward_A: "+", forward_B: "+", reverse_A1: "0", reverse_B: "0" },
  { type: "O", antigens: "None (H)", antibodies: "Anti-A & Anti-B", forward_A: "0", forward_B: "0", reverse_A1: "+", reverse_B: "+" },
];

const RBC_COMPAT = [
  { patient: "O", canReceive: "O" },
  { patient: "A", canReceive: "A, O" },
  { patient: "B", canReceive: "B, O" },
  { patient: "AB", canReceive: "A, B, AB, O (universal recipient)" },
];

const PLASMA_COMPAT = [
  { patient: "O", canReceive: "O, A, B, AB (universal recipient)" },
  { patient: "A", canReceive: "A, AB" },
  { patient: "B", canReceive: "B, AB" },
  { patient: "AB", canReceive: "AB only" },
];

const STORAGE_QUICK = [
  { component: "Packed RBCs", temp: "1-6°C", shelf: "35-42 days", note: "One unit ↑ Hgb ~1 g/dL" },
  { component: "FFP", temp: "≤ -18°C", shelf: "1 year frozen; 24h after thaw", note: "All clotting factors; ABO-compatible" },
  { component: "Platelets", temp: "20-24°C + agitation", shelf: "5 days", note: "Highest bacterial contamination risk" },
  { component: "Cryoprecipitate", temp: "≤ -18°C", shelf: "1 year frozen; 4-6h after thaw", note: "Fibrinogen, Factor VIII, vWF, Factor XIII" },
  { component: "Granulocytes", temp: "20-24°C (no agitation)", shelf: "24 hours", note: "Must be irradiated; crossmatched" },
];

const REACTION_QUICK = [
  { type: "Acute Hemolytic (AHTR)", key: "ABO error → intravascular hemolysis", action: "STOP. DAT, repeat ABO, check plasma for hemolysis" },
  { type: "Febrile (FNHTR)", key: "WBC antibodies/cytokines → fever ≥1°C", action: "Rule out hemolytic first. Prevent with leukoreduction" },
  { type: "Allergic (Urticaria)", key: "Plasma protein antibodies → hives", action: "Antihistamines. May resume if mild" },
  { type: "Anaphylaxis", key: "IgA deficiency + anti-IgA", action: "Epinephrine. Future: washed products" },
  { type: "TRALI", key: "Donor anti-HLA → lung injury", action: "NOT diuretic-responsive. Low/normal BP & BNP" },
  { type: "TACO", key: "Volume overload", action: "Diuretic-responsive. HIGH BP & BNP" },
  { type: "Delayed Hemolytic (DHTR)", key: "Anamnestic response 3-28 days", action: "New antibody + positive DAT. Kidd is classic" },
  { type: "TA-GVHD", key: "Donor T-cells engraft → ~100% fatal", action: "Prevent with IRRADIATION (not leukoreduction)" },
];

const ENZYME_EFFECTS = [
  { system: "Rh (D, C, c, E, e)", effect: "Enhanced" },
  { system: "Kidd (Jka, Jkb)", effect: "Enhanced" },
  { system: "Lewis (Lea, Leb)", effect: "Enhanced" },
  { system: "P1, I", effect: "Enhanced" },
  { system: "MNSs (M, N, S, s)", effect: "Destroyed" },
  { system: "Duffy (Fya, Fyb)", effect: "Destroyed" },
];

const HIGH_YIELD_FACTS = [
  "Universal RBC donor = O-negative | Universal plasma donor = AB",
  "ABO antibodies = IgM → complement activation → intravascular hemolysis",
  "Rh antibodies = IgG → immune-stimulated → cross placenta → HDFN",
  "Weak D donors = label Rh-POSITIVE | Partial D patients = treat as Rh-NEGATIVE",
  "RhIG dose: 1 vial (300 µg) covers 30 mL fetal whole blood (15 mL packed RBCs)",
  "Kleihauer-Betke quantifies fetal-maternal hemorrhage (fetal HbF resists acid elution)",
  "Coombs control MUST be positive to validate negative AHG — if negative, test is INVALID",
  "Electronic crossmatch requires: 2 prior ABO typings + negative screen + validated computer",
  "Kidd (Jk) antibodies = delayed hemolytic reactions (titers drop quickly, hard to detect)",
  "Anti-K (Kell) suppresses erythropoiesis → fetal anemia with LOW reticulocytes",
  "Enzymes DESTROY: MNSs and Duffy | Enzymes ENHANCE: Rh, Kidd, Lewis, P, I",
  "Platelets stored at ROOM TEMP → highest bacterial contamination risk",
  "Irradiated RBCs expire: 28 days from irradiation OR original expiration (whichever is sooner)",
  "Washed RBCs expire in 24 HOURS (open system)",
  "Leukoreduction prevents FNHTR & CMV transmission | Irradiation prevents TA-GVHD",
  "TRALI = low/normal BP + normal BNP + NO diuretic response",
  "TACO = HIGH BP + elevated BNP + responds to diuretics",
  "ABO HDFN can occur in FIRST pregnancy (type O mom, A/B baby) — DAT often weakly positive or negative",
  "Most fatal transfusion reactions = ABO clerical error (wrong blood → wrong patient)",
  "1:1:1 ratio (RBC:FFP:Platelets) in massive transfusion prevents dilutional coagulopathy",
];

export default function MltBloodBankCheatSheet() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Blood Bank Cheat Sheet for MLT Certification",
    description: "Quick-reference blood bank cheat sheet covering ABO/Rh typing, compatibility charts, transfusion reactions, storage temperatures, and high-yield exam facts for MLT certification.",
    url: "https://www.nursenest.ca/allied-health/mlt/blood-bank/cheat-sheet",
    author: { "@type": "Organization", name: "NurseNest Allied" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.mlt_blood_bank_cheat_sheet.bloodBankCheatSheetMlt")}
        description={t("allied.mlt_blood_bank_cheat_sheet.freeBloodBankCheatSheet")}
        keywords="blood bank cheat sheet MLT, blood banking quick reference, ABO compatibility chart, transfusion reaction comparison, blood component storage temperatures"
        canonicalPath="/allied-health/mlt/blood-bank/cheat-sheet"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-100 px-4 py-3" aria-label="Breadcrumb" data-testid="breadcrumb-nav">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link href="/allied-health" className="hover:text-red-600 transition-colors">Allied Health</Link>
            <span>/</span>
            <Link href="/allied-health/mlt" className="hover:text-red-600 transition-colors">MLT</Link>
            <span>/</span>
            <Link href="/allied-health/mlt/blood-bank" className="hover:text-red-600 transition-colors">Blood Bank</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Cheat Sheet</span>
          </div>
        </nav>

        <header className="bg-gradient-to-br from-red-800 to-red-950 text-white py-14 px-4" data-testid="cheat-sheet-hero">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-red-200 mb-4">
              <FileText className="w-4 h-4" />
              <span>{t("allied.mlt_blood_bank_cheat_sheet.freeShareableResource")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-cheat-sheet-title">
              Blood Bank Cheat Sheet
            </h1>
            <p className="text-red-200 text-lg max-w-2xl mx-auto mb-6">
              Everything you need to know for blood banking on the MLT exam — on one page. Bookmark it. Share it. Pass your exam.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/allied-health/mlt/blood-bank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors" data-testid="link-full-review">
                <BookOpen className="w-4 h-4" /> Full Blood Bank Review
              </Link>
              <Link href="/allied-health/mlt/questions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-red-800 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors" data-testid="link-practice-questions">
                Practice Questions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-abo-table">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">ABO Forward & Reverse Typing</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50">
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-red-900">RBC Antigens</th>
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Serum Antibodies</th>
                    <th className="px-3 py-2 text-center font-semibold text-red-900">Anti-A</th>
                    <th className="px-3 py-2 text-center font-semibold text-red-900">Anti-B</th>
                    <th className="px-3 py-2 text-center font-semibold text-red-900">A1 Cells</th>
                    <th className="px-3 py-2 text-center font-semibold text-red-900">B Cells</th>
                  </tr>
                </thead>
                <tbody>
                  {ABO_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-3 py-2 font-bold text-gray-900">{row.type}</td>
                      <td className="px-3 py-2 text-gray-600">{row.antigens}</td>
                      <td className="px-3 py-2 text-gray-600">{row.antibodies}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold">{row.forward_A === "+" ? <span className="text-emerald-600">+</span> : <span className="text-gray-400">0</span>}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold">{row.forward_B === "+" ? <span className="text-emerald-600">+</span> : <span className="text-gray-400">0</span>}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold">{row.reverse_A1 === "+" ? <span className="text-blue-600">+</span> : <span className="text-gray-400">0</span>}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold">{row.reverse_B === "+" ? <span className="text-blue-600">+</span> : <span className="text-gray-400">0</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">Green (+) = agglutination. Forward typing columns use Anti-A/Anti-B reagents. Reverse typing columns use A1/B reagent cells.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="section-rbc-compat">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" /> RBC Compatibility
              </h3>
              <div className="space-y-2">
                {RBC_COMPAT.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-8 font-bold text-red-700">{row.patient}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{row.canReceive}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Match by antigens: avoid giving antigens the patient lacks.</p>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 p-6" data-testid="section-plasma-compat">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" /> Plasma Compatibility
              </h3>
              <div className="space-y-2">
                {PLASMA_COMPAT.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-8 font-bold text-blue-700">{row.patient}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{row.canReceive}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Match by antibodies (REVERSE of RBC rules).</p>
            </section>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-storage">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Storage Temperatures & Shelf Life</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-red-50">
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Component</th>
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Temperature</th>
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Shelf Life</th>
                    <th className="px-3 py-2 text-left font-semibold text-red-900">Key Fact</th>
                  </tr>
                </thead>
                <tbody>
                  {STORAGE_QUICK.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-3 py-2 font-semibold text-gray-900">{row.component}</td>
                      <td className="px-3 py-2 text-gray-600 font-mono text-xs">{row.temp}</td>
                      <td className="px-3 py-2 text-gray-600">{row.shelf}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-reactions">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Transfusion Reactions Quick Reference</h2>
            </div>
            <div className="space-y-3">
              {REACTION_QUICK.map((row, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <p className="font-bold text-gray-900 text-sm">{row.type}</p>
                  <p className="text-gray-600 text-xs mt-1"><span className="font-semibold text-gray-700">Key:</span> {row.key}</p>
                  <p className="text-gray-600 text-xs mt-0.5"><span className="font-semibold text-gray-700">Action:</span> {row.action}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8" data-testid="section-enzyme">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Enzyme Effects on Blood Group Antigens</h2>
            <p className="text-xs text-gray-500 mb-3">Mnemonic: <strong>"Enzymes Destroy MNSs and Duffy"</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ENZYME_EFFECTS.map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${row.effect === "Enhanced" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="text-gray-700">{row.system}</span>
                  <span className={`ml-auto text-xs font-semibold ${row.effect === "Enhanced" ? "text-emerald-600" : "text-red-600"}`}>{row.effect}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200/50 p-6 md:p-8" data-testid="section-high-yield">
            <h2 className="text-xl font-bold text-gray-900 mb-4">20 High-Yield Blood Bank Facts</h2>
            <ol className="space-y-2">
              {HIGH_YIELD_FACTS.map((fact, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                  <span className="w-6 h-6 rounded-full bg-red-200/60 text-red-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{fact}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 text-center text-white" data-testid="section-cta">
            <Lock className="w-10 h-10 text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Struggling with Blood Bank Questions?</h2>
            <p className="text-red-200 mb-6 max-w-xl mx-auto">
              Unlock 300+ Blood Bank Practice Questions with full rationales. Know why every answer is right — and why every distractor is wrong.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/allied-health/mlt/questions" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-800 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-lg" data-testid="button-cta-unlock">
                Unlock 300+ Blood Bank Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/mlt/blood-bank" className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors" data-testid="button-cta-full-review">
                Full Blood Bank Review
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
