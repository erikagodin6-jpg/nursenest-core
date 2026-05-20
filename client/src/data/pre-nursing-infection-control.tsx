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
import { Shield, AlertTriangle, Hand, Layers } from "lucide-react";

export function InfectionControlModule() {
  const { t } = useI18n();
  const hygieneContent = useEditableText("infctrl-hygiene-cognitive", "1. BEFORE touching a patient. 2. BEFORE a clean/aseptic procedure. 3. AFTER body fluid exposure risk. 4. AFTER touching a patient. 5. AFTER touching patient surroundings. These moments create a systematic approach to hand hygiene that covers all critical transmission opportunities.");
  const ppeDoffingContent = useEditableText("infctrl-ppe-doffing-cognitive", "DONNING (putting on): Gown → Mask/Respirator → Goggles/Face shield → Gloves. DOFFING (removing): Gloves → Goggles/Face shield → Gown → Mask/Respirator. The doffing sequence is critical — the most contaminated items (gloves) come off first, and the mask (which protects airways) comes off last, AFTER leaving the patient area. Hand hygiene after each step of doffing.");

  return (
    <div className="space-y-10" data-testid="module-infection-control">
      <div>
        <EditableModuleText sectionKey="infctrl-title" defaultText="Infection Control Foundations" as="h2" className="text-2xl font-bold text-gray-900 mb-2" />
        <EditableModuleText sectionKey="infctrl-desc" defaultText="Master the chain of infection, standard precautions, hand hygiene, PPE selection, and aseptic technique — the core competencies that prevent healthcare-associated infections." as="p" className="text-gray-600" multiline />
      </div>

      <MicroLesson title="The Chain of Infection" subtitle="Six links that must all be present for infection to occur" icon={<Layers className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infctrl-chain-content" defaultText={`Infection requires an unbroken chain of infection (A conceptual model with six links: (1) infectious agent, (2) reservoir, (3) portal of exit, (4) mode of transmission, (5) portal of entry, (6) susceptible host. Breaking ANY link prevents infection.). Infection prevention strategies work by targeting the weakest links in this chain.`} as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <ProgressiveReveal
          title={t("data.pre_nursing_infection_control.theSixLinks")}
          cards={[
            {
              id: "ic1",
              title: "1. Infectious Agent",
              summary: "The pathogen itself",
              detail: "The microorganism capable of causing disease — bacteria, virus, fungus, parasite, or prion. Factors that matter: virulence (ability to cause disease), infectivity (ability to establish infection), pathogenicity (ability to produce disease), and dose (number of organisms needed). Breaking this link: antimicrobial agents, vaccines.",
            },
            {
              id: "ic2",
              title: "2. Reservoir",
              summary: "Where the pathogen lives and multiplies",
              detail: "The habitat where the organism survives: humans (colonized or infected patients, healthcare workers), animals, or the environment (contaminated surfaces, water, soil). Breaking this link: early identification and treatment of infected patients, environmental cleaning, surveillance.",
            },
            {
              id: "ic3",
              title: "3. Portal of Exit",
              summary: "How the pathogen leaves the reservoir",
              detail: "The route by which the organism leaves its reservoir: respiratory tract (coughing, sneezing), GI tract (feces, vomit), urogenital tract, skin/wound, blood (needle-sticks, transfusion). Breaking this link: respiratory hygiene, wound containment, proper waste disposal.",
            },
            {
              id: "ic4",
              title: "4. Mode of Transmission",
              summary: "How the pathogen travels to a new host",
              detail: "Contact (direct/indirect), droplet, airborne, vehicle (food, water, blood), or vector (insects). This is the most targeted link in healthcare infection prevention. Breaking this link: HAND HYGIENE (the single most effective intervention), PPE, isolation precautions, environmental controls.",
            },
            {
              id: "ic5",
              title: "5. Portal of Entry",
              summary: "How the pathogen enters the new host",
              detail: "The route by which the organism enters the new host: mucous membranes (eyes, nose, mouth), broken skin (wounds, IV sites, surgical incisions), respiratory tract (inhalation), GI tract (ingestion), urinary tract (catheterization). Breaking this link: PPE (masks, goggles), wound care, aseptic technique for invasive procedures.",
            },
            {
              id: "ic6",
              title: "6. Susceptible Host",
              summary: "A person who can develop infection",
              detail: "Not everyone exposed becomes infected — susceptibility depends on: immune status, age (very young and elderly are more vulnerable), nutritional status, chronic disease, immunosuppressive therapy, stress, and presence of invasive devices. Breaking this link: vaccination, nutrition, minimizing immunosuppression when possible.",
            },
          ]}
        />
      </MicroLesson>

      <MicroLesson title="Hand Hygiene" subtitle="The single most effective infection prevention measure" icon={<Hand className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infctrl-hygiene-content" defaultText="Hand hygiene prevents transmission by breaking the mode of transmission (The fourth link in the chain of infection. Contact transmission (direct and indirect via contaminated hands) is the most common mode in healthcare. Hand hygiene directly interrupts this transmission path.) link. Two methods are available, and the choice depends on the clinical situation." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Alcohol-Based Hand Rub (ABHR)</p>
            <p className="text-xs text-blue-600"><strong>Preferred method</strong> for routine decontamination when hands are not visibly soiled. Faster, more effective against most organisms, less irritating to skin. Apply enough to cover all surfaces; rub until dry (minimum 20 seconds). <strong>NOT effective against:</strong> C. difficile spores and norovirus — these require soap and water.</p>
          </div>
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-1">Soap & Water Handwashing</p>
            <p className="text-xs text-emerald-600"><strong>Required when:</strong> hands are visibly soiled or contaminated with body fluids, after caring for patients with C. difficile or norovirus, before eating, after using the restroom. Technique: wet, apply soap, lather all surfaces for minimum 20 seconds, rinse, dry with paper towel, use towel to turn off faucet.</p>
          </div>
        </div>
        <CognitiveCard
          type="concept"
          title={t("data.pre_nursing_infection_control.the5MomentsForHand")}
          content={hygieneContent}
        />
      </MicroLesson>

      <MicroLesson title="Personal Protective Equipment (PPE)" subtitle="Barrier protection matched to risk" icon={<Shield className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infctrl-ppe-content" defaultText="PPE creates a barrier between the healthcare worker and infectious material. The critical principle is risk-based selection (PPE is selected based on the anticipated exposure: what body fluids might be encountered, what transmission route is involved, and what procedures will be performed. Using too little PPE creates risk; using too much wastes resources and creates a false sense of security.)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Gloves</p>
            <p className="text-xs text-blue-600">Used when touching blood, body fluids, mucous membranes, non-intact skin, or contaminated items. Change between patients and between dirty and clean tasks on the same patient. Gloves do NOT replace hand hygiene — hands must be cleaned before donning and after removing gloves.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Gown</p>
            <p className="text-xs text-purple-600">Protects skin and clothing. Required when anticipating contact with blood/body fluids that could soil clothing, or during contact precautions. Remove before leaving the patient's environment to prevent carrying organisms on clothing.</p>
          </div>
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100">
            <p className="text-xs font-semibold text-teal-700 mb-1">Mask & Eye Protection</p>
            <p className="text-xs text-teal-600"><strong>Surgical mask:</strong> Protects against droplet transmission (within ~1 meter). <strong>N95 respirator:</strong> Required for airborne precautions (TB, measles, varicella) — must be fit-tested. <strong>Eye protection (goggles/face shield):</strong> When splash or spray of body fluids is anticipated.</p>
          </div>
        </div>
        <CognitiveCard
          type="warning"
          title={t("data.pre_nursing_infection_control.ppeDonningDoffingOrder")}
          content={ppeDoffingContent}
        />
      </MicroLesson>

      <MicroLesson title="Standard & Transmission-Based Precautions" subtitle="The two tiers of isolation precautions" icon={<AlertTriangle className="w-5 h-5" />}>
        <EditableModuleText sectionKey="infctrl-precautions-content" defaultText="Infection prevention uses a two-tier system (Tier 1: Standard Precautions — applied to ALL patients regardless of diagnosis. Tier 2: Transmission-Based Precautions — added on top of standard precautions for patients with known or suspected infections transmitted by specific routes.)." as="p" className="text-sm text-gray-600 leading-relaxed" multiline />
        <div className="space-y-3 mt-3">
          <div className="p-4 bg-green-50/60 rounded-xl border border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-1">Standard Precautions (ALL Patients)</p>
            <p className="text-xs text-green-600">Based on the principle that ALL blood, body fluids, secretions, excretions (except sweat), non-intact skin, and mucous membranes may contain transmissible infectious agents. Includes: hand hygiene, PPE based on anticipated exposure, respiratory hygiene/cough etiquette, safe injection practices, safe handling of contaminated equipment/surfaces.</p>
          </div>
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-1">Contact Precautions</p>
            <p className="text-xs text-blue-600">For infections spread by direct or indirect contact (MRSA, VRE, C. difficile, scabies). Requires: private room or cohorting, gloves and gown for all interactions with patient or environment, dedicated equipment.</p>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 mb-1">Droplet Precautions</p>
            <p className="text-xs text-purple-600">For infections spread by large respiratory droplets (influenza, pertussis, meningococcal disease). Requires: private room, surgical mask within 1 meter, patient wears mask during transport.</p>
          </div>
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-700 mb-1">Airborne Precautions</p>
            <p className="text-xs text-rose-600">For infections spread by airborne droplet nuclei (TB, measles, varicella, COVID-19 aerosol-generating procedures). Requires: negative-pressure airborne infection isolation room (AIIR), N95 respirator (fit-tested), door closed at all times.</p>
          </div>
        </div>
      </MicroLesson>

      <MatchingExercise
        title={t("data.pre_nursing_infection_control.matchThePrecautionType")}
        pairs={[
          { term: "Standard precautions", definition: "Applied to ALL patients" },
          { term: "Contact precautions", definition: "Gown and gloves, dedicated equipment" },
          { term: "Droplet precautions", definition: "Surgical mask within 1 meter" },
          { term: "Airborne precautions", definition: "N95 respirator, negative-pressure room" },
          { term: "Hand hygiene", definition: "Most effective single infection prevention measure" },
          { term: "Chain of infection", definition: "Six links that must all be present for infection" },
        ]}
      />

      <SelfCheckQuiz
        title={t("data.pre_nursing_infection_control.infectionControlQuiz")}
        questions={[
          {
            id: "ic1",
            question: "Which link in the chain of infection is MOST effectively targeted by hand hygiene?",
            options: ["Infectious agent", "Reservoir", "Mode of transmission", "Susceptible host"],
            correctIndex: 2,
            rationale: "Hand hygiene directly breaks the mode of transmission (specifically contact transmission), which is the most common route of healthcare-associated infection transmission.",
          },
          {
            id: "ic2",
            question: "When caring for a patient with C. difficile, which hand hygiene method is required?",
            options: ["Alcohol-based hand rub", "Soap and water", "Either method is equally effective", "Antiseptic wipes only"],
            correctIndex: 1,
            rationale: "C. difficile produces spores that are NOT killed by alcohol-based hand rubs. Soap and water with mechanical friction is required to physically remove the spores from hands.",
          },
          {
            id: "ic3",
            question: "What is the correct order for REMOVING (doffing) PPE?",
            options: ["Mask → Gown → Gloves → Goggles", "Gloves → Goggles → Gown → Mask", "Gown → Gloves → Mask → Goggles", "Goggles → Mask → Gloves → Gown"],
            correctIndex: 1,
            rationale: "Doffing order: Gloves (most contaminated) → Goggles/Face shield → Gown → Mask/Respirator (removed last, after leaving patient area). Hand hygiene between each step.",
          },
          {
            id: "ic4",
            question: "A patient with active pulmonary tuberculosis requires which type of precautions?",
            options: ["Standard precautions only", "Contact precautions", "Droplet precautions", "Airborne precautions"],
            correctIndex: 3,
            rationale: "TB is transmitted by airborne droplet nuclei (<5 μm) that remain suspended in air. Requires: negative-pressure room, N95 respirator for healthcare workers, door closed.",
          },
          {
            id: "ic5",
            question: "Standard precautions are based on the principle that:",
            options: ["Only symptomatic patients are infectious", "All blood and body fluids may contain transmissible agents", "Precautions are only needed for known infections", "Gloves provide sufficient protection for all situations"],
            correctIndex: 1,
            rationale: "Standard precautions assume that ALL blood, body fluids, secretions, excretions (except sweat), non-intact skin, and mucous membranes may contain infectious agents — regardless of diagnosis.",
          },
          {
            id: "ic6",
            question: "Why must gloves be changed between dirty and clean tasks on the SAME patient?",
            options: ["To save money on gloves", "To prevent cross-contamination between body sites", "Gloves lose their barrier protection quickly", "It is only a recommendation, not required"],
            correctIndex: 1,
            rationale: "Organisms from a contaminated site (e.g., perineal care) can be transferred to a clean site (e.g., IV site) on the same patient via contaminated gloves, causing infection at the clean site.",
          },
          {
            id: "ic7",
            question: "Which WHO moment for hand hygiene occurs BEFORE touching a patient?",
            options: ["Moment 3", "Moment 4", "Moment 1", "Moment 5"],
            correctIndex: 2,
            rationale: "WHO Moment 1: BEFORE touching a patient. This protects the patient from organisms carried on the healthcare worker's hands from previous contacts.",
          },
          {
            id: "ic8",
            question: "A patient is diagnosed with influenza. Which type of transmission-based precautions should be implemented?",
            options: ["Airborne precautions", "Contact precautions", "Droplet precautions", "Protective environment"],
            correctIndex: 2,
            rationale: "Influenza is spread by large respiratory droplets produced during coughing and sneezing. Droplet precautions require a surgical mask within 1 meter and the patient wearing a mask during transport.",
          },
          {
            id: "ic9",
            question: "What is the MINIMUM time recommended for rubbing hands with alcohol-based hand rub?",
            options: ["5 seconds", "10 seconds", "20 seconds", "60 seconds"],
            correctIndex: 2,
            rationale: "Alcohol-based hand rub should be applied to all surfaces of the hands and rubbed until dry, which takes a minimum of 20 seconds for adequate antimicrobial action.",
          },
          {
            id: "ic10",
            question: "Which organism requires the use of soap and water instead of alcohol-based hand rub?",
            options: ["MRSA", "VRE", "Norovirus", "Streptococcus pneumoniae"],
            correctIndex: 2,
            rationale: "Norovirus is not effectively killed by alcohol-based hand rubs. Soap and water with mechanical friction is required to physically remove the virus. C. difficile spores also require soap and water.",
          },
          {
            id: "ic11",
            question: "What type of room is required for a patient on airborne precautions?",
            options: ["Any private room with the door closed", "Negative-pressure airborne infection isolation room (AIIR)", "Positive-pressure room", "A shared room with curtain dividers"],
            correctIndex: 1,
            rationale: "Airborne precautions require a negative-pressure airborne infection isolation room (AIIR) that has at least 6-12 air changes per hour with air exhausted directly to the outside or through HEPA filtration.",
          },
          {
            id: "ic12",
            question: "Which of the following is the FIRST item put on during PPE donning?",
            options: ["Gloves", "Mask/Respirator", "Gown", "Goggles/Face shield"],
            correctIndex: 2,
            rationale: "The correct donning order is: Gown → Mask/Respirator → Goggles/Face shield → Gloves. The gown goes on first to protect clothing before other barriers are added.",
          },
          {
            id: "ic13",
            question: "A nurse is caring for a patient with scabies. Which precautions are required IN ADDITION to standard precautions?",
            options: ["Airborne precautions", "Droplet precautions", "Contact precautions", "No additional precautions needed"],
            correctIndex: 2,
            rationale: "Scabies is transmitted through direct skin-to-skin contact. Contact precautions (gloves and gown for all interactions, dedicated equipment) are required in addition to standard precautions.",
          },
          {
            id: "ic14",
            question: "The 'reservoir' in the chain of infection refers to:",
            options: ["The route by which the pathogen enters a new host", "The habitat where the pathogen lives and multiplies", "The method of pathogen travel between hosts", "The person who develops the infection"],
            correctIndex: 1,
            rationale: "The reservoir is where the pathogen survives and multiplies. This can be humans (colonized or infected patients), animals, or the environment (contaminated surfaces, water, soil).",
          },
          {
            id: "ic15",
            question: "Which disease requires an N95 respirator that has been fit-tested for the healthcare worker?",
            options: ["Influenza", "Meningococcal meningitis", "Active pulmonary tuberculosis", "MRSA wound infection"],
            correctIndex: 2,
            rationale: "Active pulmonary TB requires airborne precautions, including a fit-tested N95 respirator. TB is transmitted via airborne droplet nuclei (<5 μm) that remain suspended in air for extended periods.",
          },
          {
            id: "ic16",
            question: "After removing gloves during the doffing process, the nurse should IMMEDIATELY:",
            options: ["Remove the goggles", "Leave the patient room", "Perform hand hygiene", "Remove the gown"],
            correctIndex: 2,
            rationale: "Hand hygiene should be performed after each step of the doffing process. After removing gloves (the most contaminated item), hand hygiene is essential before touching other PPE to prevent self-contamination.",
          },
          {
            id: "ic17",
            question: "Standard precautions apply to all of the following EXCEPT:",
            options: ["Blood", "Sweat", "Cerebrospinal fluid", "Wound drainage"],
            correctIndex: 1,
            rationale: "Standard precautions apply to ALL blood, body fluids, secretions, and excretions EXCEPT sweat. Sweat has not been implicated in the transmission of infectious agents.",
          },
          {
            id: "ic18",
            question: "Which factor makes a host MORE susceptible to infection?",
            options: ["Adequate nutrition", "Immunosuppressive therapy", "Up-to-date vaccinations", "Intact skin barriers"],
            correctIndex: 1,
            rationale: "Immunosuppressive therapy weakens the immune response, making the host more vulnerable to infection. This breaks the sixth link in the chain — the susceptible host — by reducing the body's ability to fight off pathogens.",
          },
          {
            id: "ic19",
            question: "What is the single MOST effective measure to prevent healthcare-associated infections?",
            options: ["Wearing gloves for all patient contact", "Administering prophylactic antibiotics", "Hand hygiene", "Placing all patients in isolation rooms"],
            correctIndex: 2,
            rationale: "Hand hygiene is consistently identified as the single most effective intervention to prevent healthcare-associated infections. It directly breaks the mode of transmission link in the chain of infection.",
          },
          {
            id: "ic20",
            question: "A patient with measles (rubeola) requires which type of isolation precautions?",
            options: ["Contact precautions", "Droplet precautions", "Airborne precautions", "Standard precautions only"],
            correctIndex: 2,
            rationale: "Measles is one of the most contagious diseases, transmitted via airborne droplet nuclei that can remain suspended in air for up to 2 hours. Airborne precautions with a negative-pressure room and N95 respirator are required.",
          },
        ]}
      />
    </div>
  );
}
