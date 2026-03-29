import { AlliedSEO } from "@/allied/allied-seo";
import { HubHero, ContentCard, FinalCTASection } from "./components";
import { Zap } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const SCENARIO_PREVIEWS = [
  { title: "Multi-Vehicle Highway MVC", description: "Respond to a high-speed multi-vehicle collision. Triage multiple patients, manage a tension pneumothorax, and coordinate air medical transport.", tags: ["Trauma", "MCI", "Advanced"], difficulty: "Advanced" },
  { title: "Chest Pain — STEMI in the Field", description: "Assess a 58-year-old male with crushing substernal chest pain. Interpret the 12-lead, activate the cath lab, and manage cardiogenic shock en route.", tags: ["Cardiac", "STEMI", "ACP"], difficulty: "Advanced" },
  { title: "Pediatric Febrile Seizure", description: "Manage an 18-month-old with active seizure activity. Assess airway, administer benzodiazepines, and communicate with anxious parents.", tags: ["Pediatric", "Medical"], difficulty: "Intermediate" },
  { title: "Anaphylaxis at a Restaurant", description: "A 32-year-old with known peanut allergy presents with stridor and hypotension after accidental exposure. Manage the airway and administer epinephrine.", tags: ["Medical", "Airway"], difficulty: "Intermediate" },
  { title: "Breech Delivery in the Field", description: "An imminent delivery with breech presentation. Manage the delivery, address complications, and provide neonatal resuscitation.", tags: ["OB", "Neonatal"], difficulty: "Advanced" },
  { title: "Overdose — Unknown Substance", description: "A 24-year-old found unresponsive in a park. Perform toxidrome assessment, manage the airway, and administer naloxone while considering poly-substance ingestion.", tags: ["Medical", "Toxicology"], difficulty: "Intermediate" },
  { title: "Fall From Height — Geriatric Trauma", description: "An 78-year-old who fell from a 12-foot ladder. Manage concurrent head injury and anticoagulant-complicated hemorrhage.", tags: ["Trauma", "Geriatric"], difficulty: "Advanced" },
  { title: "Cardiac Arrest — Refractory VF", description: "Manage a witnessed cardiac arrest with refractory VF. Execute high-quality CPR, drug therapy, and consider reversible causes.", tags: ["Cardiac", "ACLS"], difficulty: "Advanced" },
  { title: "Asthma Exacerbation — Status Asthmaticus", description: "A 16-year-old with severe respiratory distress unresponsive to home nebulizers. Escalate therapy and prepare for advanced airway intervention.", tags: ["Medical", "Airway"], difficulty: "Intermediate" },
];

export default function ParamedicScenariosHub() {
  const { t } = useI18n();
  return (
    <div data-testid="paramedic-scenarios-hub">
      <AlliedSEO
        title={t("allied.paramedicParamedicScenariosHub.paramedicClinicalScenariosDispatchtodisposi")}
        description={t("allied.paramedicParamedicScenariosHub.practiceWithUnfoldingParamedicClinical")}
        keywords="paramedic scenarios, EMS clinical scenarios, paramedic simulation, paramedic case studies, prehospital scenarios, dispatch to disposition"
        canonicalPath="/allied-health/paramedic/scenarios"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Paramedic Clinical Scenarios",
          "description": "Unfolding dispatch-to-disposition paramedic clinical scenarios with branching decisions and detailed clinical debriefs.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HubHero
        title={t("allied.paramedicParamedicScenariosHub.clinicalScenarios")}
        subtitle={t("allied.paramedic_scenarios_hub.unfoldingDispatchtodispositionScenariosT")}
        breadcrumbs={[
          { label: "Paramedic", href: "/allied-health/paramedic" },
          { label: "Scenarios" },
        ]}
      />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500">{SCENARIO_PREVIEWS.length} clinical scenarios available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIO_PREVIEWS.map(scenario => (
              <ContentCard
                key={scenario.title}
                title={scenario.title}
                description={scenario.description}
                meta={scenario.difficulty}
                tags={scenario.tags}
                href="/allied-health/paramedic/sims"
                icon={Zap}
                badge={scenario.difficulty}
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("allied.paramedicParamedicScenariosHub.buildClinicalJudgmentThroughSimulation")}
        subtitle={t("allied.paramedic_scenarios_hub.scenariosBuildTheDecisionmakingSkills")}
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
