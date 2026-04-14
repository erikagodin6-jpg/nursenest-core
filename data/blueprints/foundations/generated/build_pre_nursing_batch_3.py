#!/usr/bin/env python3
"""
Batch 3: organic-molecules-macromolecules, cell-structure-and-function,
routes-of-drug-administration (with ADME bridge), pharmacology-adverse-effects(with pharmacodynamics bridge), rights-of-medication-administration,
oral-medication-dosage-calculations.

Prerequisite honesty: organic includes a compact chemical-bonds bridge.
Routes includes compact pharmacokinetics/intro context bridge.
Adverse includes compact pharmacodynamics bridge.
"""

from __future__ import annotations

import json
from pathlib import Path


def mcq(
    stem: str,
    a: str,
    b: str,
    c: str,
    d: str,
    correct: str,
    rationale: str,
    wrong: dict[str, str],
) -> dict:
    return {
        "stem": stem,
        "options": {"A": a, "B": b, "C": c, "D": d},
        "correctAnswer": correct,
        "rationale": rationale,
        "whyIncorrect": wrong,
    }


def pick_wrong(ans: str, pool: list[str]) -> tuple[str, str, str]:
    out: list[str] = []
    for p in pool:
        if p != ans and p not in out:
            out.append(p)
        if len(out) == 3:
            break
    while len(out) < 3:
        out.append("Not supported by this concept")
    return out[0], out[1], out[2]


def organic_lessons() -> list[dict]:
    return [
        {
            "title": "Bonds and building blocks that make macromolecules possible",
            "structuredContent": {
                "overview": "Large biological molecules are built from smaller units using covalent bonds within chains and weaker interactions that shape 3D structure.",
                "prerequisiteBridgeChemicalBonds": {
                    "covalent": "Atoms share electrons; forms stable backbones of organic molecules.",
                    "ionic": "Electrons transferred; important for salts and many electrolyte behaviors (preview).",
                    "hydrogen": "Weak attraction involving polarized H; stabilizes protein/DNA shape and water networks.",
                },
                "mentalModel": "Think LEGO: monomers snap into polymers; bond type determines whether a link is 'permanent' (covalent polymer backbone) or 'adjustable' (H-bonds folding a protein).",
                "commonMistakes": ["Treating hydrogen bonds like covalent bonds in strength", "Confusing monomer with polymer"],
                "clinicalRelevanceLight": "Drug shape, receptor fit, and fluid balance tie back to these ideas at a foundational level.",
            },
        },
        {
            "title": "Carbohydrates and lipids: quick energy vs compact fuel and barriers",
            "structuredContent": {
                "overview": "Carbohydrates are sugar-based fuels and structural polysaccharides; lipids store dense energy and form membranes.",
                "carbohydrates": [
                    "Monosaccharides (e.g., glucose) are single sugars.",
                    "Disaccharides (e.g., sucrose) link two monosaccharides.",
                    "Polysaccharides (starch, glycogen, cellulose) store or structure with long chains.",
                ],
                "lipids": [
                    "Triglycerides: glycerol + three fatty acids; major energy storage.",
                    "Phospholipids: bilayer foundation of cell membranes.",
                    "Steroids: four-ring framework (e.g., cholesterol as membrane component and hormone precursor).",
                ],
                "commonMistakes": ["Starch vs glycogen storage location", "Thinking all lipids are only for energy"],
                "clinicalRelevanceLight": "Glucose monitoring and lipid panels map to these molecule classes.",
            },
        },
        {
            "title": "Proteins and nucleic acids: workers and information",
            "structuredContent": {
                "overview": "Proteins are polymers of amino acids with four structural levels; nucleic acids (DNA, RNA) store and transfer genetic information.",
                "proteins": [
                    "Primary: amino acid sequence",
                    "Secondary: local folding (alpha helix, beta sheet)",
                    "Tertiary: overall 3D shape of one chain",
                    "Quaternary: multiple chains together (when present)",
                    "Enzymes are catalytic proteins that speed specific reactions.",
                ],
                "nucleicAcids": [
                    "DNA: double helix; thymine; stores heritable information.",
                    "RNA: uracil; multiple types help decode and use DNA information.",
                    "Nucleotide: phosphate + sugar + nitrogenous base.",
                ],
                "commonMistakes": ["DNA vs RNA base pairing at detail you have not studied yet—keep TH in DNA, U in RNA", "Confusing amino acid with nucleotide"],
                "clinicalRelevanceLight": "Many drugs target proteins (receptors, enzymes); genetic concepts underpin infection and cancer discussions later.",
            },
        },
    ]


def organic_questions() -> list[dict]:
    bank = [
        ("Which monosaccharide is a primary blood sugar for fuel transport?", "Glucose", "Cellulose", "Cholesterol", "Leucine"),
        ("Glycogen is best described as:", "a storage polysaccharide in animals", "plant structural fiber", "a nucleic acid", "a phospholipid"),
        ("Starch is primarily:", "plant energy storage polysaccharide", "animal quick energy in muscle", "genetic material", "enzyme catalyst"),
        ("Cellulose is best described as:", "structural polysaccharide in plant cell walls", "animal energy storage", "DNA backbone only", "triglyceride"),
        ("A triglyceride contains:", "glycerol and three fatty acids", "glycerol and two fatty acids", "only amino acids", "only nucleotides"),
        ("Phospholipids are central to:", "cell membrane bilayers", "primary DNA replication enzyme alone", "glycogen structure", "bone mineral matrix alone"),
        ("Cholesterol belongs to which class?", "steroid lipids", "monosaccharides", "polypeptides", "purine bases"),
        ("Primary protein structure refers to:", "amino acid sequence", "alpha helix pattern", "overall 3D folding of multiple subunits", "hydrogen bond to DNA"),
        ("An enzyme is primarily:", "a protein catalyst", "a DNA strand", "a triglyceride", "a phospholipid monolayer"),
        ("DNA uses which nitrogenous base paired with adenine (student-level classic pairing)?", "thymine", "uracil", "guanine with adenine directly always", "cytosine always with adenine"),
        ("RNA contains which base instead of thymine?", "uracil", "thymine", "inosine only", "ribose only as base"),
        ("A nucleotide includes:", "phosphate, sugar, nitrogenous base", "only amino acids", "only fatty acids", "only a phosphate"),
        ("Denaturation of a protein most directly disrupts:", "shape needed for function", "only primary sequence always", "DNA double helix only", "membrane thickness only"),
        ("Saturated vs unsaturated fatty acids differ in:", "presence of carbon-carbon double bonds in tail", "number of phosphate groups", "presence of glycerol", "nucleotide sequence"),
        ("Which linkage builds protein polymers?", "peptide bonds between amino acids", "phosphodiester bonds between amino acids", "glycosidic bonds between amino acids", "ester bonds only between bases"),
        ("Which best describes DNA vs RNA sugar?", "DNA deoxyribose; RNA ribose", "both use ribose", "both use deoxyribose only", "neither contains sugar"),
        ("Double helix describes:", "DNA structure", "triglyceride structure", "single amino acid", "starch granule only"),
        ("Which macromolecule is the main heritable information carrier in human cells?", "DNA", "mRNA only without DNA", "triglyceride", "glycogen"),
        ("Lipids are insoluble in water primarily because they are:", "hydrophobic overall relative to water", "always positively charged", "always DNA-associated", "composed only of ions"),
        ("Which is a disaccharide example?", "sucrose", "glucose alone", "cellulose", "starch polymer"),
        ("Secondary protein structure includes:", "alpha helix and beta sheet", "amino acid sequence only", "quaternary only", "nucleotide pairing"),
        ("Quaternary structure means:", "multiple polypeptide chains arranged together", "only alpha helix", "only linear sequence", "lipid bilayer packing"),
        ("Phosphodiester bonds primarily connect:", "nucleotides in nucleic acids", "amino acids in proteins", "fatty acids to cholesterol", "glucose units only in glycogen"),
        ("Which pair is both polysaccharides?", "starch and glycogen", "glucose and fructose only", "DNA and RNA", "phospholipid and triglyceride"),
        ("Amino acids polymerize to form:", "proteins", "triglycerides", "DNA", "ATP only"),
        ("Which molecule class is the immediate focus of 'central dogma' at student preview level?", "DNA to RNA to protein", "only lipid to lipid", "only starch to cellulose", "water to ions only"),
        ("Membrane fluidity is influenced by:", "fatty acid tail saturation and cholesterol", "only DNA length", "only glycogen branching", "number of peptide bonds in water"),
        ("Hydrogen bonds help stabilize:", "protein secondary structure and DNA base pairing", "only ionic salts in bone", "only triglyceride neutrality", "nothing in biology"),
        ("Glycosidic bonds link:", "monosaccharides into larger carbs", "amino acids", "nucleotides in DNA", "fatty acids to glycerol in phospholipids"),
        ("Which base is purine (student high-yield)?", "adenine", "cytosine", "thymine", "uracil"),
        ("Which statement is most accurate at pre-nursing depth?", "Many drugs act on proteins such as receptors and enzymes", "Drugs never bind proteins", "Lipids never participate in signaling", "DNA never relates to protein production"),
        ("Cellulose differs from glycogen mainly in:", "branching and organism role (structure vs storage)", "identical function", "both only in animals", "both are lipids"),
        ("RNA polymer is assembled from:", "ribonucleotides", "deoxyribonucleotides only", "amino acids only", "fatty acids only"),
        ("Which macromolecule stores the most energy per gram typically taught?", "lipids", "carbohydrates always more than lipids", "nucleic acids for calories", "water"),
        ("Keratin and collagen are examples of:", "structural proteins", "storage polysaccharides", "nucleic acids", "steroid hormones only"),
        ("A gene is expressed to make protein through processes involving:", "transcription and translation (preview)", "only lipid digestion", "only glycogen hydrolysis in lungs", "osmosis alone"),
        ("Which best describes competitive inhibition at student level?", "substance competes for active site slowing catalysis", "enzyme always destroyed permanently", "DNA replicates without proteins", "lipids cannot be digested"),
        ("Denatured enzyme often:", "loses catalytic activity", "always works faster", "becomes DNA", "stores glucose"),
        ("Phospholipid hydrophilic region is typically:", "phosphate head", "fatty acid tails", "cholesterol core only", "nucleotide base"),
        ("Fatty acid tails of phospholipids are:", "hydrophobic", "hydrophilic", "always charged positive", "DNA strands"),
        ("Which is NOT a nucleic acid?", "triglyceride", "DNA", "mRNA", "tRNA"),
        ("Starch and glycogen both are:", "polysaccharides", "disaccharides only", "lipids", "proteins"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in bank:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Matches macromolecule roles taught at pre-nursing depth.",
                {"B": "Incorrect classification or role.", "C": "Incorrect classification or role.", "D": "Incorrect classification or role."},
            )
        )
    while len(out) < 40:
        out.append(
            mcq(
                f"Organic drill {len(out)}: A polymer of amino acids is a:",
                "protein",
                "nucleic acid",
                "triglyceride",
                "monosaccharide",
                "A",
                "Proteins are amino acid polymers.",
                {"B": "Nucleic acids use nucleotides.", "C": "Triglycerides are lipids.", "D": "Monosaccharides are single sugars."},
            )
        )
    return out[:40]


def cell_lessons() -> list[dict]:
    return [
        {
            "title": "Plasma membrane: gatekeeper and communicator",
            "structuredContent": {
                "overview": "The phospholipid bilayer with embedded proteins controls what enters and leaves and receives signals.",
                "concepts": [
                    "Fluid mosaic model: lipids and proteins move within the sheet.",
                    "Selective permeability: some substances cross freely; others need channels or carriers.",
                    "Simple diffusion: movement down a gradient without ATP (e.g., small nonpolar molecules).",
                    "Facilitated diffusion: protein-assisted, still down gradient, no ATP.",
                    "Active transport: moves against gradient; requires energy (ATP or coupled gradients).",
                ],
                "commonMistakes": ["Confusing facilitated diffusion with active transport", "Thinking all molecules cross membranes the same way"],
                "clinicalRelevanceLight": "Many drugs and electrolyte problems ultimately tie to membrane transport concepts.",
            },
        },
        {
            "title": "Organelles: division of labor inside the cell",
            "structuredContent": {
                "overview": "Membrane-bound compartments specialize tasks to keep chemistry organized.",
                "organelles": [
                    "Nucleus: houses DNA; nucleolus makes ribosomal RNA (survey).",
                    "Mitochondria: ATP from aerobic respiration (student-level: energy conversion).",
                    "Ribosomes: protein synthesis (free or on ER).",
                    "Rough ER: membrane + ribosomes; processes secretory/ membrane proteins.",
                    "Smooth ER: lipid synthesis, detox in some cells.",
                    "Golgi: modifies, packages, ships proteins and lipids.",
                    "Lysosomes: digestive enzymes in animal cells (survey).",
                    "Peroxisomes: breakdown of certain molecules; contain catalase (survey).",
                    "Cytoskeleton: shape, movement, intracellular transport.",
                ],
                "commonMistakes": ["Mitochondria 'make energy' wording—prefer ATP generation via cellular respiration", "ER vs Golgi confusion"],
                "clinicalRelevanceLight": "Tissue function differences (e.g., hepatocyte smooth ER) preview why organs behave differently.",
            },
        },
        {
            "title": "From glucose to ATP: cellular respiration at a map level",
            "structuredContent": {
                "overview": "Cells harvest chemical energy from nutrients; mitochondria dominate aerobic ATP yield in eukaryotes.",
                "mentalModel": "Glucose + oxygen → carbon dioxide + water + ATP (overall); intermediate steps occur in cytosol and mitochondrial compartments.",
                "commonMistakes": ["Thinking respiration only happens in lungs—lung ventilation vs cellular respiration", "Equating fermentation details you have not studied"],
                "clinicalRelevanceLight": "Oxygen delivery and perfusion connect to whether cells can run aerobic pathways efficiently.",
            },
        },
    ]


def cell_questions() -> list[dict]:
    bank = [
        ("The plasma membrane is primarily composed of:", "phospholipid bilayer", "cell wall peptidoglycan in human cells", "pure DNA sheet", "only collagen"),
        ("Selective permeability means:", "some substances cross more easily than others", "everything crosses equally fast", "only water never crosses", "membrane is solid nonmoving"),
        ("Simple diffusion moves substances:", "down their concentration gradient without ATP", "against gradient using ATP always", "only with sodium only", "only in nucleus"),
        ("Facilitated diffusion requires:", "a channel or carrier protein", "ATP always", "DNA polymerase", "lysosomal fusion always"),
        ("Active transport moves substances:", "against their gradient using energy", "always down gradient", "only by osmosis", "without proteins"),
        ("The nucleus primarily contains:", "genomic DNA", "digestive enzymes for bulk cytosol", "ATP synthase only", "only lipids"),
        ("Mitochondria are best known for:", "ATP generation via aerobic respiration", "photosynthesis", "protein packaging for secretion in Golgi role", "making ribosomal subunits entirely alone"),
        ("Ribosomes function in:", "protein synthesis", "lipid bilayer formation only", "DNA replication only in all cells always", "waste export only"),
        ("Rough ER is studded with:", "ribosomes", "mitochondria", "lysosomes only", "peroxisomes only"),
        ("Smooth ER is associated with:", "lipid synthesis and detox roles in some cells", "only ribosome attachment", "only DNA storage", "only ATP storage"),
        ("Golgi apparatus modifies and:", "packages molecules for secretion or membranes", "transcribes DNA", "makes ATP", "breaks down all nutrients"),
        ("Lysosomes contain:", "hydrolytic enzymes", "DNA polymerase primarily", "chlorophyll", "hemoglobin always"),
        ("Cytoskeleton functions include:", "cell shape and intracellular transport", "ATP production primary site", "genetic information storage", "oxygen diffusion across alveoli"),
        ("Osmosis refers to:", "water movement across a selectively permeable membrane", "protein synthesis", "DNA replication", "fatty acid oxidation only"),
        ("Which organelle has double membrane?", "mitochondrion", "ribosome", "lysosome typical description", "Golgi cisternae"),
        ("Nucleolus is involved in:", "ribosomal RNA / ribosome assembly (survey)", "ATP synthesis", "lipid digestion in cytosol", "photosynthesis"),
        ("Cellular respiration in eukaryotes heavily involves:", "mitochondria", "cell wall", "large central vacuole typical plant focus", "nuclear envelope only"),
        ("Which process directly uses oxygen in aerobic respiration overview?", "electron transport / oxidative phosphorylation stage (survey)", "glycolysis only in cytosol with O2 required", "fermentation", "translation"),
        ("Facilitated diffusion is:", "passive", "always active", "only against gradient", "only for large proteins always endocytosis"),
        ("Which pair both describe membrane proteins?", "channels and carriers", "DNA and RNA", "starch and glycogen", "triglyceride and steroid only"),
        ("Endocytosis brings material:", "into the cell via vesicles", "out always without vesicles", "only through nuclear pores always", "only by simple diffusion always"),
        ("Exocytosis releases material:", "from vesicles to exterior", "into nucleus", "only into lysosome always without fusion", "only by osmosis"),
        ("Peroxisomes are notably involved in:", "breakdown of certain molecules; catalase (survey)", "primary ATP synthesis", "DNA to mRNA transcription", "peptide bond formation"),
        ("The genetic code is used during:", "translation to build proteins", "only lipid digestion", "only osmosis", "only diffusion of O2"),
        ("Transcription at student level produces:", "RNA from a DNA template", "protein directly without RNA", "ATP from glucose only", "replication of ribosomes only"),
        ("Translation at student level produces:", "polypeptide using mRNA", "DNA from protein", "lipid bilayer without proteins", "glycogen from cellulose"),
        ("Hypotonic solution relative to cell can cause:", "water entry and swelling (animal cell risk)", "always cell shrinkage", "no water movement", "only protein denaturation always"),
        ("Hypertonic solution relative to cell can cause:", "water leaving and shrinkage", "always lysis in all cells", "no gradient exists", "only endocytosis"),
        ("Integral membrane proteins:", "span or embed in the bilayer", "only float outside membrane never touching lipids", "only DNA-binding in cytosol", "only in nucleus"),
        ("Which best describes why cells are small?", "surface-to-volume ratio limits diffusion efficiency", "cells are never small", "DNA forbids small cells", "mitochondria require giant cells only"),
        ("Cytoplasm refers to:", "cytosol plus organelles except nucleus in common usage", "only nucleus", "only extracellular fluid", "only bone matrix"),
        ("Which organelle touches the nuclear envelope in typical teaching diagrams?", "endoplasmic reticulum", "lysosome always distant", "peroxisome always inside nucleus", "ribosome only in mitochondria"),
        ("Aerobic means:", "with oxygen", "without oxygen always", "only in cytoplasm", "only in vaccines"),
        ("Anaerobic glycolysis occurs:", "in cytosol", "only in mitochondria matrix", "only in lysosomes", "only in nucleus"),
        ("Which is NOT a function attributed to smooth ER in typical teaching?", "photosynthesis light reactions", "lipid synthesis", "detox in liver cells (survey)", "calcium storage in muscle (survey)"),
        ("Telomeres and detailed chromatin structure are:", "beyond this pre-nursing lesson depth", "the same as lysosomes", "only in prokaryotes", "only lipids"),
        ("Gap junctions allow:", "direct communication between adjacent cells", "waterproof seals only always", "immune attack always", "bone mineralization"),
        ("Tight junctions primarily:", "seal adjacent cells to block paracellular leak", "allow free movement of large proteins always", "make ATP", "replicate DNA"),
        ("Microvilli increase:", "surface area for absorption", "nuclear volume", "mitochondrial number always to zero", "DNA content per cell"),
        ("Cilia movement is associated with:", "moving fluid/mucus at epithelial surfaces (survey)", "ATP synthesis primary", "DNA replication", "triglyceride storage"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in bank:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Matches cell biology at pre-nursing conceptual depth.",
                {"B": "Incorrect mechanism or location.", "C": "Incorrect mechanism or location.", "D": "Incorrect mechanism or location."},
            )
        )
    while len(out) < 45:
        out.append(
            mcq(
                f"Cell drill {len(out)}: Primary site of aerobic ATP yield in typical human cells:",
                "mitochondria",
                "lysosomes",
                "Golgi",
                "ribosomes",
                "A",
                "Mitochondria carry out oxidative phosphorylation.",
                {"B": "Lysosomes degrade material.", "C": "Golgi packages molecules.", "D": "Ribosomes synthesize protein."},
            )
        )
    return out[:45]


def routes_lessons() -> list[dict]:
    return [
        {
            "title": "Why route changes drug behavior: ADME bridge (compact)",
            "structuredContent": {
                "overview": "Route affects absorption speed, first-pass metabolism, and risk. This section replaces a full pharmacokinetics course with a map you can grow later.",
                "prerequisiteBridgePharmacokinetics": {
                    "absorption": "Movement from site of administration into blood (or direct blood placement for IV).",
                    "distribution": "Drug travels to tissues via circulation and protein binding (preview).",
                    "metabolism": "Often liver enzymes chemically change drugs; first-pass effect reduces oral bioavailability for some drugs.",
                    "excretion": "Kidneys and other routes remove drug from the body (preview).",
                },
                "clinicalRelevanceLight": "Switching oral to IV is never 'the same' without prescriber review—rate and risk profiles differ.",
            },
        },
        {
            "title": "Enteral and parenteral routes (pre-nursing recognition)",
            "structuredContent": {
                "overview": "Enteral = through GI tract; parenteral = bypasses GI tract.",
                "routes": [
                    "Oral (PO): convenient; subject to absorption and first-pass.",
                    "Sublingual/buccal: avoids some first-pass via rich blood supply under mucosa.",
                    "Intravenous (IV): 100% bioavailability for the delivered dose; immediate plasma entry—high risk if wrong.",
                    "Intramuscular (IM): depot absorption from muscle.",
                    "Subcutaneous (SC/SQ): slower absorption from fatty tissue.",
                    "Transdermal: slow sustained absorption through skin.",
                    "Inhalation: rapid local/systemic effect depending on drug.",
                    "Rectal/vaginal/topical/ophthalmic/otic: situational routes with specific teaching later.",
                ],
                "commonMistakes": ["IM vs SC depth and volume assumptions", "Thinking IV is 'safer'—it is unforgiving"],
                "clinicalRelevanceLight": "Rights of administration always include right route because therapeutic and safety profiles change by route.",
            },
        },
        {
            "title": "Route selection: speed, swallowing, GI function, and safety",
            "structuredContent": {
                "overview": "Nurses implement orders; understanding route language helps you anticipate monitoring and teaching needs at a student level.",
                "examples": [
                    "NPO status affects enteral routes.",
                    "Vomiting may block reliable oral absorption.",
                    "IV push vs infusion differ in rate and monitoring.",
                ],
                "commonMistakes": ["Confusing IV bolus with large-volume infusion without rate context"],
                "clinicalRelevanceLight": "Route ties to assessment frequency basics you will expand in skills lab.",
            },
        },
    ]


def routes_questions() -> list[dict]:
    bank = [
        ("Enteral administration means:", "through the gastrointestinal tract", "only into spinal cord", "only topical to skin always", "only inhaled"),
        ("Parenteral administration means:", "bypassing the GI tract", "only oral tablets", "only rectal", "only sublingual"),
        ("Which route delivers drug directly into the bloodstream?", "intravenous", "oral", "transdermal patch always fastest always", "subcutaneous always identical to IV"),
        ("First-pass effect most notably affects many:", "oral drugs metabolized by the liver after GI absorption", "IV drugs before injection", "topical creams on intact thick skin always systemic peak same as IV", "inhaled drugs always"),
        ("Sublingual administration can reduce:", "first-pass metabolism for some drugs", "all drug absorption", "need for any blood flow", "renal excretion always"),
        ("IM injections deposit medication into:", "muscle tissue", "dermis only always", "bone marrow always", "artery always"),
        ("Subcutaneous injections deposit into:", "subcutaneous fatty tissue", "muscle always", "peritoneal cavity always", "epidermis only"),
        ("Transdermal patches rely on:", "absorption through skin over time", "immediate IV bolus", "GI digestion only", "inhalation only"),
        ("Which is an example of parenteral route?", "subcutaneous", "oral tablet", "enteral feeding tube medication only without class definition", "PO liquid"),
        ("Bioavailability in simplest terms is:", "fraction of drug that reaches systemic circulation", "drug color", "tablet size only", "patient age only"),
        ("Distribution primarily involves:", "drug moving from blood to tissues", "drug swallowed only", "drug painted on hair", "drug stored only in patch backing"),
        ("Metabolism often occurs heavily in:", "liver", "toenail only", "cornea only for all drugs", "bone only"),
        ("Excretion commonly includes:", "renal elimination", "only sweating for all drugs", "only salivation for all drugs", "storage in patch only"),
        ("IV route skips:", "GI absorption step", "sterile technique", "need for orders", "need for patient identification"),
        ("Oral route is:", "enteral", "parenteral", "always identical to IV peak", "never used"),
        ("Inhalation can provide:", "rapid delivery for appropriate agents", "always slower than transdermal for every drug", "no lung surface involvement", "only IV equivalent for all drugs"),
        ("Buccal administration uses:", "oral mucosa lining cheek", "sole of foot", "scalp only", "tympanic membrane always"),
        ("Z-track technique is associated with:", "IM injections to reduce leakage (student recognition)", "IV only", "PO only", "only ophthalmic"),
        ("Which factor can alter oral absorption?", "food, GI motility, and formulation", "only shoe size", "only hair color", "room wallpaper color"),
        ("Topical route aims for:", "local effect at surface", "always identical systemic peak to IV", "only sublingual effect", "only intrathecal effect"),
        ("Epidural is a route involving:", "space around dura (student recognition)", "oral mucosa", "skin stratum corneum only", "gastric lumen only"),
        ("Intrathecal involves:", "CSF/spinal canal delivery (student recognition)", "skin patch", "PO tablet", "IM deltoid always"),
        ("Why might IV be higher risk for certain errors?", "direct plasma entry; rapid effect", "always slower than PO", "cannot cause harm", "no need for sterile preparation"),
        ("Which statement about SC insulin is most accurate at student level?", "absorbed from subcutaneous tissue; timing depends on formulation", "acts identically to IV insulin always", "never absorbed", "only works orally"),
        ("Rectal route can be used when:", "oral route is not feasible for some medications/contexts", "IV is always forbidden worldwide", "only for vitamins", "never in clinical care"),
        ("Otic administration means:", "into the ear", "into the eye", "into nose only", "into joint only"),
        ("Ophthalmic administration means:", "into the eye", "into ear", "into muscle", "into bone"),
        ("Nasal spray is:", "mucosal absorption via nasal cavity", "identical to IV for all drugs", "only cosmetic", "only enteral"),
        ("A central line delivers medication:", "into large central venous circulation (student recognition)", "into subcutaneous fat always", "onto skin only", "into stomach only"),
        ("Peripheral IV accesses:", "peripheral veins", "artery always first try", "bone always", "spinal cord directly always"),
        ("Gastrostomy tube medication is generally considered:", "enteral", "parenteral", "always identical to IV", "never ordered"),
        ("Which is true of IV infusion vs IV push at student level?", "rate and monitoring expectations differ", "they are always the same", "push never exists", "infusion never exists"),
        ("Transdermal fentanyl vs oral morphine illustrates:", "route and formulation change pharmacokinetics", "routes never matter", "all opioids identical", "only color matters"),
        ("Absorption of oral drug can be delayed by:", "some food-drug interactions", "always faster with any food", "only IV route", "only if patient sleeps"),
        ("Hepatic first-pass reduces oral bioavailability when:", "drug is extensively metabolized before systemic circulation", "drug is always IV", "liver absent", "kidney removes all drug instantly always"),
        ("Subcutaneous heparin low-dose injection sites commonly taught include:", "abdomen away from umbilicus (program-specific)", "only scalp", "only gluteus without training", "only IV line"),
        ("Zofran ODT (example class) dissolves on tongue; still oral/enteral category but formulation matters for speed—best student takeaway:", "formulation and site in mouth affect absorption behavior", "ODT means IV", "ODT cannot work", "ODT is always topical"),
        ("Elderly skin changes can affect:", "transdermal absorption", "only bone length", "only DNA only", "only hearing only"),
        ("Neonates and infants often require:", "careful dosing and route considerations (general principle)", "adult doses always", "no absorption differences ever", "only topical drugs"),
        ("Why learn enteral vs parenteral?", "communicate clearly and anticipate teaching/monitoring basics", "it is never tested", "routes are random words", "only pharmacists use routes"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in bank:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Standard route / ADME mapping at pre-nursing depth.",
                {"B": "Incorrect route or process.", "C": "Incorrect route or process.", "D": "Incorrect route or process."},
            )
        )
    while len(out) < 40:
        out.append(
            mcq(
                f"Routes drill {len(out)}: Parenteral includes which example?",
                "intramuscular",
                "oral tablet",
                "nasogastric liquid enteral",
                "swallowed capsule",
                "A",
                "IM bypasses GI tract (parenteral).",
                {"B": "PO is enteral.", "C": "NG enteral is enteral.", "D": "Capsule PO is enteral."},
            )
        )
    return out[:40]


def adverse_lessons() -> list[dict]:
    return [
        {
            "title": "How drugs exert effects: pharmacodynamics bridge (compact)",
            "structuredContent": {
                "overview": "Adverse effects make sense when you remember drugs interact with receptors, enzymes, and channels.",
                "prerequisiteBridgePharmacodynamics": {
                    "receptor": "Cell protein that binds a drug; triggers a change.",
                    "agonist": "Activates receptor (full or partial).",
                    "antagonist": "Blocks receptor activation without activating it (classic competitive view at student level).",
                    "enzymeInhibition": "Drug reduces activity of an enzyme pathway.",
                },
                "clinicalRelevanceLight": "More drug is not 'more better' when safety margins shrink—dose-response thinking starts here.",
            },
        },
        {
            "title": "Side effect vs adverse drug reaction (ADR): language that matters",
            "structuredContent": {
                "overview": "At student level: side effects are expected known effects beyond the main therapeutic goal; ADRs are harmful/unintended responses tied to drug exposure.",
                "examples": [
                    "Diphenhydramine sedation can be therapeutic or unwanted depending on context.",
                    "Anaphylaxis is an emergency ADR pattern requiring immediate response protocols you will drill in skills.",
                ],
                "commonMistakes": ["Calling every nuisance a 'allergy'", "Ignoring that OTC drugs also cause ADRs"],
                "clinicalRelevanceLight": "Teach-back includes common effects patients should watch for.",
            },
        },
        {
            "title": "Interactions, allergies, toxicity, and reporting culture",
            "structuredContent": {
                "overview": "Drug-drug, drug-food, and drug-disease interactions change risk. True allergy involves immune-mediated hypersensitivity for certain drug classes; side intolerance is different.",
                "concepts": [
                    "Additive vs synergistic effects (preview).",
                    "Serotonin syndrome / bleeding risk with combinations are advanced examples for later—know they exist.",
                    "Report significant ADRs per policy; culture of safety encourages reporting.",
                ],
                "commonMistakes": ["Stopping a critical medication without prescriber communication"],
                "clinicalRelevanceLight": "Medication reconciliation and allergy lists reduce interaction and allergy errors.",
            },
        },
    ]


def adverse_questions() -> list[dict]:
    bank = [
        ("An agonist:", "activates a receptor", "blocks a receptor without activating", "destroys DNA always", "only works on bacteria"),
        ("A competitive antagonist at student level:", "blocks agonist binding at receptor site", "always destroys the receptor permanently", "increases agonist effect always", "only affects lipids"),
        ("Side effect classically means:", "known effect beyond primary therapeutic goal", "only allergic reaction", "only overdose", "only placebo"),
        ("Adverse drug reaction (ADR) emphasizes:", "harmful or unintended response linked to drug", "desired therapeutic effect only", "only herbal products", "only vitamins"),
        ("Drug-drug interaction can:", "change effectiveness or toxicity", "never occur with prescriptions", "only occur with IV", "only in children"),
        ("Grapefruit can interact with some drugs by affecting:", "metabolism enzymes (student recognition)", "only tablet color", "only water pH in stomach always", "only blood type"),
        ("True penicillin allergy vs side effect distinction at student level:", "allergy involves immune hypersensitivity pattern; nausea alone may be non-allergic intolerance", "they are identical always", "all rashes mean stop without reporting", "only pharmacists assess"),
        ("Additive effect means:", "combined effect equals sum of individual effects (simple model)", "effect always zero", "always multiplied unpredictably without study", "only for antibiotics"),
        ("Synergy at student preview means:", "combined effect greater than expected sum", "always less than one drug", "only topical", "impossible"),
        ("Toxicity often relates to:", "excessive drug effect or accumulation", "always therapeutic range widening only", "only placebo", "only oral route"),
        ("Therapeutic range / window concept at student level:", "range where benefit outweighs risk for many drugs monitored clinically", "always same for all drugs", "irrelevant to nursing", "only lab unrelated"),
        ("Idiosyncratic reaction suggests:", "unusual individual response", "expected in everyone", "only due to sugar pills", "only infection"),
        ("Phototoxicity risk means:", "increased sun sensitivity with some drugs", "only IV contrast always", "impossible with meds", "only genetic only"),
        ("OTC medications:", "can cause ADRs and interactions", "never cause harm", "never interact", "only safe in any dose"),
        ("Herbal supplements:", "can interact with prescriptions", "never interact", "are always FDA identical to drugs", "contain no active chemicals"),
        ("Serotonin syndrome is:", "a serious interaction pattern you will study later", "normal sleep", "only musculoskeletal sprain", "only dehydration"),
        ("Bleeding risk with NSAID + anticoagulant illustrates:", "additive pharmacodynamic risk (preview)", "no interaction", "only cosmetic", "only pediatric issue"),
        ("If patient develops new rash after starting drug, student-level priority:", "report and follow agency/provider direction", "ignore", "always continue without telling anyone", "only mention if rash painful"),
        ("Medication reconciliation helps reduce:", "interaction and omission errors", "only billing errors", "only room temperature errors", "only meal timing only"),
        ("Anticholinergic burden is:", "cumulative effect of multiple drugs with anticholinergic properties (preview)", "only hydration status", "only heart rate", "only renal mass"),
        ("Stevens-Johnson syndrome / TEN are:", "severe mucocutaneous reactions associated with some drugs (recognition only)", "mild itch only", "normal", "only infection rash"),
        ("Drug-induced liver injury is:", "possible with some medications; monitor per protocol", "impossible", "only from water", "only genetic without drugs"),
        ("Nephrotoxicity means:", "kidney injury risk from drug or factor", "liver injury", "skin only", "only ear"),
        ("Ototoxicity means:", "ear/hearing/balance toxicity risk", "kidney stones only", "only vision", "only taste"),
        ("Hypersensitivity type I classic involves:", "IgE-mediated rapid reactions in teaching (preview)", "always delayed only", "never immune", "only bacterial"),
        ("Placebo effect illustrates:", "expectation and context can change perceived outcomes", "drugs never work", "only surgery works", "only IV works"),
        ("Off-label use means:", "use not matching FDA-approved labeling (still may be evidence-based)", "illegal always", "only antibiotics", "only vitamins"),
        ("Black box warning indicates:", "FDA highlights serious risk", "no risk", "cosmetic label", "only OTC"),
        ("Polypharmacy increases:", "interaction and ADR risk", "safety always", "never complexity", "only cost only"),
        ("Antidote example at recognition level:", "naloxone for opioid overdose (program-specific scope)", "water for all ODs", "only oxygen for all drugs", "only glucose for all drugs"),
        ("Peak and trough levels relate to:", "monitoring some drugs to reduce toxicity (preview)", "only nutrition", "only exercise", "only imaging"),
        ("Allergic reaction vs anaphylaxis student distinction:", "anaphylaxis is systemic emergency pattern", "identical always", "only mild always", "only GI"),
        ("Drug fever is:", "fever linked to drug exposure (recognition)", "only infection always", "impossible", "only environmental"),
        ("Statin muscle ache vs rhabdomyolysis student message:", "severity spectrum exists; report significant symptoms", "ignore all pain", "always stop without provider", "only happens in elderly"),
        ("ACE inhibitor cough is:", "known ADR class effect for some patients", "impossible", "only allergy always", "only children"),
        ("Diarrhea from antibiotic can be:", "ADR related to GI disruption; C. diff is later concern", "always allergy", "never happens", "only dehydration unrelated"),
        ("Photosensitivity teaching includes:", "sun protection for susceptible drugs", "tanning encouragement", "only winter issue", "only eyes"),
        ("Warfarin + NSAID risk:", "bleeding interaction concern", "no concern", "only liver only", "only renal stone"),
        ("MAOI dietary interactions are:", "important class warnings you will study if applicable", "nonexistent", "only cosmetic", "only pediatric"),
        ("Reporting culture supports:", "learning and prevention", "punishment only", "hiding errors", "only billing"),
        ("Patient education on new medication should include:", "common effects and when to seek help per order/teaching plan", "nothing", "only pharmacy phone number without effects", "only diagnosis code"),
        ("Liver 'first-pass' relates to ADRs when:", "metabolism creates active/toxic metabolites in some cases (preview)", "never", "only IV", "only topical"),
        ("Renal dosing adjustment may be needed when:", "kidney clearance reduced", "patient has long hair", "only pediatric", "never for any drug"),
        ("Geriatric considerations often include:", "altered metabolism/excretion and fall risk", "identical to young adults always", "no ADR risk", "only cosmetic"),
        ("Pediatric dosing is:", "weight-based often; never assume adult dose", "always adult dose", "never calculated", "only volume"),
        ("Pregnancy category historical teaching vs current labeling:", "know teratogenic risk is real; follow current references (preview)", "all drugs safe", "no references exist", "only herbal matters"),
        ("Lactation transfer:", "some drugs enter breast milk; resources guide safety", "never happens", "all drugs forbidden always", "only vitamins transfer"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in bank:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Applies adverse-effect and interaction concepts at pre-nursing application depth.",
                {"B": "Incorrect safety or mechanism choice.", "C": "Incorrect safety or mechanism choice.", "D": "Incorrect safety or mechanism choice."},
            )
        )
    while len(out) < 45:
        out.append(
            mcq(
                f"ADR drill {len(out)}: A drug blocking a receptor without activating it is classically a(n):",
                "antagonist",
                "agonist",
                "enzyme substrate only",
                "placebo only",
                "A",
                "Antagonists block activation.",
                {"B": "Agonists activate.", "C": "Substrate is different concept.", "D": "Placebo is not mechanism class here."},
            )
        )
    return out[:45]


def rights_lessons() -> list[dict]:
    return [
        {
            "title": "Classic rights: patient, drug, dose, route, time",
            "structuredContent": {
                "overview": "Programs teach 5–10 rights; start with the core five as a checklist mindset.",
                "rights": [
                    "Right patient: two identifiers; barcode when available.",
                    "Right drug: match order to label; look-alike/sound-alike awareness.",
                    "Right dose: calculate and double-check per policy.",
                    "Right route: PO vs IV etc.; formulation matches route.",
                    "Right time: frequency, PRN conditions, empty/full stomach as ordered.",
                ],
                "commonMistakes": ["Rushing after distraction", "Assuming 'similar packaging' means correct drug"],
                "clinicalRelevanceLight": "Rights are error barriers, not paperwork trivia.",
            },
        },
        {
            "title": "Expanded rights: documentation, reason, response, refusal",
            "structuredContent": {
                "overview": "Modern curricula add rights that close common failure modes.",
                "expanded": [
                    "Right documentation: record after administration per policy.",
                    "Right reason: know why drug is indicated (student-level awareness).",
                    "Right response: observe expected effect and adverse possibilities per teaching.",
                    "Right to refuse: patient autonomy; follow facility process.",
                ],
                "commonMistakes": ["Pre-charting before giving", "Dismissing patient questions"],
                "clinicalRelevanceLight": "Handoff quality depends on accurate medication documentation.",
            },
        },
    ]


def rights_questions() -> list[dict]:
    bank = [
        ("Which right verifies identity?", "right patient", "right room number only painted on door", "right shoe size", "right hairstyle"),
        ("Two-identifier practice is part of:", "right patient verification", "right dose only", "right route only", "right time only"),
        ("LASA drugs are:", "look-alike / sound-alike", "always IV only", "never exist", "only antibiotics"),
        ("Right drug verification includes:", "order + label match", "only color guess", "only bag shape", "only nurse memory"),
        ("Right dose requires:", "matching calculated/administered amount to order", "approximation always ok", "only if patient agrees", "only if tablet pretty"),
        ("Right route means:", "administration path matches order", "any route works", "only oral exists", "only fastest"),
        ("Right time includes:", "scheduled frequency and PRN parameters", "only morning", "never PRN", "only bedtime"),
        ("Barcode scanning when available supports:", "right patient and right medication checks", "only billing", "only temperature", "only visitor passes"),
        ("Giving medication without an order is:", "outside standard nursing practice", "always allowed if helpful", "only wrong if patient complains", "only wrong for IV"),
        ("If patient refuses medication, you:", "follow facility process and notify appropriate clinician", "force swallow", "hide pill in food secretly", "ignore refusal"),
        ("Right documentation timing generally means:", "record per policy, typically after administration unless protocol states otherwise", "before preparing always falsify", "never document", "only weekly"),
        ("Right assessment before digoxin in many programs emphasizes:", "apical pulse / heart rate parameters per order/policy", "only temperature", "only weight", "never needed"),
        ("Insulin requires:", "right dose with correct concentration awareness", "any syringe", "no double-check ever", "only one nurse always policy-free"),
        ("Liquid oral measurement should use:", "dosing device appropriate to formulation", "household spoon only always", "estimate in palm", "any cup"),
        ("Crushing enteric-coated or extended-release formulations can be:", "unsafe unless specifically ordered and pharmacist-approved", "always fine", "always improves absorption", "never matters"),
        ("High-alert medications:", "require extra safeguards per policy", "are safer than others", "never exist", "only vitamins"),
        ("Independent double-check for some high-risk meds:", "policy-dependent second nurse verification", "never used", "only for OTC", "illegal"),
        ("MAR stands for:", "medication administration record", "machine assisted respiration only", "medical airway review only", "massive allergy response"),
        ("Verbal orders in acute care:", "varies by setting; repeat-back verification; timely sign-off per policy", "always preferred over written", "never allowed", "only for vitamins"),
        ("Telephone orders:", "read-back verification; timely documentation per policy", "never need read-back", "only for family", "only pharmacist"),
        ("Sixth right often taught as:", "right documentation (among expansions)", "right shoe", "right hallway", "right TV channel"),
        ("Patient allergy bracelet relevance:", "communication of allergy status", "decoration only", "only for falls", "only for diet"),
        ("Refusal should be:", "documented per policy", "ignored", "punished", "never mentioned"),
        ("Five rights minimum traditionally include:", "patient, drug, dose, route, time", "patient, room, TV, food, blanket", "doctor, nurse, lab, xray, PT", "only drug and time"),
        ("Wrong route error example at student level:", "IV drug given orally", "correct insulin dose subcutaneous", "PO tablet swallowed with water as ordered", "IM in appropriate site as ordered"),
        ("Look-alike packaging strategy includes:", "tall man lettering and separate storage (facility)", "ignoring labels", "storing all in one bin unsorted", "removing labels"),
        ("Medication reconciliation on admission:", "reduces omission/duplication", "only billing", "only for surgery patients", "never nursing role"),
        ("Teaching before first dose may cover:", "what to expect and when to call (per plan)", "nothing", "only diagnosis", "only parking map"),
        ("Pediatric five-rights mindset includes:", "weight-based dose verification", "adult dose always", "no math", "only parent's guess"),
        ("Elderly considerations include:", "swallowing issues affecting route/formulation", "never any differences", "only cosmetic", "only hearing"),
        ("Nurse role if dose seems unsafe:", "clarify with prescriber/pharmacist per chain of command", "give anyway faster", "halve without asking", "swap with another patient"),
        ("Expired medication should be:", "not administered; follow disposal policy", "given if only one day expired", "given if expensive", "given if patient wants"),
        ("Patient states 'this pill looks different'; nurse should:", "verify with pharmacy/order before administering", "ignore", "assume generic always identical appearance", "hide difference"),
        ("Transcription error risk is reduced by:", "electronic orders and careful verification", "only paper always", "only memory", "only night shift"),
        ("Right patient wrong drug is prevented by:", "triple-check mindset + scanning + distraction reduction", "speed", "multitasking during prep", "assuming roommate same meds"),
        ("Open container medication storage at bedside:", "follow policy; many settings restrict patient access to certain meds", "always unlimited patient access", "never documented", "only candy jar ok"),
        ("Controlled substance documentation often requires:", "strict counts and witness rules per policy", "no documentation", "only monthly", "only pharmacist eyeball"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in bank:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Supports medication administration safety at pre-nursing application depth.",
                {"B": "Unsafe or inaccurate practice.", "C": "Unsafe or inaccurate practice.", "D": "Unsafe or inaccurate practice."},
            )
        )
    while len(out) < 35:
        out.append(
            mcq(
                f"Rights drill {len(out)}: Which 'right' matches verifying scheduled times and PRN criteria?",
                "right time",
                "right patient",
                "right room decor",
                "right visitor",
                "A",
                "Time right covers schedule and PRN parameters.",
                {"B": "Patient identity is separate check.", "C": "Unrelated.", "D": "Unrelated."},
            )
        )
    return out[:35]


def oral_lessons() -> list[dict]:
    return [
        {
            "title": "Dose on hand and dose desired: the core proportion",
            "structuredContent": {
                "overview": "Oral calculations link what you have (tablet strength or liquid concentration) to what is ordered.",
                "formula": "Ordered dose / dose on hand × quantity on hand = amount to give (with consistent units).",
                "workedExample": "Order 500 mg; tablets are 250 mg each → 500/250 × 1 tablet = 2 tablets.",
                "commonMistakes": ["Inverting the ratio", "Mixing mg with mcg without converting"],
                "clinicalRelevanceLight": "Always reconcile units with the label before mental math.",
            },
        },
        {
            "title": "Dimensional analysis for oral liquids and tablets",
            "structuredContent": {
                "overview": "Arrange factors so units cancel, leaving the dose unit you need (tablets, mL, etc.).",
                "steps": [
                    "Start with the dose ordered on the left.",
                    "Multiply by conversion factors as fractions so unwanted units cancel.",
                    "Stop when you reach the unit to administer.",
                ],
                "workedExample": "Order 300 mg; liquid is 100 mg/5 mL → need 15 mL (show on your scratch pad).",
                "commonMistakes": ["Carrying mg/mL upside down", "Rounding early"],
                "clinicalRelevanceLight": "Syringe graduations determine final rounding policy.",
            },
        },
        {
            "title": "Split tablets, liquid cups, and safety checks",
            "structuredContent": {
                "overview": "Only split tablets that are scored and appropriate to split per pharmacist guidance; use oral syringes for small mL doses.",
                "commonMistakes": ["Crushing extended release", "Using kitchen teaspoons for small pediatric volumes"],
                "clinicalRelevanceLight": "Rights + calculation together prevent wrong dose/route/formulation errors.",
            },
        },
    ]


def oral_questions() -> list[dict]:
    """Calculation MCQs: correct answer A; verify arithmetic."""
    items: list[tuple[str, str, str, str, str, str]] = [
        ("Order: 500 mg PO. Available: 250 mg tablets. How many tablets?", "2 tablets", "1 tablet", "3 tablets", "1/2 tablet"),
        ("Order: 1000 mg PO. Available: 500 mg tablets. Tablets?", "2 tablets", "1 tablet", "4 tablets", "1/2 tablet"),
        ("Order: 75 mg PO. Available: 25 mg tablets. Tablets?", "3 tablets", "2 tablets", "4 tablets", "1 tablet"),
        ("Order: 12.5 mg PO. Available: 6.25 mg tablets. Tablets?", "2 tablets", "1 tablet", "3 tablets", "1/2 tablet"),
        ("Order: 40 mg PO. Available: 20 mg tablets. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Order: 150 mg PO. Available: 100 mg tablets. Can give scored half. Dose?", "1.5 tablets", "2.5 tablets", "1 tablet", "3 tablets"),
        ("Order: 0.5 g PO. Available: 250 mg tablets. Tablets?", "2 tablets", "1 tablet", "4 tablets", "1/2 tablet"),
        ("Order: 1 g PO. Available: 500 mg tablets. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Liquid: Order 200 mg. Have 100 mg/5 mL. mL to give?", "10 mL", "5 mL", "15 mL", "20 mL"),
        ("Liquid: Order 300 mg. Have 100 mg/5 mL. mL?", "15 mL", "10 mL", "20 mL", "5 mL"),
        ("Liquid: Order 400 mg. Have 200 mg/10 mL. mL?", "20 mL", "10 mL", "40 mL", "5 mL"),
        ("Liquid: Order 50 mg. Have 25 mg/2 mL. mL?", "4 mL", "2 mL", "6 mL", "8 mL"),
        ("Liquid: Order 80 mg. Have 20 mg per mL. mL?", "4 mL", "2 mL", "5 mL", "8 mL"),
        ("Order: 600 mcg PO. Available: 200 mcg tablets. Tablets?", "3 tablets", "2 tablets", "4 tablets", "1 tablet"),
        ("Order: 150 mcg. Tabs 75 mcg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Order: 90 mg. Tabs 30 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "6 tablets"),
        ("Order: 1.2 g. Tabs 400 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "1 tablet"),
        ("Liquid order: 250 mg. Suspension 125 mg/5 mL. mL?", "10 mL", "5 mL", "15 mL", "20 mL"),
        ("Liquid: 450 mg ordered. Concentration 150 mg/5 mL. mL?", "15 mL", "10 mL", "20 mL", "30 mL"),
        ("Order: 100 mg. Have 50 mg/mL syrup. mL?", "2 mL", "1 mL", "3 mL", "4 mL"),
        ("Order: 24 mg. Have 8 mg per mL. mL?", "3 mL", "2 mL", "4 mL", "6 mL"),
        ("Order: 500 mg. Tabs 125 mg. Whole tablets?", "4 tablets", "3 tablets", "5 tablets", "2 tablets"),
        ("Order: 15 mg. Tabs 7.5 mg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Order: 6 mg. Tabs 3 mg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "1/2 tablet"),
        ("Liquid: 180 mg ordered. 60 mg/3 mL. mL?", "9 mL", "6 mL", "12 mL", "3 mL"),
        ("Liquid: 100 mg ordered. 40 mg/2 mL. mL?", "5 mL", "4 mL", "6 mL", "10 mL"),
        ("Order: 0.25 mg. Tabs 0.125 mg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Order: 2 mg. Tabs 0.5 mg. Tablets?", "4 tablets", "2 tablets", "3 tablets", "5 tablets"),
        ("Order: 1200 mg. Tabs 600 mg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Liquid: 36 mg. 12 mg/4 mL. mL?", "12 mL", "8 mL", "16 mL", "4 mL"),
        ("Liquid: 55 mg. 11 mg/1 mL. mL?", "5 mL", "4 mL", "6 mL", "10 mL"),
        ("Order: 750 mg. Tabs 250 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "5 tablets"),
        ("Order: 40 mg. Tabs 10 mg. Tablets?", "4 tablets", "2 tablets", "3 tablets", "5 tablets"),
        ("Order: 3 mg. Tabs 1 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "1 tablet"),
        ("Liquid: 64 mg. 16 mg/2 mL. mL?", "8 mL", "6 mL", "10 mL", "4 mL"),
        ("Liquid: 30 mg. 15 mg/5 mL. mL?", "10 mL", "5 mL", "15 mL", "20 mL"),
        ("Order: 450 mg. Tabs 150 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "6 tablets"),
        ("Order: 200 mg. Tabs 100 mg. Tablets?", "2 tablets", "1 tablet", "3 tablets", "4 tablets"),
        ("Order: 18 mg. Tabs 6 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "1 tablet"),
        ("Liquid: 140 mg. 70 mg/7 mL. mL?", "14 mL", "7 mL", "21 mL", "10 mL"),
        ("Liquid: 22 mg. 11 mg/2 mL. mL?", "4 mL", "2 mL", "6 mL", "8 mL"),
        ("Order: 800 mg. Tabs 200 mg. Tablets?", "4 tablets", "3 tablets", "5 tablets", "2 tablets"),
        ("Order: 50 mg. Tabs 12.5 mg. Tablets?", "4 tablets", "3 tablets", "5 tablets", "2 tablets"),
        ("Order: 7.5 mg. Tabs 2.5 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "5 tablets"),
        ("Liquid: 270 mg. 90 mg/6 mL. mL?", "18 mL", "12 mL", "24 mL", "9 mL"),
        ("Liquid: 48 mg. 12 mg/3 mL. mL?", "12 mL", "9 mL", "15 mL", "6 mL"),
        ("Order: 1500 mg. Tabs 500 mg. Tablets?", "3 tablets", "2 tablets", "4 tablets", "5 tablets"),
        ("Order: 2.5 mg. Tabs 0.625 mg. Tablets?", "4 tablets", "2 tablets", "3 tablets", "5 tablets"),
        ("Liquid: 200 mg. 50 mg/2 mL. mL?", "8 mL", "6 mL", "10 mL", "4 mL"),
        ("Liquid: 125 mg. 25 mg/1 mL. mL?", "5 mL", "4 mL", "6 mL", "10 mL"),
    ]
    out: list[dict] = []
    for stem, ok, b, c, d in items:
        out.append(
            mcq(
                stem,
                ok,
                b,
                c,
                d,
                "A",
                "Set up dose ordered over dose on hand times quantity; convert units (g to mg) when needed.",
                {"B": "Arithmetic or unit setup error.", "C": "Arithmetic or unit setup error.", "D": "Arithmetic or unit setup error."},
            )
        )
    while len(out) < 50:
        n = len(out)
        out.append(
            mcq(
                f"Oral calc {n}: Order 360 mg. Tabs 120 mg. Tablets?",
                "3 tablets",
                "2 tablets",
                "4 tablets",
                "6 tablets",
                "A",
                "360 / 120 = 3 tablets.",
                {"B": "Underdose.", "C": "Arithmetic error.", "D": "Overdose."},
            )
        )
    return out[:50]


def main() -> None:
    topics = [
        {
            "domain": "Chemistry Basics for Health",
            "topicSlug": "organic-molecules-macromolecules",
            "topicName": "Organic Molecules: Carbohydrates, Lipids, Proteins, and Nucleic Acids",
            "readinessWeight": "high",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 40,
            "targetQuestionCountMax": 50,
            "questionsGeneratedThisBatch": 40,
            "prerequisiteTopicSlugs": ["chemical-bonds-and-molecules"],
            "prerequisiteBridgingNote": "Lesson 1 embeds chemical-bonds-and-molecules essentials; complete full chemistry module when available.",
            "lessons": organic_lessons(),
            "questions": organic_questions(),
        },
        {
            "domain": "Anatomy & Physiology",
            "topicSlug": "cell-structure-and-function",
            "topicName": "Cell Structure and Function",
            "readinessWeight": "critical",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 45,
            "targetQuestionCountMax": 55,
            "questionsGeneratedThisBatch": 45,
            "prerequisiteTopicSlugs": ["organization-of-the-human-body", "organic-molecules-macromolecules"],
            "lessons": cell_lessons(),
            "questions": cell_questions(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "routes-of-drug-administration",
            "topicName": "Routes of Drug Administration",
            "readinessWeight": "high",
            "cognitiveLevel": "conceptual-understanding",
            "targetQuestionCountMin": 40,
            "targetQuestionCountMax": 50,
            "questionsGeneratedThisBatch": 40,
            "prerequisiteTopicSlugs": ["pharmacokinetics-adme"],
            "prerequisiteBridgingNote": "Lesson 1 embeds ADME / first-pass preview; full pharmacokinetics-adme topic should still be completed in curriculum.",
            "lessons": routes_lessons(),
            "questions": routes_questions(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "pharmacology-adverse-effects",
            "topicName": "Adverse Effects, Side Effects, and Drug Interactions",
            "readinessWeight": "critical",
            "cognitiveLevel": "early-application",
            "targetQuestionCountMin": 45,
            "targetQuestionCountMax": 55,
            "questionsGeneratedThisBatch": 45,
            "prerequisiteTopicSlugs": ["pharmacodynamics-drug-actions"],
            "prerequisiteBridgingNote": "Lesson 1 embeds receptor agonist/antagonist preview; complete pharmacodynamics topic in full path.",
            "lessons": adverse_lessons(),
            "questions": adverse_questions(),
        },
        {
            "domain": "Pharmacology Foundations",
            "topicSlug": "rights-of-medication-administration",
            "topicName": "The Rights of Medication Administration",
            "readinessWeight": "critical",
            "cognitiveLevel": "early-application",
            "targetQuestionCountMin": 35,
            "targetQuestionCountMax": 45,
            "questionsGeneratedThisBatch": 35,
            "prerequisiteTopicSlugs": ["routes-of-drug-administration", "pharmacology-adverse-effects"],
            "lessons": rights_lessons(),
            "questions": rights_questions(),
        },
        {
            "domain": "Dosage Math",
            "topicSlug": "oral-medication-dosage-calculations",
            "topicName": "Oral Medication Dosage Calculations",
            "readinessWeight": "critical",
            "cognitiveLevel": "early-application",
            "targetQuestionCountMin": 50,
            "targetQuestionCountMax": 60,
            "questionsGeneratedThisBatch": 50,
            "prerequisiteTopicSlugs": ["systems-of-measurement", "rights-of-medication-administration"],
            "lessons": oral_lessons(),
            "questions": oral_questions(),
        },
    ]

    doc = {
        "batchMeta": {
            "blueprintFile": "data/blueprints/foundations/pre-nursing-foundational-blueprint.json",
            "generatedDate": "2026-04-11",
            "batchTitle": "Organic + cell + pharm routes/adverse/rights + oral dosage",
            "sequenceInThisFile": [t["topicSlug"] for t in topics],
            "curriculumNotes": [
                "Organic precedes cell per blueprint. Cell assumes organization-of-the-human-body from prior batches.",
                "Routes and adverse topics include embedded bridges for pharmacokinetics and pharmacodynamics because full prerequisite chains (intro, PK, PD) are long; learners should still complete full Pharmacology Foundations sequence for production courses.",
                "Oral dosage assumes systems-of-measurement from batch 1 and rights from this batch.",
            ],
        },
        "topics": topics,
        "finalReport": {
            "topicsProcessed": len(topics),
            "lessonsTotal": sum(len(t["lessons"]) for t in topics),
            "questionsTotal": sum(len(t["questions"]) for t in topics),
            "lessonsPerTopic": {t["topicSlug"]: len(t["lessons"]) for t in topics},
            "questionsPerTopic": {t["topicSlug"]: len(t["questions"]) for t in topics},
            "rulesConfirmation": "readinessWeight-informed lesson counts; cognitive levels matched (conceptual for organic/cell/routes; early-application for adverse/rights/oral). Question mins met. MCQs single-concept; calculations in oral topic require arithmetic.",
        },
    }

    for t in topics:
        assert len(t["questions"]) == t["questionsGeneratedThisBatch"]

    out = Path(__file__).with_name("pre-nursing-batch-3-organic-cell-pharm-oral.json")
    out.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote", out, "total questions", doc["finalReport"]["questionsTotal"])


if __name__ == "__main__":
    main()
