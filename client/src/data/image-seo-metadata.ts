export interface ImageSeoEntry {
  file: string;
  alt: string;
  title: string;
  description: string;
  keywords: string[];
}

export const imageSeoMetadata: Record<string, ImageSeoEntry> = {
  "ms": {
    file: "MS_1773375043083.png",
    alt: "Multiple sclerosis pathophysiology and management illustration",
    title: "Multiple Sclerosis (MS)",
    description: "Autoimmune demyelinating disease of the CNS: relapsing-remitting vs progressive forms, disease-modifying therapies, and symptom management",
    keywords: ["multiple sclerosis", "MS", "demyelination", "relapsing-remitting", "interferon", "glatiramer"]
  },
  "mumps": {
    file: "mumps_1773375043083.png",
    alt: "Mumps viral infection illustration showing parotid gland swelling",
    title: "Mumps",
    description: "Viral parotitis caused by paramyxovirus: parotid gland swelling, fever, orchitis risk, and MMR vaccination prevention",
    keywords: ["mumps", "parotitis", "paramyxovirus", "MMR", "orchitis", "parotid"]
  },
  "myasthenia-gravis": {
    file: "myastheniagravis_1773375043083.png",
    alt: "Myasthenia gravis neuromuscular junction illustration",
    title: "Myasthenia Gravis",
    description: "Autoimmune disorder affecting the neuromuscular junction: ptosis, diplopia, muscle weakness, Tensilon test, and cholinergic crisis management",
    keywords: ["myasthenia gravis", "neuromuscular junction", "ptosis", "diplopia", "Tensilon", "cholinergic crisis"]
  },
  "narcolepsy": {
    file: "narcolepsy_1773375043083.png",
    alt: "Narcolepsy sleep disorder illustration",
    title: "Narcolepsy",
    description: "Neurological sleep disorder with excessive daytime sleepiness, cataplexy, sleep paralysis, and hypnagogic hallucinations",
    keywords: ["narcolepsy", "cataplexy", "sleep disorder", "excessive daytime sleepiness", "modafinil"]
  },
  "nec": {
    file: "nec_1773375043083.png",
    alt: "Necrotizing enterocolitis (NEC) illustration",
    title: "Necrotizing Enterocolitis (NEC)",
    description: "Most common GI emergency in neonates: bowel necrosis, abdominal distension, bloody stools, pneumatosis intestinalis, and surgical management",
    keywords: ["NEC", "necrotizing enterocolitis", "neonate", "pneumatosis intestinalis", "bowel necrosis"]
  },
  "neonatal-jaundice": {
    file: "neonataljaundice_1773375043083.jpeg",
    alt: "Neonatal jaundice and phototherapy illustration",
    title: "Neonatal Jaundice",
    description: "Hyperbilirubinemia in newborns: physiologic vs pathologic jaundice, phototherapy, exchange transfusion, and bilirubin monitoring",
    keywords: ["neonatal jaundice", "hyperbilirubinemia", "phototherapy", "bilirubin", "kernicterus"]
  },
  "neonatal-reflexes": {
    file: "neonatalreflex_1773375043083.png",
    alt: "Neonatal primitive reflexes assessment illustration",
    title: "Neonatal Reflexes",
    description: "Primitive reflex assessment in newborns: Moro, rooting, sucking, Babinski, palmar grasp, and tonic neck reflexes with expected timing",
    keywords: ["neonatal reflexes", "primitive reflexes", "Moro", "rooting", "Babinski", "newborn assessment"]
  },
  "neonatal-sepsis": {
    file: "neonatalsepsis_1773375043083.png",
    alt: "Neonatal sepsis recognition and management illustration",
    title: "Neonatal Sepsis",
    description: "Early and late-onset neonatal sepsis: risk factors, subtle clinical signs, diagnostic workup, and antibiotic management",
    keywords: ["neonatal sepsis", "newborn infection", "group B streptococcus", "GBS", "ampicillin gentamicin"]
  },
  "newborn-diabetic-mother": {
    file: "newbornofdiabetic_1773375043083.png",
    alt: "Infant of diabetic mother complications illustration",
    title: "Newborn of Diabetic Mother",
    description: "Complications in infants born to diabetic mothers: macrosomia, hypoglycemia, polycythemia, respiratory distress, and congenital anomalies",
    keywords: ["infant of diabetic mother", "IDM", "macrosomia", "neonatal hypoglycemia", "gestational diabetes"]
  },
  "ng-tube": {
    file: "ngtube_1773375043083.png",
    alt: "Nasogastric tube insertion and management illustration",
    title: "NG Tube",
    description: "Nasogastric tube insertion technique, placement verification methods, aspiration prevention, and ongoing tube management",
    keywords: ["NG tube", "nasogastric", "tube insertion", "placement verification", "aspiration"]
  },
  "obstructive-uropathy": {
    file: "obstructiveuropathy_1773375043083.png",
    alt: "Obstructive uropathy and hydronephrosis illustration",
    title: "Obstructive Uropathy",
    description: "Urinary tract obstruction: hydronephrosis, causes including calculi and BPH, diagnostic workup, and management strategies",
    keywords: ["obstructive uropathy", "hydronephrosis", "urinary obstruction", "kidney stones", "BPH"]
  },
  "opioid-overdose": {
    file: "opioid_1773375043083.png",
    alt: "Opioid overdose and naloxone administration illustration",
    title: "Opioid Overdose",
    description: "Opioid toxicity management: respiratory depression, pinpoint pupils, naloxone (Narcan) reversal, and re-sedation monitoring",
    keywords: ["opioid overdose", "naloxone", "Narcan", "respiratory depression", "opioid antagonist"]
  },
  "osteogenesis-imperfecta": {
    file: "osteogenesis_1773375043083.png",
    alt: "Osteogenesis imperfecta brittle bone disease illustration",
    title: "Osteogenesis Imperfecta",
    description: "Brittle bone disease: genetic collagen disorder, frequent fractures, blue sclera, hearing loss, and supportive management",
    keywords: ["osteogenesis imperfecta", "brittle bone disease", "collagen disorder", "blue sclera", "fractures"]
  },
  "osteoporosis": {
    file: "osteoporosis_1773375043083.png",
    alt: "Osteoporosis bone density loss illustration",
    title: "Osteoporosis",
    description: "Progressive bone density loss: DEXA screening, bisphosphonate therapy, calcium and vitamin D supplementation, and fall prevention",
    keywords: ["osteoporosis", "bone density", "DEXA", "bisphosphonates", "calcium", "fracture prevention"]
  },
  "otitis-media": {
    file: "otitismedia_1773375043083.png",
    alt: "Otitis media middle ear infection illustration",
    title: "Otitis Media",
    description: "Acute otitis media: middle ear infection with bulging tympanic membrane, ear pain, fever, and antibiotic management",
    keywords: ["otitis media", "ear infection", "tympanic membrane", "tympanostomy tubes", "amoxicillin"]
  },
  "pancreatic-pseudocyst": {
    file: "pancreaticpseudocyst_1773375043083.png",
    alt: "Pancreatic pseudocyst illustration",
    title: "Pancreatic Pseudocyst",
    description: "Encapsulated fluid collection after acute pancreatitis: monitoring, potential complications, and drainage indications",
    keywords: ["pancreatic pseudocyst", "pancreatitis complication", "drainage", "cyst"]
  },
  "pancreatitis": {
    file: "pancreatitis_1773375043083.png",
    alt: "Acute and chronic pancreatitis illustration",
    title: "Pancreatitis",
    description: "Pancreatic inflammation: Cullen's sign, Grey Turner's sign, elevated lipase, NPO status, pain management, and prevention",
    keywords: ["pancreatitis", "Cullen sign", "Grey Turner sign", "lipase", "gallstones", "alcohol"]
  },
  "papilledema": {
    file: "papilledema_1773375043083.png",
    alt: "Papilledema optic disc swelling illustration",
    title: "Papilledema",
    description: "Optic disc swelling from increased intracranial pressure: fundoscopic findings, causes, and urgent management",
    keywords: ["papilledema", "optic disc edema", "increased ICP", "intracranial pressure", "fundoscopy"]
  }
};
