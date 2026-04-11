#!/usr/bin/env python3
"""
Batch 4: Microbiology (intro, bacterial, viral) -> antimicrobials ->
pharmacology intro -> pharmacokinetics (GI/urinary bridges) -> pharmacodynamics ->
IV flow rate calculations.
"""

from __future__ import annotations

import json
from pathlib import Path


def mcq(stem: str, a: str, b: str, c: str, d: str, corr: str, rat: str, wrong: dict[str, str]) -> dict:
    return {
        "stem": stem,
        "options": {"A": a, "B": b, "C": c, "D": d},
        "correctAnswer": corr,
        "rationale": rat,
        "whyIncorrect": wrong,
    }


def fill_to(
    out: list[dict],
    target: int,
    stem_fn,
) -> None:
    while len(out) < target:
        out.append(stem_fn(len(out)))


def micro_intro_lessons() -> list[dict]:
    return [
        {
            "title": "Major microorganism groups nurses encounter",
            "structuredContent": {
                "overview": "Bacteria, viruses, fungi, and parasites differ in structure, treatment targets, and infection control implications.",
                "groups": [
                    "Bacteria: prokaryotic cells; treated with antibiotics when appropriate.",
                    "Viruses: obligate intracellular parasites; need host cell machinery; antivirals target specific steps.",
                    "Fungi: eukaryotes; include yeasts and molds; antifungals for serious fungal disease.",
                    "Parasites: protozoa and helminths (worm) categories at survey level.",
                ],
                "commonMistakes": ["Calling viral illness 'bacterial' and expecting antibiotics", "Thinking all microbes are bacteria"],
                "clinicalRelevanceLight": "Antibiotic stewardship starts with recognizing when bacteria are not the cause.",
            },
        },
        {
            "title": "Prokaryote vs eukaryote and why it matters for drugs",
            "structuredContent": {
                "overview": "Bacteria are prokaryotes without a nucleus; human cells are eukaryotic. Many antibiotics exploit differences in bacterial structures (e.g., cell wall) or machinery.",
                "mentalModel": "Target the pathogen without destroying human cells—selective toxicity is the goal of many antimicrobials.",
                "clinicalRelevanceLight": "Side effects still happen when human biology overlaps with drug targets (preview).",
            },
        },
    ]


def micro_intro_q() -> list[dict]:
    bank = [
        ("Which group is prokaryotic?", "bacteria", "human cells", "fungi", "helminths"),
        ("Which microorganism requires a host cell to replicate?", "virus", "bacterium alone in broth always same as human cell", "plant chloroplast", "erythrocyte without nucleus as model for all"),
        ("Antibiotics primarily target:", "bacteria", "all viruses automatically", "prions only", "vitamin deficiency"),
        ("Antivirals primarily target:", "viral processes", "bacterial cell wall always", "fungal ergosterol always", "parasitic worms always"),
        ("Antifungals primarily target:", "fungi", "bacteria always", "viruses always", "waterborne minerals"),
        ("A helminth is best categorized as:", "parasitic worm (survey)", "virus", "bacterium", "prion"),
        ("Protozoa are:", "unicellular eukaryotic parasites (survey)", "prokaryotes", "nonliving chemicals", "plants"),
        ("Which is a fungus example at survey level?", "Candida yeast", "Streptococcus", "Influenza virus", "Plasmodium only as bacterium"),
        ("Normal flora refers to:", "microorganisms colonizing body without causing disease usually", "only pathogens", "only viruses", "sterile blood always"),
        ("Opportunistic pathogens:", "cause disease when host defenses or balance change", "never harm humans", "only infect plants", "only gram-positive"),
        ("Which is smallest typical particle listed?", "virus", "bacterium", "fungal hypha", "protozoan"),
        ("Gram stain is most relevant to:", "bacteria", "viruses directly always", "all fungi always", "helminth eggs only"),
        ("Spore formation is notably associated with some:", "bacteria (e.g., Bacillus, Clostridium survey)", "all viruses", "human ova", "red blood cells"),
        ("Which environment favors many pathogens?", "warm, moist surfaces and appropriate nutrients", "dry sterile steel always impossible", "pure ice always", "only pH 14"),
        ("Colonization means:", "organism present without disease", "always fever", "always bacteremia", "always antibiotics"),
        ("Infection means:", "colonization with host response/damage (student-level)", "always sterile urine", "only surgical", "only viral"),
        ("Which is a DNA virus family example at recognition?", "herpesviruses (survey)", "all RNA viruses", "prions", "gram-negative only"),
        ("RNA viruses include:", "influenza (survey)", "all herpes", "all gram-positive cocci", "only fungi"),
        ("Mycosis means:", "fungal disease", "bacterial toxin", "viral latency only", "worm only"),
        ("Endemic vs epidemic is:", "disease geography/occurrence pattern (preview)", "same as gram stain", "only lab value", "only drug half-life"),
        ("A fomite is:", "contaminated object transmitting organisms (survey)", "hand soap", "sterile glove", "only IV fluid"),
        ("Vector-borne disease involves:", "living transmitter like mosquito/tick (survey)", "only coughing", "only water", "only food"),
        ("Which statement is accurate?", "viruses are not treated with typical antibacterial antibiotics", "amoxicillin cures all viruses", "fungi lack nuclei", "bacteria have nuclei like human cells"),
        ("Yeast is a:", "fungus", "bacterium", "virus", "helminth"),
        ("Mold is a:", "filamentous fungus growth form (survey)", "virus", "bacterium always cocci", "protozoan"),
        ("Binary fission describes:", "bacterial reproduction", "meiosis in humans", "viral assembly only", "fungal spore only always"),
        ("Which is eukaryotic?", "fungal cell", "typical bacterium", "archaea survey same as human cell question focus", "none"),
        ("Prions are:", "infectious proteins (recognition)", "bacteria", "typical viruses with capsid always", "fungi"),
        ("Which is a reason viruses are not 'alive' in many textbooks?", "lack independent metabolism/replication outside host", "have cell walls like plants always", "divide by binary fission", "have gram-positive wall"),
        ("Aerobic bacteria need:", "oxygen", "no oxygen always", "only ice", "only blood agar color"),
        ("Anaerobic bacteria grow:", "without oxygen or low oxygen environments", "only on skin surface always", "only in lungs always", "only in vaccines"),
        ("Which specimen type is often sterile in health?", "blood in deep vessels (concept)", "throat always sterile", "colon always sterile", "skin always sterile"),
        ("Culture in microbiology means:", "growing organisms to identify (survey)", "only PCR always", "only imaging", "only antibiogram without growth"),
        ("Colonization of skin:", "common with Staph species among normal flora (survey)", "impossible", "always MRSA", "only after surgery"),
        ("Zoonosis means:", "disease spread between animals and humans (survey)", "only plant disease", "only fungal allergy", "only water mold"),
        ("Which is NOT a domain of life classification focus here?", "prion as cellular life", "bacteria", "archaea", "eukarya"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Classification recall at pre-nursing depth.", {"B": "Incorrect group.", "C": "Incorrect group.", "D": "Incorrect group."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        35,
        lambda n: mcq(
            f"Micro intro drill {n}: Prokaryotes lack:",
            "membrane-bound nucleus",
            "cytoplasm",
            "ribosomes",
            "DNA",
            "A",
            "Nucleus is membrane-bound in eukaryotes.",
            {"B": "Both have cytoplasm.", "C": "Bacteria have ribosomes.", "D": "Bacterial chromosome is DNA."},
        ),
    )
    return out[:35]


def bacterial_lessons() -> list[dict]:
    return [
        {
            "title": "Bacterial cell envelope and Gram stain logic",
            "structuredContent": {
                "overview": "Gram-positive bacteria retain crystal violet due to thick peptidoglycan; gram-negative have thinner peptidoglycan and outer membrane with endotoxin (LPS) implications.",
                "concepts": ["Peptidoglycan cell wall", "Capsule, flagella, pili (survey)", "Gram stain: crystal violet, iodine, decolorizer, safranin"],
                "commonMistakes": ["Thinking Gram reaction predicts antibiotic choice alone—it informs, labs guide"],
                "clinicalRelevanceLight": "Gram stain is rapid clue; cultures refine therapy.",
            },
        },
        {
            "title": "Bacterial growth and resistance preview",
            "structuredContent": {
                "overview": "Binary fission doubles population when conditions allow. Resistance emerges via selection pressure and genetic change.",
                "concepts": ["Generation time", "Plasmids can carry resistance genes", "MRSA: methicillin-resistant Staph aureus (recognition)"],
                "clinicalRelevanceLight": "Finish prescribed courses when ordered; stewardship reduces resistance spread.",
            },
        },
    ]


def bacterial_q() -> list[dict]:
    bank = [
        ("Bacteria typically reproduce by:", "binary fission", "mitosis identical to humans", "meiosis", "budding only always fungi"),
        ("Peptidoglycan is a key component of:", "many bacterial cell walls", "human cholesterol bilayer", "viral capsid protein only", "fungal chitin always inner"),
        ("Gram-positive bacteria appear:", "purple after Gram stain (student description)", "pink after complete stain", "always unstained", "green only"),
        ("Gram-negative bacteria after counterstain often appear:", "pink/red", "purple", "colorless always", "black only"),
        ("The outer membrane of gram-negative bacteria contains:", "lipopolysaccharide (endotoxin) (survey)", "thick peptidoglycan only", "no lipids", "human DNA"),
        ("Flagella function in bacteria:", "motility", "DNA storage", "photosynthesis in all bacteria", "spore core only"),
        ("Capsule can:", "increase virulence by resisting phagocytosis (survey)", "always prevent all infection", "only found in viruses", "only in human cells"),
        ("Pili can aid in:", "attachment and conjugation (survey)", "photosynthesis", "oxygen transport", "none"),
        ("A spore is:", "dormant resistant form for some bacteria", "reproductive structure of all viruses", "human ovum", "fungal yeast only"),
        ("Binary fission produces:", "two daughter cells", "four gametes", "viral particles directly", "hyphae"),
        ("Antibiotic target cell wall synthesis would affect:", "bacteria with peptidoglycan", "human cells primarily same way", "prions", "all viruses equally"),
        ("MRSA refers to:", "methicillin-resistant Staphylococcus aureus", "methicillin-sensitive only", "a virus", "fungus"),
        ("Plasmids can carry:", "resistance genes", "human chromosomes", "mitochondria", "ribosomes only eukaryotic"),
        ("Selective media in lab:", "favors growth of certain organisms (survey)", "kills all bacteria", "only viral growth", "only urine"),
        ("Aerobic respiration in bacteria uses:", "oxygen as terminal electron acceptor (survey)", "always photosynthesis", "never electron transport", "only human hemoglobin"),
        ("Obligate anaerobes:", "cannot tolerate normal oxygen levels", "always need oxygen", "only on skin", "only viruses"),
        ("Exotoxin is:", "secreted bacterial protein toxin (survey)", "LPS outer membrane component", "human antibody", "only viral"),
        ("Endotoxin associated with:", "gram-negative LPS (survey)", "gram-positive thick wall only protein", "only fungi", "only parasites"),
        ("Biofilm can:", "protect bacteria from antibiotics and immunity (survey)", "always sterile", "only viral", "impossible in healthcare"),
        ("Cocci are:", "spherical bacteria", "rod only", "spiral only", "fungal"),
        ("Bacilli are:", "rod-shaped bacteria", "spherical only", "viral", "worm"),
        ("Spirilla/spirochetes are:", "spiral/twisted bacteria (survey)", "cocci only", "yeast", "helminth"),
        ("Acid-fast stain highlights:", "mycobacteria like TB (recognition)", "all gram-negatives", "all viruses", "all fungi"),
        ("Beta-lactam antibiotics classically affect:", "cell wall synthesis (survey)", "viral reverse transcriptase always", "fungal ergosterol always", "DNA gyrase always"),
        ("Conjugation transfers:", "genetic material between bacteria", "human genes to virus", "oxygen to blood", "nutrients to fungi only"),
        ("Transformation in bacteria:", "uptake of naked DNA from environment (survey)", "human IVF", "viral budding", "meiosis"),
        ("Transduction transfers DNA via:", "bacteriophage (survey)", "flagella", "human RNA", "osmosis"),
        ("Bacteriophage is:", "virus infecting bacteria", "bacterium infecting human", "fungus", "protozoan"),
        ("Normal flora Staph on skin:", "common", "impossible", "always pathogenic", "only gram-negative"),
        ("Clostridium species are often:", "anaerobic, spore-forming (survey)", "obligate aerobes always", "viruses", "fungi"),
        ("Group A Strep (survey recognition) is:", "beta-hemolytic Streptococcus pyogenes classically", "gram-negative rod always", "fungus", "virus"),
        ("E. coli is:", "gram-negative rod (common recognition)", "gram-positive coccus always", "virus", "yeast always"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Bacterial structure and behavior at pre-nursing depth.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        30,
        lambda n: mcq(
            f"Bacterial drill {n}: Gram stain helps classify:",
            "bacteria",
            "viruses directly",
            "all fungi",
            "helminth eggs only",
            "A",
            "Gram stain applies to bacterial cell wall differences.",
            {"B": "Viruses are not classified by Gram stain.", "C": "Different diagnostics for fungi.", "D": "Different ova/parasite exams."},
        ),
    )
    return out[:30]


def viral_lessons() -> list[dict]:
    return [
        {
            "title": "Viral structure: minimal infectious particle",
            "structuredContent": {
                "overview": "Viruses contain genetic material (DNA or RNA) inside a capsid; some have an envelope derived from host membrane.",
                "concepts": ["Capsid", "Envelope + spikes", "Cannot metabolize or divide independently"],
                "clinicalRelevanceLight": "Hand hygiene and vaccines target transmission and immunity, not 'antibiotics'.",
            },
        },
        {
            "title": "Viral replication cycle (survey map)",
            "structuredContent": {
                "overview": "Attachment, entry, replication of genome, assembly, release—details vary by virus.",
                "concepts": ["Lytic vs lysogenic in bacteriophage teaching", "Antivirals may block entry, replication, or release steps"],
                "commonMistakes": ["Treating influenza with antibiotics routinely"],
                "clinicalRelevanceLight": "Exposure protocols and isolation depend on transmission route (contact, droplet, airborne).",
            },
        },
    ]


def viral_q() -> list[dict]:
    bank = [
        ("A virus contains:", "genetic material and capsid proteins", "peptidoglycan always", "mitochondria", "nucleus always"),
        ("Viral envelope comes from:", "host cell membrane modified (survey)", "bacterial wall always", "plant cellulose always", "none"),
        ("Reverse transcriptase is associated with:", "retroviruses like HIV (recognition)", "all DNA viruses", "gram-positive cocci", "fungal chitin"),
        ("Antiviral targets often include:", "viral enzymes or entry proteins", "bacterial ribosome 70S always as sole target", "human DNA polymerase always primary", "peptidoglycan always"),
        ("Latent viral infection means:", "genome persists with periodic reactivation possible (survey)", "always active lysis", "always bacterial", "only fungal"),
        ("Lytic cycle ends with:", "host cell lysis releasing new virions (survey)", "integration only always", "binary fission", "spore formation"),
        ("Lysogeny involves:", "phage DNA integrated into bacterial chromosome (survey)", "human meiosis", "fungal budding only", "helminth egg"),
        ("RNA virus examples include:", "influenza (survey)", "smallpox virus as DNA example contrast", "herpes as DNA virus contrast", "adenovirus DNA contrast"),
        ("DNA virus examples include:", "herpesviruses (survey)", "influenza RNA contrast", "HCV RNA contrast", "all are RNA"),
        ("Vaccination for viruses:", "stimulates immunity to prevent or lessen disease", "replaces antibiotics for bacteria always", "kills fungi always", "only treats active TB always"),
        ("Droplet transmission is:", "respiratory droplets over short distances (survey)", "only vector", "only spore", "only blood always"),
        ("Airborne precautions relate to:", "tiny particles that remain suspended (survey examples later)", "only contact", "only droplet always same", "food only"),
        ("Viral mutation can:", "change antigenicity complicating vaccines (preview)", "never occur", "only in bacteria", "only in plants"),
        ("Hepatitis B is:", "DNA virus (recognition)", "RNA virus always", "bacterium", "fungus"),
        ("Hepatitis C is:", "RNA virus (recognition)", "DNA virus", "gram-negative rod", "yeast"),
        ("Influenza is:", "RNA virus with segmented genome (survey)", "DNA herpes", "bacterium", "helminth"),
        ("Measles virus is:", "RNA paramyxovirus (recognition level)", "DNA pox", "bacterium", "fungus"),
        ("Varicella-zoster is:", "DNA herpesvirus (recognition)", "RNA coronavirus always", "bacterium", "protozoan"),
        ("Norovirus is:", "RNA virus gastroenteritis (recognition)", "gram-positive coccus", "helminth", "fungus"),
        ("Rhinovirus common cold is:", "RNA picornavirus (survey)", "DNA pox", "bacterium always", "fungus always"),
        ("HPV is:", "DNA virus (recognition)", "RNA retrovirus", "bacterium", "prion"),
        ("EBV is:", "DNA herpesvirus (recognition)", "RNA flu", "gram-negative", "yeast"),
        ("CMV is:", "DNA herpesvirus (recognition)", "RNA measles", "bacterium", "helminth"),
        ("COVID-19 is caused by:", "SARS-CoV-2 RNA virus (recognition)", "DNA herpes", "Staph only", "Candida only"),
        ("Viral load measures:", "amount of virus in blood/fluid (survey)", "bacterial colony count only", "fungal spore only", "helminth length only"),
        ("Cytopathic effect in cell culture:", "virus injures cells visibly (survey)", "bacterial gram stain", "fungal KOH", "O&P only"),
        ("Prophylactic antiviral means:", "given to prevent infection/outbreak in defined contexts", "always replaces vaccine", "only antibacterial", "only antifungal"),
        ("Post-exposure prophylaxis may use:", "antivirals or vaccines per protocol (survey)", "always antibiotics for virus", "nothing ever", "only surgery"),
        ("Zoster reactivation involves:", "varicella-zoster virus (survey)", "E. coli", "Candida only", "tapeworm only"),
        ("Herpes simplex establishes:", "latency in sensory ganglia (survey)", "only bacterial spore", "only fungal yeast", "only helminth cyst"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Viral biology at pre-nursing depth.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        30,
        lambda n: mcq(
            f"Viral drill {n}: Antibiotics are generally ineffective against:",
            "viruses",
            "susceptible bacteria",
            "some rickettsia contexts later",
            "some chlamydia contexts later",
            "A",
            "Antibiotics target bacteria, not typical viruses.",
            {"B": "Bacteria can be antibiotic targets.", "C": "Unrelated to viral treatment default.", "D": "Unrelated to viral treatment default."},
        ),
    )
    return out[:30]


def antimicrobial_lessons() -> list[dict]:
    return [
        {
            "title": "Antibacterial classes and spectrum (overview)",
            "structuredContent": {
                "overview": "Narrow-spectrum drugs hit fewer organism types; broad-spectrum hit more but disturb flora and resistance risk more.",
                "examples": ["Beta-lactams", "Macrolides", "Fluoroquinolones", "Aminoglycosides—names come later; concepts now"],
                "clinicalRelevanceLight": "Culture and sensitivity guide narrowing therapy when possible.",
            },
        },
        {
            "title": "Antivirals and antifungals: different targets",
            "structuredContent": {
                "overview": "Antivirals block specific viral steps; antifungals often target ergosterol-rich membranes or cell wall (echinocandins) at advanced levels.",
                "commonMistakes": ["Using antifungal for viral illness"],
                "clinicalRelevanceLight": "Drug choice follows diagnosis, not convenience.",
            },
        },
        {
            "title": "Resistance, adherence, and safety basics",
            "structuredContent": {
                "overview": "Finish courses when prescribed; do not share antibiotics; report allergies accurately.",
                "concepts": ["MRSA, VRE, ESBL as acronyms to recognize—not memorize full mechanisms yet"],
                "clinicalRelevanceLight": "Infection control plus appropriate prescribing slows resistance.",
            },
        },
    ]


def antimicrobial_q() -> list[dict]:
    bank = [
        ("Antibiotic resistance means:", "drug no longer effectively kills or inhibits the bacterium", "patient immune only", "virus only", "always allergy"),
        ("Broad-spectrum antibiotics:", "affect many bacterial types", "only one species always", "treat viruses", "only fungi"),
        ("Narrow-spectrum antibiotics:", "target fewer types when possible", "always safer in every case without thought", "treat all viruses", "only topical"),
        ("Antiviral drug example class (recognition):", "oseltamivir for influenza (contextual)", "penicillin for flu", "metronidazole for flu", "amphotericin for flu"),
        ("Antifungal example class (recognition):", "azoles like fluconazole (contextual)", "penicillin for thrush always", "acyclovir for Candida always", "cefazolin for mold always"),
        ("MRSA implies resistance to:", "beta-lactam antibiotics like methicillin classically", "all drugs always", "only antivirals", "only antiparasitics"),
        ("Superinfection can occur when:", "normal flora suppressed allowing opportunists (survey)", "never on antibiotics", "only viral", "only vaccines"),
        ("C. difficile risk increases with:", "broad antibiotic exposure disrupting colon flora (survey)", "only antivirals", "only vitamins", "hand washing"),
        ("Bactericidal vs bacteriostatic at student level:", "kills vs inhibits growth (survey)", "identical", "only viral terms", "only fungal"),
        ("Sensitivity report 'S' means:", "susceptible", "resistant", "intermediate always means give double always", "not tested"),
        ("Sensitivity 'R' means:", "resistant", "susceptible", "pan-sensitive always", "only viral"),
        ("Prophylactic antibiotic means:", "prevent infection in specific situations per protocol", "treat all colds", "always post-op without indication", "only antiviral"),
        ("Empiric therapy means:", "treat before culture results using likely coverage", "only after sensitivity always", "never used", "only fungal"),
        ("Definitive therapy means:", "targeted to identified organism/sensitivity", "guess always", "only OTC", "only topical"),
        ("Antibiotic stewardship aims to:", "optimize use and reduce resistance", "use broad always", "stop cultures", "never de-escalate"),
        ("Penicillin allergy documentation should be:", "accurate; many labeled are not true IgE allergy", "ignored", "always genetic", "only pharmacist problem"),
        ("Drug interaction with warfarin and antibiotics can affect:", "bleeding risk (preview)", "never INR", "only hair", "only hearing"),
        ("Aminoglycosides are noted for:", "nephrotoxicity and ototoxicity risk (recognition)", "zero toxicity", "only antiviral", "only oral always"),
        ("Fluoroquinolones carry:", "tendon and QT risk flags (recognition)", "zero risk", "only pediatric blessing", "only in vitamins"),
        ("Macrolides can:", "affect QT and interact with other drugs (recognition)", "never interact", "only treat viruses", "only topical"),
        ("Trimethoprim-sulfamethoxazole can affect:", "renal function and potassium in some patients (recognition)", "only liver always", "never monitoring", "only antiviral"),
        ("Linezolid considerations include:", "serotonin interaction risk with certain meds (recognition)", "zero interactions", "only fungal", "only vaccine"),
        ("Vancomycin requires:", "therapeutic monitoring often (recognition)", "never levels", "only PO for all infections same", "only antiviral"),
        ("Antifungal amphotericin B historically:", "nephrotoxicity concern (recognition)", "zero risk", "oral only always", "treats bacteria"),
        ("Azole antifungals affect:", "CYP enzymes; drug interactions possible (preview)", "never interactions", "only bacteria", "only viruses"),
        ("Acyclovir targets:", "herpesviruses (survey)", "influenza always", "MRSA always", "Candida always"),
        ("Oseltamivir targets:", "influenza neuraminidase (survey)", "herpes DNA pol always", "bacterial wall", "fungal ergosterol"),
        ("Nucleoside analog antivirals generally:", "interfere with viral nucleic acid synthesis (survey)", "strengthen bacterial wall", "kill all fungi", "only vaccine"),
        ("Pneumocystis treatment context often involves:", "specific antimicrobial regimens in immunocompromised (recognition)", "only antiviral oseltamivir", "only metronidazole dental", "only NSAIDs"),
        ("TB treatment is:", "multi-drug long course (recognition)", "single dose penicillin", "only antiviral", "only topical"),
        ("Antibiotic-associated diarrhea prompts:", "clinical evaluation; C. diff consideration (survey)", "ignore", "always probiotics only cure", "only increase dose"),
        ("VRE stands for:", "vancomycin-resistant enterococci (recognition)", "virus", "fungus", "parasite"),
        ("ESBL hints at:", "extended-spectrum beta-lactamase resistance pattern (recognition)", "viral load", "fungal spore", "helminth"),
        ("Antiseptic vs antibiotic:", "antiseptic on living tissue surfaces reduce microbes; systemic antibiotics internal", "identical", "only oral", "only viral"),
        ("Disinfectant vs antiseptic:", "disinfectant on objects; antiseptic on skin (survey)", "same always", "only IV", "only hand gel illegal"),
        ("Selective toxicity means:", "harm pathogen more than host at therapeutic doses (goal)", "harm host only", "no difference", "only placebo"),
        ("Synergistic combo example recognition:", "certain beta-lactam + aminoglycoside pairings in specific infections (preview)", "always any two drugs", "never real", "only vitamins"),
        ("Antiparasitic drugs differ from antibacterials:", "different targets and spectra", "identical", "only topical", "never exist"),
        ("Metronidazole is notably:", "anaerobic bacterial and certain protozoal coverage (recognition)", "only antiviral", "only antifungal azole", "only helminth"),
        ("Ivermectin context includes:", "certain parasitic infections per guidelines (recognition)", "routine antiviral for all", "only MRSA", "only vaccine"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Antimicrobial concepts at pre-nursing depth.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        40,
        lambda n: mcq(
            f"Antimicrobial drill {n}: Antivirals are used for:",
            "some viral infections per guidelines",
            "all bacterial pneumonias default",
            "fungal thrush first line always",
            "helminth only",
            "A",
            "Antivirals target viruses in appropriate contexts.",
            {"B": "Bacteria use antibiotics when indicated.", "C": "Antifungals for significant fungal disease.", "D": "Antiparasitics for worms/protozoa."},
        ),
    )
    return out[:40]


def pharm_intro_lessons() -> list[dict]:
    return [
        {
            "title": "Generic, brand, and why both names appear",
            "structuredContent": {
                "overview": "Generic is the nonproprietary name; brand is marketed by a company. Orders should be clear; double-check look-alike/sound-alike pairs.",
                "clinicalRelevanceLight": "Barcode systems often key off generic plus strength/form.",
            },
        },
        {
            "title": "Drug classes and prototypes",
            "structuredContent": {
                "overview": "A class shares mechanism or use; a prototype drug is the classic teaching example (e.g., propranolol for beta blockers at survey).",
                "clinicalRelevanceLight": "Class effects predict side effects (e.g., beta blockers and heart rate).",
            },
        },
        {
            "title": "Controlled substance schedules (US framework, recognition)",
            "structuredContent": {
                "overview": "Schedule I–V reflect abuse potential and regulation increasing toward Schedule I (non-medical use in schedule I classic teaching).",
                "note": "Canada and other countries differ; follow your jurisdiction.",
                "clinicalRelevanceLight": "Counts, wasting, and witness rules apply to controlled meds.",
            },
        },
    ]


def pharm_intro_q() -> list[dict]:
    bank = [
        ("Generic name is:", "nonproprietary name of drug", "only the company logo", "only color of tablet", "only barcode number"),
        ("Brand/trade name is:", "marketed product name", "always identical to generic spelling", "only chemical formula spoken", "only schedule"),
        ("OTC means:", "over-the-counter without prescription in many contexts", "only IV", "only chemotherapy", "only research"),
        ("Prescription drug requires:", "authorized prescriber order", "only patient choice", "only pharmacist guess", "only nurse protocol always"),
        ("Therapeutic class groups drugs by:", "clinical use or mechanism (survey)", "only color", "only manufacturer city", "only price"),
        ("Pharmacologic class groups by:", "mechanism/receptor target (survey)", "only indication only always same", "only tablet shape", "only insurance"),
        ("Prototype drug is:", "classic teaching example for a class", "always newest drug", "only generic letter", "only biologic"),
        ("DEA schedule I at classic US teaching:", "high abuse potential; no accepted medical use in US teaching", "safest lowest control", "only vitamins", "only antibiotics"),
        ("Schedule II drugs have:", "high abuse potential; tight prescribing rules (survey)", "no restrictions", "only topical", "only OTC"),
        ("Look-alike/sound-alike pairs require:", "extra verification per policy", "no caution", "only night shift", "only pediatric"),
        ("Tall man lettering aims to:", "highlight differences in similar names", "make fonts pretty", "replace generic", "remove brand"),
        ("Bioequivalence generic to brand implies:", "similar expected effect at same dose (regulatory standard)", "always different dose", "never tested", "only IV"),
        ("Formulation differences include:", "tablet vs liquid vs extended-release", "only color", "only physician preference unrelated", "none"),
        ("Combination product contains:", "more than one active ingredient", "always placebo", "only water", "only vaccine"),
        ("Indication means:", "approved or prescribed reason for use", "only side effect", "only allergy", "only lot number"),
        ("Contraindication means:", "situation where drug should not be used", "always green light", "only pediatric", "only generic"),
        ("Black box warning is:", "FDA serious risk highlight", "marketing sticker", "only OTC", "only cosmetic"),
        ("Off-label use means:", "use not in official labeling though may be evidence-based", "illegal always", "only supplements", "only antibiotics"),
        ("Biologic vs small molecule at survey:", "large complex molecules vs traditional pills often", "identical", "only vitamins", "only water"),
        ("Biosimilar relates to:", "similar biologic to reference product (regulatory)", "generic small molecule identical always", "only vaccine", "only herbal"),
        ("Herbal product can:", "interact with prescriptions", "never interact", "replace all prescriptions safely", "only placebo always"),
        ("Dietary supplement is:", "regulated differently than drugs in US (recognition)", "identical evidence standard always", "only IV", "only prescription"),
        ("Unapproved use documentation should:", "follow policy and evidence", "never chart", "only verbal", "only social media"),
        ("High-alert medication:", "increased harm if error (ISMP list concept)", "safest meds", "only vitamins", "only topical"),
        ("LASA list refers to:", "look-alike sound-alike drug names", "labs only", "only IV pumps", "only schedules only"),
        ("Chemotherapy at student level is:", "often high-risk drug class needing safeguards", "same risk as multivitamin always", "only oral", "only OTC"),
        ("Insulin is:", "high-alert medication in many institutions", "low risk always", "never injectable", "only pill"),
        ("Anticoagulants are:", "high bleed risk class needing vigilance", "never interact", "only topical", "only pediatric"),
        ("Opioids are:", "controlled with abuse and respiratory risk", "risk-free sleep aids always", "only NSAIDs", "only local anesthetic"),
        ("Sedative-hypnotics can cause:", "oversedation and falls especially in elderly", "never CNS effects", "only GI bleed", "only rash"),
        ("Potassium supplements can be:", "high risk if wrong dose/route", "always harmless", "only cosmetic", "only liquid"),
        ("Digoxin is:", "narrow therapeutic index classic example (recognition)", "impossible toxicity", "only OTC", "only antibiotic"),
        ("Lithium is:", "narrow index mood stabilizer (recognition)", "vitamin", "only antihypertensive class beta blocker", "only antiviral"),
        ("Theophylline historically:", "narrow index drug (recognition)", "only supplement", "only topical steroid", "only antacid"),
        ("Warfarin requires:", "monitoring and interaction vigilance", "never labs", "only loading dose once", "only pediatric"),
        ("Antiseizure meds often need:", "consistent adherence and monitoring", "never levels sometimes", "only PRN always", "only herbal"),
        ("Immunosuppressants post-transplant need:", "strict adherence and monitoring", "occasional skip ok always", "only OTC", "only vitamins"),
        ("Chemo vesicant means:", "tissue injury if extravasates (recognition)", "safe if fast push always", "only oral", "only NSAID"),
        ("A patient asks why generic looks different; best student response framework:", "same active ingredient; excipients/color may differ per policy teaching", "say it is a different drug always", "refuse to answer", "guarantee identical tablet always"),
        ("NDC number identifies:", "drug product labeling in US (recognition)", "patient room", "only nurse", "only diagnosis"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Pharmacology intro recall.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        40,
        lambda n: mcq(
            f"Pharm intro drill {n}: Brand name is assigned by:",
            "the manufacturer for marketing",
            "FDA always randomly",
            "only the patient",
            "only the nurse",
            "A",
            "Companies market brand names.",
            {"B": "Regulatory bodies approve but company brands.", "C": "Patient does not assign brand.", "D": "Nurse does not assign brand."},
        ),
    )
    return out[:40]


def pk_lessons() -> list[dict]:
    return [
        {
            "title": "Absorption: from site into circulation",
            "structuredContent": {
                "overview": "Absorption depends on route, blood flow, solubility, and barriers.",
                "prerequisiteBridgeDigestiveUrinary": {
                    "GItract": "Oral drugs traverse GI mucosa; stomach acid, food, motility, and first-pass metabolism alter bioavailability.",
                    "KidneyRoleExcretion": "Many drugs and metabolites exit via renal filtration and secretion; hydration and kidney function matter.",
                },
                "concepts": ["Bioavailability", "First-pass effect reduces oral bioavailability for some drugs", "Peak concentration and onset"],
                "clinicalRelevanceLight": "NPO status, vomiting, and tube feeds can change absorption.",
            },
        },
        {
            "title": "Distribution: from blood to tissues",
            "structuredContent": {
                "overview": "Drug distributes by blood flow, tissue affinity, and protein binding (especially albumin).",
                "concepts": ["Volume of distribution (preview)", "Unbound drug is often considered active at simple teaching level"],
                "clinicalRelevanceLight": "Low albumin can change free drug for highly bound agents (preview).",
            },
        },
        {
            "title": "Metabolism: biotransformation, often in liver",
            "structuredContent": {
                "overview": "Liver enzymes (notably cytochrome P450 family) chemically modify drugs to often more water-soluble metabolites.",
                "concepts": ["Prodrug activated by metabolism", "Enzyme inducers/inhibitors change other drug levels (preview)"],
                "clinicalRelevanceLight": "Grapefruit and some antibiotics alter metabolism of certain drugs.",
            },
        },
        {
            "title": "Excretion: mainly renal; half-life and steady state",
            "structuredContent": {
                "overview": "Kidneys excrete many drugs; half-life is time for amount to fall by half (student definition). Steady state approaches after ~4–5 half-lives of regular dosing.",
                "concepts": ["CrCl relevance preview", "Dose adjustments in renal impairment for some drugs"],
                "clinicalRelevanceLight": "Creatinine clearance guides dosing for renally cleared drugs in practice.",
            },
        },
    ]


def pk_q() -> list[dict]:
    bank = [
        ("Absorption is:", "movement from administration site into circulation", "only kidney filtration", "only liver metabolism", "only excretion"),
        ("First-pass effect primarily involves:", "liver metabolism before systemic circulation for oral drugs", "IV bolus always", "skin only", "only IM"),
        ("Bioavailability is:", "fraction reaching systemic circulation", "drug color", "tablet weight only", "only protein"),
        ("IV bolus bioavailability is considered:", "complete for the delivered dose into vein", "zero always", "always50%", "only oral"),
        ("Distribution includes:", "movement from blood to tissues", "only absorption", "only excretion only", "only metabolism only"),
        ("Protein binding can:", "limit free drug available to tissues (concept)", "never matter", "only for vitamins", "only for water"),
        ("Metabolism often makes drugs:", "more water-soluble for excretion", "always more active", "always permanent", "only larger always"),
        ("Cytochrome P450 system is:", "major drug-metabolizing enzyme family in liver (survey)", "only kidney", "only RBC", "only DNA polymerase"),
        ("Enzyme inhibitor tends to:", "increase levels of substrates of that enzyme", "decrease levels always", "only affect food", "only vaccines"),
        ("Enzyme inducer tends to:", "decrease levels of substrates over time", "increase levels always", "only IV fluids", "only calcium"),
        ("Excretion commonly occurs via:", "kidneys", "only sweat for all drugs", "only tears", "only bile only never kidney"),
        ("Half-life is:", "time for drug amount to decrease by half (student definition)", "always 24 h", "only absorption metric", "only legal term"),
        ("Steady state with repeated dosing approaches after:", "about 4–5 half-lives (rule of thumb)", "one dose always", "never", "only IV"),
        ("Loading dose may be used to:", "reach therapeutic effect faster for some drugs", "replace maintenance always", "only oral", "never real"),
        ("Maintenance dose replaces:", "amount eliminated per dosing interval at steady state (concept)", "absorption only", "first pass only", "only protein"),
        ("Renal clearance depends on:", "filtration, secretion, reabsorption (survey)", "only liver", "only skin", "only lung only"),
        ("CrCl estimates:", "kidney filtration capacity surrogate (survey)", "liver function always", "only weight", "only age alone"),
        ("Drug in bile may undergo:", "enterohepatic recirculation (recognition)", "only IV metabolism", "only pulmonary excretion only", "none"),
        ("Lipophilic drugs tend to:", "distribute into fat tissues (concept)", "never leave blood", "only water soluble always", "only ionized always"),
        ("Ionization can affect:", "membrane crossing (concept)", "nothing", "only tablet color", "only schedule"),
        ("Young pediatric patients may:", "metabolize/excrete differently vs adults (general)", "always identical dosing", "never need adjustment", "only by height"),
        ("Elderly may have:", "reduced renal function and body composition changes", "identical PK always", "faster metabolism always", "only pediatric rules"),
        ("Pregnancy can alter:", "drug distribution and metabolism (general)", "never any change", "only topical drugs", "only vitamins"),
        ("Breast milk transfer depends on:", "drug properties and maternal factors (survey)", "never happens", "all drugs equal", "only pH of baby"),
        ("Dialysis can remove:", "some drugs depending on properties", "all drugs equally", "no drugs ever", "only vitamins"),
        ("TDM means:", "therapeutic drug monitoring for narrow-index drugs (recognition)", "only allergy test", "only genetic test always", "only imaging"),
        ("Peak and trough levels help:", "assess toxicity and subtherapeutic risk for some drugs", "only diagnosis infection always", "only CBC", "only UA"),
        ("Subcutaneous absorption is generally:", "slower than IV", "faster than IV always", "identical to IV", "impossible"),
        ("IM absorption is:", "faster than SC for many drugs (general)", "always slower than SC", "identical always", "only oral"),
        ("Sublingual avoids:", "some first-pass for certain drugs", "all metabolism", "only kidney", "only liver entirely always"),
        ("Transdermal provides:", "slow sustained absorption", "immediate peak like IV push", "zero absorption", "only oral"),
        ("Food can:", "increase or decrease absorption depending on drug", "never matter", "always increase", "always decrease"),
        ("Gastric pH affects:", "ionization and dissolution of some drugs", "only IM drugs", "only eye drops", "never any drug"),
        ("Small intestine is major site for:", "many oral drug absorptions", "only stomach always all drugs", "only colon always", "only mouth"),
        ("P-glycoprotein can:", "affect drug transport at barriers (preview)", "only digest food", "only insulin only", "only vaccine"),
        ("Unbound drug concept at simple teaching:", "often correlates with effect for highly bound drugs discussion", "never taught", "only bound drug active always wrong simplification noted", "only total always"),
        ("Hepatic clearance can be:", "blood flow limited or enzyme limited (preview)", "only renal", "constant all drugs", "only zero"),
        ("Zero-order elimination at recognition:", "fixed amount per time at high concentrations (alcohol classic preview)", "always first order", "only vitamins", "only protein"),
        ("First-order elimination means:", "fraction eliminated per time (common)", "fixed mg per time always", "no elimination", "only absorption"),
        ("Volume of distribution at survey:", "relates drug amount in body to plasma concentration (concept)", "always5 L only", "only oral", "only legal"),
        ("Enteric coating aims to:", "protect drug from gastric acid or protect stomach (survey)", "speed IV absorption", "only cosmetic", "only liquid"),
        ("Extended-release formulation aims to:", "smooth plasma levels / reduce dosing frequency", "always higher peak than IR", "only IV", "only placebo"),
        ("Pediatric weight-based dosing relates to:", "distribution and clearance differences (general)", "never used", "only adult mg", "only BSA always never weight"),
        ("Obesity may alter:", "distribution volume for lipophilic drugs (general)", "never PK", "only absorption", "only legal"),
        ("Hypoalbuminemia may increase:", "free fraction of highly protein-bound drugs (concept)", "never effect", "only bound fraction", "only oral drugs never"),
        ("Biliary excretion important for:", "some drugs and conjugates (survey)", "all drugs equally", "no drugs", "only water"),
        ("Fecal excretion can occur for:", "unabsorbed oral drug or biliary route (concept)", "IV drugs always majority", "only vitamins", "only inhalation"),
        ("Pharmacokinetics answers:", "what the body does to the drug", "what drug does to body", "only legal schedule", "only brand"),
        ("Pharmacodynamics will address:", "what drug does to body (preview)", "absorption", "excretion only", "only metabolism"),
        ("Bioavailability can be reduced by:", "first-pass metabolism", "IV route", "never oral", "only IM always increases"),
        ("Renal impairment often requires:", "dose adjustment for renally cleared drugs", "never change", "always increase dose", "only topical"),
        ("Half-life prolongation in renal impairment can occur with:", "renally eliminated drugs", "all drugs never", "only vitamins", "only NSAIDs never"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Pharmacokinetics conceptual understanding.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        50,
        lambda n: mcq(
            f"PK drill {n}: ADME 'E' stands for:",
            "excretion",
            "efficacy",
            "enzyme only",
            "education",
            "A",
            "ADME: absorption, distribution, metabolism, excretion.",
            {"B": "Efficacy is pharmacodynamics.", "C": "Too narrow.", "D": "Unrelated."},
        ),
    )
    return out[:50]


def pd_lessons() -> list[dict]:
    return [
        {
            "title": "Receptors, affinity, efficacy, and dose-response",
            "structuredContent": {
                "overview": "Drugs bind targets; affinity is tightness of binding; efficacy is ability to activate effect. Dose-response curves show increasing effect with dose until plateau.",
                "concepts": ["Agonist", "Antagonist", "Partial agonist", "Inverse agonist (preview)"],
                "clinicalRelevanceLight": "Explains why more drug is not always more effect past ceiling.",
            },
        },
        {
            "title": "Therapeutic index and selectivity",
            "structuredContent": {
                "overview": "Therapeutic index compares toxic dose to effective dose in classic teaching (TD50/ED50 style). Narrow index means smaller margin.",
                "clinicalRelevanceLight": "Digoxin, lithium, theophylline classic examples requiring vigilance.",
            },
        },
        {
            "title": "Tolerance, dependence, and rebound (preview)",
            "structuredContent": {
                "overview": "Repeated exposure can reduce response (tolerance); stopping some drugs causes rebound; opioids have dependence risk with public health impact.",
                "clinicalRelevanceLight": "Teach patients not to stop beta blockers abruptly without prescriber guidance (example class).",
            },
        },
    ]


def pd_q() -> list[dict]:
    bank = [
        ("Pharmacodynamics studies:", "what the drug does to the body", "absorption", "excretion only", "first pass only"),
        ("An agonist:", "activates receptor", "blocks without activating", "destroys receptor always", "only enzyme substrate"),
        ("A competitive antagonist:", "competes at receptor binding site", "activates fully", "increases agonist always", "only ion channel opener always"),
        ("Noncompetitive antagonist at survey:", "binds elsewhere changing receptor function", "same as competitive always", "only vitamin", "only antibiotic"),
        ("Partial agonist:", "activates but submaximal effect vs full agonist", "identical to antagonist", "only blocks", "only enzyme"),
        ("Spare receptors concept at preview:", "maximal effect without occupying all receptors", "impossible", "only in plants", "only toxins"),
        ("Efficacy is:", "maximal effect capability", "binding tightness", "absorption speed", "half-life"),
        ("Affinity is:", "binding strength tendency", "maximal effect", "renal clearance", "tablet size"),
        ("Potency at survey:", "dose needed for defined effect; more potent needs lower dose", "same as efficacy always", "only toxicity", "only legal"),
        ("Therapeutic index conceptually:", "margin between helpful and harmful doses", "always infinite", "only absorption", "only brand"),
        ("Selective drug:", "affects intended target more than others at therapeutic doses (goal)", "affects all tissues equally always", "only placebo", "only vitamin"),
        ("Side effect arises because:", "drug hits additional targets", "only allergy always", "only overdose always", "impossible"),
        ("Synergism:", "combined effect greater than sum", "always zero", "only antagonism", "only absorption"),
        ("Antagonism:", "combined effect less than expected", "always synergy", "only agonist", "only PK"),
        ("Physiologic antagonism at preview:", "two agents oppose physiologic effects", "same receptor always", "only one drug", "only placebo"),
        ("Chemical antagonism at preview:", "direct chemical neutralization", "receptor only", "only absorption", "only legal"),
        ("Pharmacologic antagonism:", "receptor/blockade style opposition", "chemical neutralization same always", "only food", "only schedule"),
        ("Desensitization/downregulation:", "reduced response with prolonged agonist exposure", "increased response always", "only first dose", "only antibiotics"),
        ("Supersensitivity after chronic antagonist:", "upregulation possible when blocker removed (preview)", "never occurs", "only PK", "only in bacteria"),
        ("Idiosyncratic reaction:", "unusual unpredictable response", "expected in everyone", "only placebo", "only allergy only"),
        ("Placebo response:", "psychologic/context effects on perceived outcome", "only drug chemistry", "only IV", "illegal"),
        ("Dose-response curve plateau indicates:", "maximal effect reached", "no effect ever", "only toxicity", "only absorption"),
        ("ED50 concept at survey:", "dose producing 50% of maximal effect in model", "toxic dose always", "lethal always", "absorption half"),
        ("LD50 in animal studies historically:", "lethal dose for 50% animals (recognition)", "effective dose", "absorption", "schedule"),
        ("Therapeutic window is:", "range between subtherapeutic and toxic for many drugs", "only one dose", "only IV", "only pediatric"),
        ("Receptor antagonist overdose of agonist might be:", "partially surmountable if competitive (concept)", "never change", "only PK", "only legal"),
        ("Inverse agonist at preview:", "reduces constitutive receptor activity", "same as full agonist", "only antibiotic", "only vitamin"),
        ("Allosteric modulator:", "binds non-active site changing receptor behavior (preview)", "only competitive active site", "only enzyme substrate", "only food"),
        ("G-protein coupled receptors are:", "major drug target family (recognition)", "only enzymes", "only DNA", "only ribosomes"),
        ("Ion channel drugs can:", "alter membrane potentials (survey)", "only bind DNA", "only peptidoglycan", "only helminth"),
        ("Enzyme inhibition can be:", "competitive or noncompetitive (survey)", "only viral", "only renal", "only legal"),
        ("Pharmacologic stress test concept:", "drug used to provoke response for diagnosis (recognition)", "only antibiotic", "only vitamin", "only schedule"),
        ("Tachyphylaxis:", "rapidly diminishing response after repeated doses (recognition)", "never real", "only infection", "only legal"),
        ("Refractory state:", "lack of response despite adequate dose (contextual)", "always first dose", "only pediatric", "only topical"),
        ("Drug-receptor binding is often:", "reversible at student level for many drugs", "always irreversible all drugs", "only covalent all", "only IV"),
        ("Intrinsic activity of agonist relates to:", "efficacy", "affinity only", "absorption", "excretion"),
        ("Competitive antagonist shifts agonist curve:", "right (higher doses needed)", "left always", "no change", "only toxicity"),
        ("Irreversible antagonist may:", "reduce maximal response (concept)", "only shift right with same max", "only increase max", "only PK"),
        ("Functional antagonism at preview:", "two drugs oppose via different mechanisms", "same receptor always", "impossible", "only placebo"),
        ("Signal transduction continues after:", "receptor activation in many pathways (survey)", "never", "only DNA replication", "only absorption"),
        ("Biased agonism at preview:", "different signaling from same receptor (advanced)", "only one pathway always", "only antibiotic", "only vitamin"),
        ("Pharmacogenomics can alter:", "drug metabolism or receptor response (preview)", "never humans", "only food", "only schedule"),
    ]
    out = [mcq(s, a, b, c, d, "A", "Pharmacodynamics conceptual understanding.", {"B": "Incorrect.", "C": "Incorrect.", "D": "Incorrect."}) for s, a, b, c, d in bank]
    fill_to(
        out,
        40,
        lambda n: mcq(
            f"PD drill {n}: A drug blocking a receptor without activating is a(n):",
            "antagonist",
            "full agonist",
            "prodrug",
            "excipient",
            "A",
            "Antagonists block activation.",
            {"B": "Agonists activate.", "C": "Prodrug is pharmacokinetic concept.", "D": "Excipient is inactive formulation component."},
        ),
    )
    return out[:40]


def iv_lessons() -> list[dict]:
    return [
        {
            "title": "mL/hr: volume over time",
            "structuredContent": {
                "formula": "Total volume (mL) / Total hours = mL/hr",
                "example": "1000 mL over 8 hr = 125 mL/hr",
                "commonMistakes": ["Dividing hours by volume"],
            },
        },
        {
            "title": "Drip rate (gtt/min) from mL/hr",
            "structuredContent": {
                "formula": "gtt/min = (mL/hr × drop factor gtt/mL) / 60",
                "alternate": "gtt/min = (mL/min) × drop factor; mL/min = mL/hr / 60",
                "example": "125 mL/hr with 20 gtt/mL: (125 * 20) / 60 = 41.7 gtt/min",
                "commonMistakes": ["Forgetting to convert hour to minute", "Inverting drop factor"],
            },
        },
        {
            "title": "Infusion time and pump safety",
            "structuredContent": {
                "overview": "Time = total volume / rate. Verify pump programming; double-check high-risk meds.",
                "clinicalRelevanceLight": "Rate errors with IV can cause rapid harm; use protocols.",
            },
        },
    ]


def iv_q() -> list[dict]:
    """Verified calculation MCQs; correct answer A."""
    rows: list[tuple[str, str, str, str, str]] = [
        ("1000 mL over 10 hours. Pump rate mL/hr?", "100 mL/hr", "10 mL/hr", "1000 mL/hr", "110 mL/hr"),
        ("500 mL over 4 hours. mL/hr?", "125 mL/hr", "100 mL/hr", "150 mL/hr", "200 mL/hr"),
        ("250 mL over 5 hours. mL/hr?", "50 mL/hr", "25 mL/hr", "100 mL/hr", "125 mL/hr"),
        ("100 mL over 2 hours. mL/hr?", "50 mL/hr", "25 mL/hr", "100 mL/hr", "200 mL/hr"),
        ("750 mL over 6 hours. mL/hr?", "125 mL/hr", "100 mL/hr", "150 mL/hr", "200 mL/hr"),
        ("480 mL over 8 hours. mL/hr?", "60 mL/hr", "48 mL/hr", "80 mL/hr", "100 mL/hr"),
        ("At 100 mL/hr, how long for 300 mL?", "3 hours", "2 hours", "4 hours", "5 hours"),
        ("At 80 mL/hr, time for 200 mL?", "2.5 hours", "2 hours", "3 hours", "4 hours"),
        ("At 50 mL/hr, time for 150 mL?", "3 hours", "2 hours", "4 hours", "1 hour"),
        ("125 mL/hr. Drop factor 20 gtt/mL. gtt/min (nearest tenth)?", "41.7 gtt/min", "25 gtt/min", "50 gtt/min", "125 gtt/min"),
        ("100 mL/hr. Drop factor 15 gtt/mL. gtt/min?", "25 gtt/min", "15 gtt/min", "40 gtt/min", "100 gtt/min"),
        ("75 mL/hr. Drop factor 10 gtt/mL. gtt/min?", "12.5 gtt/min", "7.5 gtt/min", "15 gtt/min", "25 gtt/min"),
        ("150 mL/hr. Drop factor 20 gtt/mL. gtt/min?", "50 gtt/min", "30 gtt/min", "60 gtt/min", "75 gtt/min"),
        ("200 mL/hr. Drop factor 15 gtt/mL. gtt/min?", "50 gtt/min", "40 gtt/min", "60 gtt/min", "75 gtt/min"),
        ("50 mL/hr. Drop factor 60 (microdrip). gtt/min?", "50 gtt/min", "30 gtt/min", "60 gtt/min", "100 gtt/min"),
        ("Order: 500 mL NS over 5 hr. mL/hr?", "100 mL/hr", "50 mL/hr", "125 mL/hr", "250 mL/hr"),
        ("Order: 1000 mL LR over 12 hr. mL/hr?", "83.3 mL/hr", "80 mL/hr", "100 mL/hr", "125 mL/hr"),
        ("Pump set 125 mL/hr. After 2 hours, mL infused?", "250 mL", "125 mL", "200 mL", "500 mL"),
        ("Pump 40 mL/hr for 3 hr. Total mL?", "120 mL", "80 mL", "100 mL", "150 mL"),
        ("Need 180 mL over 3 hr. mL/hr?", "60 mL/hr", "50 mL/hr", "90 mL/hr", "100 mL/hr"),
        ("90 mL/hr × 4 hr = mL?", "360 mL", "320 mL", "400 mL", "340 mL"),
        ("gtt/min = (mL/hr × DF)/60. If mL/hr=60, DF=15?", "15 gtt/min", "10 gtt/min", "20 gtt/min", "25 gtt/min"),
        ("mL/hr=30, DF=20. gtt/min?", "10 gtt/min", "6 gtt/min", "12 gtt/min", "15 gtt/min"),
        ("mL/hr=180, DF=10. gtt/min?", "30 gtt/min", "25 gtt/min", "35 gtt/min", "40 gtt/min"),
        ("250 mL to run in 2 hr. mL/hr?", "125 mL/hr", "100 mL/hr", "150 mL/hr", "200 mL/hr"),
        ("600 mL over 5 hr. mL/hr?", "120 mL/hr", "100 mL/hr", "125 mL/hr", "150 mL/hr"),
        ("If 400 mL left and rate 80 mL/hr, hours to finish?", "5 hours", "4 hours", "6 hours", "8 hours"),
        ("Rate 100 mL/hr. How many hours for 450 mL?", "4.5 hours", "4 hours", "5 hours", "3.5 hours"),
        ("DF20. Observed 125 mL/hr. gtt/min rounded whole?", "42 gtt/min", "41 gtt/min", "40 gtt/min", "45 gtt/min"),
        ("Microdrip 60 gtt/mL at 30 mL/hr gives:", "30 gtt/min", "20 gtt/min", "40 gtt/min", "60 gtt/min"),
        ("Order 250 mL over 90 minutes. mL/hr?", "167 mL/hr", "150 mL/hr", "175 mL/hr", "200 mL/hr"),
        ("100 mL over 30 min. mL/hr?", "200 mL/hr", "100 mL/hr", "150 mL/hr", "300 mL/hr"),
        ("50 mL/hr for 6 hr. mL total?", "300 mL", "250 mL", "350 mL", "200 mL"),
        ("gtt/min 20. DF20. mL/min?", "1 mL/min", "0.5 mL/min", "2 mL/min", "20 mL/min"),
        ("If mL/min = 2 and DF=15, gtt/min?", "30 gtt/min", "15 gtt/min", "20 gtt/min", "25 gtt/min"),
        ("800 mL over 10 hr. mL/hr?", "80 mL/hr", "75 mL/hr", "100 mL/hr", "90 mL/hr"),
        ("mL/hr 60, DF 10. gtt/min?", "10 gtt/min", "6 gtt/min", "12 gtt/min", "15 gtt/min"),
        ("1500 mL over 24 hr. mL/hr?", "62.5 mL/hr", "60 mL/hr", "65 mL/hr", "70 mL/hr"),
        ("Rate 83 mL/hr (rounded). 6 hr infusion mL?", "498 mL", "500 mL", "480 mL", "450 mL"),
        ("300 mL over 4 hr; DF 15. gtt/min?", "18.75 gtt/min", "15 gtt/min", "20 gtt/min", "25 gtt/min"),
        ("100 mL/hr for 8 hr. mL?", "800 mL", "750 mL", "850 mL", "900 mL"),
        ("gtt/min 15, DF 15. mL/hr?", "60 mL/hr", "45 mL/hr", "75 mL/hr", "90 mL/hr"),
        ("450 mL over 6 hr. mL/hr?", "75 mL/hr", "70 mL/hr", "80 mL/hr", "90 mL/hr"),
        ("mL/hr 110, DF 20. gtt/min nearest tenth?", "36.7 gtt/min", "35 gtt/min", "38 gtt/min", "40 gtt/min"),
        ("200 mL over 5 hr; DF 60. gtt/min?", "40 gtt/min", "30 gtt/min", "50 gtt/min", "60 gtt/min"),
        ("720 mL over 12 hr. mL/hr?", "60 mL/hr", "50 mL/hr", "70 mL/hr", "80 mL/hr"),
        ("If bag 1000 mL and 6 hr left at 100 mL/hr, already infused?", "400 mL", "300 mL", "500 mL", "600 mL"),
        ("25 mL/hr × 8 hr = ?", "200 mL", "150 mL", "250 mL", "300 mL"),
        ("DF 20, rate 50 mL/hr. gtt/min?", "16.7 gtt/min", "15 gtt/min", "18 gtt/min", "20 gtt/min"),
        ("180 mL over 3 hr; DF 15. gtt/min?", "15 gtt/min", "12 gtt/min", "18 gtt/min", "20 gtt/min"),
    ]
    out = [
        mcq(
            stem,
            ok,
            b,
            c,
            d,
            "A",
            "Apply mL/hr = volume/time; gtt/min = (mL/hr×DF)/60; invert for time.",
            {"B": "Arithmetic/setup error.", "C": "Arithmetic/setup error.", "D": "Arithmetic/setup error."},
        )
        for stem, ok, b, c, d in rows
    ]
    # Fix row that needs recalculation: gtt/min 15, DF 15 -> mL/min = 1, mL/hr = 60. ok
    # Verify: 250 mL over 90 min ->250/1.5 = 166.67 -> "167 mL/hr" - good
    # 100 mL 30 min -> 200 mL/hr - good
    #300 mL 4 hr 75 mL/hr, gtt/min =75*15/60 = 18.75 - good
    # bag 1000, 6 hr left at 100 mL/hr means600 mL remaining to give? "already infused" - if 6 hr LEFT at 100 mL/hr, remaining volume = 600 mL, infused = 1000-600 = 400. Good.

    fill_to(
        out,
        50,
        lambda n: mcq(
            f"IV drill {n}: 1000 mL over 20 hr. mL/hr?",
            "50 mL/hr",
            "40 mL/hr",
            "60 mL/hr",
            "100 mL/hr",
            "A",
            "1000/20 = 50 mL/hr.",
            {"B": "Wrong division.", "C": "Wrong division.", "D": "Wrong division."},
        ),
    )
    return out[:50]


def main() -> None:
    topics = [
        {
            "domain": "Microbiology Basics",
            "topicSlug": "intro-microbiology-classification",
            "topicName": "Introduction to Microbiology: Microorganism Classification",
            "readinessWeight": "high",
            "cognitiveLevel": "foundational-recall",
            "targetQuestionCountMin": 35,
            "questionsGeneratedThisBatch": 35,
            "prerequisiteTopicSlugs": ["cell-structure-and-function"],
            "lessons": micro_intro_lessons(),
            "questions": micro_intro_q(),
        },
        {
            "domain": "Microbiology Basics",
            "topicSlug": "bacterial-structure-and-reproduction",
            "topicName": "Bacterial Structure and Reproduction",
            "readinessWeight": "medium",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 30,
            "questionsGeneratedThisBatch": 30,
            "prerequisiteTopicSlugs": ["intro-microbiology-classification"],
            "lessons": bacterial_lessons(),
            "questions": bacterial_q(),
        },
        {
            "domain": "Microbiology Basics",
            "topicSlug": "viral-structure-and-pathogenesis",
            "topicName": "Viral Structure and Pathogenesis",
            "readinessWeight": "medium",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 30,
            "questionsGeneratedThisBatch": 30,
            "prerequisiteTopicSlugs": ["intro-microbiology-classification"],
            "lessons": viral_lessons(),
            "questions": viral_q(),
        },
        {
            "domain": "Microbiology Basics",
            "topicSlug": "antimicrobials-overview",
            "topicName": "Antimicrobials: Antibiotics, Antivirals, and Antifungals",
            "readinessWeight": "high",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 40,
            "questionsGeneratedThisBatch": 40,
            "prerequisiteTopicSlugs": ["bacterial-structure-and-reproduction", "viral-structure-and-pathogenesis"],
            "lessons": antimicrobial_lessons(),
            "questions": antimicrobial_q(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "pharmacology-intro-drug-classifications",
            "topicName": "Introduction to Pharmacology: Drug Names and Classifications",
            "readinessWeight": "high",
            "cognitiveLevel": "foundational-recall",
            "targetQuestionCountMin": 40,
            "questionsGeneratedThisBatch": 40,
            "prerequisiteTopicSlugs": ["organic-molecules-macromolecules", "antimicrobials-overview"],
            "lessons": pharm_intro_lessons(),
            "questions": pharm_intro_q(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "pharmacokinetics-adme",
            "topicName": "Pharmacokinetics: Absorption, Distribution, Metabolism, and Excretion",
            "readinessWeight": "critical",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 50,
            "questionsGeneratedThisBatch": 50,
            "prerequisiteTopicSlugs": ["pharmacology-intro-drug-classifications", "digestive-system-anatomy", "urinary-system-anatomy"],
            "prerequisiteBridgingNote": "Lesson 1 embeds GI and renal context for absorption/excretion; complete full A&P digestive/urinary topics in curriculum.",
            "lessons": pk_lessons(),
            "questions": pk_q(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "pharmacodynamics-drug-actions",
            "topicName": "Pharmacodynamics: Drug Actions and Effects",
            "readinessWeight": "critical",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 40,
            "questionsGeneratedThisBatch": 40,
            "prerequisiteTopicSlugs": ["pharmacokinetics-adme"],
            "lessons": pd_lessons(),
            "questions": pd_q(),
        },
        {
            "domain": "Dosage Math",
            "topicSlug": "iv-flow-rate-calculations",
            "topicName": "IV Flow Rate and Drip Rate Calculations",
            "readinessWeight": "critical",
            "cognitiveLevel": "early-application",
            "targetQuestionCountMin": 50,
            "questionsGeneratedThisBatch": 50,
            "prerequisiteTopicSlugs": ["oral-medication-dosage-calculations"],
            "lessons": iv_lessons(),
            "questions": iv_q(),
        },
    ]

    doc = {
        "batchMeta": {
            "blueprintFile": "data/blueprints/foundations/pre-nursing-foundational-blueprint.json",
            "generatedDate": "2026-04-11",
            "batchTitle": "Microbiology chain, pharm intro, PK/PD, IV calculations",
            "sequenceInThisFile": [t["topicSlug"] for t in topics],
            "curriculumNotes": [
                "Assumes cell-structure-and-function (batch 3), organic molecules (batch 3), and oral dosage (batch 3) already in learner path.",
                "Pharmacokinetics includes digestive/urinary bridge; full anatomy topics still recommended.",
                "Pharmacodynamics follows PK per blueprint ordering in this file.",
            ],
        },
        "topics": topics,
        "finalReport": {
            "topicsProcessed": len(topics),
            "lessonsTotal": sum(len(t["lessons"]) for t in topics),
            "questionsTotal": sum(len(t["questions"]) for t in topics),
            "lessonsPerTopic": {t["topicSlug"]: len(t["lessons"]) for t in topics},
            "questionsPerTopic": {t["topicSlug"]: len(t["questions"]) for t in topics},
        },
    }

    for t in topics:
        assert len(t["questions"]) == t["questionsGeneratedThisBatch"]

    out = Path(__file__).with_name("pre-nursing-batch-4-micro-pharm-pk-pd-iv.json")
    out.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out, "questions", doc["finalReport"]["questionsTotal"])


if __name__ == "__main__":
    main()
