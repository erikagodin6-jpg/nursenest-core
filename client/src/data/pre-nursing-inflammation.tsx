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
import { Flame, Shield, Activity, Heart } from "lucide-react";

export function InflammationModule() {
  const { t } = useI18n();
  const cardinalSignsContent = useEditableText("infl-cardinal-signs-content", "The five cardinal signs of inflammation were first described by Celsus (rubor, calor, dolor, tumor) with functio laesa added by Virchow. Rubor (redness) results from vasodilation increasing blood flow to the area. Calor (heat) occurs from increased blood flow and metabolic activity. Dolor (pain) is caused by inflammatory mediators stimulating nerve endings and tissue swelling compressing nerves. Tumor (swelling) results from increased vascular permeability allowing fluid and proteins to leak into interstitial spaces. Functio laesa (loss of function) occurs as a protective mechanism — pain and swelling limit movement of the affected area, promoting healing.");
  const mediatorContent = useEditableText("infl-mediator-content", "Inflammatory mediators are chemical signals that coordinate the inflammatory response. Histamine (from mast cells) causes immediate vasodilation and increased vascular permeability — this is why antihistamines reduce swelling and itching. Prostaglandins (produced via the COX pathway) cause pain, fever, and prolonged vasodilation — NSAIDs work by inhibiting COX enzymes. Cytokines (IL-1, IL-6, TNF-alpha) are signaling proteins that recruit immune cells, induce fever via the hypothalamus, and can trigger systemic inflammatory response syndrome (SIRS) when overproduced. Complement proteins create membrane attack complexes that lyse pathogens. Leukotrienes cause bronchospasm and are involved in asthma pathophysiology.");
  const woundHealingContent = useEditableText("infl-wound-healing-content", "Wound healing proceeds through four overlapping phases. Hemostasis (seconds to hours): vasoconstriction, platelet plug formation, fibrin clot stabilization — stops bleeding. Inflammatory phase (1-6 days): neutrophils arrive first (within hours) to phagocytize bacteria, followed by macrophages (24-48 hours) that clear debris and release growth factors. Proliferative phase (4-21 days): fibroblasts produce collagen, angiogenesis creates new blood vessels, granulation tissue fills the wound, and epithelial cells migrate across the wound surface. Remodeling phase (21 days to 2 years): collagen reorganizes along stress lines, scar tissue matures and strengthens (reaching maximum 80% of original skin strength), and excess vasculature regresses.");

  return (
    <div className="space-y-10" data-testid="module-inflammation">
      <div>
        <EditableModuleText sectionKey="infl-title" defaultText="Inflammation & Wound Healing" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="infl-desc" defaultText="Understand the inflammatory response from cellular mechanisms to clinical signs, differentiate acute from chronic inflammation, master inflammatory mediators and their pharmacologic targets, and learn the phases of wound healing." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="Acute vs. Chronic Inflammation" subtitle="Protective response vs. pathological process" icon={<Flame className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infl-acute-chronic-intro" defaultText="Inflammation is a fundamental protective response to tissue injury or infection. Acute inflammation is rapid, self-limiting, and beneficial — it eliminates the threat and initiates repair. Chronic inflammation persists for weeks to years, causes ongoing tissue damage, and underlies many chronic diseases including atherosclerosis, rheumatoid arthritis, and cancer." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
            <p className="text-xs font-semibold text-orange-700 mb-1">Acute Inflammation</p>
            <p className="text-xs text-orange-600"><strong>Onset:</strong> Seconds to minutes. <strong>Duration:</strong> Hours to days. <strong>Primary cells:</strong> Neutrophils (first responders). <strong>Vascular changes:</strong> Vasodilation, increased permeability (exudate formation). <strong>Purpose:</strong> Eliminate the injurious agent, remove necrotic tissue, initiate repair. <strong>Outcomes:</strong> Complete resolution, abscess formation, or progression to chronic inflammation. <strong>Examples:</strong> Acute appendicitis, sprained ankle, bacterial pneumonia, surgical incision.</p>
          </div>
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-red-700 mb-1">Chronic Inflammation</p>
            <p className="text-xs text-red-600"><strong>Onset:</strong> Gradual or follows unresolved acute inflammation. <strong>Duration:</strong> Weeks to years. <strong>Primary cells:</strong> Macrophages, lymphocytes, plasma cells. <strong>Tissue changes:</strong> Fibrosis, tissue destruction, angiogenesis occurring simultaneously. <strong>Purpose:</strong> Attempt to contain persistent threat — often causes more damage than the original insult. <strong>Examples:</strong> Rheumatoid arthritis, atherosclerosis, Crohn's disease, chronic hepatitis, tuberculosis.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_inflammation.theFiveCardinalSignsOf")}
          content={cardinalSignsContent}
        />
      </MicroLesson>

      <MicroLesson title="Inflammatory Mediators & Pharmacologic Targets" subtitle="Chemical signals that drive the inflammatory cascade" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infl-mediators-intro" defaultText="Understanding inflammatory mediators is essential because most anti-inflammatory medications work by targeting specific mediators or their pathways. Every NSAID, corticosteroid, antihistamine, and biologic drug connects back to these chemical signals." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_inflammation.keyInflammatoryMediators")}
          cards={[
            {
              id: "infl-med-1",
              title: "Histamine",
              summary: "Released from mast cells — causes immediate vasodilation and permeability",
              detail: "Histamine is preformed and stored in mast cell granules, released within seconds of injury or allergen exposure. It causes arteriolar vasodilation (redness, warmth), increased venular permeability (swelling), and smooth muscle contraction (bronchospasm in allergic reactions). Antihistamines (diphenhydramine, cetirizine) block H1 receptors to reduce these effects. H2 receptors in the stomach regulate acid secretion — H2 blockers (famotidine) reduce gastric acid.",
            },
            {
              id: "infl-med-2",
              title: "Prostaglandins",
              summary: "Produced via COX pathway — cause pain, fever, and sustained vasodilation",
              detail: "Prostaglandins are synthesized from arachidonic acid by cyclooxygenase (COX) enzymes. COX-1 is constitutive — it protects gastric mucosa, supports platelet function, and maintains renal blood flow. COX-2 is inducible — upregulated during inflammation. NSAIDs inhibit COX: non-selective (ibuprofen, aspirin) inhibit both COX-1 and COX-2, which is why they can cause GI bleeding and renal impairment. Selective COX-2 inhibitors (celecoxib) have fewer GI side effects but increased cardiovascular risk.",
            },
            {
              id: "infl-med-3",
              title: "Cytokines (IL-1, IL-6, TNF-α)",
              summary: "Signaling proteins that coordinate systemic inflammatory responses",
              detail: "Pro-inflammatory cytokines are produced primarily by macrophages and T cells. TNF-alpha triggers endothelial activation, neutrophil recruitment, and fever. IL-1 acts on the hypothalamus to raise body temperature (fever). IL-6 stimulates acute-phase protein production by the liver (CRP, fibrinogen). When overproduced, cytokines cause systemic inflammatory response syndrome (SIRS) and can progress to septic shock. Biologic drugs (infliximab, adalimumab) target TNF-alpha for conditions like rheumatoid arthritis and Crohn's disease.",
            },
            {
              id: "infl-med-4",
              title: "Complement System",
              summary: "Cascade of proteins that enhance immune defense",
              detail: "The complement system consists of ~30 plasma proteins that activate in a cascade. Key functions: opsonization (C3b coats pathogens to enhance phagocytosis), chemotaxis (C5a attracts neutrophils to the site), and lysis (membrane attack complex C5b-C9 creates pores in pathogen membranes). Complement deficiencies increase susceptibility to infections, particularly encapsulated bacteria (Neisseria, Streptococcus pneumoniae).",
            },
          ]}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_inflammation.inflammatoryMediatorsAndDrugTargets")}
          content={mediatorContent}
        />
      </MicroLesson>

      <MicroLesson title="Fever Physiology & Immune Regulation" subtitle="Understanding fever as a regulated immune response" icon={<Activity className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infl-fever-intro" defaultText="Fever is not a malfunction — it is a deliberate upward resetting of the hypothalamic thermostat in response to pyrogens. It enhances immune function but can become dangerous at extreme levels. Understanding fever physiology helps nurses make evidence-based decisions about when to treat fever and when to let it serve its protective role." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Fever Mechanism</p>
            <p className="text-xs text-amber-600"><strong>Exogenous pyrogens</strong> (bacteria, viruses) stimulate macrophages to release <strong>endogenous pyrogens</strong> (IL-1, IL-6, TNF-α). These act on the hypothalamus to increase prostaglandin E2 (PGE2) production, which raises the thermostat set point. The body then generates heat through shivering and vasoconstriction (chills) until the new set point is reached. <strong>Antipyretics</strong> (acetaminophen, NSAIDs) lower fever by inhibiting PGE2 synthesis — they reset the thermostat back to normal, causing vasodilation and sweating (defervescence).</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Immune Overreaction vs. Immunosuppression</p>
            <p className="text-xs text-blue-600"><strong>Overreaction (Hypersensitivity):</strong> The immune system attacks harmless substances (allergies — Type I), self-tissues (autoimmune diseases — Type II/III), or causes excessive cell-mediated responses (contact dermatitis — Type IV). In severe cases, systemic overreaction causes anaphylaxis or cytokine storm. <strong>Immunosuppression:</strong> Inadequate immune response — from HIV/AIDS, chemotherapy, corticosteroids, malnutrition, or extremes of age. Increases susceptibility to opportunistic infections. Both extremes require nursing vigilance for different complications.</p>
          </div>
        </div>
      </MicroLesson>

      <MicroLesson title="Wound Healing Phases" subtitle="From hemostasis through remodeling" icon={<Heart className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infl-wound-intro" defaultText="Wound healing is a complex, overlapping process that depends on adequate nutrition (especially protein and vitamin C), oxygenation, moisture balance, and absence of infection. Nurses play a critical role in optimizing healing conditions and recognizing signs of impaired healing." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_inflammation.fourPhasesOfWoundHealing")}
          cards={[
            {
              id: "infl-wh-1",
              title: "Phase 1: Hemostasis (Seconds to Hours)",
              summary: "Stop the bleeding — vasoconstriction and clot formation",
              detail: "Immediately after injury, damaged blood vessels constrict (vasoconstriction) to reduce blood loss. Platelets adhere to exposed collagen and aggregate to form a temporary platelet plug. The coagulation cascade activates to convert fibrinogen to fibrin, which stabilizes the plug into a clot. The clot serves as a scaffold for incoming cells and a barrier against infection. Clinically: direct pressure aids hemostasis; impaired coagulation (anticoagulant therapy, liver disease, thrombocytopenia) delays this phase.",
            },
            {
              id: "infl-wh-2",
              title: "Phase 2: Inflammatory Phase (Days 1-6)",
              summary: "Clean the wound — neutrophils and macrophages remove debris and bacteria",
              detail: "Neutrophils arrive within hours — they phagocytize bacteria and release proteolytic enzymes to break down necrotic tissue. Macrophages arrive at 24-48 hours and are essential for wound healing — they clear debris, release growth factors (PDGF, TGF-β, VEGF), and transition the wound from inflammation to proliferation. Signs of normal inflammation (redness, warmth, swelling, pain) are expected. Signs of infection (increasing pain, purulent drainage, fever, spreading erythema) indicate the inflammatory phase has been overwhelmed.",
            },
            {
              id: "infl-wh-3",
              title: "Phase 3: Proliferative Phase (Days 4-21)",
              summary: "Rebuild tissue — granulation, angiogenesis, and epithelialization",
              detail: "Fibroblasts migrate into the wound and produce collagen — the primary structural protein of new tissue. Angiogenesis creates new blood vessels from existing ones, giving granulation tissue its characteristic beefy red, bumpy appearance. Epithelial cells migrate across the wound surface from the edges (epithelialization). Wound contraction reduces wound size. Clinically: moist wound environment promotes healing; excessive dryness impairs epithelial migration; protein and vitamin C are essential for collagen synthesis.",
            },
            {
              id: "infl-wh-4",
              title: "Phase 4: Remodeling (Day 21 to 2 Years)",
              summary: "Strengthen and reorganize — collagen maturation and scar formation",
              detail: "Type III collagen (weaker, produced during proliferation) is gradually replaced by Type I collagen (stronger, organized along stress lines). The scar initially appears raised and red, then flattens and pales over months. Maximum tensile strength is reached at approximately 80% of original skin strength — healed tissue is never as strong as uninjured tissue. Excess collagen deposition can lead to hypertrophic scars or keloids. Clinically: activity restrictions during this phase protect healing tissue from disruption.",
            },
          ]}
        />
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_inflammation.woundHealingFundamentals")}
          content={woundHealingContent}
        />
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_inflammation.matchTheInflammationConcept")}
        pairs={[
          { id: "infl-m1", term: "Rubor", definition: "Redness — caused by vasodilation increasing blood flow" },
          { id: "infl-m2", term: "Histamine", definition: "Mast cell mediator causing immediate vasodilation and permeability" },
          { id: "infl-m3", term: "Prostaglandins", definition: "COX-pathway mediators causing pain, fever, and vasodilation" },
          { id: "infl-m4", term: "Granulation tissue", definition: "Beefy red tissue with new blood vessels during proliferative phase" },
          { id: "infl-m5", term: "Cytokine storm", definition: "Dangerous systemic overproduction of inflammatory signaling proteins" },
          { id: "infl-m6", term: "Functio laesa", definition: "Loss of function — protective limitation of movement in inflamed area" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_inflammation.inflammationWoundHealingQuiz")}
        questions={[
          {
            id: "infl1",
            question: "Which cells are the FIRST to arrive at an acute inflammatory site?",
            options: ["Macrophages", "Lymphocytes", "Neutrophils", "Fibroblasts"],
            correctIndex: 2,
            rationale: "Neutrophils are the first responders in acute inflammation, arriving within hours. They phagocytize bacteria and release proteolytic enzymes. Macrophages arrive later (24-48 hours) and are critical for the transition to healing.",
          },
          {
            id: "infl2",
            question: "The cardinal sign 'tumor' in inflammation refers to:",
            options: ["A cancerous growth", "Swelling from fluid leaking into interstitial spaces", "Increased body temperature", "Loss of function"],
            correctIndex: 1,
            rationale: "In the context of inflammation, 'tumor' means swelling — it results from increased vascular permeability allowing plasma proteins and fluid to leak from blood vessels into the interstitial spaces (edema formation).",
          },
          {
            id: "infl3",
            question: "NSAIDs reduce inflammation PRIMARILY by:",
            options: ["Blocking histamine receptors", "Inhibiting cyclooxygenase (COX) enzymes to reduce prostaglandin production", "Destroying neutrophils at the inflammatory site", "Increasing corticosteroid production"],
            correctIndex: 1,
            rationale: "NSAIDs (ibuprofen, aspirin, naproxen) work by inhibiting COX enzymes, which reduces prostaglandin synthesis. Prostaglandins mediate pain, fever, and sustained vasodilation, so blocking their production reduces these inflammatory symptoms.",
          },
          {
            id: "infl4",
            question: "A major risk of non-selective NSAID use is GI bleeding because:",
            options: ["NSAIDs are toxic to the liver", "COX-1 inhibition reduces the protective prostaglandins that maintain gastric mucosal integrity", "NSAIDs increase gastric acid production", "NSAIDs kill beneficial gut bacteria"],
            correctIndex: 1,
            rationale: "COX-1 is constitutive — it produces prostaglandins that protect the gastric mucosa by maintaining blood flow and mucus production. Non-selective NSAIDs inhibit both COX-1 and COX-2, removing this gastroprotective effect and increasing GI bleeding risk.",
          },
          {
            id: "infl5",
            question: "Fever is caused by endogenous pyrogens acting on which structure?",
            options: ["Cerebral cortex", "Hypothalamus", "Medulla oblongata", "Pituitary gland"],
            correctIndex: 1,
            rationale: "Endogenous pyrogens (IL-1, IL-6, TNF-α) act on the hypothalamus to increase prostaglandin E2 (PGE2) production, which raises the thermostat set point. The body then generates heat through shivering and vasoconstriction until the new set point is reached.",
          },
          {
            id: "infl6",
            question: "During wound healing, macrophages are MOST critical because they:",
            options: ["Form the initial platelet plug", "Produce collagen for tissue repair", "Release growth factors that transition the wound from inflammation to proliferation", "Create the fibrin clot"],
            correctIndex: 2,
            rationale: "Macrophages are essential for wound healing — they phagocytize debris, release growth factors (PDGF, TGF-β, VEGF), and orchestrate the transition from the inflammatory phase to the proliferative phase. Without macrophages, wound healing is severely impaired.",
          },
          {
            id: "infl7",
            question: "Granulation tissue appears:",
            options: ["White and avascular", "Black and necrotic", "Beefy red and bumpy with new blood vessels", "Yellow and purulent"],
            correctIndex: 2,
            rationale: "Healthy granulation tissue is beefy red, moist, and bumpy (granular) due to new capillary formation (angiogenesis). It indicates the wound is in the proliferative phase and healing is progressing normally.",
          },
          {
            id: "infl8",
            question: "The maximum tensile strength a healed wound can achieve compared to original tissue is approximately:",
            options: ["100% — wounds heal to full strength", "80% of original strength", "50% of original strength", "30% of original strength"],
            correctIndex: 1,
            rationale: "Even after complete remodeling (which takes up to 2 years), scar tissue reaches a maximum of approximately 80% of original skin tensile strength. Healed tissue is never as strong as uninjured tissue, which is why re-injury at the same site is common.",
          },
          {
            id: "infl9",
            question: "Which inflammatory mediator is responsible for bronchospasm in asthma?",
            options: ["Histamine only", "Prostaglandins only", "Leukotrienes", "Complement C3b"],
            correctIndex: 2,
            rationale: "Leukotrienes are potent bronchoconstrictors produced from arachidonic acid via the lipoxygenase pathway. They play a major role in asthma pathophysiology. Leukotriene receptor antagonists (montelukast) are used in asthma management.",
          },
          {
            id: "infl10",
            question: "Chronic inflammation differs from acute inflammation PRIMARILY in that chronic inflammation:",
            options: ["Involves neutrophils as the primary cell type", "Is always caused by bacterial infection", "Features macrophages and lymphocytes with simultaneous tissue destruction and repair", "Resolves within 24 hours"],
            correctIndex: 2,
            rationale: "Chronic inflammation is characterized by macrophages and lymphocytes (not neutrophils), simultaneous tissue destruction and repair attempts, fibrosis, and persistence for weeks to years. It underlies many chronic diseases.",
          },
          {
            id: "infl11",
            question: "Antipyretics (acetaminophen, ibuprofen) reduce fever by:",
            options: ["Directly killing the pathogens causing fever", "Inhibiting prostaglandin E2 synthesis in the hypothalamus, resetting the thermostat", "Causing peripheral vasoconstriction to retain heat", "Suppressing all immune function"],
            correctIndex: 1,
            rationale: "Antipyretics work by inhibiting PGE2 production in the hypothalamus, which lowers the thermostat set point back toward normal. This triggers vasodilation and sweating (defervescence) as the body releases excess heat.",
          },
          {
            id: "infl12",
            question: "Which nutrient is MOST essential for collagen synthesis during wound healing?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
            correctIndex: 1,
            rationale: "Vitamin C (ascorbic acid) is required for collagen synthesis — it is a cofactor for the enzymes that hydroxylate proline and lysine in collagen formation. Vitamin C deficiency (scurvy) causes impaired wound healing, bleeding gums, and fragile blood vessels.",
          },
          {
            id: "infl13",
            question: "The complement system enhances phagocytosis through a process called:",
            options: ["Chemotaxis", "Opsonization", "Lysis", "Diapedesis"],
            correctIndex: 1,
            rationale: "Opsonization is the process where complement protein C3b coats the surface of pathogens, making them more recognizable and 'appetizing' to phagocytes (neutrophils and macrophages). This significantly enhances phagocytic efficiency.",
          },
          {
            id: "infl14",
            question: "A patient has a wound that shows increasing redness spreading beyond the wound edges, purulent drainage, and fever. This MOST likely indicates:",
            options: ["Normal inflammatory phase progression", "Wound infection requiring intervention", "Successful transition to the proliferative phase", "Normal remodeling phase"],
            correctIndex: 1,
            rationale: "Spreading erythema beyond wound edges, purulent drainage, and fever are signs of wound infection — the inflammatory response has been overwhelmed by bacterial growth. This requires assessment, possible wound culture, and treatment. Normal inflammation is localized and decreasing by day 4-6.",
          },
          {
            id: "infl15",
            question: "Type I hypersensitivity reactions (allergic reactions) are mediated by:",
            options: ["IgG antibodies and complement", "IgE antibodies and mast cell degranulation", "T lymphocytes", "Neutrophils"],
            correctIndex: 1,
            rationale: "Type I (immediate) hypersensitivity involves IgE antibodies binding to mast cells. Upon re-exposure to the allergen, cross-linking of IgE triggers mast cell degranulation, releasing histamine and other mediators. Anaphylaxis is the most severe form.",
          },
          {
            id: "infl16",
            question: "During the hemostasis phase of wound healing, what forms first?",
            options: ["Granulation tissue", "Collagen matrix", "Platelet plug", "Epithelial cell migration"],
            correctIndex: 2,
            rationale: "Hemostasis begins with vasoconstriction followed by platelet adhesion and aggregation to form a temporary platelet plug. The coagulation cascade then converts fibrinogen to fibrin, which stabilizes the plug into a definitive clot.",
          },
          {
            id: "infl17",
            question: "TNF-alpha inhibitors (infliximab, adalimumab) are used to treat which type of inflammation?",
            options: ["Acute bacterial infections", "Chronic inflammatory conditions like rheumatoid arthritis and Crohn's disease", "Allergic rhinitis", "Post-surgical wound inflammation"],
            correctIndex: 1,
            rationale: "TNF-alpha inhibitors (biologics) target the cytokine TNF-alpha, which drives chronic inflammatory conditions. They are used for rheumatoid arthritis, Crohn's disease, psoriasis, and ankylosing spondylitis — conditions where chronic cytokine-mediated inflammation causes ongoing tissue damage.",
          },
          {
            id: "infl18",
            question: "Which phase of wound healing involves fibroblasts producing collagen?",
            options: ["Hemostasis", "Inflammatory phase", "Proliferative phase", "None — collagen is pre-existing"],
            correctIndex: 2,
            rationale: "During the proliferative phase (days 4-21), fibroblasts migrate into the wound bed and produce collagen, the primary structural protein of new connective tissue. This phase also features angiogenesis, granulation tissue formation, and epithelialization.",
          },
          {
            id: "infl19",
            question: "A patient on chronic corticosteroid therapy has impaired wound healing because corticosteroids:",
            options: ["Increase collagen synthesis", "Suppress the inflammatory response needed to initiate healing", "Promote excessive granulation tissue", "Enhance platelet function"],
            correctIndex: 1,
            rationale: "Corticosteroids suppress inflammation broadly — they inhibit cytokine production, reduce neutrophil and macrophage function, and impair fibroblast activity. While this reduces harmful inflammation, it also suppresses the inflammatory phase necessary to initiate wound healing.",
          },
          {
            id: "infl20",
            question: "The endogenous pyrogen primarily responsible for inducing fever by acting on the hypothalamus is:",
            options: ["Histamine", "Interleukin-1 (IL-1)", "Complement C5a", "Bradykinin"],
            correctIndex: 1,
            rationale: "IL-1 (along with IL-6 and TNF-alpha) is a key endogenous pyrogen released by macrophages. It acts on the hypothalamus to increase PGE2 production, raising the thermostat set point and producing fever as a systemic inflammatory response.",
          },
        ]}
      />
    </div>
  );
}
