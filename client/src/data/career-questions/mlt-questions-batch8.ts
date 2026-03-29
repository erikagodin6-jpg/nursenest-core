import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch8: CareerQuestion[] = [
  {
    id: "mlt-b8-001",
    stem: "The correct order of draw for venipuncture is:",
    options: ["Blood cultures, light blue, red/SST, green, lavender, gray", "Lavender, red, green, blue, gray", "Red, blue, green, lavender, gray", "Gray, lavender, green, red, blue"],
    correctIndex: 0,
    rationale: "Correct order: blood cultures (yellow SPS) → light blue (citrate) → red/SST → green (heparin) → lavender (EDTA) → gray (oxalate/fluoride). This prevents cross-contamination of additives between tubes. Citrate must be drawn before tubes with clot activators to avoid falsely shortened coagulation times.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Order of Draw"
  },
  {
    id: "mlt-b8-002",
    stem: "A patient's blood specimen is hemolyzed. Which analyte would be MOST falsely elevated?",
    options: ["Sodium", "Potassium", "Chloride", "Calcium"],
    correctIndex: 1,
    rationale: "RBCs contain ~23x more potassium than plasma. Hemolysis releases intracellular K+ causing falsely elevated results. LDH, AST, and phosphorus are also significantly affected. Sodium concentration is similar inside and outside cells, so it is minimally affected.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-003",
    stem: "The maximum tourniquet application time during venipuncture should not exceed:",
    options: ["30 seconds", "1 minute", "3 minutes", "5 minutes"],
    correctIndex: 1,
    rationale: "Tourniquet time should not exceed 1 minute. Prolonged application causes hemoconcentration, falsely increasing proteins, lipids, and cell-bound analytes. It can also cause localized acidosis and affect potassium levels.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Venipuncture Technique"
  },
  {
    id: "mlt-b8-004",
    stem: "For a 2-hour postprandial glucose test, the timing begins:",
    options: ["When the patient arrives at the lab", "When the patient begins eating the meal", "When the patient finishes eating the meal", "When the blood is drawn"],
    correctIndex: 1,
    rationale: "The 2-hour postprandial glucose timing starts when the patient begins eating the standardized meal. The blood sample is drawn exactly 2 hours after the start of the meal. Normal 2-hour postprandial glucose is <140 mg/dL.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Special Collection Procedures"
  },
  {
    id: "mlt-b8-005",
    stem: "A blood culture contamination rate above what percentage requires corrective action?",
    options: ["1%", "3%", "5%", "10%"],
    correctIndex: 1,
    rationale: "Blood culture contamination rate should be <3%. Rates above 3% indicate problems with collection technique, skin preparation, or specimen handling. Proper antisepsis with chlorhexidine or iodine and allowing adequate drying time are essential.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Special Collection Procedures"
  },
  {
    id: "mlt-b8-006",
    stem: "Which of the following specimens should NEVER be collected through an IV line?",
    options: ["Blood cultures", "CBC", "Coagulation studies", "All of the above should ideally be drawn by separate venipuncture"],
    correctIndex: 3,
    rationale: "IV line draws introduce contamination from IV fluids (dilution, glucose, electrolyte changes) and heparin flush (affecting coagulation). If an IV draw is unavoidable, the line must be flushed and the first 5-10 mL discarded. Separate venipuncture is always preferred.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-007",
    stem: "The preferred site for capillary blood collection in infants is:",
    options: ["The fingertip", "The earlobe", "The medial or lateral plantar surface of the heel", "The great toe"],
    correctIndex: 2,
    rationale: "Infant heel stick: use medial or lateral plantar surface of the heel. The puncture depth must not exceed 2.0 mm to avoid calcaneus bone injury. The central area of the heel should be avoided due to proximity to the bone. Fingertip collection is used after age 1 year.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Capillary Collection"
  },
  {
    id: "mlt-b8-008",
    stem: "A specimen for cold agglutinin testing requires:",
    options: ["Collection in an EDTA tube and refrigeration immediately", "Collection and transport at 37°C in a pre-warmed tube", "Collection in a citrate tube at room temperature", "Collection in a red-top tube and freezing"],
    correctIndex: 1,
    rationale: "Cold agglutinins are IgM antibodies that bind RBCs at temperatures below 37°C. The specimen must be collected and transported at 37°C using a pre-warmed tube and heat block to prevent in vitro agglutination that would cause falsely abnormal CBC results.",
    difficulty: 3,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-009",
    stem: "Patient identification for specimen collection requires checking which TWO identifiers?",
    options: ["Name and room number", "Name and date of birth", "Name and physician", "Room number and bed number"],
    correctIndex: 1,
    rationale: "Two unique patient identifiers are required per The Joint Commission: typically name and date of birth, or name and medical record number. Room and bed numbers are NOT acceptable identifiers because patients move. This is a critical patient safety measure.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Patient Identification & Safety"
  },
  {
    id: "mlt-b8-010",
    stem: "A citrate tube for coagulation testing must be filled to at least what percentage of its nominal volume?",
    options: ["50%", "70%", "90%", "100%"],
    correctIndex: 2,
    rationale: "Citrate tubes must be filled to ≥90% of their nominal volume. Under-filling changes the blood-to-anticoagulant ratio from the required 9:1, resulting in excess citrate that over-chelates calcium, causing falsely prolonged PT and aPTT results.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-011",
    stem: "A delta check flags a patient's potassium at 6.8 mEq/L when the previous result 4 hours ago was 4.2 mEq/L. The MOST likely cause is:",
    options: ["Acute renal failure", "Specimen identification error or collection problem", "Medication effect", "Rapid potassium infusion"],
    correctIndex: 1,
    rationale: "A rapid, dramatic change in potassium (>2.5 mEq/L in 4 hours) is more likely a pre-analytical error (hemolysis, clotted specimen, mislabeled) than a true clinical change. Delta checks detect potential specimen identification errors. Recollection should be requested before reporting.",
    difficulty: 3,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-012",
    stem: "Which specimen type requires immediate chilling on ice after collection?",
    options: ["CBC", "Ammonia", "Lipid panel", "Hemoglobin A1c"],
    correctIndex: 1,
    rationale: "Ammonia must be placed on ice immediately and analyzed within 15 minutes. At room temperature, deamination of amino acids by blood cell enzymes causes falsely elevated ammonia levels. Other ice-required analytes include arterial blood gases, lactic acid, and gastrin.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-013",
    stem: "A specimen label is missing the time of collection. The correct action is to:",
    options: ["Add the approximate time and initial it", "Reject the specimen and request recollection", "Call the floor to verify the time", "Process and report with a comment"],
    correctIndex: 1,
    rationale: "Incomplete specimen labeling is a rejection criterion. Time of collection is essential for test interpretation (e.g., cortisol, drug levels) and for meeting turnaround time requirements. Specimens with missing critical identifiers must be rejected.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Patient Identification & Safety"
  },
  {
    id: "mlt-b8-014",
    stem: "For glucose tolerance testing (GTT), the fasting blood glucose must be drawn after a minimum of:",
    options: ["4 hours fasting", "6 hours fasting", "8 hours fasting (typically 8-12 hours)", "No fasting required"],
    correctIndex: 2,
    rationale: "GTT requires 8-12 hours of fasting. Fasting glucose is drawn first, then the patient drinks 75g glucose load (100g for pregnancy). Blood is drawn at 1-hour and 2-hour intervals. The patient must remain seated and not smoke during the test.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Special Collection Procedures"
  },
  {
    id: "mlt-b8-015",
    stem: "The angle of needle insertion for routine venipuncture is:",
    options: ["5-10 degrees", "15-30 degrees", "45 degrees", "90 degrees"],
    correctIndex: 1,
    rationale: "Standard venipuncture angle is 15-30 degrees with the bevel up. Too steep an angle risks going through the vein. Too shallow may not enter the vein. Anchoring the vein and using a smooth insertion technique reduces discomfort and hematoma risk.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Venipuncture Technique"
  },
  {
    id: "mlt-b8-016",
    stem: "A light-sensitive analyte like bilirubin requires:",
    options: ["Collection in an amber tube or wrapping the tube in aluminum foil", "Immediate freezing", "Collection on ice", "No special handling"],
    correctIndex: 0,
    rationale: "Bilirubin degrades when exposed to light (photodegradation). Specimens must be protected from light using amber tubes or aluminum foil wrapping. Vitamin A, vitamin B6, and porphyrins are also light-sensitive analytes.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-017",
    stem: "Blood cultures should ideally be collected from how many separate venipuncture sites?",
    options: ["One site only", "Two to three separate sites", "Four separate sites", "From an existing IV line"],
    correctIndex: 1,
    rationale: "Two to three sets from separate venipuncture sites are recommended. This helps distinguish true bacteremia (growth in multiple sets) from contamination (growth in one set). Each set includes an aerobic and anaerobic bottle.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Special Collection Procedures"
  },
  {
    id: "mlt-b8-018",
    stem: "Which of the following is a common pre-analytical error that causes specimen rejection?",
    options: ["Using the correct tube", "Proper patient identification", "Clotted specimen in an EDTA tube", "Specimen received at correct temperature"],
    correctIndex: 2,
    rationale: "Clotted specimens in anticoagulant tubes (EDTA, citrate) must be rejected. Causes include inadequate mixing (must be gently inverted 8-10 times), difficult or slow draws, and use of butterfly sets without proper flushing. Pre-analytical errors account for 46-68% of all laboratory errors.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b8-019",
    stem: "A timed specimen for cortisol is collected at 8:00 AM. The expected normal cortisol at this time is:",
    options: ["<5 µg/dL", "10-25 µg/dL (peak morning level)", "30-50 µg/dL", "Cortisol has no diurnal variation"],
    correctIndex: 1,
    rationale: "Cortisol follows a diurnal pattern with peak levels at 6-8 AM (10-25 µg/dL) and nadir at midnight (<5 µg/dL). Morning collection evaluates adrenal sufficiency; midnight collection screens for Cushing syndrome. Timing is critical for interpretation.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Special Collection Procedures"
  },
  {
    id: "mlt-b8-020",
    stem: "The antecubital fossa veins preferred for venipuncture in order of preference are:",
    options: ["Cephalic, basilic, median cubital", "Median cubital, cephalic, basilic", "Basilic, median cubital, cephalic", "Any vein is equally preferred"],
    correctIndex: 1,
    rationale: "Median cubital vein is first choice: large, well-anchored, less painful. Cephalic is second: more lateral, may roll. Basilic is third: close to brachial artery and median nerve, higher risk. Avoid wrist and hand veins for routine draws.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Venipuncture Technique"
  },
  {
    id: "mlt-b8-021",
    stem: "A Plasmodium falciparum infection is characterized by which finding on a thin blood smear?",
    options: ["Schüffner dots in enlarged RBCs", "Multiple ring forms in normal-sized RBCs, banana-shaped gametocytes", "Band-form trophozoites", "Merozoite rosettes"],
    correctIndex: 1,
    rationale: "P. falciparum: small delicate rings (often multiple per RBC), normal-sized RBCs, possible appliqué forms (accolé), banana/crescent-shaped gametocytes. Unlike other species, mature trophozoites and schizonts are rarely seen in peripheral blood due to sequestration.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-022",
    stem: "The O&P (ova and parasite) examination includes which three components?",
    options: ["Gram stain, culture, sensitivity", "Macroscopic exam, concentration, permanent stain", "Wet mount only", "Acid-fast stain, culture, PCR"],
    correctIndex: 1,
    rationale: "Complete O&P examination: (1) macroscopic examination for worm segments, consistency, blood, mucus; (2) concentration technique (flotation or sedimentation) to recover eggs, cysts, larvae; (3) permanent stained smear (trichrome or iron hematoxylin) for protozoan identification.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Ova & Parasite Examination"
  },
  {
    id: "mlt-b8-023",
    stem: "Entamoeba histolytica trophozoites are differentiated from nonpathogenic E. dispar by:",
    options: ["Size differences on wet mount", "Presence of ingested RBCs (erythrophagocytosis) in E. histolytica", "Cyst morphology alone", "They cannot be differentiated microscopically; antigen detection or PCR is required"],
    correctIndex: 3,
    rationale: "E. histolytica and E. dispar are morphologically identical on microscopy. Although ingested RBCs suggest E. histolytica, definitive differentiation requires antigen detection (EIA) or molecular testing (PCR). E. dispar is nonpathogenic and does not require treatment.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b8-024",
    stem: "Giardia lamblia cysts are identified by their characteristic:",
    options: ["Round shape with 8 nuclei", "Oval shape with 4 nuclei, central axoneme, and median bodies", "Spherical shape with single nucleus", "Crescent shape with polar filament"],
    correctIndex: 1,
    rationale: "Giardia lamblia cysts: oval, 8-12 µm, contain 4 nuclei, axonemes, and median bodies. Trophozoites have a characteristic 'face-like' appearance with 2 nuclei, 4 pairs of flagella, and a ventral sucking disk. Most common intestinal parasite worldwide.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b8-025",
    stem: "The laboratory diagnosis of Cryptosporidium parvum in stool is best made by:",
    options: ["Routine O&P examination", "Modified acid-fast stain showing small (4-6 µm) red oocysts", "Gram stain", "India ink preparation"],
    correctIndex: 1,
    rationale: "Cryptosporidium oocysts are very small (4-6 µm) and not reliably detected by routine O&P. Modified acid-fast (Kinyoun) stain shows pink/red oocysts against a blue-green background. Immunoassay and PCR are also used. Causes severe diarrhea in immunocompromised patients.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b8-026",
    stem: "Pinworm (Enterobius vermicularis) diagnosis is best performed by:",
    options: ["Routine stool O&P examination", "Scotch tape (cellophane tape) preparation from the perianal area", "Blood smear examination", "Urine examination"],
    correctIndex: 1,
    rationale: "Pinworm females migrate to the perianal area at night to deposit eggs. The scotch tape (paddle) preparation collected in the early morning before bathing is the method of choice. Eggs are rarely found in stool. Eggs are asymmetric, flattened on one side.",
    difficulty: 1,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b8-027",
    stem: "Ascaris lumbricoides eggs are identified by their:",
    options: ["Thin, transparent shell with terminal knob", "Thick, mammillated (bumpy) shell, golden-brown color", "Operculated shell with terminal spine", "Barrel-shaped with polar plugs"],
    correctIndex: 1,
    rationale: "Ascaris lumbricoides: fertilized eggs are round/oval, 55-75 µm, with a thick shell and characteristic mammillated (bumpy) outer coat, golden-brown from bile staining. Unfertilized eggs are elongated and irregular. Largest intestinal roundworm (20-35 cm adults).",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b8-028",
    stem: "Plasmodium vivax malaria is characterized by which features on blood smear?",
    options: ["Normal-sized RBCs with multiple rings", "Enlarged RBCs with Schüffner dots, ameboid trophozoites", "Band-form trophozoites in normal RBCs", "Banana-shaped gametocytes"],
    correctIndex: 1,
    rationale: "P. vivax: enlarged (1.5-2x) infected RBCs, Schüffner dots (stippling), ameboid trophozoites, 12-24 merozoites in schizonts. Relapse possible from hypnozoites in liver. Treatment requires chloroquine plus primaquine (for hypnozoites).",
    difficulty: 3,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-029",
    stem: "Toxoplasma gondii infection is primarily transmitted by:",
    options: ["Mosquito bite", "Ingestion of undercooked meat containing tissue cysts or exposure to cat feces containing oocysts", "Sexual contact", "Blood transfusion only"],
    correctIndex: 1,
    rationale: "Toxoplasma transmission: ingestion of tissue cysts in undercooked meat (pork, lamb), or oocysts from cat feces contaminating food/water. Congenital transmission causes severe fetal damage. Immunocompromised patients risk reactivation causing encephalitis.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-030",
    stem: "Hookworm eggs (Necator americanus/Ancylostoma duodenale) are characterized by:",
    options: ["Thick mammillated shell", "Thin shell, oval, containing developing morula (4-8 cell stage)", "Operculated with terminal knob", "Barrel-shaped with polar plugs"],
    correctIndex: 1,
    rationale: "Hookworm eggs: thin-shelled, oval, 55-75 µm, contain a developing morula (4-8 cell stage) with clear space between morula and shell. Cannot differentiate Necator from Ancylostoma by egg morphology alone. Larvae hatch in soil and penetrate skin (cutaneous larva migrans).",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b8-031",
    stem: "Trichinella spiralis infection is diagnosed by:",
    options: ["Stool O&P examination", "Muscle biopsy showing encysted larvae", "Blood smear", "Urine examination"],
    correctIndex: 1,
    rationale: "Trichinella larvae encyst in striated muscle tissue (especially diaphragm, masseter, tongue). Diagnosis: serology (EIA for anti-Trichinella antibodies), muscle biopsy showing coiled larvae within nurse cells, and clinical presentation (periorbital edema, eosinophilia, myalgia). Not found in stool.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Tissue Helminths"
  },
  {
    id: "mlt-b8-032",
    stem: "The concentration technique used in parasitology to float parasite eggs and cysts to the surface is:",
    options: ["Sedimentation with formalin-ethyl acetate", "Zinc sulfate flotation", "Direct wet mount only", "Giemsa staining"],
    correctIndex: 1,
    rationale: "Flotation (zinc sulfate, specific gravity 1.18): parasite eggs and cysts float to surface for collection. Best for Giardia cysts. Sedimentation (formalin-ethyl acetate): heavier elements settle to bottom. Sedimentation recovers a wider range of parasites including operculated eggs and larvae.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Concentration Techniques"
  },
  {
    id: "mlt-b8-033",
    stem: "Taenia solium (pork tapeworm) cysticercosis occurs when humans ingest:",
    options: ["Undercooked pork containing cysticerci", "Eggs from T. solium, leading to larval migration to tissues", "Raw fish", "Contaminated water with cercariae"],
    correctIndex: 1,
    rationale: "Cysticercosis occurs when humans ingest T. solium EGGS (not cysticerci). Eggs hatch, larvae penetrate intestinal wall and migrate to tissues (brain, muscle, eye). Neurocysticercosis causes seizures and is diagnosed by CT/MRI showing cysts and serology.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Tissue Helminths"
  },
  {
    id: "mlt-b8-034",
    stem: "Schistosoma mansoni eggs are characterized by:",
    options: ["Terminal spine", "Lateral spine", "No spine, round shape", "Operculated with shoulder knobs"],
    correctIndex: 1,
    rationale: "Schistosoma egg identification by spine position: S. mansoni = lateral spine; S. haematobium = terminal spine; S. japonicum = small lateral knob (often rudimentary). S. mansoni and S. japonicum found in stool; S. haematobium found in urine.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Tissue Helminths"
  },
  {
    id: "mlt-b8-035",
    stem: "The arthropod vector responsible for transmitting Plasmodium species (malaria) is:",
    options: ["Ixodes tick", "Tsetse fly", "Female Anopheles mosquito", "Sandfly"],
    correctIndex: 2,
    rationale: "Female Anopheles mosquito transmits Plasmodium sporozoites during blood meal. Sporozoites travel to liver (exoerythrocytic cycle) then invade RBCs (erythrocytic cycle). Tsetse fly transmits Trypanosoma; Ixodes transmits Borrelia/Babesia; sandfly transmits Leishmania.",
    difficulty: 1,
    category: "Parasitology",
    topic: "Arthropod Vectors"
  },
  {
    id: "mlt-b8-036",
    stem: "Thick blood smears for malaria diagnosis are used to:",
    options: ["Identify the Plasmodium species", "Increase sensitivity by concentrating parasites (detect low-level parasitemia)", "Examine RBC morphology", "Perform antibody testing"],
    correctIndex: 1,
    rationale: "Thick smear: RBCs are lysed, concentrating parasites in a smaller area. 10-20x more sensitive than thin smear for detecting low parasitemia. Thin smear is used for species identification and parasitemia quantification. Both should be prepared and examined.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-037",
    stem: "A trichrome-stained stool smear shows a cyst with a single large nucleus containing a large karyosome (dot) and a glycogen vacuole. This is most consistent with:",
    options: ["Entamoeba histolytica", "Entamoeba coli", "Iodamoeba bütschlii", "Giardia lamblia"],
    correctIndex: 2,
    rationale: "Iodamoeba bütschlii cyst: single nucleus with large eccentric karyosome, prominent glycogen vacuole that stains dark with iodine. E. histolytica cysts have 4 nuclei. E. coli cysts have up to 8 nuclei. Iodamoeba is nonpathogenic.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b8-038",
    stem: "Strongyloides stercoralis is unique among intestinal nematodes because:",
    options: ["Its eggs are operculated", "Larvae (not eggs) are found in stool, and autoinfection can occur", "It requires an intermediate host", "It is the largest roundworm"],
    correctIndex: 1,
    rationale: "Strongyloides is unique: rhabditiform (L1) larvae are found in stool (eggs hatch before passage). Autoinfection cycle allows hyperinfection in immunosuppressed patients (especially corticosteroid therapy). Can persist for decades through internal autoinfection.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b8-039",
    stem: "Babesia microti on blood smear appears as:",
    options: ["Banana-shaped gametocytes", "Small intraerythrocytic ring forms resembling Plasmodium, often in tetrads (Maltese cross)", "Large ameboid trophozoites with Schüffner dots", "Extracellular trypomastigotes"],
    correctIndex: 1,
    rationale: "Babesia: small ring forms inside RBCs that can mimic P. falciparum. Distinguishing features: tetrad forms (Maltese cross), no pigment (hemozoin), extracellular forms present. Transmitted by Ixodes tick (same vector as Lyme disease). No liver stage.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-040",
    stem: "Echinococcus granulosus causes which clinical condition?",
    options: ["Intestinal obstruction", "Hydatid cyst disease (cystic echinococcosis) primarily in liver and lungs", "Cutaneous larva migrans", "Elephantiasis"],
    correctIndex: 1,
    rationale: "Echinococcus granulosus causes hydatid cysts, primarily in liver (65%) and lungs (25%). Humans are accidental intermediate hosts from ingesting eggs from dog feces. Cysts contain protoscolices (hydatid sand). Rupture can cause anaphylaxis. Diagnosed by imaging and serology.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Tissue Helminths"
  },
  {
    id: "mlt-b8-041",
    stem: "The cell culture method for virus isolation involves:",
    options: ["Growing viruses on agar plates", "Inoculating patient specimens into living cell monolayers and observing for cytopathic effect (CPE)", "Growing viruses in broth media", "Direct Gram staining"],
    correctIndex: 1,
    rationale: "Viral culture uses living cell monolayers (e.g., MRC-5 fibroblasts, HEp-2, Vero cells). Specimens are inoculated and observed for cytopathic effect (CPE): cell rounding, detachment, syncytia formation, or inclusion bodies. Different viruses produce characteristic CPE patterns.",
    difficulty: 2,
    category: "Virology",
    topic: "Viral Culture & Identification"
  },
  {
    id: "mlt-b8-042",
    stem: "Respiratory syncytial virus (RSV) is best detected by:",
    options: ["Routine bacterial culture", "Rapid antigen detection (immunofluorescence or immunochromatographic assay) or RT-PCR", "Acid-fast stain", "Darkfield microscopy"],
    correctIndex: 1,
    rationale: "RSV detection: rapid antigen tests (DFA or lateral flow immunochromatographic assays) for point-of-care results; RT-PCR for highest sensitivity and specificity. Cell culture can be used but is slower. RSV is the most common cause of bronchiolitis in infants.",
    difficulty: 2,
    category: "Virology",
    topic: "Rapid Antigen Detection"
  },
  {
    id: "mlt-b8-043",
    stem: "The HIV testing algorithm in the United States currently recommends which initial screening test?",
    options: ["Western blot", "4th generation HIV-1/2 antigen/antibody combination immunoassay", "Rapid antibody test only", "Viral culture"],
    correctIndex: 1,
    rationale: "Current CDC algorithm: (1) 4th generation Ag/Ab combo assay (detects HIV-1/2 antibodies AND p24 antigen); if reactive → (2) HIV-1/HIV-2 differentiation assay; if indeterminate → (3) HIV-1 NAT (nucleic acid test). Western blot is no longer recommended as confirmatory.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-044",
    stem: "Hepatitis B surface antigen (HBsAg) indicates:",
    options: ["Immunity from vaccination", "Active hepatitis B infection (acute or chronic)", "Past resolved infection", "Hepatitis A infection"],
    correctIndex: 1,
    rationale: "HBsAg is the first marker to appear in acute HBV infection and its persistence >6 months defines chronic infection. Vaccination produces only anti-HBs. Past resolved infection shows anti-HBs and anti-HBc. The 'window period' shows anti-HBc IgM only.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-045",
    stem: "The hepatitis B serological profile showing anti-HBs positive, anti-HBc positive, HBsAg negative indicates:",
    options: ["Acute infection", "Chronic infection", "Immunity from past natural infection", "Immunity from vaccination only"],
    correctIndex: 2,
    rationale: "Anti-HBs + anti-HBc = natural immunity from past resolved infection. Vaccination produces anti-HBs ONLY (no anti-HBc). Acute infection: HBsAg+, anti-HBc IgM+. Chronic: HBsAg+ >6 months, anti-HBc IgG+.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-046",
    stem: "Cytopathic effect (CPE) showing multinucleated giant cells with syncytia formation is characteristic of which virus?",
    options: ["Influenza A", "Respiratory syncytial virus (RSV) or herpes simplex virus (HSV)", "Adenovirus", "Rotavirus"],
    correctIndex: 1,
    rationale: "Syncytia (multinucleated giant cells from cell fusion) are characteristic CPE of RSV and HSV. RSV fuses respiratory epithelial cells. HSV also causes syncytia plus Cowdry type A intranuclear inclusions. Adenovirus shows grape-like clusters. Influenza causes hemadsorption.",
    difficulty: 3,
    category: "Virology",
    topic: "Viral Culture & Identification"
  },
  {
    id: "mlt-b8-047",
    stem: "RT-PCR is required for detecting RNA viruses because:",
    options: ["DNA polymerase can amplify RNA directly", "RNA must first be converted to complementary DNA (cDNA) by reverse transcriptase before PCR amplification", "RNA is more stable than DNA", "RNA viruses cannot be detected by any molecular method"],
    correctIndex: 1,
    rationale: "RNA cannot be directly amplified by DNA polymerase (Taq). Reverse transcriptase converts RNA to cDNA, which can then be amplified by standard PCR. Used for HIV viral load, influenza detection, SARS-CoV-2 testing, hepatitis C viral load, and other RNA viruses.",
    difficulty: 2,
    category: "Virology",
    topic: "Molecular Viral Testing"
  },
  {
    id: "mlt-b8-048",
    stem: "The 'window period' in hepatitis B infection refers to:",
    options: ["Time between exposure and symptom onset", "Period when HBsAg has disappeared and anti-HBs has not yet appeared; only anti-HBc IgM is detectable", "Duration of chronic infection", "Time between vaccination doses"],
    correctIndex: 1,
    rationale: "HBV window period: HBsAg has cleared, anti-HBs not yet detectable. Only marker present is anti-HBc (IgM in acute, transitioning to IgG). This can lead to missed diagnoses if only HBsAg and anti-HBs are tested. Anti-HBc IgM confirms recent infection during the window.",
    difficulty: 3,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-049",
    stem: "SARS-CoV-2 (COVID-19) diagnostic testing by RT-PCR targets which specimen type for optimal sensitivity?",
    options: ["Blood serum", "Nasopharyngeal swab", "Urine", "Stool"],
    correctIndex: 1,
    rationale: "Nasopharyngeal (NP) swab provides highest sensitivity for SARS-CoV-2 RT-PCR. Anterior nasal swabs are also accepted for some assays. The test detects viral RNA targets (N gene, E gene, RdRp gene, ORF1ab). Rapid antigen tests detect nucleocapsid protein.",
    difficulty: 1,
    category: "Virology",
    topic: "Molecular Viral Testing"
  },
  {
    id: "mlt-b8-050",
    stem: "Influenza A and B are primarily differentiated and subtyped by:",
    options: ["Gram stain morphology", "Hemagglutinin (H) and neuraminidase (N) surface antigens, detected by molecular methods or immunoassay", "Colony morphology on culture plates", "Acid-fast staining"],
    correctIndex: 1,
    rationale: "Influenza A is subtyped by hemagglutinin (H1-18) and neuraminidase (N1-11) surface glycoproteins. Influenza B has two lineages (Victoria, Yamagata). Rapid molecular assays (e.g., ID NOW, Xpert Flu) detect and differentiate A and B. Antigenic drift and shift drive epidemics and pandemics.",
    difficulty: 2,
    category: "Virology",
    topic: "Rapid Antigen Detection"
  },
  {
    id: "mlt-b8-051",
    stem: "EBV (Epstein-Barr virus) infectious mononucleosis is confirmed by:",
    options: ["Positive monospot (heterophile antibody) test or EBV-specific serologies (VCA IgM, VCA IgG, EBNA)", "Bacterial throat culture", "CBC alone", "Urine culture"],
    correctIndex: 0,
    rationale: "Monospot: detects heterophile antibodies (agglutinate horse/sheep RBCs). Positive in ~85% of cases but may be negative in children <4 years. EBV-specific serology: VCA IgM (acute infection), VCA IgG (current/past), EBNA (past infection). CBC shows lymphocytosis with reactive (atypical) lymphocytes.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-052",
    stem: "Shell vial culture for CMV (cytomegalovirus) detection uses:",
    options: ["Standard broth culture", "Cell monolayers centrifuged with specimen, then stained with fluorescent antibodies at 24-48 hours", "Agar plates with antibiotics", "Acid-fast staining of respiratory specimens"],
    correctIndex: 1,
    rationale: "Shell vial (rapid culture): specimen is centrifuge-enhanced onto cell monolayers, incubated 24-48 hours, then stained with monoclonal antibodies against CMV immediate-early antigens. Much faster than conventional culture (2-4 weeks). Largely replaced by PCR in many labs.",
    difficulty: 3,
    category: "Virology",
    topic: "Viral Culture & Identification"
  },
  {
    id: "mlt-b8-053",
    stem: "Hepatitis C virus (HCV) is primarily transmitted by:",
    options: ["Fecal-oral route", "Parenteral exposure (IV drug use, needlestick, blood transfusion before 1992)", "Respiratory droplets", "Mosquito bite"],
    correctIndex: 1,
    rationale: "HCV transmission: primarily parenteral (sharing needles, needlestick injuries, blood transfusions before screening in 1992). Sexual and perinatal transmission are less common. No vaccine available. Current treatment: direct-acting antivirals (DAAs) achieve >95% cure rates.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-054",
    stem: "Norovirus gastroenteritis outbreaks are best detected by:",
    options: ["Routine stool culture", "RT-PCR of stool specimens", "Gram stain of stool", "Blood culture"],
    correctIndex: 1,
    rationale: "Norovirus: most common cause of viral gastroenteritis outbreaks (cruise ships, nursing homes, hospitals). Cannot be cultured in routine cell culture. RT-PCR is the gold standard for detection. Electron microscopy shows small round structured viruses (SRSV).",
    difficulty: 2,
    category: "Virology",
    topic: "Molecular Viral Testing"
  },
  {
    id: "mlt-b8-055",
    stem: "Varicella-zoster virus (VZV) reactivation from dorsal root ganglia causes:",
    options: ["Chickenpox (varicella)", "Herpes zoster (shingles) in a dermatomal distribution", "Infectious mononucleosis", "Roseola"],
    correctIndex: 1,
    rationale: "VZV establishes latency in dorsal root ganglia after primary chickenpox infection. Reactivation causes herpes zoster (shingles): painful vesicular rash in a dermatomal distribution. Diagnosed by DFA of lesion scrapings or PCR. Shingrix vaccine recommended for adults ≥50 years.",
    difficulty: 2,
    category: "Virology",
    topic: "Emerging Viral Pathogens"
  },
  {
    id: "mlt-b8-056",
    stem: "Dengue fever diagnosis uses which serological markers?",
    options: ["Anti-dengue IgM (acute) and NS1 antigen (early detection within first 5 days)", "HBsAg", "Anti-HIV antibodies", "RPR"],
    correctIndex: 0,
    rationale: "Dengue diagnosis: NS1 antigen detectable days 1-5 of illness (early marker). IgM antibodies appear day 4-5, peak at 2 weeks. IgG appears later and persists. RT-PCR detects viral RNA in early illness. Four serotypes (DENV 1-4); secondary infection with different serotype increases risk of severe dengue.",
    difficulty: 3,
    category: "Virology",
    topic: "Emerging Viral Pathogens"
  },
  {
    id: "mlt-b8-057",
    stem: "West Nile virus (WNV) is transmitted by:",
    options: ["Aedes mosquito only", "Culex mosquito (primary vector in North America)", "Tick bite", "Direct person-to-person contact"],
    correctIndex: 1,
    rationale: "West Nile virus: transmitted by Culex mosquitoes. Birds are the natural reservoir. Most infections asymptomatic; <1% develop neuroinvasive disease (encephalitis, meningitis). Diagnosis: WNV IgM in serum or CSF, RT-PCR. No specific treatment or vaccine for humans.",
    difficulty: 2,
    category: "Virology",
    topic: "Emerging Viral Pathogens"
  },
  {
    id: "mlt-b8-058",
    stem: "Rotavirus is the most common cause of severe gastroenteritis in:",
    options: ["Elderly adults", "Children under 5 years of age", "Adolescents", "Healthcare workers"],
    correctIndex: 1,
    rationale: "Rotavirus: most common cause of severe diarrhea in children <5 years worldwide. Detected by EIA (enzyme immunoassay) for rotavirus antigen in stool. Cannot be cultured routinely. Oral vaccines (RotaTeq, Rotarix) have dramatically reduced hospitalizations.",
    difficulty: 1,
    category: "Virology",
    topic: "Rapid Antigen Detection"
  },
  {
    id: "mlt-b8-059",
    stem: "HPV (human papillomavirus) testing in cervical cancer screening detects:",
    options: ["Viral antibodies in serum", "High-risk HPV DNA or mRNA in cervical cells by molecular methods", "Viral culture results", "Complete blood count changes"],
    correctIndex: 1,
    rationale: "HPV testing detects high-risk HPV types (16, 18, and others) by DNA hybridization or mRNA detection from cervical swab specimens. Used in co-testing with Pap smear for cervical cancer screening in women ≥30 years. HPV 16 and 18 cause ~70% of cervical cancers.",
    difficulty: 2,
    category: "Virology",
    topic: "Molecular Viral Testing"
  },
  {
    id: "mlt-b8-060",
    stem: "The hepatitis A virus (HAV) is transmitted by:",
    options: ["Parenteral route (needlestick)", "Fecal-oral route (contaminated food or water)", "Sexual contact exclusively", "Airborne droplets"],
    correctIndex: 1,
    rationale: "HAV: fecal-oral transmission via contaminated food (shellfish, produce) or water. No chronic carrier state. IgM anti-HAV indicates acute infection. IgG anti-HAV indicates past infection or vaccination (immunity). Self-limiting; no specific antiviral treatment.",
    difficulty: 1,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b8-061",
    stem: "H&E (hematoxylin and eosin) staining in histology demonstrates:",
    options: ["Only connective tissue", "Nuclei stain blue-purple (hematoxylin/basophilic) and cytoplasm/connective tissue stain pink (eosin/eosinophilic)", "Fat droplets only", "Acid-fast organisms"],
    correctIndex: 1,
    rationale: "H&E is the most common histological stain. Hematoxylin (basic dye) binds acidic structures (DNA, RNA) → blue-purple nuclei. Eosin (acidic dye) binds basic structures → pink cytoplasm, collagen, muscle. Used as the primary screening stain for tissue sections.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "H&E Staining"
  },
  {
    id: "mlt-b8-062",
    stem: "The fixative of choice for routine histological processing is:",
    options: ["Absolute ethanol", "10% neutral buffered formalin (NBF)", "Bouin fixative", "Glutaraldehyde"],
    correctIndex: 1,
    rationale: "10% NBF (3.7% formaldehyde in phosphate buffer, pH 6.8-7.2) is the standard fixative. It crosslinks proteins, preserving tissue architecture. Fixation time: 24-48 hours for routine biopsies. Glutaraldehyde is used for electron microscopy. Bouin is used for testicular biopsies.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Tissue Fixation & Processing"
  },
  {
    id: "mlt-b8-063",
    stem: "The correct order of tissue processing steps is:",
    options: ["Embedding, fixation, dehydration, clearing", "Fixation, dehydration, clearing, infiltration/embedding", "Clearing, fixation, dehydration, embedding", "Dehydration, fixation, clearing, embedding"],
    correctIndex: 1,
    rationale: "Processing order: (1) Fixation (formalin) → (2) Dehydration (graded alcohols: 70%, 95%, 100%) → (3) Clearing (xylene replaces alcohol, miscible with paraffin) → (4) Infiltration with molten paraffin → (5) Embedding in paraffin block. Each step prepares tissue for the next.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Tissue Fixation & Processing"
  },
  {
    id: "mlt-b8-064",
    stem: "PAS (Periodic Acid-Schiff) stain is positive for:",
    options: ["Collagen only", "Glycogen, mucins, basement membranes, and fungi", "Lipids", "Nucleic acids"],
    correctIndex: 1,
    rationale: "PAS stains carbohydrate-containing structures magenta/pink: glycogen (removed by diastase digestion), neutral mucins, basement membranes, and fungal cell walls. PAS with diastase: glycogen is digested away, remaining positive structures are non-glycogen carbohydrates.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b8-065",
    stem: "Masson trichrome stain demonstrates:",
    options: ["Lipids in yellow", "Collagen in blue/green, muscle in red, nuclei in dark brown/black", "Glycogen in magenta", "Iron in blue"],
    correctIndex: 1,
    rationale: "Masson trichrome: differentiates collagen (blue/green) from muscle/cytoplasm (red) and nuclei (dark brown/black). Used to evaluate fibrosis in liver biopsies, renal biopsies (glomerular basement membrane), and cardiac tissue. Essential for staging liver fibrosis.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b8-066",
    stem: "Congo Red stain with polarized light microscopy showing apple-green birefringence is diagnostic for:",
    options: ["Glycogen storage disease", "Amyloidosis", "Iron overload", "Melanoma"],
    correctIndex: 1,
    rationale: "Congo Red stains amyloid deposits orange-red under light microscopy. Under polarized light, amyloid shows characteristic apple-green birefringence. This is the gold standard for amyloid identification in tissue. Amyloidosis can be systemic (AL, AA) or localized.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b8-067",
    stem: "Frozen sections are performed during surgery primarily to:",
    options: ["Save time on routine processing", "Provide rapid intraoperative diagnosis (usually within 15-20 minutes)", "Improve staining quality", "Preserve antigens better than formalin fixation"],
    correctIndex: 1,
    rationale: "Frozen sections: tissue is rapidly frozen (cryostat at -20 to -25°C), sectioned, and H&E stained for intraoperative consultation. Provides diagnosis within 15-20 minutes to guide surgical decisions (e.g., tumor margins, lymph node status). Quality is lower than paraffin sections.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Frozen Sections"
  },
  {
    id: "mlt-b8-068",
    stem: "GMS (Grocott-Gomori methenamine silver) stain is used to identify:",
    options: ["Collagen fibers", "Fungal organisms (stains cell walls black against green background)", "Iron deposits", "Calcium deposits"],
    correctIndex: 1,
    rationale: "GMS stains fungal cell walls black/dark brown against a light green counterstain. Used to identify Pneumocystis jirovecii (crushed ping-pong ball appearance), Aspergillus, Candida, and other fungi in tissue. Also stains some bacteria and parasites.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b8-069",
    stem: "Immunohistochemistry (IHC) uses which principle to detect antigens in tissue?",
    options: ["DNA hybridization", "Labeled antibodies that bind to specific tissue antigens, visualized by chromogenic or fluorescent detection", "Enzyme kinetics", "Mass spectrometry"],
    correctIndex: 1,
    rationale: "IHC: antibodies (monoclonal or polyclonal) bind specific tissue antigens. Detected by enzyme-labeled secondary antibodies (DAB chromogen → brown color) or fluorescent labels. Antigen retrieval (HIER or enzyme digestion) reverses formalin crosslinks. Essential for tumor classification.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b8-070",
    stem: "Decalcification of bone specimens before histological processing uses:",
    options: ["Xylene", "Acid solutions (formic acid, hydrochloric acid) or chelating agents (EDTA)", "Alcohol dehydration alone", "Formalin only"],
    correctIndex: 1,
    rationale: "Decalcification removes calcium from bone/calcified tissue so it can be sectioned. Acid decalcifiers (formic acid, HCl) are faster but may damage tissue. EDTA chelation is gentler (better morphology/IHC preservation) but slower (days to weeks). Endpoint testing confirms completion.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Decalcification"
  },
  {
    id: "mlt-b8-071",
    stem: "Optimal section thickness for routine H&E-stained paraffin sections is:",
    options: ["1-2 µm", "4-5 µm", "10-15 µm", "20-25 µm"],
    correctIndex: 1,
    rationale: "Standard paraffin section thickness: 4-5 µm. This provides optimal detail with single cell layers visible. Thicker sections (10-15 µm) are used for frozen sections. Thinner sections (1-2 µm) are used for resin-embedded electron microscopy specimens.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Embedding & Microtomy"
  },
  {
    id: "mlt-b8-072",
    stem: "The IHC marker cytokeratin (CK) is positive in:",
    options: ["Lymphomas", "Carcinomas (epithelial tumors)", "Sarcomas", "Melanomas"],
    correctIndex: 1,
    rationale: "Cytokeratin: intermediate filament protein found in epithelial cells. CK-positive tumors = carcinomas. Vimentin = mesenchymal tumors (sarcomas). S-100 = melanoma, neural tumors. CD45/LCA = lymphomas. IHC panel helps classify undifferentiated tumors.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b8-073",
    stem: "Quality control in histology includes checking for all of the following EXCEPT:",
    options: ["Proper fixation time and temperature", "Correct embedding orientation", "Section thickness verification", "Patient's blood type"],
    correctIndex: 3,
    rationale: "Histology QC includes: fixation monitoring, processing quality, embedding orientation, section thickness, staining consistency, positive/negative controls for special stains and IHC, and proper labeling. Patient blood type is not part of histology quality control.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Quality Control in Histology"
  },
  {
    id: "mlt-b8-074",
    stem: "Prussian blue (Perls) stain in histology demonstrates:",
    options: ["Glycogen", "Hemosiderin (iron) deposits appearing blue", "Collagen fibers", "Calcium"],
    correctIndex: 1,
    rationale: "Prussian blue stain: potassium ferrocyanide + HCl reacts with ferric iron (Fe³⁺) in tissue to form blue precipitate. Used to detect hemosiderin deposits in liver (hemochromatosis), bone marrow iron stores, and transfusional iron overload. Nuclear fast red counterstain.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b8-075",
    stem: "The Bethesda System classification for cervical cytology reporting includes which categories?",
    options: ["Only normal and cancer", "NILM, ASC-US, ASC-H, LSIL, HSIL, SCC, and adenocarcinoma", "Grades I through IV only", "Positive and negative only"],
    correctIndex: 1,
    rationale: "Bethesda System: NILM (negative for intraepithelial lesion), ASC-US (atypical squamous cells of undetermined significance), ASC-H (cannot exclude HSIL), LSIL (low-grade SIL), HSIL (high-grade SIL), SCC (squamous cell carcinoma), adenocarcinoma. Also includes specimen adequacy assessment.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Bethesda System Classification"
  },
  {
    id: "mlt-b8-076",
    stem: "Koilocytes on a Pap smear indicate:",
    options: ["Bacterial infection", "HPV (human papillomavirus) infection — characterized by perinuclear clearing (halo) and nuclear wrinkling", "Candida infection", "Normal endocervical cells"],
    correctIndex: 1,
    rationale: "Koilocytes: squamous cells with perinuclear cavitation (halo), nuclear enlargement, irregularity, and wrinkling/hyperchromasia. Pathognomonic for HPV infection. Classified as LSIL in the Bethesda System. High-risk HPV types (16, 18) are associated with cervical cancer progression.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Pap Smear Evaluation"
  },
  {
    id: "mlt-b8-077",
    stem: "Fine needle aspiration (FNA) cytology is most commonly used for:",
    options: ["Blood cell counts", "Rapid evaluation of palpable masses (thyroid, breast, lymph node) with minimal invasion", "Routine Pap smears", "Tissue fixation"],
    correctIndex: 1,
    rationale: "FNA: thin needle (22-25 gauge) inserted into palpable or image-guided mass to aspirate cells for cytological evaluation. Minimally invasive, outpatient procedure. Used for thyroid nodules, breast masses, lymph nodes, and soft tissue lesions. Rapid on-site evaluation (ROSE) improves adequacy.",
    difficulty: 1,
    category: "Cytotechnology",
    topic: "Fine Needle Aspiration"
  },
  {
    id: "mlt-b8-078",
    stem: "Liquid-based cytology (ThinPrep, SurePath) offers which advantage over conventional Pap smears?",
    options: ["Lower cost", "Reduced obscuring factors (blood, mucus, inflammation), improved cell preservation, and ability to perform HPV co-testing from same vial", "Faster processing time", "No fixation required"],
    correctIndex: 1,
    rationale: "Liquid-based cytology: cells collected directly into liquid fixative. Advantages: reduced obscuring factors, thin uniform monolayer, improved sensitivity for HSIL, and residual specimen available for HPV testing, GC/CT testing, or other molecular tests from the same collection vial.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Liquid-Based Cytology"
  },
  {
    id: "mlt-b8-079",
    stem: "Non-gynecological cytology specimens include all of the following EXCEPT:",
    options: ["Pleural fluid", "Urine cytology", "Bronchial washings", "Complete blood count"],
    correctIndex: 3,
    rationale: "Non-gynecological cytology evaluates cells from: body fluids (pleural, peritoneal, pericardial), urine, sputum, bronchial washings/brushings, CSF, and FNA specimens. CBC is a hematology test, not cytology. These specimens are evaluated for malignant cells and infectious organisms.",
    difficulty: 1,
    category: "Cytotechnology",
    topic: "Non-Gynecological Cytology"
  },
  {
    id: "mlt-b8-080",
    stem: "An adequate Pap smear must include cells from which area of the cervix?",
    options: ["Only the ectocervix", "The transformation zone (squamocolumnar junction)", "Only the endocervix", "The vaginal wall only"],
    correctIndex: 1,
    rationale: "The transformation zone (T-zone/squamocolumnar junction) is where most cervical neoplasia originates. An adequate Pap must sample this area. Presence of endocervical cells and/or metaplastic squamous cells confirms T-zone sampling. Their absence may require notation of limited adequacy.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Pap Smear Evaluation"
  },
  {
    id: "mlt-b8-081",
    stem: "The germ tube test is positive for:",
    options: ["Cryptococcus neoformans", "Candida albicans", "Aspergillus fumigatus", "Trichophyton rubrum"],
    correctIndex: 1,
    rationale: "Germ tube test: C. albicans produces true germ tubes (short hyphal extensions with no constriction at the base) when incubated in serum at 37°C for 2-3 hours. C. tropicalis produces pseudohyphae (constriction at base). Rapid, presumptive ID for C. albicans.",
    difficulty: 1,
    category: "Mycology",
    topic: "Yeasts"
  },
  {
    id: "mlt-b8-082",
    stem: "The five classic dimorphic fungi (thermal dimorphism: mold at 25°C, yeast at 37°C) include:",
    options: ["Candida, Aspergillus, Mucor, Cryptococcus, Malassezia", "Histoplasma, Blastomyces, Coccidioides, Paracoccidioides, Talaromyces (Penicillium) marneffei", "All dermatophytes", "Pneumocystis, Candida, Aspergillus, Mucor, Fusarium"],
    correctIndex: 1,
    rationale: "Classic dimorphic fungi (mold at 25°C, yeast at 37°C): Histoplasma capsulatum, Blastomyces dermatitidis, Coccidioides immitis, Paracoccidioides brasiliensis, and Talaromyces (Penicillium) marneffei. All are BSL-3 organisms. Geographic distribution is important for diagnosis.",
    difficulty: 2,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b8-083",
    stem: "Cryptococcus neoformans is identified by:",
    options: ["Positive germ tube test", "India ink showing encapsulated yeast with wide capsule, urease positive, brown colonies on niger seed agar", "Lactophenol cotton blue showing septate hyphae", "KOH showing dermatophyte hyphae"],
    correctIndex: 1,
    rationale: "Cryptococcus neoformans: encapsulated yeast, positive India ink (wide clear capsule around yeast cells in CSF), urease positive, melanin production (brown on niger/birdseed agar). Cryptococcal antigen (CrAg) by lateral flow assay is highly sensitive and specific. Causes meningitis in immunocompromised.",
    difficulty: 2,
    category: "Mycology",
    topic: "Yeasts"
  },
  {
    id: "mlt-b8-084",
    stem: "Aspergillus fumigatus in tissue shows:",
    options: ["Broad, non-septate hyphae with 90° branching", "Narrow (3-6 µm), septate hyphae with 45° dichotomous branching", "Budding yeast with pseudohyphae", "Spherules with endospores"],
    correctIndex: 1,
    rationale: "Aspergillus: narrow (3-6 µm), septate hyphae with regular 45° dichotomous branching. Contrast with Mucor/Rhizopus: wide (6-25 µm), ribbon-like, pauci-septate, with 90° irregular branching. Tissue morphology is crucial for guiding antifungal therapy (voriconazole for Aspergillus, amphotericin for Mucor).",
    difficulty: 2,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b8-085",
    stem: "KOH (potassium hydroxide) preparation is used to:",
    options: ["Culture fungi from clinical specimens", "Dissolve keratin and cellular debris to visualize fungal elements in skin, hair, and nail specimens", "Stain bacteria", "Detect viral inclusions"],
    correctIndex: 1,
    rationale: "KOH (10-20%) dissolves keratinized tissue, clearing skin scrapings, hair, and nails to reveal fungal hyphae, arthrospores, or yeast cells. Adding calcofluor white enhances visualization under fluorescent microscopy. Quick, inexpensive screening test for dermatophyte infections.",
    difficulty: 1,
    category: "Mycology",
    topic: "KOH Preparation"
  },
  {
    id: "mlt-b8-086",
    stem: "Dermatophytes infect which tissue types?",
    options: ["Deep organs (liver, spleen)", "Keratinized tissue only: skin, hair, and nails", "Blood and bone marrow", "Central nervous system"],
    correctIndex: 1,
    rationale: "Dermatophytes are keratinophilic fungi that infect keratinized structures: skin (tinea corporis), hair (tinea capitis), and nails (tinea unguium/onychomycosis). Three genera: Trichophyton, Microsporum, Epidermophyton. They do not invade deep tissue. Identified by colony and microscopic morphology.",
    difficulty: 1,
    category: "Mycology",
    topic: "Dermatophytes"
  },
  {
    id: "mlt-b8-087",
    stem: "Histoplasma capsulatum in bone marrow or tissue appears as:",
    options: ["Large budding yeast", "Small (2-4 µm) oval yeast cells within macrophages", "Spherules with endospores", "Septate hyphae"],
    correctIndex: 1,
    rationale: "Histoplasma: small (2-4 µm) oval yeast with narrow-based budding, found INSIDE macrophages (intracellular). GMS or PAS stain. Acquired by inhalation of microconidia from bat/bird guano contaminated soil (Ohio/Mississippi River valleys). Disseminates in immunocompromised.",
    difficulty: 3,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b8-088",
    stem: "Coccidioides immitis in tissue is identified by:",
    options: ["Small intracellular yeasts", "Large spherules (20-60 µm) containing endospores", "Broad-based budding yeast", "Septate branching hyphae"],
    correctIndex: 1,
    rationale: "Coccidioides: tissue form = large spherules (20-60 µm) filled with endospores (2-5 µm). When spherules rupture, endospores are released and form new spherules. Endemic to southwestern US (San Joaquin Valley fever). Arthroconidia in mold form are highly infectious (BSL-3).",
    difficulty: 3,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b8-089",
    stem: "Antifungal susceptibility testing for yeasts uses which standardized method?",
    options: ["Kirby-Bauer disk diffusion only", "CLSI broth microdilution (M27) or Etest for determining MIC values", "Coagulase test", "Serological testing"],
    correctIndex: 1,
    rationale: "CLSI M27 broth microdilution is the reference method for yeast antifungal susceptibility. Etest provides a gradient diffusion MIC on agar. M44 disk diffusion is available for fluconazole and voriconazole against Candida. Results guide therapy (azoles, echinocandins, amphotericin B).",
    difficulty: 3,
    category: "Mycology",
    topic: "Antifungal Susceptibility"
  },
  {
    id: "mlt-b8-090",
    stem: "Blastomyces dermatitidis in tissue is characterized by:",
    options: ["Small intracellular yeast", "Large (8-15 µm) thick-walled yeast with broad-based budding", "Spherules with endospores", "Narrow-based budding with capsule"],
    correctIndex: 1,
    rationale: "Blastomyces: large (8-15 µm) yeast with thick, refractile (double-contoured) cell wall and characteristic broad-based budding (wide connection between parent and daughter cell). Endemic to Great Lakes/Ohio-Mississippi River regions. Causes pulmonary and disseminated disease.",
    difficulty: 3,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b8-091",
    stem: "A point-of-care glucose meter shows a reading of 35 mg/dL in a neonatal ICU patient with a hematocrit of 65%. The MOST likely explanation is:",
    options: ["True hypoglycemia requiring immediate treatment", "Falsely low result due to high hematocrit interference with the glucose oxidase strip method", "Instrument malfunction", "Specimen contamination"],
    correctIndex: 1,
    rationale: "Many POC glucose meters use whole blood and are affected by extreme hematocrits. High hematocrit (polycythemia, neonates) causes falsely LOW glucose readings because less plasma is available in the sample. Low hematocrit causes falsely HIGH readings. Confirmatory laboratory testing is recommended.",
    difficulty: 3,
    category: "Point-of-Care Testing",
    topic: "Glucose Meters"
  },
  {
    id: "mlt-b8-092",
    stem: "Point-of-care blood gas analyzers (e.g., i-STAT) measure which analytes directly?",
    options: ["Only pH", "pH, pCO2, pO2, and selected electrolytes (Na, K, iCa, Cl) and metabolites (glucose, lactate, BUN, creatinine)", "Only hemoglobin", "Only coagulation factors"],
    correctIndex: 1,
    rationale: "POC blood gas analyzers use ion-selective electrodes and biosensors to directly measure pH, pCO2, pO2, and various electrolytes and metabolites from a small whole blood sample. HCO3 and base excess are calculated values. Results available in 2-3 minutes for critical care decision-making.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Blood Gas Analyzers"
  },
  {
    id: "mlt-b8-093",
    stem: "CLIA-waived tests are defined as tests that:",
    options: ["Require highly trained personnel", "Are simple, have low risk of erroneous results, and are approved for use outside traditional laboratory settings", "Must be performed in a reference laboratory", "Require daily quality control only"],
    correctIndex: 1,
    rationale: "CLIA-waived tests: simple, accurate, pose negligible risk if performed incorrectly. Examples: urine dipstick, urine pregnancy, POC glucose, rapid strep, rapid flu, fecal occult blood. Even waived tests require following manufacturer instructions, although QC requirements are less stringent.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "Quality Management for POCT"
  },
  {
    id: "mlt-b8-094",
    stem: "Rapid strep tests (lateral flow immunoassay) detect which antigen?",
    options: ["Streptolysin O", "Group A Streptococcus (Lancefield group A) carbohydrate antigen from throat swabs", "Protein A", "M protein"],
    correctIndex: 1,
    rationale: "Rapid strep tests detect Lancefield group A carbohydrate antigen (N-acetylglucosamine) from throat swabs. High specificity (~95-99%) but lower sensitivity (~70-90%). Negative rapid tests in children should be confirmed by throat culture. Positive results do not require confirmation.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "Rapid Strep / Flu / COVID Testing"
  },
  {
    id: "mlt-b8-095",
    stem: "Urine pregnancy tests (POC) detect:",
    options: ["Estrogen", "Human chorionic gonadotropin (hCG) in urine", "Progesterone", "FSH"],
    correctIndex: 1,
    rationale: "POC pregnancy tests detect hCG (human chorionic gonadotropin) produced by the placental trophoblast. Detectable 7-10 days after implantation. Most tests detect ≥20-25 mIU/mL hCG. First morning void is optimal (most concentrated). False negatives possible if tested too early.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "Urine Pregnancy Testing"
  },
  {
    id: "mlt-b8-096",
    stem: "POC coagulation testing (e.g., i-STAT ACT) is commonly used in:",
    options: ["Routine outpatient screening", "Operating rooms and cardiac catheterization labs to monitor heparin anticoagulation during procedures", "Urine testing", "Microbiology identification"],
    correctIndex: 1,
    rationale: "POC activated clotting time (ACT) monitors heparin during cardiopulmonary bypass, cardiac catheterization, and ECMO. ACT is prolonged by heparin. Target ACT varies by procedure (400-600 seconds for CPB). POC INR devices are used for warfarin monitoring in clinics.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Coagulation Point-of-Care"
  },
  {
    id: "mlt-b8-097",
    stem: "Quality management for POCT requires:",
    options: ["No quality control since tests are simple", "Operator training/competency, regular QC testing, proficiency testing, and documentation per regulatory requirements", "Only annual instrument inspection", "No documentation needed"],
    correctIndex: 1,
    rationale: "POCT quality management: operator training and competency assessment, QC per manufacturer and regulatory requirements, proficiency testing, result documentation, instrument maintenance, and correlation studies with central laboratory methods. POCT coordinator oversees compliance.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Quality Management for POCT"
  },
  {
    id: "mlt-b8-098",
    stem: "A POC hemoglobin/hematocrit device (e.g., HemoCue) uses which measurement principle?",
    options: ["Coulter impedance", "Modified azide methemoglobin photometric method on a microcuvette", "Flow cytometry", "Manual centrifugation"],
    correctIndex: 1,
    rationale: "HemoCue: capillary or venous blood fills a microcuvette containing dried reagent. Hemoglobin is converted to azide methemoglobin and measured photometrically at dual wavelengths. Results in ~60 seconds. Used in blood donation screening, clinics, and resource-limited settings.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Glucose Meters"
  },
  {
    id: "mlt-b8-099",
    stem: "Rapid influenza diagnostic tests (RIDTs) detect:",
    options: ["Influenza RNA", "Influenza nucleoprotein antigen by immunochromatographic lateral flow", "Influenza antibodies in serum", "Influenza culture growth"],
    correctIndex: 1,
    rationale: "RIDTs detect influenza nucleoprotein antigens (NP) by immunochromatographic lateral flow assay. Results in 10-15 minutes. Sensitivity 50-70% (lower than molecular tests). Positive results are reliable; negative results should be confirmed by molecular testing during influenza season.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Rapid Strep / Flu / COVID Testing"
  },
  {
    id: "mlt-b8-100",
    stem: "POC creatinine testing is used for:",
    options: ["Diagnosing renal cancer", "Rapid assessment of kidney function before contrast dye administration for imaging procedures", "Urine culture", "Blood typing"],
    correctIndex: 1,
    rationale: "POC creatinine/eGFR: used in radiology departments to assess kidney function before administering iodinated contrast media (risk of contrast-induced nephropathy). Also used in emergency departments and clinics. Results in 2-5 minutes allow immediate clinical decision-making.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Blood Gas Analyzers"
  },
  {
    id: "mlt-b8-101",
    stem: "A laboratory scientist notices that the QC for a chemistry analyzer has been trending upward for the last 5 days, with the most recent control exceeding +2 SD. According to Westgard rules, this pattern represents:",
    options: ["Random error only", "A trend indicating systematic error — investigate calibration drift, reagent degradation, or temperature change", "Acceptable performance", "No action needed until it exceeds 3 SD"],
    correctIndex: 1,
    rationale: "Five consecutive controls on the same side of the mean violates the 5x trend rule. Progressive increase suggests systematic error: deteriorating reagent, calibration drift, light source aging, or temperature change. Action: recalibrate, check reagents, verify temperatures. Do not report patient results until resolved.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b8-102",
    stem: "A new chemistry method is being validated. The comparison study requires testing a minimum of:",
    options: ["5 patient specimens", "20 patient specimens across the reportable range", "40 patient specimens across the reportable range over 5 days (per CLSI EP09)", "100 specimens"],
    correctIndex: 2,
    rationale: "CLSI EP09-A3 recommends 40 patient specimens spanning the analytical measurement range, tested over ≥5 days on both the new and reference/comparative method. Results are analyzed by Deming regression, Bland-Altman plots, and correlation statistics to assess agreement and bias.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b8-103",
    stem: "Exposure to formaldehyde in the histology lab requires:",
    options: ["No special precautions", "Fume hood use, monitoring airborne levels, and adherence to OSHA PEL of 0.75 ppm TWA", "Only gloves", "Working near an open window"],
    correctIndex: 1,
    rationale: "Formaldehyde: OSHA PEL = 0.75 ppm (8-hour TWA), STEL = 2 ppm (15 minutes). Classified as a human carcinogen (IARC Group 1). Requires chemical fume hoods, personal monitoring, engineering controls, PPE (gloves, goggles), and training. Formalin-free fixatives are being explored.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Laboratory Safety"
  },
  {
    id: "mlt-b8-104",
    stem: "A Levy-Jennings chart shows the last 8 control values alternating above and below the mean but within 2 SD. This pattern suggests:",
    options: ["Systematic error (shift)", "Random error", "Acceptable precision", "Equipment malfunction requiring immediate shutdown"],
    correctIndex: 2,
    rationale: "Control values alternating randomly around the mean within ±2 SD represents normal, acceptable variation (good precision). No Westgard rules are violated. This is the expected pattern of a well-functioning analytical system. Random scatter around the mean indicates absence of systematic bias.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b8-105",
    stem: "The LIS (Laboratory Information System) function that automatically releases results meeting all predefined criteria is called:",
    options: ["Manual verification", "Autoverification", "Delta check", "Reflex testing"],
    correctIndex: 1,
    rationale: "Autoverification: LIS automatically reviews and releases results that meet all defined criteria: within reference range, no delta check violation, QC in control, no instrument flags, no critical values. Reduces TAT. Non-autoverified results require manual review by a qualified technologist.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Laboratory Information Systems"
  },
  {
    id: "mlt-b8-106",
    stem: "Reference range establishment requires testing a minimum of how many healthy individuals per CLSI C28-A3?",
    options: ["20", "50", "120", "500"],
    correctIndex: 2,
    rationale: "CLSI C28-A3c recommends a minimum of 120 healthy reference individuals to establish a reference range using non-parametric statistical methods (2.5th and 97.5th percentiles). Demographics should match the target population. Smaller studies (20-60) can be used for verification (transference) of established ranges.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b8-107",
    stem: "Biological safety cabinets (BSC) Class II Type A2 protect:",
    options: ["The worker only", "The worker, the specimen, and the environment through HEPA-filtered laminar airflow", "Only the specimen", "Only the environment"],
    correctIndex: 1,
    rationale: "Class II BSC provides three protections: worker (inward airflow), specimen (downward HEPA-filtered laminar flow), and environment (HEPA-filtered exhaust). Required for BSL-2 and BSL-3 work. Certification required annually. Type A2 recirculates 70% of air through HEPA filter.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Laboratory Safety"
  },
  {
    id: "mlt-b8-108",
    stem: "Specimen rejection criteria include all of the following EXCEPT:",
    options: ["Hemolyzed specimen for potassium", "Clotted specimen in EDTA tube for CBC", "Unlabeled specimen", "Specimen with correct patient identifiers and appropriate collection tube"],
    correctIndex: 3,
    rationale: "Rejection criteria: hemolysis (K, LDH, AST), lipemia, icterus, clotted anticoagulated tubes, wrong tube, under-filled citrate tubes, unlabeled/mislabeled specimens, expired tubes, improper transport conditions. A properly labeled, correctly collected specimen should be accepted.",
    difficulty: 1,
    category: "Laboratory Operations & Quality Management",
    topic: "Specimen Rejection Criteria"
  },
  {
    id: "mlt-b8-109",
    stem: "Lean and Six Sigma in the laboratory focus on:",
    options: ["Increasing the number of tests performed per day", "Eliminating waste (Lean) and reducing variation/defects (Six Sigma) to improve quality and efficiency", "Adding more staff", "Purchasing the most expensive equipment"],
    correctIndex: 1,
    rationale: "Lean: eliminate waste (overproduction, waiting, transport, overprocessing, inventory, motion, defects). Six Sigma: reduce process variation using DMAIC (Define, Measure, Analyze, Improve, Control). Goal: <3.4 defects per million opportunities. Both methodologies improve laboratory quality and reduce costs.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Lean & Six Sigma in the Lab"
  },
  {
    id: "mlt-b8-110",
    stem: "CLIA proficiency testing (PT) failure in the same analyte for two consecutive testing events results in:",
    options: ["A warning letter", "Mandatory cessation of testing for that analyte until corrective action is completed and approved", "No consequence", "Automatic laboratory closure"],
    correctIndex: 1,
    rationale: "Two consecutive PT failures for the same analyte = unsuccessful PT. The laboratory must stop testing, investigate root cause, implement corrective action, and pass a subsequent PT event before resuming testing. CMS may impose sanctions. PT is a critical component of laboratory quality assessment.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Proficiency Testing"
  },
  {
    id: "mlt-b8-111",
    stem: "A laboratory technologist is performing a Gram stain on a CSF specimen. After crystal violet staining, the decolorization step uses:",
    options: ["Safranin", "Acetone-alcohol (or just acetone)", "Iodine", "Crystal violet again"],
    correctIndex: 1,
    rationale: "Gram stain procedure: (1) Crystal violet (primary stain, 1 min) → (2) Gram's iodine (mordant, 1 min) → (3) Decolorizer (acetone-alcohol, 5-10 sec) → (4) Safranin (counterstain, 30 sec-1 min). Gram-positive retain crystal violet-iodine complex (purple). Gram-negative are decolorized and take up safranin (pink).",
    difficulty: 1,
    category: "Microbiology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b8-112",
    stem: "A case-based scenario: A 35-year-old woman presents with fatigue and jaundice. Labs show: Hgb 8.5 g/dL, reticulocytes 12%, LDH elevated, indirect bilirubin elevated, haptoglobin <10 mg/dL, DAT positive with anti-IgG. The MOST likely diagnosis is:",
    options: ["Iron deficiency anemia", "Warm autoimmune hemolytic anemia (AIHA)", "Hereditary spherocytosis", "Pernicious anemia"],
    correctIndex: 1,
    rationale: "Clinical scenario demonstrates hemolytic anemia (elevated retics, LDH, indirect bilirubin, low haptoglobin) with positive DAT (anti-IgG on red cells) = warm AIHA. IgG autoantibodies coat RBCs → splenic macrophage destruction. Cold AIHA would show complement (C3d) on DAT. Treatment: corticosteroids, rituximab.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-113",
    stem: "Case study: A chemistry analyzer QC shows Level 1 (normal) at +2.5 SD and Level 2 (abnormal) at -2.8 SD. The R-4s rule is violated because:",
    options: ["Both controls are beyond 2 SD", "The algebraic difference between the two controls exceeds 4 SD (2.5 + 2.8 = 5.3 SD range)", "One control is beyond 3 SD", "Seven consecutive controls are on one side"],
    correctIndex: 1,
    rationale: "R-4s rule: the range between two controls within a run exceeds 4 SD. Here: +2.5 SD - (-2.8 SD) = 5.3 SD range, which exceeds 4 SD. This indicates random error. Possible causes: pipetting error, air bubbles, temperature fluctuation. Patient results from this run should not be reported.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b8-114",
    stem: "A technologist notices the chemistry analyzer's sodium results are consistently 3 mEq/L higher than the reference method. This represents:",
    options: ["Random error (imprecision)", "Systematic error/bias (inaccuracy) — requires recalibration", "Normal variation", "Excellent precision"],
    correctIndex: 1,
    rationale: "Consistent deviation in one direction from the reference = systematic error (bias/inaccuracy). Positive bias of +3 mEq/L could be due to calibration error, deteriorated calibrator, or method-specific interference. Action: recalibrate, verify calibrators, check for interfering substances.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b8-115",
    stem: "Case: A blood bank technologist performs an antibody panel. The patient's serum reacts at IAT with cells 2, 4, 7, and 10. Using the rule of three, a positive identification requires reactivity with at least 3 antigen-positive cells and non-reactivity with at least 3 antigen-negative cells. Anti-E is identified. The antibody significance is:",
    options: ["Clinically insignificant IgM antibody", "Clinically significant IgG antibody capable of causing hemolytic transfusion reactions and HDFN — antigen-negative units required", "Cold agglutinin with no clinical significance", "Naturally occurring antibody"],
    correctIndex: 1,
    rationale: "Anti-E (Rh system) is a clinically significant IgG antibody detected at IAT phase. Can cause delayed hemolytic transfusion reactions and HDFN. Crossmatch-compatible, E-negative units must be provided. All Rh antibodies (anti-D, -C, -c, -E, -e) are clinically significant.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Antibody Identification"
  },
  {
    id: "mlt-b8-116",
    stem: "A lab value interpretation scenario: Na 125 mEq/L, K 5.8 mEq/L, glucose 750 mg/dL. After correcting sodium for hyperglycemia, the corrected sodium is approximately:",
    options: ["125 mEq/L (no correction needed)", "135 mEq/L", "115 mEq/L", "145 mEq/L"],
    correctIndex: 1,
    rationale: "Corrected Na = measured Na + 1.6 × [(glucose - 100)/100]. Here: 125 + 1.6 × [(750-100)/100] = 125 + 1.6 × 6.5 = 125 + 10.4 ≈ 135 mEq/L. Hyperglycemia causes osmotic fluid shift, diluting sodium. The corrected value reveals the true sodium status. Elevated K in this DKA scenario is also expected.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b8-117",
    stem: "Case: CSF analysis shows WBC 1,200/µL (90% neutrophils), protein 250 mg/dL, glucose 20 mg/dL (serum glucose 100 mg/dL). Gram stain shows gram-positive diplococci. This is MOST consistent with:",
    options: ["Viral meningitis", "Bacterial meningitis (likely Streptococcus pneumoniae)", "Fungal meningitis", "Normal CSF"],
    correctIndex: 1,
    rationale: "Bacterial meningitis profile: high WBC with neutrophil predominance, elevated protein, very low glucose (CSF/serum ratio 0.2, normal >0.6). Gram-positive diplococci = S. pneumoniae (most common cause in adults). Viral meningitis shows lymphocyte predominance with normal glucose.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-118",
    stem: "Instrument troubleshooting: A chemistry analyzer consistently produces error code 'R1 reagent insufficient.' The FIRST step is to:",
    options: ["Replace the entire instrument", "Check reagent volume, expiration date, and proper loading/positioning in the instrument", "Ignore and continue testing", "Recalibrate immediately"],
    correctIndex: 1,
    rationale: "Systematic troubleshooting approach: check the simplest causes first. R1 reagent insufficient may be due to: low reagent volume, improper loading position, expired reagent, kinked tubing, or probe/aspiration error. Verify supply before investigating more complex causes.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b8-119",
    stem: "A body fluid analysis of pleural fluid shows: WBC 15,000/µL, protein 5.5 g/dL (serum protein 7.0 g/dL), LDH 250 IU/L (serum LDH 200 IU/L). This is classified as:",
    options: ["Transudate", "Exudate (meets Light's criteria)", "Normal pleural fluid", "Hemorrhagic effusion"],
    correctIndex: 1,
    rationale: "Light's criteria for exudate (any ONE): pleural/serum protein ratio >0.5 (5.5/7.0 = 0.79 ✓), pleural/serum LDH ratio >0.6 (250/200 = 1.25 ✓), or pleural LDH > 2/3 upper limit of normal serum LDH. Exudates suggest infection, malignancy, or inflammation. Transudates suggest CHF or cirrhosis.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-120",
    stem: "A synovial fluid analysis shows: negatively birefringent needle-shaped crystals under polarized microscopy. This finding is diagnostic for:",
    options: ["Pseudogout (calcium pyrophosphate deposition)", "Gout (monosodium urate crystals)", "Septic arthritis", "Rheumatoid arthritis"],
    correctIndex: 1,
    rationale: "Monosodium urate (MSU) crystals in gout: needle-shaped, strongly negatively birefringent (yellow when parallel to slow ray of compensator). CPPD crystals in pseudogout: rhomboid/rod-shaped, weakly positively birefringent (blue when parallel). Mnemonic: Negative birefringence = Needles = gout (N-N-N).",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Synovial Fluid"
  },
  {
    id: "mlt-b8-121",
    stem: "A case scenario: An ABG shows pH 7.52, pCO2 28 mmHg, HCO3 22 mEq/L. The acid-base disorder is:",
    options: ["Metabolic acidosis", "Respiratory alkalosis (acute, uncompensated)", "Metabolic alkalosis", "Respiratory acidosis"],
    correctIndex: 1,
    rationale: "pH 7.52 (alkalotic) + low pCO2 28 mmHg (respiratory cause) + normal HCO3 22 mEq/L (no metabolic compensation yet) = acute uncompensated respiratory alkalosis. Caused by hyperventilation (anxiety, pain, PE, sepsis, high altitude). If chronic, kidneys would excrete HCO3 to compensate.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b8-122",
    stem: "Case: A 55-year-old male presents with bone pain. Labs: calcium 13.5 mg/dL, PTH 450 pg/mL (elevated), phosphorus 2.0 mg/dL (low), ALP elevated. The MOST likely diagnosis is:",
    options: ["Hypoparathyroidism", "Primary hyperparathyroidism", "Vitamin D deficiency", "Renal failure"],
    correctIndex: 1,
    rationale: "Primary hyperparathyroidism: elevated calcium, elevated PTH (inappropriate for the hypercalcemia), low phosphorus (PTH increases renal phosphorus excretion), elevated ALP (increased bone turnover). Usually caused by parathyroid adenoma. Secondary hyperparathyroidism (renal failure) shows low calcium, elevated PTH.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-123",
    stem: "Troubleshooting scenario: A hematology analyzer reports an MCHC of 42 g/dL. This impossible result is MOST likely caused by:",
    options: ["True spherocytosis", "Cold agglutinins causing RBC clumping (falsely low RBC count and falsely elevated MCV)", "Iron deficiency anemia", "Normal variation"],
    correctIndex: 1,
    rationale: "MCHC >36.5 g/dL is physiologically impossible (except in spherocytosis where it approaches 36-37). Cold agglutinins: RBC clumps counted as larger, fewer cells → falsely low RBC, falsely elevated MCV → calculated MCHC dramatically elevated. Warm to 37°C and re-run.",
    difficulty: 3,
    category: "Hematology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b8-124",
    stem: "A DIC panel shows: PT 22 sec (ref 11-13), aPTT 55 sec (ref 25-35), fibrinogen 85 mg/dL (ref 200-400), D-dimer >20 µg/mL (ref <0.5), platelets 45,000/µL. Peripheral smear shows schistocytes. The ISTH DIC score indicates:",
    options: ["Normal coagulation", "Overt DIC — consumption of coagulation factors, fibrinogen, and platelets with active fibrinolysis", "Isolated thrombocytopenia", "Heparin effect"],
    correctIndex: 1,
    rationale: "ISTH DIC scoring: prolonged PT (+2), decreased fibrinogen (+1), markedly elevated D-dimer (+3), decreased platelets (+2) = score ≥5 = overt DIC. Treatment: treat underlying cause, replace consumed components (platelets, FFP, cryoprecipitate for fibrinogen), consider heparin if thrombosis predominates.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-125",
    stem: "A transfusion reaction workup shows: post-transfusion DAT positive (pre-transfusion was negative), positive eluate showing anti-Jk^a, hemolyzed post-transfusion serum. This represents:",
    options: ["Febrile non-hemolytic reaction", "Acute hemolytic transfusion reaction due to anti-Jk^a (anamnestic response)", "Allergic reaction", "TRALI"],
    correctIndex: 1,
    rationale: "Newly positive DAT post-transfusion with anti-Jk^a in eluate = hemolytic transfusion reaction. Kidd (Jk) antibodies are notorious: they can drop below detectable levels (undetectable on pre-transfusion antibody screen) then rapidly rise upon re-exposure (anamnestic response), causing delayed HTR.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b8-126",
    stem: "An iron studies panel shows: serum iron 180 µg/dL, TIBC 200 µg/dL, ferritin 1,500 ng/mL, transferrin saturation 90%. This pattern indicates:",
    options: ["Iron deficiency anemia", "Iron overload (hemochromatosis or transfusional)", "Anemia of chronic disease", "Normal iron status"],
    correctIndex: 1,
    rationale: "Iron overload pattern: elevated serum iron, low/normal TIBC (body doesn't need more transferrin), very elevated ferritin (iron stores), transferrin saturation >45% (diagnostic threshold for hemochromatosis >60-70%). Causes: hereditary hemochromatosis (HFE gene), chronic transfusions, iron supplementation.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b8-127",
    stem: "A lab receives a specimen with two patient labels attached. The CORRECT action is to:",
    options: ["Use the label that matches the requisition", "Process normally since there are labels", "Reject the specimen — mislabeled/dual-labeled specimens cannot be accepted", "Choose the most recent label"],
    correctIndex: 2,
    rationale: "Two labels on one specimen represents a critical patient safety risk. The specimen could be from either patient. It must be rejected and recollected. Patient identification errors are the most dangerous pre-analytical errors and the most common cause of fatal acute hemolytic transfusion reactions.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Patient Identification & Safety"
  },
  {
    id: "mlt-b8-128",
    stem: "Plasmodium malariae infection is characterized by:",
    options: ["Banana-shaped gametocytes", "Band-form trophozoites, rosette schizonts (daisy-head), 72-hour cycle (quartan malaria)", "Enlarged RBCs with Schüffner dots", "Multiple ring forms per RBC"],
    correctIndex: 1,
    rationale: "P. malariae: band-form trophozoites (bar of chromatin stretches across RBC), rosette/daisy-head schizonts (6-12 merozoites), normal-sized RBCs, no stippling. 72-hour erythrocytic cycle (quartan fever). Can cause chronic low-grade parasitemia for decades (nephrotic syndrome).",
    difficulty: 3,
    category: "Parasitology",
    topic: "Blood & Tissue Protozoa"
  },
  {
    id: "mlt-b8-129",
    stem: "Whipworm (Trichuris trichiura) eggs are identified by their:",
    options: ["Round with mammillated shell", "Barrel-shaped (football-shaped) with bipolar mucous plugs", "Thin-shelled with morula", "Operculated with lateral spine"],
    correctIndex: 1,
    rationale: "Trichuris trichiura (whipworm) eggs are distinctive: barrel/football-shaped (50-54 × 22-23 µm) with transparent mucous plugs at both poles. Adults have a characteristic whip-like shape (thin anterior, thick posterior). Causes dysentery and rectal prolapse in heavy infections.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b8-130",
    stem: "A tissue biopsy stained with Warthin-Starry silver stain shows small spiral organisms in the gastric mucosa. These are MOST likely:",
    options: ["Treponema pallidum", "Helicobacter pylori", "Borrelia burgdorferi", "Leptospira interrogans"],
    correctIndex: 1,
    rationale: "Warthin-Starry silver stain demonstrates H. pylori as small curved/spiral bacilli in gastric biopsies. H. pylori colonizes gastric epithelium, causes gastritis, peptic ulcers, and is associated with gastric MALT lymphoma and adenocarcinoma. Also detected by rapid urease test, UBT, and stool antigen.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  }
];
