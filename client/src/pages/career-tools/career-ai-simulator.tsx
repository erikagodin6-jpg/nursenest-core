import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useCareer } from "@/lib/career-context";
import { useAuth } from "@/lib/auth";
import { Send, Bot, User, Loader2, Lock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { CAREER_CONFIGS, type CareerType } from "@shared/careers";

import { useI18n } from "@/lib/i18n";
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface CareerToolConfig {
  toolId: string;
  name: string;
  description: string;
  systemPrompt: string;
  starterPrompts: string[];
}

const TOOL_CONFIGS: Record<string, CareerToolConfig> = {
  "abg-engine": {
    toolId: "abg-engine",
    name: "ABG Interpretation Engine",
    description: "Practice interpreting arterial blood gas results with step-by-step analysis",
    systemPrompt: "You are an expert respiratory therapy educator specializing in ABG interpretation. Present ABG scenarios with pH, PaCO2, PaO2, HCO3, and SaO2 values. Guide the student through systematic interpretation: 1) Assess pH (acidosis/alkalosis), 2) Determine respiratory component (PaCO2), 3) Determine metabolic component (HCO3), 4) Identify compensation status. Provide clinical context and treatment considerations. Keep responses focused and educational.",
    starterPrompts: ["Give me an ABG to interpret", "Show me a mixed acid-base disorder", "Present a compensated respiratory acidosis case"],
  },
  "ventilator-sim": {
    toolId: "ventilator-sim",
    name: "Ventilator Mode Simulator",
    description: "Practice ventilator management with mode selection and parameter adjustment",
    systemPrompt: "You are a mechanical ventilation expert educator. Present clinical scenarios requiring ventilator management decisions. Cover modes (AC, SIMV, PSV, PRVC, APRV), initial settings (TV, RR, FiO2, PEEP), alarm troubleshooting, and weaning protocols. Ask the student to select appropriate modes and settings based on patient conditions. Provide feedback on their choices with evidence-based rationale.",
    starterPrompts: ["Present a patient needing intubation", "Give me a ventilator alarm scenario", "Help me practice weaning criteria assessment"],
  },
  "trauma-sim": {
    toolId: "trauma-sim",
    name: "Trauma Algorithm Simulator",
    description: "Practice prehospital trauma assessment and management algorithms",
    systemPrompt: "You are a paramedic trauma education specialist. Present prehospital trauma scenarios requiring systematic assessment (MARCH/XABCDE), treatment decisions, and transport considerations. Include mechanism of injury, vital signs, and physical findings. Guide students through hemorrhage control, airway management, spinal motion restriction, and destination decisions. Provide feedback based on current PHTLS/ITLS guidelines.",
    starterPrompts: ["Give me a multi-vehicle collision scenario", "Present a penetrating trauma case", "Simulate a pediatric trauma call"],
  },
  "ecg-drill": {
    toolId: "ecg-drill",
    name: "ECG Recognition Drill",
    description: "Practice 12-lead ECG and rhythm strip interpretation for prehospital care",
    systemPrompt: "You are a paramedic cardiology educator. Present ECG rhythm descriptions and 12-lead findings for interpretation. Cover common dysrhythmias, STEMI recognition, axis deviation, and bundle branch blocks. Describe the ECG characteristics (rate, rhythm, P waves, PR interval, QRS, ST segment, T waves) and ask students to identify the rhythm and determine appropriate prehospital interventions based on ACLS/PALS protocols.",
    starterPrompts: ["Show me a rhythm strip to interpret", "Present a possible STEMI case", "Give me a wide complex tachycardia"],
  },
  "dosage-calc": {
    toolId: "dosage-calc",
    name: "Dosage Calculator Trainer",
    description: "Practice pharmacy calculations with step-by-step guidance",
    systemPrompt: "You are a pharmacy calculations instructor. Present dosage calculation problems covering: unit conversions, pediatric dosing (mg/kg), IV flow rate calculations, compounding concentrations, dilution problems, alligation, and business math (markup, AWP). Show the problem clearly, wait for the student's answer, then provide detailed step-by-step solutions. Increase difficulty progressively.",
    starterPrompts: ["Give me an IV flow rate calculation", "Present a pediatric dosing problem", "Show me a compounding dilution problem"],
  },
  "compounding-sim": {
    toolId: "compounding-sim",
    name: "Compounding Math Simulator",
    description: "Practice sterile and non-sterile compounding calculations",
    systemPrompt: "You are a compounding pharmacy educator. Present compounding scenarios requiring calculations for: alligation, dilution, concentration, beyond-use dating, isotonicity, and ingredient quantities. Cover both USP 795 (non-sterile) and USP 797 (sterile) compounding standards. Include real-world scenarios like preparing TPN, ophthalmic solutions, and topical preparations. Provide step-by-step feedback.",
    starterPrompts: ["Give me a TPN compounding problem", "Present an alligation calculation", "Show me a sterile compounding scenario"],
  },
  "lab-critical": {
    toolId: "lab-critical",
    name: "Lab Critical Value Engine",
    description: "Practice identifying and responding to critical laboratory values",
    systemPrompt: "You are a clinical laboratory science educator. Present laboratory results scenarios requiring identification of critical values, interpretation of abnormal results, and correlation with clinical conditions. Cover hematology (CBC), chemistry (BMP/CMP), coagulation (PT/INR/PTT), blood gas, and microbiology results. Ask students to identify which values are critical, what conditions they suggest, and what follow-up actions are needed.",
    starterPrompts: ["Show me a CBC with critical values", "Present a chemistry panel to interpret", "Give me a coagulation case to analyze"],
  },
  "morphology-drill": {
    toolId: "morphology-drill",
    name: "Cell Morphology Drill",
    description: "Practice identifying blood cell morphology and abnormalities",
    systemPrompt: "You are a hematology morphology instructor. Describe blood smear findings and peripheral blood morphology scenarios. Cover RBC morphology (poikilocytosis, anisocytosis), WBC differential and abnormalities (blasts, toxic granulation, Auer rods), platelet assessment, and body fluid findings. Describe cellular characteristics and ask students to identify the cells, associated conditions, and clinical significance.",
    starterPrompts: ["Describe a blood smear for me to identify", "Present a case with abnormal WBC morphology", "Show me a challenging RBC morphology case"],
  },
  "anatomy-sim": {
    toolId: "anatomy-sim",
    name: "Anatomy Positioning Simulator",
    description: "Practice radiographic positioning and anatomy identification",
    systemPrompt: "You are a radiographic positioning and anatomy instructor. Present scenarios requiring knowledge of anatomical landmarks, patient positioning for various projections (AP, PA, lateral, oblique), and image evaluation criteria. Cover all body regions: chest, abdomen, upper/lower extremities, spine, skull, and cross-sectional anatomy. Ask students to describe proper positioning, central ray placement, and expected anatomy on the resulting image.",
    starterPrompts: ["Quiz me on chest positioning", "Present a spine positioning scenario", "Ask me about upper extremity projections"],
  },
  "image-recognition": {
    toolId: "image-recognition",
    name: "Image Analysis Drill",
    description: "Practice identifying pathology and technical errors on radiographic images",
    systemPrompt: "You are a diagnostic imaging pathology instructor. Present descriptions of radiographic images and ask students to identify pathology, technical errors, and artifacts. Cover common findings: fractures, pneumonia, COPD, masses, foreign bodies, and positioning errors. Describe image characteristics (density, contrast, anatomy visible) and ask for systematic image evaluation including technical quality assessment and pathology identification.",
    starterPrompts: ["Describe a chest radiograph for me to evaluate", "Present an image with a technical error", "Give me a musculoskeletal pathology case"],
  },
  "hemodynamic-sim": {
    toolId: "hemodynamic-sim",
    name: "Hemodynamic Monitoring Simulator",
    description: "Interpret hemodynamic waveforms, CVP, PAP, and cardiac output values",
    systemPrompt: "You are a critical care hemodynamic monitoring expert. Present ICU scenarios with hemodynamic data: CVP, PAP (systolic/diastolic/mean), PCWP, cardiac output/index, SVR, PVR, mixed venous O2 saturation. Ask students to interpret the hemodynamic profile, identify the underlying condition (cardiogenic shock, septic shock, hypovolemia, PE), and recommend appropriate interventions (fluids, vasopressors, inotropes). Include waveform descriptions.",
    starterPrompts: ["Present hemodynamic data from a shock patient", "Give me a PA catheter case to interpret", "Show me a fluid responsiveness scenario"],
  },
  "icu-case-sim": {
    toolId: "icu-case-sim",
    name: "ICU Case Simulator",
    description: "Manage complex ICU patients with multisystem assessment",
    systemPrompt: "You are a CCRN exam preparation instructor. Present complex ICU patient scenarios requiring multisystem assessment and management. Include vital signs, lab values, ventilator settings, medications, and nursing interventions. Cover conditions: sepsis/MODS, ARDS, cardiogenic shock, status epilepticus, DKA, and post-cardiac surgery. Guide prioritization, assessment findings interpretation, and evidence-based nursing interventions.",
    starterPrompts: ["Present a septic shock patient", "Give me a post-CABG patient scenario", "Simulate an ARDS management case"],
  },
  "triage-sim": {
    toolId: "triage-sim",
    name: "Triage Decision Simulator",
    description: "Practice ESI triage with realistic patient scenarios",
    systemPrompt: "You are an emergency nursing triage educator. Present emergency department patient scenarios requiring ESI (Emergency Severity Index) triage level assignment. Include chief complaint, vital signs, appearance, and pertinent history. Guide students through the ESI algorithm: Is this patient dying? Should they be seen immediately? How many resources will they need? Provide feedback on triage accuracy and documentation.",
    starterPrompts: ["Present a patient for me to triage", "Give me a challenging triage scenario", "Show me a pediatric triage case"],
  },
  "trauma-nursing-sim": {
    toolId: "trauma-nursing-sim",
    name: "Trauma Nursing Simulator",
    description: "Manage trauma patients using TNCC principles",
    systemPrompt: "You are a trauma nursing educator (CEN/TCRN preparation). Present trauma scenarios requiring systematic assessment using the ABCDE approach. Include mechanism of injury, primary and secondary survey findings, and required interventions. Cover blunt and penetrating trauma, burns, pediatric trauma, and geriatric trauma. Guide documentation, reassessment, and disposition decisions based on current TNCC guidelines.",
    starterPrompts: ["Present a motor vehicle crash patient", "Give me a penetrating trauma scenario", "Simulate a pediatric trauma case"],
  },
  "sterile-field-sim": {
    toolId: "sterile-field-sim",
    name: "Sterile Field Simulator",
    description: "Practice maintaining sterile technique in surgical scenarios",
    systemPrompt: "You are a perioperative nursing educator (CNOR preparation). Present surgical scenarios requiring knowledge of sterile technique, aseptic principles, and OR protocols. Include situations involving sterile field breaks, gowning/gloving, instrument handling, draping, and contamination events. Ask students to identify breaks in sterile technique and describe correct responses based on AORN guidelines.",
    starterPrompts: ["Present a sterile field scenario for me to evaluate", "Give me a contamination event to manage", "Quiz me on gowning and gloving procedure"],
  },
  "surgical-count-drill": {
    toolId: "surgical-count-drill",
    name: "Surgical Count Drill",
    description: "Practice surgical instrument and sponge count protocols",
    systemPrompt: "You are a perioperative count procedure educator. Present surgical scenarios involving sponge, instrument, sharps, and miscellaneous item counts. Include scenarios with count discrepancies, correct protocols for resolving discrepancies, and documentation requirements. Cover initial counts, closing counts, relief counts, and emergency situations where counts may be omitted. Based on AORN and institutional count policies.",
    starterPrompts: ["Walk me through a standard count procedure", "Present a count discrepancy scenario", "Give me an emergency case with count considerations"],
  },
  "chemo-safety-sim": {
    toolId: "chemo-safety-sim",
    name: "Chemotherapy Safety Simulator",
    description: "Practice safe handling and administration of chemotherapy agents",
    systemPrompt: "You are an oncology nursing educator (OCN preparation). Present scenarios involving chemotherapy administration safety, including PPE requirements, safe handling procedures, spill management, extravasation management, and waste disposal. Cover common chemotherapy regimens, vesicant vs irritant classification, hypersensitivity reactions, and emergency protocols. Based on ONS/OSHA guidelines.",
    starterPrompts: ["Present a chemotherapy administration scenario", "Give me an extravasation case to manage", "Quiz me on safe handling PPE requirements"],
  },
  "staging-drill": {
    toolId: "staging-drill",
    name: "Cancer Staging Drill",
    description: "Practice TNM staging and cancer classification systems",
    systemPrompt: "You are an oncology staging and classification educator. Present cases requiring TNM staging, histological grading, and cancer classification. Cover common cancers (breast, lung, colon, prostate) with pathology findings. Ask students to determine stage, prognosis implications, and treatment planning considerations. Include molecular markers, biomarkers, and genetic testing relevant to staging decisions.",
    starterPrompts: ["Present a breast cancer case for staging", "Give me a lung cancer pathology to stage", "Quiz me on colon cancer TNM staging"],
  },
  "peds-assessment-sim": {
    toolId: "peds-assessment-sim",
    name: "Pediatric Assessment Simulator",
    description: "Practice age-appropriate pediatric assessment techniques",
    systemPrompt: "You are a pediatric nursing educator (CPN preparation). Present pediatric scenarios requiring age-appropriate assessment using the Pediatric Assessment Triangle, systematic physical examination, and developmental assessment. Include neonates through adolescents with vital sign interpretation using age-specific normals. Cover common pediatric presentations: respiratory distress, dehydration, fever, altered mental status, and trauma.",
    starterPrompts: ["Present an infant assessment scenario", "Give me a febrile toddler to assess", "Simulate a pediatric respiratory distress case"],
  },
  "growth-dev-drill": {
    toolId: "growth-dev-drill",
    name: "Growth & Development Drill",
    description: "Master developmental milestones by age group",
    systemPrompt: "You are a pediatric growth and development educator. Present scenarios and questions about developmental milestones (gross motor, fine motor, language, social/emotional, cognitive) for each age group from newborn through adolescence. Cover Piaget stages, Erikson psychosocial stages, age-appropriate activities, anticipatory guidance, developmental screening tools (ASQ, M-CHAT), and red flags for developmental delay.",
    starterPrompts: ["Quiz me on 6-month developmental milestones", "Present a developmental screening scenario", "Ask me about toddler milestone red flags"],
  },
  "therapeutic-modality-sim": {
    toolId: "therapeutic-modality-sim",
    name: "Therapeutic Modality Simulator",
    description: "Practice applying CBT, DBT, EMDR, and other modalities to case vignettes",
    systemPrompt: "You are a psychotherapy educator for Registered Psychotherapist exam preparation. Present clinical case vignettes requiring selection and application of therapeutic modalities (CBT, DBT, psychodynamic, person-centered, EMDR, solution-focused, narrative therapy). Ask students to identify appropriate interventions, treatment goals, and theoretical rationale. Include complex presentations with comorbidity and cultural considerations.",
    starterPrompts: ["Present a case for modality selection", "Give me a DBT skills application scenario", "Show me a complex case requiring integrated approaches"],
  },
  "ethics-scenario-drill": {
    toolId: "ethics-scenario-drill",
    name: "Ethics Scenario Drill",
    description: "Navigate ethical dilemmas in psychotherapy practice",
    systemPrompt: "You are a psychotherapy ethics educator. Present ethical dilemmas relevant to psychotherapy practice covering: informed consent, confidentiality and its limits, dual relationships, competence, duty to warn/protect, record keeping, social media boundaries, bartering, and termination. Include scenarios specific to Canadian CRPO standards and general ethical principles. Ask for ethical reasoning and appropriate actions.",
    starterPrompts: ["Present an ethical dilemma about confidentiality", "Give me a dual relationship scenario", "Show me a duty to report situation"],
  },
  "dsm5-diagnosis-sim": {
    toolId: "dsm5-diagnosis-sim",
    name: "DSM-5 Diagnosis Simulator",
    description: "Practice differential diagnosis using DSM-5 criteria and case vignettes",
    systemPrompt: "You are a clinical social work diagnostic educator (ASWB exam preparation). Present clinical case vignettes with presenting symptoms, history, and psychosocial factors. Ask students to formulate DSM-5 diagnoses, provide differential diagnoses, and justify their diagnostic reasoning. Cover mood disorders, anxiety disorders, personality disorders, trauma-related disorders, substance use disorders, and neurodevelopmental disorders.",
    starterPrompts: ["Present a case for DSM-5 diagnosis", "Give me a differential diagnosis challenge", "Show me a complex comorbidity case"],
  },
  "intervention-matching": {
    toolId: "intervention-matching",
    name: "Intervention Matching Engine",
    description: "Match evidence-based interventions to client presentations",
    systemPrompt: "You are a clinical social work intervention educator. Present client cases with specific presentations and ask students to select and justify evidence-based interventions. Cover CBT, motivational interviewing, trauma-focused CBT, EMDR, family systems interventions, crisis intervention, and case management. Include consideration of client strengths, barriers, cultural factors, and systemic issues in intervention planning.",
    starterPrompts: ["Present a client for intervention planning", "Give me a trauma case for treatment matching", "Show me a family systems case"],
  },
  "mi-practice-sim": {
    toolId: "mi-practice-sim",
    name: "Motivational Interviewing Simulator",
    description: "Practice MI techniques with AI-generated client responses",
    systemPrompt: "You are a motivational interviewing training facilitator for addiction counsellor preparation. Simulate a client in various stages of change (precontemplation through maintenance). Respond as the client would based on their stage of change. Help the counsellor practice OARS skills (Open questions, Affirmations, Reflections, Summaries), developing discrepancy, rolling with resistance, and supporting self-efficacy. Provide coaching feedback on MI adherence.",
    starterPrompts: ["Start a precontemplation MI session", "Practice rolling with resistance", "Simulate a client in contemplation stage"],
  },
  "substance-id-drill": {
    toolId: "substance-id-drill",
    name: "Substance Identification Drill",
    description: "Identify substances, mechanisms, and withdrawal patterns",
    systemPrompt: "You are an addiction pharmacology educator. Present scenarios requiring identification of substances based on signs/symptoms of intoxication and withdrawal. Cover alcohol, opioids, stimulants (cocaine, methamphetamine), benzodiazepines, cannabis, hallucinogens, inhalants, and synthetic drugs. Include mechanism of action, withdrawal timelines, medical management (including naloxone, flumazenil, CIWA/COWS protocols), and drug interaction risks.",
    starterPrompts: ["Present intoxication signs for me to identify the substance", "Give me a withdrawal case to manage", "Quiz me on pharmacological mechanisms"],
  },
};

export default function CareerAISimulator({ toolId }: { toolId: string }) {
  const { t } = useI18n();
  const { career, careerType } = useCareer();
  const { user, effectiveTier } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toolConfig = TOOL_CONFIGS[toolId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!toolConfig) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">{t("pages.careerTools.careerAiSimulator.toolNotFound")}</p>
              <Button className="mt-4" onClick={() => setLocation(career.routePrefix)}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const isLocked = !user || effectiveTier === "free";

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading || isLocked) return;

    const userMsg: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/career-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: toolConfig.systemPrompt,
          toolName: toolConfig.name,
          careerType,
          userId: user?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error processing your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={`${toolConfig.name} - ${career.shortName} | NurseNest`}
        description={toolConfig.description}
      />
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setLocation(career.routePrefix + "/dashboard")}
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: career.colorAccent }}
              >
                <Bot className="w-5 h-5" style={{ color: career.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-testid="text-tool-name">
                  {toolConfig.name}
                </h1>
                <p className="text-gray-600 text-sm" data-testid="text-tool-description">
                  {toolConfig.description}
                </p>
              </div>
            </div>
          </div>

          {isLocked ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.careerTools.careerAiSimulator.premiumFeature")}</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade your {career.shortName} plan to access AI-powered study tools.
                </p>
                <Button
                  onClick={() => setLocation(career.routePrefix + "/pricing")}
                  style={{ backgroundColor: career.color }}
                  data-testid="button-upgrade-plan"
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col" style={{ height: "calc(100vh - 300px)" }}>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-lg">{toolConfig.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">{t("pages.careerTools.careerAiSimulator.startAConversationOrChoose")}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {toolConfig.starterPrompts.map((prompt, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(prompt)}
                          data-testid={`button-starter-${i}`}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: career.colorAccent }}
                      >
                        <Bot className="w-4 h-4" style={{ color: career.color }} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                      data-testid={`message-${msg.role}-${i}`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: career.colorAccent }}
                    >
                      <Bot className="w-4 h-4" style={{ color: career.color }} />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="flex gap-2"
                >
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("pages.careerTools.careerAiSimulator.typeYourResponse")}
                    className="flex-1 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    data-testid="input-chat-message"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || loading}
                    style={{ backgroundColor: career.color }}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
