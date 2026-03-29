import { useI18n } from "@/lib/i18n";
import {
  MicroLesson,
  CognitiveCard,
  HoverReveal,
  MatchingExercise,
  SelfCheckQuiz,
  ProgressiveReveal,
} from "@/components/interactive-learning";
import { EditableModuleText, useEditableText } from "@/components/module-edit-context";
import { Bug, Shield, Microscope, AlertTriangle } from "lucide-react";

export function MicrobiologyModule() {
  const { t } = useI18n();
  const colonizationWarning = useEditableText("micro-colonization-warning", "Colonization means microorganisms are present and multiplying but not causing tissue damage or immune response. Infection means microorganisms are invading tissue, multiplying, and causing damage with an immune response (signs: redness, swelling, heat, pain, loss of function). A patient can be colonized with MRSA on their skin without being infected — but if that MRSA enters a wound, infection develops.");
  const antisepticConcept = useEditableText("micro-antiseptic-concept", "Antiseptics are for living tissue. Disinfectants are for inanimate objects. Using a disinfectant on skin causes chemical burns. Using an antiseptic on a surgical instrument does not achieve sterilization. Matching the right agent to the right surface is a safety fundamental.");

  return (
    <div className="space-y-10" data-testid="module-microbiology">
      <div>
        <EditableModuleText sectionKey="micro-title" defaultText="Microbiology Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="micro-desc" defaultText="Understand the microorganisms relevant to healthcare — their structures, reproduction, transmission, and the principles of controlling microbial spread." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Types of Microorganisms" subtitle="Bacteria, viruses, fungi, parasites, and prions" icon={<Bug className="w-5 h-5" />}>
        <EditableModuleText sectionKey="micro-types-content" defaultText="Microorganisms are classified by their cellular structure and reproduction. Bacteria are prokaryotic (no nucleus). Viruses are acellular (not truly alive — require a host cell to replicate). Fungi are eukaryotic (have a nucleus). These structural differences determine how each type is targeted by antimicrobial agents. Understanding these distinctions is essential because treatment strategies differ fundamentally between organism types." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_microbiology.theFiveCategoriesOfMicroorganisms")}
          cards={[
            {
              id: "mb1",
              title: "Bacteria",
              summary: "Prokaryotic, single-celled, diverse metabolisms",
              detail: "Bacteria are prokaryotes — they lack a membrane-bound nucleus and organelles. They have a cell wall (peptidoglycan in most), a plasma membrane, ribosomes, and circular DNA. They reproduce by binary fission (simple division). Classified as Gram-positive (thick peptidoglycan wall, stains purple) or Gram-negative (thin peptidoglycan with outer membrane, stains pink). This distinction affects antibiotic susceptibility.",
            },
            {
              id: "mb2",
              title: "Viruses",
              summary: "Acellular, obligate intracellular parasites",
              detail: "Viruses are not cells — they consist of genetic material (DNA or RNA) surrounded by a protein coat (capsid), sometimes with a lipid envelope. They cannot reproduce independently; they hijack host cell machinery. Enveloped viruses (like influenza) are easier to kill with disinfectants because the lipid envelope is fragile. Non-enveloped viruses (like norovirus) are more resistant.",
            },
            {
              id: "mb3",
              title: "Fungi",
              summary: "Eukaryotic, can be unicellular or multicellular",
              detail: "Fungi include yeasts (unicellular, reproduce by budding — e.g., Candida) and molds (multicellular, grow as hyphae). Fungi have cell walls made of chitin (not peptidoglycan), which is why antibacterial drugs don't work against them. Fungal infections (mycoses) are treated with antifungals that target ergosterol in fungal cell membranes.",
            },
            {
              id: "mb4",
              title: "Parasites",
              summary: "Protozoa, helminths — live on or in a host",
              detail: "Protozoa are single-celled eukaryotes (e.g., Plasmodium causing malaria, Giardia). Helminths are multicellular worms (roundworms, tapeworms, flukes). Parasites have complex life cycles often involving intermediate hosts. Transmission is often fecal-oral, vector-borne, or through contaminated water/food.",
            },
            {
              id: "mb5",
              title: "Prions",
              summary: "Misfolded proteins — no nucleic acid",
              detail: "Prions are infectious misfolded proteins that cause other normal proteins to misfold. They contain no DNA or RNA. They are extremely resistant to standard sterilization methods (heat, chemicals, radiation). Examples include Creutzfeldt-Jakob disease. Prions cannot be treated with antibiotics, antivirals, or antifungals.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Normal Flora & Colonization" subtitle="The body's resident microbial communities" icon={<Microscope className="w-5 h-5" />}>
        <EditableModuleText sectionKey="micro-flora-content" defaultText="The human body hosts trillions of microorganisms collectively called the normal flora (microbiome). Resident microorganisms colonize body surfaces (skin, gut, respiratory tract, urogenital tract) without causing disease under normal conditions. They provide protective functions including competitive exclusion of pathogens, vitamin synthesis, and immune system development. These organisms are not contaminants — they are essential partners in health." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Protective Functions</p>
            <p className="text-xs text-green-600"><strong>Competitive exclusion:</strong> Normal flora occupy binding sites and consume nutrients, preventing pathogens from establishing. <strong>Immune training:</strong> Constant exposure to commensal organisms trains the immune system. <strong>Vitamin production:</strong> Gut bacteria synthesize vitamin K and some B vitamins.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">When Flora Becomes Harmful</p>
            <p className="text-xs text-amber-600"><strong>Opportunistic infection:</strong> Normal flora can cause infection if displaced to a sterile site (e.g., E. coli from gut to urinary tract → UTI). <strong>Antibiotic disruption:</strong> Broad-spectrum antibiotics kill normal flora, allowing resistant organisms like C. difficile to overgrow.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_microbiology.colonizationVsInfection")}
          content={colonizationWarning}
        />
      </MicroLesson>

      <MicroLesson title="Microbial Transmission" subtitle="How microorganisms spread between hosts" icon={<AlertTriangle className="w-5 h-5" />}>
        <EditableModuleText sectionKey="micro-transmission-content" defaultText="Understanding transmission routes is the foundation of infection prevention. Strategies to interrupt the chain of infection target the weakest links: hand hygiene (breaking the mode of transmission), PPE (protecting the portal of entry), and isolation precautions (containing the reservoir). Each route requires different prevention strategies." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Contact Transmission</p>
            <p className="text-xs text-blue-600"><strong>Direct contact:</strong> Person-to-person physical transfer (touching, bodily fluids). <strong>Indirect contact:</strong> Transfer via contaminated objects (fomites) — doorknobs, stethoscopes, bed rails. This is the most common transmission route in healthcare settings. Prevention: Hand hygiene is the single most effective measure.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Droplet Transmission</p>
            <p className="text-xs text-purple-600">Large respiratory droplets (&gt;5 μm) generated by coughing, sneezing, or talking. They travel short distances (typically &lt;1 meter) and fall quickly due to gravity. Examples: influenza, pertussis. Prevention: Surgical mask within close proximity.</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-1">Airborne Transmission</p>
            <p className="text-xs text-rose-600">Tiny droplet nuclei (&lt;5 μm) that remain suspended in air for extended periods and can travel long distances through air currents. Examples: tuberculosis, measles, varicella. Prevention: N95 respirator, negative-pressure room, airborne precautions.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Sterilization, Disinfection & Asepsis" subtitle="Levels of microbial control" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="micro-sterilization-content" defaultText="Microbial control exists on a spectrum from sterilization (the complete destruction or removal of ALL forms of microbial life, including bacterial endospores, achieved through autoclaving, ethylene oxide gas, or ionizing radiation) to basic cleaning. Understanding this hierarchy prevents both under-treatment (infection risk) and over-treatment (unnecessary cost/damage)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Sterilization (Highest Level)</p>
            <p className="text-xs text-red-600">Destroys ALL microorganisms including spores. Methods: autoclaving (121°C, 15 psi, 15+ min), chemical sterilants (glutaraldehyde), ethylene oxide gas. Used for: surgical instruments, implants, items entering sterile body cavities.</p>
          </div>
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">High-Level Disinfection</p>
            <p className="text-xs text-amber-600">Destroys all microorganisms EXCEPT high numbers of bacterial spores. Used for semi-critical items that contact mucous membranes or non-intact skin (endoscopes, respiratory therapy equipment).</p>
          </div>
          <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-100">
            <p className="text-xs font-semibold text-yellow-700 mb-1">Intermediate & Low-Level Disinfection</p>
            <p className="text-xs text-yellow-600">Intermediate: Kills vegetative bacteria, most viruses and fungi, mycobacteria. Low: Kills most bacteria and some viruses/fungi. Used for non-critical items (blood pressure cuffs, stethoscopes, environmental surfaces).</p>
          </div>
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Antisepsis</p>
            <p className="text-xs text-green-600">Application of antimicrobial agents to LIVING tissue (skin, mucous membranes). Antiseptics are safe for skin; disinfectants are NOT. Example: chlorhexidine for surgical hand scrub, povidone-iodine for skin prep. Never use a disinfectant as an antiseptic.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_microbiology.criticalDistinction")}
          content={antisepticConcept}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_microbiology.matchTheMicrobiologyConcept")}
        pairs={[
          { term: "Gram-positive bacteria", definition: "Thick peptidoglycan wall, stains purple" },
          { term: "Virus", definition: "Acellular, requires host to replicate" },
          { term: "Prion", definition: "Misfolded protein, no nucleic acid" },
          { term: "Normal flora", definition: "Resident microbes that usually don't cause disease" },
          { term: "Sterilization", definition: "Destroys ALL microbes including spores" },
          { term: "Antiseptic", definition: "Antimicrobial agent safe for living tissue" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_microbiology.microbiologyFoundationsQuiz")}
        questions={[
          {
            id: "mb1",
            question: "What structural feature distinguishes bacteria from human cells?",
            options: ["Bacteria have mitochondria", "Bacteria are prokaryotic (no membrane-bound nucleus)", "Bacteria have a lipid envelope", "Bacteria use RNA instead of DNA"],
            correctIndex: 1,
            rationale: "Bacteria are prokaryotes — they lack a membrane-bound nucleus and membrane-bound organelles. Human cells are eukaryotic with a defined nucleus.",
          },
          {
            id: "mb2",
            question: "Why are enveloped viruses generally easier to kill with disinfectants than non-enveloped viruses?",
            options: ["They are larger", "Their lipid envelope is easily disrupted by soap and alcohol", "They have weaker DNA", "They reproduce more slowly"],
            correctIndex: 1,
            rationale: "The lipid envelope is fragile and is easily disrupted by detergents, alcohol, and disinfectants, inactivating the virus. Non-enveloped viruses (e.g., norovirus) lack this vulnerable layer and are more environmentally resistant.",
          },
          {
            id: "mb3",
            question: "A patient is colonized with MRSA on their skin. This means:",
            options: ["They have an active MRSA infection", "MRSA is present but not causing tissue damage", "They need immediate antibiotic treatment", "They are immune to MRSA"],
            correctIndex: 1,
            rationale: "Colonization means the organism is present and multiplying but not invading tissue or causing an immune response. Colonized patients can still transmit MRSA to others.",
          },
          {
            id: "mb4",
            question: "Which transmission route requires an N95 respirator for protection?",
            options: ["Contact transmission", "Droplet transmission", "Airborne transmission", "Vehicle transmission"],
            correctIndex: 2,
            rationale: "Airborne transmission involves tiny droplet nuclei (<5 μm) that remain suspended in air. Standard surgical masks don't filter these — an N95 respirator is required (e.g., for TB, measles, varicella).",
          },
          {
            id: "mb5",
            question: "The single most effective measure to prevent healthcare-associated infections is:",
            options: ["Wearing gloves at all times", "Hand hygiene", "Administering prophylactic antibiotics", "Using UV sterilization"],
            correctIndex: 1,
            rationale: "Hand hygiene (handwashing or alcohol-based hand rub) is consistently identified as the single most effective measure to prevent transmission of microorganisms in healthcare.",
          },
          {
            id: "mb6",
            question: "Why do broad-spectrum antibiotics increase the risk of C. difficile infection?",
            options: ["They directly stimulate C. difficile growth", "They kill normal flora, eliminating competitive exclusion", "They cause immune suppression", "They increase intestinal pH"],
            correctIndex: 1,
            rationale: "Broad-spectrum antibiotics kill normal gut flora that normally outcompete C. difficile for nutrients and binding sites. Without this competition, C. difficile can overgrow and produce toxins.",
          },
          {
            id: "mb7",
            question: "What is the difference between disinfection and sterilization?",
            options: ["They are the same process", "Disinfection kills all organisms; sterilization kills most", "Disinfection reduces microbial load; sterilization eliminates ALL microbes including spores", "Disinfection is for skin; sterilization is for objects"],
            correctIndex: 2,
            rationale: "Sterilization destroys ALL forms of microbial life including bacterial endospores. Disinfection reduces microbial load but may not eliminate all spores.",
          },
          {
            id: "mb8",
            question: "Fungi require antifungal medications rather than antibiotics because:",
            options: ["Fungi are too large for antibiotics to penetrate", "Fungi have chitin cell walls, not peptidoglycan", "Fungi don't have cell membranes", "Antibiotics are only for viruses"],
            correctIndex: 1,
            rationale: "Antibacterial antibiotics target structures unique to bacteria (e.g., peptidoglycan synthesis). Fungi have chitin-based cell walls and ergosterol-containing membranes — antifungals target these fungal-specific structures.",
          },
          {
            id: "mb9",
            question: "Gram-negative bacteria are often more difficult to treat with antibiotics because:",
            options: ["They lack a cell wall entirely", "They have an additional outer membrane that acts as a permeability barrier", "They reproduce faster than Gram-positive bacteria", "They are always anaerobic"],
            correctIndex: 1,
            rationale: "Gram-negative bacteria have a thin peptidoglycan layer plus an outer membrane containing lipopolysaccharide (LPS). This outer membrane acts as a permeability barrier, preventing many antibiotics from reaching their targets.",
          },
          {
            id: "mb10",
            question: "Which type of microorganism contains NO nucleic acid (DNA or RNA)?",
            options: ["Virus", "Prion", "Bacterium", "Fungus"],
            correctIndex: 1,
            rationale: "Prions are infectious misfolded proteins that contain no nucleic acid. They cause disease by inducing normal proteins to misfold. This makes them resistant to treatments that target DNA or RNA.",
          },
          {
            id: "mb11",
            question: "E. coli is a normal resident of the human gut. If it enters the urinary tract, it can cause a UTI. This is an example of:",
            options: ["Viral mutation", "Opportunistic infection", "Prion disease", "Airborne transmission"],
            correctIndex: 1,
            rationale: "Opportunistic infection occurs when normal flora are displaced to a sterile body site. E. coli is harmless in the gut but becomes pathogenic when it enters the urinary tract, a normally sterile environment.",
          },
          {
            id: "mb12",
            question: "Autoclaving achieves sterilization by using:",
            options: ["Dry heat at 100°C for 30 minutes", "Pressurized steam at 121°C and 15 psi for 15+ minutes", "Chemical disinfectants under pressure", "Ultraviolet radiation in a sealed chamber"],
            correctIndex: 1,
            rationale: "Autoclaving uses pressurized steam at 121°C (250°F) at 15 psi for a minimum of 15 minutes. The combination of high temperature and pressure destroys all microorganisms, including bacterial endospores.",
          },
          {
            id: "mb13",
            question: "Droplet transmission differs from airborne transmission primarily in:",
            options: ["The type of organism transmitted", "Particle size — droplets are >5 μm and fall quickly, while airborne nuclei are <5 μm and remain suspended", "Whether gloves are needed", "The body system affected"],
            correctIndex: 1,
            rationale: "Droplets are large (>5 μm), travel short distances (<1 meter), and fall quickly. Airborne droplet nuclei are tiny (<5 μm), remain suspended in air for long periods, and can travel long distances through air currents.",
          },
          {
            id: "mb14",
            question: "Which of the following is an example of an organism transmitted by the airborne route?",
            options: ["Influenza", "Clostridium difficile", "Mycobacterium tuberculosis", "MRSA"],
            correctIndex: 2,
            rationale: "Tuberculosis (caused by Mycobacterium tuberculosis) is a classic airborne pathogen. It spreads via tiny droplet nuclei that remain suspended in air, requiring N95 respirators and negative-pressure rooms for isolation.",
          },
          {
            id: "mb15",
            question: "A nurse applies chlorhexidine to a patient's skin before inserting a central line. Chlorhexidine is classified as:",
            options: ["A disinfectant", "An antiseptic", "A sterilant", "An antibiotic"],
            correctIndex: 1,
            rationale: "Antiseptics are antimicrobial agents that are safe to apply to living tissue (skin, mucous membranes). Chlorhexidine is commonly used for surgical skin prep and central line site care. Disinfectants are only for inanimate objects.",
          },
          {
            id: "mb16",
            question: "Bacteria reproduce by a process called:",
            options: ["Mitosis", "Meiosis", "Binary fission", "Budding"],
            correctIndex: 2,
            rationale: "Binary fission is the asexual reproduction process used by bacteria. The bacterial cell replicates its DNA and divides into two identical daughter cells. This is different from eukaryotic mitosis, which involves a more complex process with a mitotic spindle.",
          },
          {
            id: "mb17",
            question: "Normal gut flora provide protection against pathogens primarily through:",
            options: ["Producing antibiotics", "Competitive exclusion — occupying binding sites and consuming nutrients", "Directly killing pathogens with enzymes", "Raising body temperature to kill invaders"],
            correctIndex: 1,
            rationale: "Competitive exclusion is the primary protective mechanism of normal flora. By occupying attachment sites and consuming available nutrients, resident bacteria prevent pathogenic organisms from establishing themselves.",
          },
          {
            id: "mb18",
            question: "Which statement about viruses is correct?",
            options: ["Viruses can reproduce independently outside a host cell", "Viruses are prokaryotic organisms", "Viruses require host cell machinery to replicate", "Viruses are effectively treated with antibiotics"],
            correctIndex: 2,
            rationale: "Viruses are obligate intracellular parasites — they cannot reproduce on their own. They must hijack a host cell's ribosomes, enzymes, and energy to replicate their genetic material and assemble new viral particles.",
          },
          {
            id: "mb19",
            question: "High-level disinfection is required for semi-critical items such as:",
            options: ["Blood pressure cuffs", "Surgical implants", "Endoscopes that contact mucous membranes", "Bed rails and countertops"],
            correctIndex: 2,
            rationale: "Semi-critical items contact mucous membranes or non-intact skin (e.g., endoscopes, respiratory therapy equipment). They require high-level disinfection, which kills all organisms except high numbers of bacterial spores.",
          },
          {
            id: "mb20",
            question: "Which mode of transmission is most common in healthcare-associated infections?",
            options: ["Airborne transmission", "Vector-borne transmission", "Contact transmission (direct or indirect)", "Fecal-oral transmission"],
            correctIndex: 2,
            rationale: "Contact transmission — both direct (person-to-person) and indirect (via contaminated objects/fomites such as stethoscopes, doorknobs, and bed rails) — is the most common mode of transmission in healthcare settings. Hand hygiene is the primary prevention strategy.",
          },
        ]}
      />
    </div>
  );
}
