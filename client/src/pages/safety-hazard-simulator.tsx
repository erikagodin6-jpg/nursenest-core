import { getAssetUrl } from "@/lib/asset-url";
import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  type CountryMode,
  type UnitMode,
  getDefaultUnitMode,
  convertTemp,
  convertWeight,
} from "@/lib/unit-conversion";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Eye,
  Bed,
  Pill,
  Scissors,
  Baby,
  DoorOpen,
  Siren,
  Heart,
  Brain,
  MousePointerClick,
  Crosshair,
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const imgMedSurg = getAssetUrl("safety-medsurg-room.png");
const imgMedPrep = getAssetUrl("safety-med-prep-area.png");
const imgPostOp = getAssetUrl("safety-post-op-room.png");
const imgPeds = getAssetUrl("safety-peds-room.png");
const imgIsolation = getAssetUrl("safety-isolation-room.png");
const imgED = getAssetUrl("safety-ed-bay.png");
const imgLaborDelivery = getAssetUrl("safety-labor-delivery.png");
const imgICU = getAssetUrl("safety-icu-room.png");
const imgORSuite = getAssetUrl("safety-or-suite.png");
const imgLTC = getAssetUrl("safety-ltc-room.png");
const imgPsychUnit = getAssetUrl("safety-psych-unit.png");
const imgHotspotRoom = getAssetUrl("safety-hotspot-room.png");


const scenarioImages: Record<string, string> = {
  "med-surg": imgMedSurg,
  "med-prep": imgMedPrep,
  "post-op": imgPostOp,
  peds: imgPeds,
  isolation: imgIsolation,
  ed: imgED,
  "labor-delivery": imgLaborDelivery,
  icu: imgICU,
  "or-suite": imgORSuite,
  ltc: imgLTC,
  "psych-unit": imgPsychUnit,
};

const scenarioImageAlt: Record<string, string> = {
  "med-surg": "Hospital medical surgical patient room with bed, IV pole, oxygen equipment and bedside table",
  "med-prep": "Hospital medication preparation area with Pyxis machine, medication vials and computer workstation",
  "post-op": "Post-operative recovery room with PCA pump, compression devices and surgical wound care equipment",
  peds: "Pediatric hospital room with crib, cardiac monitor, toys and child-appropriate medical equipment",
  isolation: "Hospital isolation room entrance with PPE cart, biohazard waste bin and infection control supplies",
  ed: "Emergency department bay with crash cart, cardiac monitor, IV pumps and stretcher",
  "labor-delivery": "Labor and delivery room with fetal heart monitor, infant warmer and birthing bed",
  icu: "Intensive care unit room with ventilator, multiple IV pumps, arterial line and cardiac monitors",
  "or-suite": "Operating room suite entrance with scrub station, sterile supply storage and surgical instruments",
  ltc: "Long-term care facility room with adjustable bed, wheelchair, walker and grab bars",
  "psych-unit": "Psychiatric unit dayroom with observation station, seating area and safety considerations",
};

type HazardItem = {
  id: string;
  label: string;
  isHazard: boolean;
  category: "fall" | "oxygen" | "iv" | "infection" | "medication" | "equipment";
  riskExplanation: string;
  potentialHarm: string;
  nursingAction: string;
};

type Scenario = {
  id: string;
  title: string;
  icon: any;
  description: string;
  items: HazardItem[];
};

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  fall: { bg: "bg-amber-50", text: "text-amber-700", label: "Fall Risk" },
  oxygen: { bg: "bg-sky-50", text: "text-sky-700", label: "Oxygen Error" },
  iv: { bg: "bg-violet-50", text: "text-violet-700", label: "IV Complication" },
  infection: { bg: "bg-rose-50", text: "text-rose-700", label: "Infection Breach" },
  medication: { bg: "bg-orange-50", text: "text-orange-700", label: "Medication Danger" },
  equipment: { bg: "bg-teal-50", text: "text-teal-700", label: "Equipment Issue" },
};

const scenarios: Scenario[] = [
  {
    id: "med-surg",
    title: "Medical-Surgical Room",
    icon: Bed,
    description:
      "You enter Room 312 to assess a 72-year-old patient admitted for pneumonia. The bed is in the highest position with only one side rail raised. A meal tray sits on the overbed table pushed to the far side. The call bell has fallen behind the headboard. Oxygen tubing runs across the floor from the wall outlet to the patient's nasal cannula. A pair of non-skid slippers sit neatly beside the bed. The IV pole is positioned on the left side with fluids infusing. Scattered on the floor near the bathroom are several damp towels. The patient's glasses are on the bedside table within reach.",
    items: [
      {
        id: "ms-bed-height",
        label: "Bed in highest position",
        isHazard: true,
        category: "fall",
        riskExplanation: "An elevated bed increases the distance and impact if the patient attempts to get out of bed unassisted.",
        potentialHarm: "Hip fracture, head injury, or other trauma from a fall.",
        nursingAction: "Lower the bed to the lowest position and ensure the wheels are locked.",
      },
      {
        id: "ms-call-bell",
        label: "Call bell behind headboard",
        isHazard: true,
        category: "equipment",
        riskExplanation: "The patient cannot reach the call bell to summon help, leading to unassisted ambulation or unmet needs.",
        potentialHarm: "Falls, delayed response to pain or respiratory distress.",
        nursingAction: "Retrieve the call bell and secure it within the patient's reach; verify it is functioning.",
      },
      {
        id: "ms-floor-clutter",
        label: "Damp towels on the bathroom floor",
        isHazard: true,
        category: "fall",
        riskExplanation: "Wet or cluttered floors create a slip-and-fall hazard for both the patient and staff.",
        potentialHarm: "Slip-related fractures, contusions, or head injuries.",
        nursingAction: "Remove the towels immediately, dry the floor, and place a wet-floor sign if needed.",
      },
      {
        id: "ms-side-rails",
        label: "Only one side rail raised",
        isHazard: true,
        category: "fall",
        riskExplanation: "For a 72-year-old pneumonia patient, inadequate side rails increase fall risk during position changes or confusion.",
        potentialHarm: "Patient may roll out of bed, sustaining fractures or soft-tissue injury.",
        nursingAction: "Raise appropriate side rails per facility policy; assess whether the patient is at risk for entrapment.",
      },
      {
        id: "ms-o2-tubing",
        label: "Oxygen tubing across the floor",
        isHazard: true,
        category: "oxygen",
        riskExplanation: "Tubing on the floor is a tripping hazard and may disconnect, interrupting oxygen delivery.",
        potentialHarm: "Falls from tripping; hypoxia from disconnected oxygen supply.",
        nursingAction: "Route the tubing along the wall or bed frame, securing it with clips to prevent tripping.",
      },
      {
        id: "ms-slippers",
        label: "Non-skid slippers beside the bed",
        isHazard: false,
        category: "fall",
        riskExplanation: "Non-skid slippers are a safety measure, not a hazard.",
        potentialHarm: "N/A  -  this is a correct safety practice.",
        nursingAction: "No action needed; ensure the patient wears them when ambulating.",
      },
      {
        id: "ms-iv-pole",
        label: "IV pole on left side with fluids infusing",
        isHazard: false,
        category: "iv",
        riskExplanation: "A properly positioned IV pole with infusing fluids is standard care.",
        potentialHarm: "N/A  -  this is routine and appropriate.",
        nursingAction: "Continue to monitor the IV site and infusion rate per protocol.",
      },
      {
        id: "ms-glasses",
        label: "Glasses within reach on bedside table",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Having corrective lenses accessible helps the patient see and navigate safely.",
        potentialHarm: "N/A  -  this supports patient safety.",
        nursingAction: "No action needed; this is a best practice for fall prevention.",
      },
    ],
  },
  {
    id: "med-prep",
    title: "Medication Preparation Area",
    icon: Pill,
    description:
      "You arrive at the medication preparation room to administer 0800 medications. On the counter you notice a pre-drawn syringe labeled 'Mr. Thompson, Room 210' but your patient is Mrs. Garcia in Room 215. A bottle of Metoprolol 25 mg sits next to Metformin 500 mg  -  both in similar white packaging. One vial of Heparin has an expiration date of last month. The Pyxis machine is logged in under another nurse's credentials. The medication administration record (MAR) is open on the computer. Your patient's allergy bracelet is missing from the med drawer paperwork. A sharps container on the wall is three-quarters full.",
    items: [
      {
        id: "mp-wrong-label",
        label: "Pre-drawn syringe labeled for wrong patient",
        isHazard: true,
        category: "medication",
        riskExplanation: "Administering a medication prepared for another patient violates the 'right patient' check and can cause a medication error.",
        potentialHarm: "Allergic reaction, adverse drug interaction, or wrong-dose administration.",
        nursingAction: "Do NOT administer. Return the syringe to the preparing nurse; verify all rights of medication administration.",
      },
      {
        id: "mp-expired",
        label: "Heparin vial expired last month",
        isHazard: true,
        category: "medication",
        riskExplanation: "Expired medications may have reduced potency or altered chemical properties.",
        potentialHarm: "Subtherapeutic anticoagulation or unpredictable drug effects.",
        nursingAction: "Remove the expired vial from stock, label it for pharmacy return, and obtain a non-expired replacement.",
      },
      {
        id: "mp-lookalike",
        label: "Metoprolol and Metformin in similar packaging",
        isHazard: true,
        category: "medication",
        riskExplanation: "Look-alike/sound-alike (LASA) medications in similar packaging dramatically increase mix-up risk.",
        potentialHarm: "Administering a beta-blocker instead of an antidiabetic (or vice versa) can cause hypotension, bradycardia, or uncontrolled blood glucose.",
        nursingAction: "Separate the medications; use tall-man lettering labels. Report to pharmacy for storage review.",
      },
      {
        id: "mp-allergy",
        label: "Patient's allergy bracelet info missing from drawer",
        isHazard: true,
        category: "medication",
        riskExplanation: "Without allergy documentation at the point of preparation, an allergen could be administered unknowingly.",
        potentialHarm: "Anaphylaxis or serious allergic reaction.",
        nursingAction: "Verify allergies in the MAR and with the patient before administration; ensure allergy band is on the patient.",
      },
      {
        id: "mp-pyxis",
        label: "Pyxis logged in under another nurse's credentials",
        isHazard: true,
        category: "medication",
        riskExplanation: "Using another provider's login violates chain-of-custody, creates accountability gaps, and is a medication diversion risk.",
        potentialHarm: "Medication errors attributed to the wrong nurse; potential for undetected diversion.",
        nursingAction: "Log out immediately and log in under your own credentials before withdrawing any medications.",
      },
      {
        id: "mp-mar",
        label: "MAR open on the computer",
        isHazard: false,
        category: "medication",
        riskExplanation: "Having the MAR open during medication preparation is standard workflow for verification.",
        potentialHarm: "N/A  -  this is expected practice for checking the five rights.",
        nursingAction: "Continue to use the MAR for verification of right drug, dose, time, route, and patient.",
      },
      {
        id: "mp-sharps",
        label: "Sharps container three-quarters full",
        isHazard: false,
        category: "infection",
        riskExplanation: "A sharps container should be replaced when it reaches the fill line (typically three-quarters). Being at capacity is the threshold, not yet over it.",
        potentialHarm: "N/A  -  it is at the recommended change point but not overfilled.",
        nursingAction: "Plan to replace the sharps container soon; it is approaching but has not exceeded the fill line.",
      },
    ],
  },
  {
    id: "post-op",
    title: "Post-Operative Recovery",
    icon: Scissors,
    description:
      "You are caring for a 58-year-old patient 12 hours after a total knee replacement. The patient is lying flat in bed and has not been repositioned in 4 hours. Sequential compression devices (SCDs) are ordered but are sitting unplugged on the chair beside the bed. An incentive spirometer is on the windowsill across the room, out of reach. The patient rates pain at 8/10 but the last PRN analgesic was given 6 hours ago. The surgical dressing has a quarter-sized area of dark drainage that was not documented on the last assessment. The patient's antiembolism stockings are properly applied. The PCA pump is functioning with the correct settings displayed. A urinary catheter is draining clear yellow urine.",
    items: [
      {
        id: "po-dvt",
        label: "SCDs unplugged and not on the patient",
        isHazard: true,
        category: "equipment",
        riskExplanation: "After joint replacement, the patient is at very high risk for deep vein thrombosis (DVT). SCDs are ordered for a reason.",
        potentialHarm: "DVT formation that can lead to pulmonary embolism (PE), a life-threatening emergency.",
        nursingAction: "Apply the SCDs to the patient immediately and plug them in; document the intervention.",
      },
      {
        id: "po-spirometer",
        label: "Incentive spirometer out of reach",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Post-operative patients need the incentive spirometer within reach to perform hourly breathing exercises and prevent atelectasis.",
        potentialHarm: "Atelectasis, pneumonia, and prolonged hospital stay.",
        nursingAction: "Place the spirometer on the overbed table within arm's reach and educate the patient on its use every 1-2 hours.",
      },
      {
        id: "po-pain",
        label: "Pain 8/10 with last analgesic 6 hours ago",
        isHazard: true,
        category: "medication",
        riskExplanation: "Uncontrolled pain impairs mobility, deep breathing, and recovery. The patient is due for reassessment and medication.",
        potentialHarm: "Immobility leading to DVT, atelectasis, and delayed healing; patient suffering.",
        nursingAction: "Administer PRN analgesic as ordered, reassess pain within 30 minutes, and consider around-the-clock pain management.",
      },
      {
        id: "po-wound",
        label: "Undocumented dark drainage on surgical dressing",
        isHazard: true,
        category: "infection",
        riskExplanation: "New or changing wound drainage that goes undocumented may indicate bleeding, infection, or wound dehiscence.",
        potentialHarm: "Undetected hemorrhage or surgical site infection.",
        nursingAction: "Circle and date the drainage, assess the wound, notify the surgeon, and document findings.",
      },
      {
        id: "po-reposition",
        label: "Patient not repositioned in 4 hours",
        isHazard: true,
        category: "fall",
        riskExplanation: "Prolonged immobility increases pressure injury risk, especially in post-surgical patients.",
        potentialHarm: "Pressure ulcers (hospital-acquired pressure injuries), skin breakdown.",
        nursingAction: "Reposition the patient immediately and implement a turning schedule every 2 hours.",
      },
      {
        id: "po-stockings",
        label: "Antiembolism stockings properly applied",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Properly applied compression stockings support venous return and DVT prevention.",
        potentialHarm: "N/A  -  this is correct preventive care.",
        nursingAction: "Continue to assess skin integrity under the stockings and remove per protocol for skin checks.",
      },
      {
        id: "po-pca",
        label: "PCA pump functioning with correct settings",
        isHazard: false,
        category: "medication",
        riskExplanation: "A properly programmed and functioning PCA pump is standard post-operative pain management.",
        potentialHarm: "N/A  -  correct operation confirmed.",
        nursingAction: "Continue to monitor respiratory rate and sedation level per PCA protocol.",
      },
      {
        id: "po-catheter",
        label: "Urinary catheter draining clear yellow urine",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Clear yellow urine with an intact drainage system indicates normal renal function post-operatively.",
        potentialHarm: "N/A  -  this is an expected finding.",
        nursingAction: "Monitor intake and output; assess for catheter removal eligibility per protocol.",
      },
    ],
  },
  {
    id: "peds",
    title: "Pediatric Room",
    icon: Baby,
    description:
      "You enter the room of a 2-year-old admitted for bronchiolitis. The crib side rail is lowered to the halfway position. Several small toy parts (marble-sized beads from a broken toy) are scattered on the crib mattress. The child's identification band is missing from the wrist. A parent is holding the child and feeding them grapes that have not been cut. The room's hand sanitizer dispenser is mounted at child-reaching height near the crib. A cardiac monitor is displaying the child's vitals accurately. The suction equipment on the wall is assembled and ready for use.",
    items: [
      {
        id: "pd-choking",
        label: "Small toy parts (marble-sized beads) in the crib",
        isHazard: true,
        category: "fall",
        riskExplanation: "Objects smaller than a toilet paper roll diameter are choking hazards for children under 3 years.",
        potentialHarm: "Airway obstruction, asphyxiation, and potential death.",
        nursingAction: "Remove all small objects from the crib immediately; educate the family on choking hazards.",
      },
      {
        id: "pd-crib-rail",
        label: "Crib side rail at halfway position",
        isHazard: true,
        category: "fall",
        riskExplanation: "A partially lowered crib rail allows a toddler to climb and fall. Rails must be fully up or fully down with a caregiver present.",
        potentialHarm: "Fall from crib causing head injury, fractures, or concussion.",
        nursingAction: "Raise the crib rail to the fully locked upright position whenever the child is unattended in the crib.",
      },
      {
        id: "pd-id-band",
        label: "Identification band missing from child's wrist",
        isHazard: true,
        category: "medication",
        riskExplanation: "Without an ID band, there is no reliable method to verify the patient's identity before medications, procedures, or lab draws.",
        potentialHarm: "Wrong-patient medication administration or procedure errors.",
        nursingAction: "Apply a new identification band immediately; verify identity with two identifiers per policy.",
      },
      {
        id: "pd-grapes",
        label: "Whole grapes being fed to a 2-year-old",
        isHazard: true,
        category: "fall",
        riskExplanation: "Whole grapes are a leading choking hazard in toddlers due to their size and smooth shape that can seal the airway.",
        potentialHarm: "Complete airway obstruction, anoxic brain injury, or death.",
        nursingAction: "Instruct the parent to cut grapes lengthwise into quarters; provide choking prevention education.",
      },
      {
        id: "pd-sanitizer",
        label: "Hand sanitizer within child's reach",
        isHazard: true,
        category: "medication",
        riskExplanation: "Alcohol-based hand sanitizer is toxic if ingested by a young child and can cause hypoglycemia and CNS depression.",
        potentialHarm: "Alcohol poisoning, seizures, respiratory depression.",
        nursingAction: "Relocate the sanitizer dispenser out of the child's reach or use a locked wall-mount dispenser.",
      },
      {
        id: "pd-monitor",
        label: "Cardiac monitor displaying vitals accurately",
        isHazard: false,
        category: "equipment",
        riskExplanation: "A functioning cardiac monitor providing accurate readings is standard monitoring for bronchiolitis.",
        potentialHarm: "N/A  -  this is appropriate and expected.",
        nursingAction: "Continue to monitor and respond to any alarm changes.",
      },
      {
        id: "pd-suction",
        label: "Suction equipment assembled and ready",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Having suction readily available is essential for a child with bronchiolitis who may need airway clearance.",
        potentialHarm: "N/A  -  this is correct emergency preparedness.",
        nursingAction: "Verify suction is functioning and an appropriate-size catheter is available.",
      },
    ],
  },
  {
    id: "isolation",
    title: "Isolation Room",
    icon: DoorOpen,
    description:
      "You are assigned to a patient on contact and droplet precautions for suspected influenza. Outside the room, you observe a visitor entering without any PPE. The isolation cart has gloves and gowns but no surgical masks. Inside the room, the door is propped open with a linen cart. The biohazard waste bin lid is open and overflowing. A dedicated stethoscope and thermometer are hanging on the wall hook inside the room. Hand sanitizer dispensers are mounted at the room entrance and exit. A tray of used meal dishes is sitting outside the door in the hallway on a clean linen cart.",
    items: [
      {
        id: "iso-ppe",
        label: "Visitor entering without PPE",
        isHazard: true,
        category: "infection",
        riskExplanation: "Contact and droplet precautions require gown, gloves, and mask for all persons entering the room.",
        potentialHarm: "Transmission of influenza to the visitor and subsequently to other patients and the community.",
        nursingAction: "Stop the visitor, provide education on PPE requirements, and assist with proper donning before entry.",
      },
      {
        id: "iso-masks",
        label: "No surgical masks on the isolation cart",
        isHazard: true,
        category: "infection",
        riskExplanation: "Droplet precautions require a surgical mask. Without masks available, staff and visitors may enter unprotected.",
        potentialHarm: "Droplet transmission of influenza to healthcare workers and visitors.",
        nursingAction: "Restock surgical masks on the isolation cart immediately and verify all PPE supplies are adequate.",
      },
      {
        id: "iso-door",
        label: "Room door propped open with a linen cart",
        isHazard: true,
        category: "infection",
        riskExplanation: "An open door in a droplet isolation room allows respiratory droplets to escape into the hallway.",
        potentialHarm: "Spread of infectious droplets to other patients, staff, and visitors in the corridor.",
        nursingAction: "Close the door immediately, remove the obstruction, and remind staff of isolation door protocols.",
      },
      {
        id: "iso-waste",
        label: "Biohazard waste bin open and overflowing",
        isHazard: true,
        category: "infection",
        riskExplanation: "An overflowing biohazard bin exposes staff to contaminated materials and prevents proper waste disposal.",
        potentialHarm: "Needlestick injuries, contact with infectious waste, environmental contamination.",
        nursingAction: "Replace the biohazard bag immediately following facility waste management protocols; request environmental services.",
      },
      {
        id: "iso-meal-tray",
        label: "Used meal tray on a clean linen cart in the hallway",
        isHazard: true,
        category: "infection",
        riskExplanation: "Placing contaminated items from an isolation room on a clean linen cart cross-contaminates clean supplies.",
        potentialHarm: "Transmission of pathogens to other patients via contaminated linens.",
        nursingAction: "Remove the tray, disinfect the cart surface, and use a dedicated transport method for isolation room items.",
      },
      {
        id: "iso-dedicated",
        label: "Dedicated stethoscope and thermometer in the room",
        isHazard: false,
        category: "infection",
        riskExplanation: "Dedicated equipment prevents cross-contamination between isolation and non-isolation patients.",
        potentialHarm: "N/A  -  this is a correct isolation practice.",
        nursingAction: "Continue using dedicated equipment; clean per protocol between uses.",
      },
      {
        id: "iso-hand-sanitizer",
        label: "Hand sanitizer at room entrance and exit",
        isHazard: false,
        category: "infection",
        riskExplanation: "Hand hygiene stations at entry and exit points support infection prevention protocols.",
        potentialHarm: "N/A  -  this is best practice for hand hygiene compliance.",
        nursingAction: "Ensure dispensers are full and functional; perform hand hygiene on entry and exit.",
      },
    ],
  },
  {
    id: "ed",
    title: "Emergency Department",
    icon: Siren,
    description:
      "You are working in a busy ED bay. A critically ill patient is on a stretcher with IV fluids running. The crash cart is blocked by two wheelchairs and a supply cart, making it inaccessible. The airway management tray on top of the crash cart is missing the laryngoscope blade. An IV pump displays a rate of 250 mL/hr, but the order reads 125 mL/hr. The cardiac monitor is alarming for a heart rate of 48 bpm but no one has acknowledged it. The patient's oxygen saturation probe is properly placed and reading 97%. The bed rails are up and the stretcher is in the lowest position.",
    items: [
      {
        id: "ed-crash-cart",
        label: "Crash cart blocked by wheelchairs and supply cart",
        isHazard: true,
        category: "equipment",
        riskExplanation: "An inaccessible crash cart delays response time during cardiac arrest or acute deterioration.",
        potentialHarm: "Delayed defibrillation, medication administration, or airway management  -  increasing mortality risk.",
        nursingAction: "Clear the path to the crash cart immediately; ensure it is always accessible within seconds.",
      },
      {
        id: "ed-airway",
        label: "Laryngoscope blade missing from airway tray",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Incomplete airway equipment means intubation cannot be performed in an emergency.",
        potentialHarm: "Inability to secure a patent airway, leading to hypoxia, brain injury, or death.",
        nursingAction: "Replace the missing blade immediately; perform a full crash cart and airway equipment check per policy.",
      },
      {
        id: "ed-iv-rate",
        label: "IV pump at 250 mL/hr (order says 125 mL/hr)",
        isHazard: true,
        category: "iv",
        riskExplanation: "An infusion rate double the ordered amount constitutes a medication/fluid administration error.",
        potentialHarm: "Fluid overload, pulmonary edema, electrolyte imbalance, or heart failure exacerbation.",
        nursingAction: "Correct the IV pump rate to 125 mL/hr immediately, assess the patient for fluid overload, and file an incident report.",
      },
      {
        id: "ed-monitor-alarm",
        label: "Cardiac monitor alarming (HR 48)  -  unacknowledged",
        isHazard: true,
        category: "equipment",
        riskExplanation: "A heart rate of 48 bpm indicates symptomatic bradycardia requiring immediate assessment.",
        potentialHarm: "Hemodynamic instability, syncope, cardiac arrest if not addressed.",
        nursingAction: "Assess the patient immediately, check for symptoms (dizziness, hypotension), and prepare for atropine administration per ACLS protocol.",
      },
      {
        id: "ed-spo2",
        label: "SpO₂ probe properly placed, reading 97%",
        isHazard: false,
        category: "oxygen",
        riskExplanation: "A properly placed pulse oximeter reading 97% indicates adequate oxygenation.",
        potentialHarm: "N/A  -  this is an expected, reassuring finding.",
        nursingAction: "Continue monitoring; ensure alarms are set to appropriate thresholds.",
      },
      {
        id: "ed-bed-position",
        label: "Bed rails up, stretcher in lowest position",
        isHazard: false,
        category: "fall",
        riskExplanation: "This is correct fall prevention positioning for an ED patient.",
        potentialHarm: "N/A  -  this represents proper safety measures.",
        nursingAction: "No action needed; continue to reassess fall risk with any change in patient condition.",
      },
    ],
  },
  {
    id: "labor-delivery",
    title: "Labor & Delivery Room",
    icon: Heart,
    description:
      "You are caring for a 28-year-old patient at 38 weeks gestation in active labor. The fetal heart rate monitor shows a baseline of 145 bpm with moderate variability. The bed side rails are both down and the bed is in the highest position. Oxytocin is infusing via an IV pump but the pump is not connected to the mainline  -  it is running through a separate peripheral IV without a backflow valve. A basin of warm water and towels is at the bedside for comfort measures. The infant warmer across the room is turned off and unchecked. Magnesium sulfate is hanging on the IV pole but there is no calcium gluconate at the bedside. The patient's allergy band lists penicillin but Ampicillin is listed on the medication administration record. Emergency delivery instruments (vacuum, forceps) are sealed in a sterile tray on the supply cart. The Ambu bag and neonatal resuscitation supplies are visible and organized on the warmer shelf.",
    items: [
      {
        id: "ld-bed-position",
        label: "Bed in highest position with both side rails down",
        isHazard: true,
        category: "fall",
        riskExplanation: "A laboring patient may become lightheaded, diaphoretic, or experience sudden positional hypotension. An elevated bed with no rails increases fall risk.",
        potentialHarm: "Fall resulting in maternal injury or placental abruption from abdominal trauma.",
        nursingAction: "Lower the bed to a safe height and raise at least one side rail; ensure the call bell is within reach.",
      },
      {
        id: "ld-oxytocin-line",
        label: "Oxytocin infusing without backflow valve on a separate IV",
        isHazard: true,
        category: "iv",
        riskExplanation: "Oxytocin must be piggybacked into the mainline closest to the insertion site with a backflow prevention valve so it can be stopped immediately without bolusing.",
        potentialHarm: "Uterine hyperstimulation (tachysystole), fetal distress, uterine rupture, or uncontrolled oxytocin bolus.",
        nursingAction: "Stop the infusion, reconnect oxytocin to the mainline via a Y-site with a backflow valve, and resume per protocol.",
      },
      {
        id: "ld-warmer-off",
        label: "Infant warmer turned off and unchecked",
        isHazard: true,
        category: "equipment",
        riskExplanation: "The infant warmer must be pre-warmed and checked before delivery to prevent neonatal hypothermia.",
        potentialHarm: "Neonatal hypothermia leading to hypoglycemia, respiratory distress, and metabolic acidosis.",
        nursingAction: "Turn on and pre-warm the infant warmer immediately; verify all resuscitation supplies and settings.",
      },
      {
        id: "ld-mag-no-calcium",
        label: "Magnesium sulfate hanging with no calcium gluconate at bedside",
        isHazard: true,
        category: "medication",
        riskExplanation: "Calcium gluconate is the antidote for magnesium sulfate toxicity and must be immediately available whenever magnesium is infusing.",
        potentialHarm: "Unrecoverable magnesium toxicity causing respiratory arrest, cardiac arrest, or death.",
        nursingAction: "Obtain calcium gluconate 1 g IV and place it at the bedside; verify deep tendon reflexes, respiratory rate, and urine output per protocol.",
      },
      {
        id: "ld-allergy-conflict",
        label: "Penicillin allergy but Ampicillin ordered on MAR",
        isHazard: true,
        category: "medication",
        riskExplanation: "Ampicillin is a penicillin-class antibiotic. Administering it to a patient with a documented penicillin allergy risks a severe allergic or anaphylactic reaction.",
        potentialHarm: "Anaphylaxis, bronchospasm, angioedema, or death.",
        nursingAction: "Hold the Ampicillin, notify the provider immediately, clarify allergy severity and cross-reactivity, and request an alternative antibiotic.",
      },
      {
        id: "ld-fhr-monitor",
        label: "Fetal heart rate 145 bpm with moderate variability",
        isHazard: false,
        category: "equipment",
        riskExplanation: "A fetal heart rate of 145 bpm with moderate variability is a Category I (reassuring) tracing indicating fetal well-being.",
        potentialHarm: "N/A  -  this is a normal, reassuring finding.",
        nursingAction: "Continue routine fetal monitoring per labor protocol.",
      },
      {
        id: "ld-comfort-basin",
        label: "Warm water basin and towels at bedside for comfort",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Hydrotherapy and warm compresses are evidence-based non-pharmacologic comfort measures during labor.",
        potentialHarm: "N/A  -  this supports patient comfort and coping.",
        nursingAction: "Continue offering comfort measures and document their use.",
      },
      {
        id: "ld-sterile-instruments",
        label: "Emergency delivery instruments sealed in sterile tray",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Having sealed sterile delivery instruments readily available is standard preparedness for labor and delivery.",
        potentialHarm: "N/A  -  this is correct emergency preparedness.",
        nursingAction: "Verify the tray is intact and not expired; keep accessible for the provider.",
      },
      {
        id: "ld-resuscitation",
        label: "Neonatal Ambu bag and resuscitation supplies organized on warmer",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Neonatal resuscitation equipment must be present and organized at every delivery.",
        potentialHarm: "N/A  -  this is required standard of care.",
        nursingAction: "Verify equipment function and appropriate sizing before delivery.",
      },
    ],
  },
  {
    id: "icu",
    title: "Intensive Care Unit",
    icon: Heart,
    description:
      "You are assuming care of a 64-year-old patient in the ICU who is intubated and mechanically ventilated following a CABG surgery. The ventilator alarm is silenced and the 'alarm silence' indicator is illuminated. The arterial line waveform on the monitor is dampened and reading 78/42 mmHg but no one has recalibrated or flushed the line. Multiple IV infusions are running: norepinephrine, propofol, and normal saline  -  but none of the lines are labeled. The head of the bed is flat at 0 degrees. The endotracheal tube is secured at 24 cm at the lip with tape. A sequential compression device is properly applied and functioning on both legs. The Foley catheter bag is secured below the level of the bladder and draining amber urine. The patient's wrist restraints are applied with two-finger slack and a quick-release knot.",
    items: [
      {
        id: "icu-alarm-silenced",
        label: "Ventilator alarm silenced",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Silencing ventilator alarms eliminates the primary safety alert for disconnection, apnea, high pressures, or low tidal volumes.",
        potentialHarm: "Undetected ventilator disconnection, hypoxia, respiratory arrest, and death.",
        nursingAction: "Re-enable all ventilator alarms immediately; adjust alarm parameters rather than silencing.",
      },
      {
        id: "icu-art-line",
        label: "Arterial line dampened waveform with low reading (78/42)",
        isHazard: true,
        category: "equipment",
        riskExplanation: "A dampened arterial line waveform produces inaccurate readings that may mask true hemodynamic status, especially critical in a patient on vasopressors.",
        potentialHarm: "Missed hypotension or hypertension, inappropriate vasopressor titration, end-organ damage.",
        nursingAction: "Perform a fast-flush test, check for air bubbles or clots, recalibrate the transducer to phlebostatic axis, and correlate with a cuff pressure.",
      },
      {
        id: "icu-unlabeled-lines",
        label: "Multiple IV lines running without labels",
        isHazard: true,
        category: "iv",
        riskExplanation: "Unlabeled IV lines make it impossible to identify which medication is infusing through which line, risking bolus errors or accidental disconnection of critical drips.",
        potentialHarm: "Accidental norepinephrine bolus causing hypertensive crisis, accidental propofol bolus causing respiratory arrest, or inadvertent discontinuation of vasopressors.",
        nursingAction: "Immediately label all IV lines from the bag to the insertion site per facility policy; trace each line to verify correct connections.",
      },
      {
        id: "icu-hob-flat",
        label: "Head of bed flat at 0 degrees",
        isHazard: true,
        category: "infection",
        riskExplanation: "For intubated patients, the head of bed must be elevated 30-45 degrees to prevent ventilator-associated pneumonia (VAP) and reduce aspiration risk.",
        potentialHarm: "Ventilator-associated pneumonia, aspiration, increased ICU length of stay, and mortality.",
        nursingAction: "Elevate the head of bed to 30-45 degrees immediately unless contraindicated; document compliance with the VAP prevention bundle.",
      },
      {
        id: "icu-ett-depth",
        label: "ET tube secured at 24 cm at the lip",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Standard ET tube depth at the lip for an adult male is typically 21-23 cm. At 24 cm, the tube may be in the right mainstem bronchus, causing one-lung ventilation.",
        potentialHarm: "Right mainstem intubation causing left lung atelectasis, hypoxia, and ventilation-perfusion mismatch.",
        nursingAction: "Auscultate bilateral breath sounds, obtain a chest X-ray to verify tube placement, and notify the provider for repositioning if needed.",
      },
      {
        id: "icu-scd",
        label: "Sequential compression devices applied and functioning bilaterally",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Properly applied SCDs are standard DVT prophylaxis for post-surgical ICU patients.",
        potentialHarm: "N/A  -  this is correct post-operative care.",
        nursingAction: "Continue use; assess skin integrity and pedal pulses regularly.",
      },
      {
        id: "icu-foley",
        label: "Foley catheter bag below bladder level, draining amber urine",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Proper catheter bag positioning below bladder level prevents urine reflux and reduces infection risk.",
        potentialHarm: "N/A  -  this is correct catheter management.",
        nursingAction: "Continue to monitor output hourly; assess for catheter removal eligibility daily.",
      },
      {
        id: "icu-restraints",
        label: "Wrist restraints with two-finger slack and quick-release knot",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Properly applied restraints with appropriate slack and quick-release knots meet safety standards for preventing self-extubation while allowing circulation.",
        potentialHarm: "N/A  -  this is correct restraint application per policy.",
        nursingAction: "Continue to assess circulation, sensation, and movement every 2 hours; document restraint assessments per protocol.",
      },
    ],
  },
  {
    id: "or-suite",
    title: "Operating Room Suite",
    icon: Scissors,
    description:
      "You are the circulating nurse for an elective laparoscopic cholecystectomy. The patient is on the OR table and anesthesia has been induced. The surgical safety checklist (time-out) was not performed before the incision. The electrosurgical unit (Bovie) dispersive pad is placed on the patient's left thigh over a bony prominence. The surgical count board shows 10 sponges opened but only 9 are accounted for on the board. A bottle of skin prep solution is sitting on the sterile back table alongside the surgical instruments. The patient has a properly placed grounding pad for the warming blanket. The anesthesia team has confirmed the patient's identity, allergies, and NPO status. Sterile drapes are properly positioned with no breaks in the sterile field. The fire extinguisher is mounted on the wall and clearly accessible.",
    items: [
      {
        id: "or-timeout",
        label: "Surgical safety time-out not performed before incision",
        isHazard: true,
        category: "equipment",
        riskExplanation: "The WHO Surgical Safety Checklist time-out is a critical patient safety step to verify correct patient, procedure, site, and surgical team agreement before any incision.",
        potentialHarm: "Wrong-site surgery, wrong-patient procedure, or wrong procedure entirely  -  all classified as never events.",
        nursingAction: "Immediately halt the procedure and initiate the surgical time-out with all team members before any incision is made.",
      },
      {
        id: "or-bovie-pad",
        label: "Electrosurgical dispersive pad placed over bony prominence",
        isHazard: true,
        category: "equipment",
        riskExplanation: "The dispersive (grounding) pad must be placed on a large, well-vascularized muscle mass. Bony prominences have poor blood flow and concentrate electrical current.",
        potentialHarm: "Thermal burn at the pad site, tissue necrosis, and electrical injury.",
        nursingAction: "Reposition the dispersive pad to a large muscle mass (e.g., anterior thigh or upper arm) with full skin contact and no bony prominences.",
      },
      {
        id: "or-sponge-count",
        label: "Surgical count discrepancy: 10 opened, 9 accounted for",
        isHazard: true,
        category: "equipment",
        riskExplanation: "A sponge count discrepancy suggests a retained surgical sponge, which is a serious never event requiring immediate resolution before wound closure.",
        potentialHarm: "Retained foreign body causing infection, abscess, bowel obstruction, sepsis, or need for reoperation.",
        nursingAction: "Notify the surgeon immediately, recount all sponges, search the surgical field and drapes, and obtain an intraoperative X-ray if the sponge cannot be located.",
      },
      {
        id: "or-prep-sterile",
        label: "Non-sterile skin prep bottle on the sterile back table",
        isHazard: true,
        category: "infection",
        riskExplanation: "Placing a non-sterile item on the sterile field breaks sterile technique and contaminates all instruments on the table.",
        potentialHarm: "Surgical site infection, wound dehiscence, sepsis, and extended hospitalization.",
        nursingAction: "Remove the contaminated item, discard the affected drape and instruments, and re-establish the sterile field with new supplies.",
      },
      {
        id: "or-flammable-prep",
        label: "Alcohol-based skin prep solution near active electrosurgical unit",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Alcohol-based surgical prep solutions are flammable. If fumes accumulate under drapes near an ignition source like a Bovie, an OR fire can occur.",
        potentialHarm: "Surgical fire causing severe burns to the patient and OR staff, airway fire if near the face.",
        nursingAction: "Ensure the prep solution has fully dried before draping, allow fumes to dissipate for at least 3 minutes, and keep the prep bottle away from the sterile field and ignition sources.",
      },
      {
        id: "or-warming-pad",
        label: "Warming blanket grounding pad properly placed",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Proper placement of the warming device pad prevents hypothermia, which is a standard of care in the operating room.",
        potentialHarm: "N/A  -  this is correct intraoperative temperature management.",
        nursingAction: "Continue to monitor the patient's core temperature throughout the procedure.",
      },
      {
        id: "or-anesthesia-check",
        label: "Anesthesia confirmed patient identity, allergies, and NPO status",
        isHazard: false,
        category: "medication",
        riskExplanation: "Pre-anesthesia verification of identity, allergies, and NPO status is a required safety check.",
        potentialHarm: "N/A  -  this is correct pre-procedural verification.",
        nursingAction: "Document the verification and continue with the pre-operative checklist.",
      },
      {
        id: "or-sterile-field",
        label: "Sterile drapes properly positioned with intact sterile field",
        isHazard: false,
        category: "infection",
        riskExplanation: "A properly maintained sterile field is the foundation of surgical asepsis.",
        potentialHarm: "N/A  -  this is correct sterile technique.",
        nursingAction: "Continue to monitor and maintain the sterile field throughout the procedure; speak up if any breaks occur.",
      },
      {
        id: "or-fire-extinguisher",
        label: "Fire extinguisher mounted and accessible",
        isHazard: false,
        category: "equipment",
        riskExplanation: "An accessible fire extinguisher is a required safety feature in every operating room per fire safety regulations.",
        potentialHarm: "N/A  -  this is correct fire safety preparedness.",
        nursingAction: "Verify all OR team members know the location and the RACE/PASS protocol for fire response.",
      },
    ],
  },
  {
    id: "ltc",
    title: "Long-Term Care Facility",
    icon: Bed,
    description:
      "You are making rounds in a long-term care facility and enter the room of an 85-year-old resident with moderate dementia and a history of recurrent falls. The bed is in the highest position with no side rails raised. A throw rug is placed between the bed and the bathroom door. The wheelchair in the room has the brakes unlocked and is positioned next to the bed. The resident's walker is stored in the closet across the room. Multiple electrical cords from a personal TV, radio, and phone charger run across the walkway. The call bell is clipped to the bed sheet within reach. Grab bars are properly installed in the bathroom next to the toilet and in the shower. The resident's medications are in a locked drawer at the nursing station. Non-skid socks are on the resident's feet.",
    items: [
      {
        id: "ltc-bed-height",
        label: "Bed in highest position with no side rails raised",
        isHazard: true,
        category: "fall",
        riskExplanation: "An elderly resident with dementia and a fall history requires the bed in the lowest position. The elevated bed dramatically increases fall distance and injury severity.",
        potentialHarm: "Hip fracture, head trauma, subdural hematoma, or death from a fall.",
        nursingAction: "Lower the bed to the lowest position immediately, engage the wheel locks, and consider a floor mat beside the bed per fall protocol.",
      },
      {
        id: "ltc-throw-rug",
        label: "Throw rug between bed and bathroom",
        isHazard: true,
        category: "fall",
        riskExplanation: "Loose throw rugs are a leading cause of falls in elderly residents, especially those with gait instability or dementia who may shuffle their feet.",
        potentialHarm: "Trip-and-fall causing fractures, head injury, or hospitalization.",
        nursingAction: "Remove the throw rug immediately; only non-slip, secured mats should be used in resident rooms.",
      },
      {
        id: "ltc-wheelchair-brakes",
        label: "Wheelchair with unlocked brakes next to the bed",
        isHazard: true,
        category: "fall",
        riskExplanation: "An unlocked wheelchair will roll away when the resident attempts to transfer, causing a fall.",
        potentialHarm: "Fall during transfer resulting in fractures, contusions, or head injury.",
        nursingAction: "Lock the wheelchair brakes immediately; educate staff and resident (if able) on always locking brakes before transfers.",
      },
      {
        id: "ltc-walker-closet",
        label: "Walker stored in the closet across the room",
        isHazard: true,
        category: "fall",
        riskExplanation: "A resident with a fall history who needs an assistive device must have it within arm's reach. Storing it across the room forces the resident to ambulate unsupported.",
        potentialHarm: "Unassisted ambulation leading to a fall, fracture, or head injury.",
        nursingAction: "Move the walker to the bedside within the resident's reach; ensure it is always accessible when the resident is in bed.",
      },
      {
        id: "ltc-electrical-cords",
        label: "Multiple electrical cords running across the walkway",
        isHazard: true,
        category: "fall",
        riskExplanation: "Cords across the walkway create a tripping hazard, especially dangerous for residents with impaired mobility or cognition.",
        potentialHarm: "Trip-and-fall injuries, electrical shock if cords are damaged, or fire hazard from overloaded outlets.",
        nursingAction: "Reroute cords along the wall, use cord covers, and consolidate to a single power strip secured away from the walking path.",
      },
      {
        id: "ltc-call-bell",
        label: "Call bell clipped to bed sheet within reach",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Having the call bell within reach allows the resident to summon help rather than attempting to get up unassisted.",
        potentialHarm: "N/A  -  this is a best practice for fall prevention.",
        nursingAction: "Verify the call bell is functioning; respond promptly to all calls.",
      },
      {
        id: "ltc-grab-bars",
        label: "Grab bars installed in bathroom by toilet and shower",
        isHazard: false,
        category: "fall",
        riskExplanation: "Properly installed grab bars provide support during transfers and reduce fall risk in the bathroom.",
        potentialHarm: "N/A  -  this is correct environmental safety.",
        nursingAction: "Ensure grab bars are secure and not loose; verify they can support the resident's weight.",
      },
      {
        id: "ltc-meds-locked",
        label: "Medications in locked drawer at nursing station",
        isHazard: false,
        category: "medication",
        riskExplanation: "Storing medications in a locked location prevents unauthorized access, especially important for a resident with dementia.",
        potentialHarm: "N/A  -  this is correct medication storage per regulation.",
        nursingAction: "Continue to administer medications per schedule and document properly.",
      },
      {
        id: "ltc-nonskid-socks",
        label: "Non-skid socks on the resident's feet",
        isHazard: false,
        category: "fall",
        riskExplanation: "Non-skid socks provide traction and reduce slip risk on smooth floors.",
        potentialHarm: "N/A  -  this is a correct fall prevention measure.",
        nursingAction: "Ensure socks are in good condition and replaced if worn; verify they fit properly.",
      },
    ],
  },
  {
    id: "psych-unit",
    title: "Psychiatric Unit",
    icon: Brain,
    description:
      "You are working on an inpatient psychiatric unit and conducting a safety round. A patient admitted for suicidal ideation has a plastic bag from a visitor's gift in the room. The bathroom door has a standard lock that can be locked from the inside. A belt and shoelaces are in the patient's personal belongings bag, which is open on the bed. The window blinds have looped pull cords hanging at chest height. A sharps container in the hallway medication room is properly secured. The dayroom has breakaway shower rods and tamper-proof light fixtures throughout. The patient's room has a breakaway curtain rod on the privacy curtain. The nursing station has a clear sightline to the hallway and dayroom. A visitor left a glass picture frame as a gift on the patient's nightstand.",
    items: [
      {
        id: "psy-plastic-bag",
        label: "Plastic bag from visitor's gift in the room",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Plastic bags are a suffocation and ligature risk for patients with suicidal ideation. All plastic bags must be removed from psychiatric patient rooms.",
        potentialHarm: "Self-harm by suffocation or ligature strangulation.",
        nursingAction: "Remove the plastic bag immediately; inspect all visitor gifts and belongings for contraband per unit policy.",
      },
      {
        id: "psy-bathroom-lock",
        label: "Bathroom door with standard lock (locks from inside)",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Standard interior locks allow patients to barricade themselves in the bathroom, preventing staff from intervening during a self-harm attempt.",
        potentialHarm: "Delayed intervention during a self-harm or suicide attempt; completed suicide.",
        nursingAction: "Report to maintenance for immediate replacement with a thumb-turn lock that can be opened from outside with a coin or tool; increase patient monitoring until resolved.",
      },
      {
        id: "psy-belt-laces",
        label: "Belt and shoelaces in open personal belongings on the bed",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Belts and shoelaces are ligature risks  -  they are standard contraband items on psychiatric units for patients with suicidal ideation.",
        potentialHarm: "Self-harm by hanging or strangulation using ligature materials.",
        nursingAction: "Remove the belt and shoelaces immediately; secure them in locked patient belongings storage. Provide the patient with drawstring-free clothing and slip-on footwear.",
      },
      {
        id: "psy-blind-cords",
        label: "Window blind pull cords hanging at chest height",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Looped blind cords are a well-documented ligature point in psychiatric settings. All window coverings should be cordless or have breakaway mechanisms.",
        potentialHarm: "Self-harm by ligature strangulation using the cord loops.",
        nursingAction: "Remove the corded blinds immediately and replace with cordless window coverings; report the safety hazard to facilities management.",
      },
      {
        id: "psy-glass-frame",
        label: "Glass picture frame on patient's nightstand",
        isHazard: true,
        category: "equipment",
        riskExplanation: "Glass items can be broken and used as sharp instruments for self-harm. Glass is contraband on psychiatric units for patients at risk.",
        potentialHarm: "Self-inflicted lacerations, life-threatening hemorrhage from intentional cutting.",
        nursingAction: "Remove the glass frame immediately; offer to display the photo in an approved frame or laminated format. Screen all visitor gifts before allowing them in the room.",
      },
      {
        id: "psy-sharps-secured",
        label: "Sharps container in hallway medication room properly secured",
        isHazard: false,
        category: "infection",
        riskExplanation: "A properly secured sharps container in a restricted-access medication room prevents patient access to sharps.",
        potentialHarm: "N/A  -  this is correct safety practice for a psychiatric unit.",
        nursingAction: "Continue to ensure the medication room is locked when unattended and sharps are disposed of properly.",
      },
      {
        id: "psy-breakaway-fixtures",
        label: "Breakaway shower rods and tamper-proof light fixtures in dayroom",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Breakaway fixtures are designed to release under body weight, preventing their use as ligature anchor points. Tamper-proof fixtures prevent access to electrical components.",
        potentialHarm: "N/A  -  these are required safety features for psychiatric units.",
        nursingAction: "Regularly inspect breakaway mechanisms to ensure they function properly and have not been tampered with.",
      },
      {
        id: "psy-breakaway-curtain",
        label: "Breakaway curtain rod on the privacy curtain",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Breakaway curtain rods detach under approximately 20 pounds of force, preventing use as a ligature anchor point.",
        potentialHarm: "N/A  -  this is a required ligature-resistant safety feature.",
        nursingAction: "Test breakaway function periodically and replace if the mechanism is compromised.",
      },
      {
        id: "psy-sightlines",
        label: "Nursing station with clear sightline to hallway and dayroom",
        isHazard: false,
        category: "equipment",
        riskExplanation: "Clear sightlines enable continuous patient observation, which is essential for safety monitoring on a psychiatric unit.",
        potentialHarm: "N/A  -  this is correct unit design for patient safety.",
        nursingAction: "Maintain unobstructed sightlines; do not place furniture or equipment that blocks visibility.",
      },
    ],
  },
];

function ScenarioSelector({
  onSelect,
  completedScenarios,
}: {
  onSelect: (s: Scenario) => void;
  completedScenarios: Set<string>;
}) {
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900" data-testid="text-page-title">
              Safety & Hazard Detection
            </h1>
            <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
              Free Interactive Module
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
          Sharpen your clinical eye by identifying patient safety hazards in realistic clinical environments. 
          Each scenario tests your ability to distinguish true hazards from safe practices  -  a critical 
          competency for nursing licensure exams and real-world patient care.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const hazardCount = s.items.filter((i) => i.isHazard).length;
          const isComplete = completedScenarios.has(s.id);
          return (
            <Card
              key={s.id}
              className={`border bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group ${isComplete ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100"}`}
              onClick={() => onSelect(s)}
              data-testid={`card-scenario-${s.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary/70" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {hazardCount} hazards
                    </span>
                  </div>
                  {isComplete && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{s.items.length} items to assess</span>
                  <ArrowRight className="w-4 h-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioRunner({
  scenario,
  onExit,
  onComplete,
  unitMode,
}: {
  scenario: Scenario;
  onExit: () => void;
  onComplete: (id: string, score: number, total: number) => void;
  unitMode: UnitMode;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  const hazards = scenario.items.filter((i) => i.isHazard);
  const totalHazards = hazards.length;
  const correctlyIdentified = Array.from(selected).filter((id) => {
    const item = scenario.items.find((i) => i.id === id);
    return item?.isHazard;
  }).length;
  const incorrectSelections = Array.from(selected).filter((id) => {
    const item = scenario.items.find((i) => i.id === id);
    return !item?.isHazard;
  }).length;

  const handleSelect = (itemId: string) => {
    if (showSummary) return;
    const newSelected = new Set(selected);
    const newRevealed = new Set(revealed);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    newRevealed.add(itemId);
    setSelected(newSelected);
    setRevealed(newRevealed);
  };

  const handleSubmit = () => {
    const allRevealed = new Set(scenario.items.map((i) => i.id));
    setRevealed(allRevealed);
    setShowSummary(true);
    onComplete(scenario.id, correctlyIdentified, totalHazards);
  };

  const handleReset = () => {
    setSelected(new Set());
    setRevealed(new Set());
    setShowSummary(false);
  };

  const scorePercent = totalHazards > 0 ? Math.round((correctlyIdentified / totalHazards) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 text-gray-500 hover:text-primary text-sm -ml-2"
          onClick={onExit}
          data-testid="button-exit-scenario"
        >
          <ArrowLeft className="w-4 h-4" />
          All Scenarios
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {correctlyIdentified}/{totalHazards} hazards found
          </span>
          {incorrectSelections > 0 && (
            <span className="text-xs text-rose-400">{incorrectSelections} false alarm{incorrectSelections > 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <scenario.icon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
        </div>
        <p className="text-[15px] text-gray-700 leading-relaxed">{scenario.description}</p>
      </div>

      <div>
        <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          Click items you believe are safety hazards:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {scenario.items.map((item) => {
            const isSelected = selected.has(item.id);
            const isRevealed = revealed.has(item.id);
            const cat = categoryColors[item.category];

            let borderStyle = "border-gray-100 hover:border-primary/30 cursor-pointer";
            if (isRevealed && isSelected && item.isHazard) {
              borderStyle = "border-emerald-300 bg-emerald-50/40";
            } else if (isRevealed && isSelected && !item.isHazard) {
              borderStyle = "border-rose-300 bg-rose-50/40";
            } else if (showSummary && !isSelected && item.isHazard) {
              borderStyle = "border-amber-300 bg-amber-50/30";
            } else if (isSelected && !isRevealed) {
              borderStyle = "border-primary bg-primary/5";
            }

            return (
              <Card
                key={item.id}
                className={`border-2 transition-all duration-300 ${borderStyle} ${showSummary ? "" : "cursor-pointer"}`}
                onClick={() => handleSelect(item.id)}
                data-testid={`card-item-${item.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {isRevealed ? (
                      isSelected && item.isHazard ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : isSelected && !item.isHazard ? (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      ) : showSummary && item.isHazard ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-gray-300"
                        }`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      {isRevealed && (
                        <div className="mt-3 space-y-2">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                            {cat.label}
                          </span>
                          {item.isHazard ? (
                            <>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t("pages.safetyHazardSimulator.risk")}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.riskExplanation}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-0.5">{t("pages.safetyHazardSimulator.potentialHarm")}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.potentialHarm}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">{t("pages.safetyHazardSimulator.nursingAction")}</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.nursingAction}</p>
                              </div>
                            </>
                          ) : (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                                {isSelected ? "Not a Hazard" : "Safe Practice"}
                              </p>
                              <p className="text-xs text-gray-600 leading-relaxed">{item.riskExplanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {!showSummary && (
        <div className="flex justify-end">
          <Button
            className="rounded-full gap-2 bg-primary text-white hover:brightness-110"
            onClick={handleSubmit}
            data-testid="button-submit-answers"
          >
            Submit & Reveal All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {showSummary && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-gray-900">{t("pages.safetyHazardSimulator.scenarioResults")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-primary">{scorePercent}%</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("pages.safetyHazardSimulator.score")}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-emerald-600">{correctlyIdentified}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("pages.safetyHazardSimulator.hazardsFound")}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-rose-500">{incorrectSelections}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("pages.safetyHazardSimulator.falseAlarms")}</p>
              </div>
            </div>
            {correctlyIdentified < totalHazards && (
              <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                You missed {totalHazards - correctlyIdentified} hazard{totalHazards - correctlyIdentified > 1 ? "s" : ""}. Missed hazards are highlighted in amber above  -  review them carefully.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button variant="outline" className="rounded-full gap-2" onClick={handleReset} data-testid="button-retry-scenario">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button variant="outline" className="rounded-full gap-2" onClick={onExit} data-testid="button-back-scenarios">
                <ArrowLeft className="w-4 h-4" />
                All Scenarios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SafetyHazardSimulatorPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, { score: number; total: number }>>({});
  const [region, setRegion] = useState<CountryMode>(() => {
    return (localStorage.getItem("nursenest-region") as CountryMode) || "US";
  });
  const unitMode = getDefaultUnitMode(region);

  useEffect(() => {
    const handler = () => {
      setRegion((localStorage.getItem("nursenest-region") as CountryMode) || "US");
    };
    window.addEventListener("regionChange", handler);
    return () => window.removeEventListener("regionChange", handler);
  }, []);

  const handleComplete = (id: string, score: number, total: number) => {
    setCompletedScenarios((prev) => { const next = new Set(prev); next.add(id); return next; });
    setScores((prev) => ({ ...prev, [id]: { score, total } }));
  };

  const totalCompleted = completedScenarios.size;
  const totalScenarios = scenarios.length;
  const overallScore = Object.values(scores).reduce((acc, s) => acc + s.score, 0);
  const overallTotal = Object.values(scores).reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.safetyHazardSimulator.safetyHazardDetectionEngineFree")}
        description={t("pages.safetyHazardSimulator.practiceIdentifyingPatientSafetyHazards")}
        keywords="patient safety nursing, hazard detection nursing, clinical safety training, fall prevention nursing, medication error prevention, infection control nursing, nursing safety simulation"
        canonicalPath="/safety-hazard-simulator"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <BreadcrumbNav />
        {totalCompleted > 0 && !activeScenario && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4" data-testid="progress-banner">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {totalCompleted}/{totalScenarios} Scenarios Completed
                </p>
                {overallTotal > 0 && (
                  <p className="text-xs text-gray-500">
                    Overall: {overallScore}/{overallTotal} hazards identified ({Math.round((overallScore / overallTotal) * 100)}%)
                  </p>
                )}
              </div>
            </div>
            <div className="w-full sm:w-48 bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(totalCompleted / totalScenarios) * 100}%` }}
              />
            </div>
          </div>
        )}

        {activeScenario ? (
          <ScenarioRunner
            scenario={activeScenario}
            onExit={() => setActiveScenario(null)}
            onComplete={handleComplete}
            unitMode={unitMode}
          />
        ) : (
          <ScenarioSelector onSelect={setActiveScenario} completedScenarios={completedScenarios} />
        )}
      </main>

      <AdminEditButton pageName="safety-hazard-simulator" />
      <Footer />
    </div>
  );
}
