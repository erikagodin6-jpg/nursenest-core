import { SECTION_HEADINGS, SHARED_CORE } from "./wave1-copd-locales.mjs";

function q(question, options, rationale) {
  return { question, options, rationale };
}

const H = SECTION_HEADINGS.tl;
const CORE = SHARED_CORE.tl;

export const COPD_TL = {
  "us-lpn-nclex-pn:copd-clinical-judgment-gold": {
    title: "COPD: klinikal na hatulan (NCLEX-PN, US)",
    seoTitle: "COPD — klinikal na hatulan | NCLEX-PN US | NurseNest",
    seoDescription:
      "Saklaw ng US LPN/LVN: pagsusuri, ligtas na delegasyon, oxygen at bronchodilator ayon sa order, escalation — hindi RN-level na hatol mag-isa.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-PN (LPN/LVN)**  
Ginagantimpalaan ang **ligtas at angkop sa papel na pangangalaga**: obserbahan at iulat ang pagbabago, isagawa ang **mga order**, palakasin ang turuan, protektahan ang **oxygen delivery ayon sa reseta**, at **mag-escalate** kapag lumampas ang mga nakita sa stable na COPD.

**Hangganan ng saklaw**  
Ang praktis ng PN/LVN **nag-iiba ayon sa estado at patakaran ng pasilidad**. Sa exam, piliin ang mga aksyon na **nananatili sa set ng order / direksyon ng RN** kapag nagte-test ng delegasyon — iwasan ang **titrate nang mag-isa**, bagong reseta, o **diagnosis** lampas sa nursing data collection.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Asahan ang **prioritization** (sino ang unahin), **kaligtasan ng oxygen na nakatali sa order**, **senyales ng impeksiyon/exacerbation**, at **patient teaching** na kayang palakasin. **Bitag**: gawing **RN-level triage** bilang aksyon ng LPN, **antalahin ang urgent report**, o **routine tasks** bago **acute respiratory change**.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Med-surg floor (US)**  
May COPD ang pasyente: **2 L/min nasal cannula** ayon sa order. Napapansin mo **RR 32**, **tripod**, **SpO₂ 84%** sa parehong flow. Anxious pero alert.

**Angkop na PN**  
Unang galaw: **reassess delivery at escalation sa loob ng order**: suriin ang kumpanya, turuan ang **pursed-lip breathing**, manatili sa pasyente, at **agad ipaalam sa RN o provider** para sa bagong pagsusuri/order. **Mali**: tahimik na **taasan ang oxygen** o magbigay ng **sedative** para “kalmahin” ang hindi pa natutukoy na respiratory distress.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• **Iulat** ang biglaang pagbabago sa paghinga; huwag maghintay sa kritikal na desaturation.  
• Ang pagbabago sa **oxygen** sa COPD ay **karaniwang may order/protocol** — trabaho mo ang ligtas na pagbibigay at mabilis na escalation.  
• **Palakasin** ang itinurong inhaler, pursed-lip, energy conservation, smoking cessation.  
• Pair sa **question bank** na may respiratory/COPD filter.`,
      },
    },
    preTest: [
      q(
        "Ang PN ay nag-aalaga sa COPD na may 2 L/min ayon sa order. Bumagsak ang SpO₂ 92%→84% at tumataas ang RR. Ano ang unahin?",
        [
          "Itaas ang oxygen sa 6 L/min nang walang nagpapalam.",
          "Suriin ang pasyente at oxygen delivery, pagkatapos ay ipaalam sa RN/provider ang acute change.",
          "Ipahiga nang flat para “magpahinga ang diaphragm”.",
          "Magbigay ng PRN sedative para sa anxiety.",
        ],
        "Suriin at i-escalate para sa bagong pagsusuri/order. Mag-titrate o mag-sedate nang mag-isa ay maaaring delikado at hindi saklaw; ang flat position ay puwedeng lumala ang dyspnea.",
      ),
      q(
        "Alin ang pinakamahusay na naglalarawan ng pursed-lip breathing sa COPD?",
        [
          "Pinapataas nito ang RR para maalis ang CO₂.",
          "Gumagawa ng bahagyang back-pressure para humaba ang pag-hinga palabas at mabawasan ang air trapping.",
          "Pinapalitan nito ang bronchodilator kapag stable.",
          "Para lang sa tulog, hindi sa activity.",
        ],
        "Pinapahaba ang expiration; hindi pumapalit sa gamot o oxygen na prescribed.",
      ),
      q(
        "Sa exacerbation anong finding ang **dapat agad iulat**?",
        [
          "Humihingi ng dagdag unan.",
          "Bagong confusion o tumataas na antok kasabay ng lumalalang trabaho ng paghinga.",
          "Stable SpO₂ sa dating baseline sa home oxygen.",
          "Tuyong bibig dahil sa cannula.",
        ],
        "Pagbabago sa isip na may respiratory decline: posibleng hypercapnic failure — iulat agad.",
      ),
    ],
    postTest: [
      q(
        "Aling aksyon ng PN ang pinaka-suportado sa **infection prevention teaching** sa COPD?",
        [
          "Hikayatin ang taunang flu vaccine kung nasa plan of care at turuan ang hand hygiene.",
          "Sabihing itigil na ang lahat ng exercise.",
          "Ihinto ang inhaler kapag may sipon.",
          "Payuhang doblehin ang home oxygen kapag pagod.",
        ],
        "Bakuna at hygiene ay nagbabawas ng trigger; ang activity ay naka-pace; oxygen at gamot ay sumusunod sa order.",
      ),
      q(
        "Sabi ng pasyente: “Konti lang sigarilyo, wala na ring saysay.” Ano ang pinakamahusay na sagot?",
        [
          "Tama — bawasan lang.",
          "Kahit maliit na usok ay nagpapanatili ng pamamaga; ang pagtigil ay nakakatulong pa rin sa exacerbations — tingnan natin ang suporta sa plan.",
          "Vape na lang.",
          "Mas ligtas ang cigar.",
        ],
        "Ang usok ay pumapaslang sa progresyon; motivational na turuan sa saklaw ng nurse.",
      ),
      q(
        "Aling gawain ang **pinaka-angkop** para sa PN kapag nag-delegate ang RN ng stable na teaching reinforcement?",
        [
          "Mag-order mag-isa ng STAT CT para sa PE.",
          "Obserbahan ang inhaler technique at iulat ang mali para sa RN/provider.",
          "Mag-reseta ng antibiotic dahil purulent ang plema.",
          "Mag-discharge nang walang RN.",
        ],
        "Reinforce skills at report; hindi mag-reseta o mag-discharge nang mag-isa sa NCLEX-PN.",
      ),
    ],
  },
  "ca-rpn-rex-pn:copd-clinical-judgment-gold": {
    title: "COPD: klinikal na hatulan (REx-PN, Canada)",
    seoTitle: "COPD — klinikal na hatulan | REx-PN Canada | NurseNest",
    seoDescription:
      "Canadian practical nursing: metric na konteksto, saklaw ng college, ligtas na delegasyon, escalation alinsunod sa REx-PN.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**REx-PN / practical nursing sa Canada**  
Inaasahan ang **saklaw na tinukoy ng college**, **metric vitals at SI labs** kung may ipinakita, at malinaw na escalation kapag **lampas** sa kaya ng practical nurse na simulan nang mag-isa.

**Kahulugan**  
Ikonekta ang **work of breathing**, **oxygen therapy ayon sa order**, **senyales ng impeksiyon/exacerbation**, at **patient education** — habang **wala sa saklaw** ang **independent prescribing** o **unsupervised titration** maliban kung may standing order/protocol na eksplisitong pinapayagan.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Hanapin ang **prioritization**, **therapeutic communication**, **ligtas na pag-administer**, at **kailan magpaalam sa RN/NP/physician**. Karaniwang bitag: **RPN** na pinapagana ng **RN primary assessment** o **tahimik na titrate ng oxygen** nang walang order.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Acute unit (Canada)**  
May COPD ang pasyente na may **low-flow oxygen** na inorder. Sa loob ng isang oras, **tumataas ang RR**, **bumabagsak ang SpO₂** sa parehong delivery, **tripod**.

**RPN fork**  
Suriin ang equipment at pasyente, **comfort positioning**, **pursed-lip**, at **ipaalam sa RN** para sa reassessment/order. **Iwasan** ang **mag-titrate ng oxygen** maliban kung may malinaw na protocol.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• **Metric** at **Canadian setting** ay maaaring lumabas — parehong pattern: assess → escalate kung unstable.  
• **College standards** ang humahawak sa maaaring simulan; kung may alinlangan, **collaboration** kaysa **solo prescription-level changes**.  
• Palakasin ang **smoking cessation**, **immunization**, at **exacerbation action plans**.  
• Mag-drill ng **REx-PN** respiratory items pagkatapos.`,
      },
    },
    preTest: [
      q(
        "May RPN na nakakita ng SpO₂ 86% sa ordered oxygen sa COPD, mas mabigat ang trabaho ng paghinga. Ano ang unang aksyon?",
        [
          "Taasan ang oxygen nang mag-isa para max ang saturation.",
          "Suriin ulit ang delivery at pasyente, ipaalam sa RN, sundin ang order/protocol.",
          "Paglakarin sa hallway para sa secreto.",
          "Mag dokumento lang at bumalik sa 2 oras.",
        ],
        "Reassess at escalate; ang walang supervision na titration ay maaaring hindi angkop; ang paglalakad ay puwedeng lumala ang distress.",
      ),
      q(
        "Alin ang **pinakamadali** para sa agad na ulat sa exacerbation?",
        [
          "Mild dry cough, walang pagbabago sa vitals.",
          "Tumataas na confusion na may CO₂ pattern at lumalalang antok.",
          "Humihingi ng pangalawang kumot.",
          "Stable appetite sa dating oxygen.",
        ],
        "Altered LOC na may ventilatory failure pattern — emergency escalation.",
      ),
      q(
        "Ang energy conservation teaching ay dapat **idiin**:",
        [
          "I-cluster ang mga gawain sa may pagpapahinga.",
          "Tapusin ang lahat ng mabilis nang walang pahinga.",
          "Iwasan ang lahat ng activity magpakailanman.",
          "Itigil ang bronchodilator para bumaba ang gamot.",
        ],
        "Ang pacing ay nakakabawas ng dyspnea; biglaang pag-alis ng prescribed meds ay delikado.",
      ),
    ],
    postTest: [
      q(
        "Aling pahayag ang **tamang wika ng saklaw** para sa oxygen changes sa Canada RPN?",
        [
          "Titrate ako sa sarili kong target nang walang dokumento.",
          "Sumusunod ako sa authorized orders/protocols at nakikipagtulungan kapag unstable ang pasyente.",
          "Nagre-reseta ako ng antibiotic kapag nagiba ang kulay ng plema.",
          "Nagdi-discharge ako kapag mas ginhawa na sila.",
        ],
        "Collaboration at protocol ang nag-iingat ng saklaw; ang mag-reseta at mag-discharge nang mag-isa ay hindi sa framing na ito.",
      ),
      q(
        "Bakit kapaki-pakinabang ang pursed-lip breathing sa COPD?",
        [
          "Pinapabilis ang pagbuga para tumaas ang CO₂.",
          "Maaaring humaba ang expiration at mabawasan ang dynamic airway collapse.",
          "Pumapalit sa oxygen therapy.",
          "Para lang sa asthma.",
        ],
        "Mekanika ng air trapping; **kumpleto** sa ordered therapy, hindi pumapalit.",
      ),
      q(
        "May lagnat, purulent plema, at lumalalang dyspnea ang COPD. Ano ang inaasahan sa collaborative care?",
        [
          "Balewalain ang vitals dahil lagi na silang may lagnat.",
          "Suriin nang matalas ang vitals at respiratory status at agad mag-ulat.",
          "Itigil ang fluids para mabawasan ang plema.",
          "Patayin ang oxygen para mas malalim ang hinga.",
        ],
        "Exacerbation ay maaaring mangailangan ng bagong pagsusuri; monitoring at reporting ay core.",
      ),
    ],
  },
  "us-rn-nclex-rn:copd-clinical-judgment-gold": {
    title: "COPD: klinikal na hatulan (NCLEX-RN, US)",
    seoTitle: "COPD — klinikal na hatulan | NCLEX-RN US | NurseNest",
    seoDescription:
      "US RN: oxygen targets, pag-manage ng exacerbation, seguridad sa CO₂ retention, prioritization, patient teaching.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-RN**  
Sinusukat ang **clinical judgment**: sino ang unahin, aling assessment ang nagpapalinaw ng panganib, at aling intervention ang tumutugma sa **pathophysiology** at **orders**.

Sa COPD: **oxygenation targets** (kadalasang **titrate sa prescribed SpO₂ range**, madalas **~88–92%** kung iyon ang plano — hindi numero sa vacuum), **timing ng bronchodilator/steroid/antibiotic**, **early mobility kung stable**, at **ventilatory failure** (pagka-antok, tumataas na CO₂) na nangangailangan ng mabilis na escalation.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Mataas na yield: **prioritization**, **ligtas na oxygen**, **infection vs heart failure**, **teaching**, at **iwasan ang sedation** na nagtatago ng respiratory failure.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**ED holding**  
68-year-old na may COPD: **mas umuubo**, **purulent sputum**, **38.3 °C**, **RR 30**, **SpO₂ 86% room air**. Alert pero pagod.

**RN fork**  
Sundin ang orders: **oxygen sa target**, **IV kung inorden**, **labs/ABG kung inorden**, **bronchodilators**, **positioning**, **close monitoring** para sa **CO₂ narcosis** kung tumataas ang pangangailangan sa O₂. Ang bitag ay **routine paperwork** bago maayos ang **oxygenation**.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Isama ang **SpO₂** sa **work of breathing** at **mental status**.  
• **Exacerbation bundle**: O₂, gamot, monitoring, infection control, mobilization kung ligtas.  
• **Turuan** ang warning signs at tamang device.  
• Mag-**timed respiratory block** sa question bank pagkatapos.`,
      },
    },
    preTest: [
      q(
        "Pinakamataas na priyoridad sa acute COPD exacerbation na SpO₂ 86% sa room air at moderate distress?",
        [
          "Tapusin ang discharge teaching tungkol sa low-sodium diet.",
          "Maglagay ng oxygen ayon sa order/protocol at suriin ang tugon, handa kung kailangan mag-escalate.",
          "Unahin ang wound care sa ibang unit.",
          "Hikayatin ang masiglang exercise para sa secretions.",
        ],
        "Unahin ang buhay-at-baga panganib; sumunod sa oxygen per order.",
      ),
      q(
        "Aling finding ang pinakamahusay na nagpapahiwatig ng acute ventilatory failure sa COPD na may oxygen?",
        [
          "Humihingi ng paboritong pagkain.",
          "Tumataas na antok, sakit ng ulo, at CO₂ pattern sa ABG.",
          "Stable SpO₂ sa target na madaling magsalita.",
          "Mild anxiety na walang pagbabago sa vitals.",
        ],
        "Tumataas na CO₂ na may pagbabago sa isip — urgent intervention.",
      ),
      q(
        "Ang home teaching ay dapat may:",
        [
          "Itigil ang inhaler kapag wala nang sintomas.",
          "Nakasulat na plano: kailan tumawag sa kliniko vs 911.",
          "Iwasan lahat ng bakuna.",
          "Sedative gabi-gabi nang walang respiratory check.",
        ],
        "Action plans at tamang bakuna; iwas sedasyon nang walang assessment.",
      ),
    ],
    postTest: [
      q(
        "Bakit maaaring mapanganib ang mataas na oxygen sa ilang COPD nang walang maingat na monitoring?",
        [
          "Laging gumagaling ang hypercapnia.",
          "Maaaring lumala ang CO₂ retention at mental status—bantayan ang ABG ayon sa order.",
          "Bawal ang oxygen sa lahat ng COPD.",
          "Hindi naaapektuhan ang ventilation.",
        ],
        "Nag-iiba ang tugon; bantayan ang CO₂ narcosis.",
      ),
      q(
        "Aling pahayag ang nagpapakita ng pursed-lip breathing?",
        [
          "Mabilis huminga palabas para mawala ang CO₂.",
          "Humihinga sa ilong, humihinga palabas nang dahan-dahan gamit ang pursed lips.",
          "Tumitigil sa paghinga bawat minuto.",
          "Gamit ito imbes sa bronchodilator.",
        ],
        "Kontroladong pag-expire; ang bronchodilator ay prescribed therapy.",
      ),
      q(
        "Sa shift report, sino ang unang suriin ng RN?",
        [
          "Nanunuod ng TV, stable sa 2 L/min.",
          "Bagong confusion, RR 32, at bumabagsak ang SpO₂ kahit may oxygen.",
          "Humihingi ng unan, stable SpO₂.",
          "Humihingi ng yelo, normal mentation.",
        ],
        "Agad na pagbabago sa oxygenation at isip — unahin.",
      ),
    ],
  },
  "ca-rn-nclex-rn:copd-clinical-judgment-gold": {
    title: "COPD: klinikal na hatulan (NCLEX-RN, Canada)",
    seoTitle: "COPD — klinikal na hatulan | NCLEX-RN Canada | NurseNest",
    seoDescription:
      "Canadian RN: COPD exacerbation, SI/metric, provincial scope language, oxygen targets, NCLEX-style prioritization.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**NCLEX-RN (Canada)**  
Sinusukat ang **clinical judgment**: sino ang unahin, aling datos ang nagpapakita ng panganib, at aling aksyon ang tumutugma sa **orders** at **provincial/employer standards**.

Sa COPD: **oxygen strategy ayon sa order**, **pagkilala sa exacerbation**, **ventilatory failure** (pagka-antok, CO₂/acidosis kung may ABG), at **teaching** na angkop sa pasyente.`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Parehong **prioritization spine** tulad ng US RN, na may **SI units**, **Canadian terminology**, at **role language**. Bitag: **routine tasks** o **discharge teaching** bago **respiratory stability**.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Medical ward (Canada)**  
Kilalang COPD: **lumalalang dyspnea**, **purulent sputum**, **38.1 °C**, **RR 28**, **SpO₂ 88%** sa **2 L/min** ayon sa order.

**RN fork**  
Suriin ang **oxygen delivery at response**, ipaalam sa **NP/physician** para sa posibleng **escalation** ng therapy, **ituro ang ordered bronchodilators/steroids/antibiotics**, bantayan ang **CO₂ retention** kung tumataas ang O₂. **Iwas** ang **discharge** bago **stability**.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• Basahin ang **Canadian units**; mag-reason mula sa stem.  
• **Stability first**: airway, breathing, circulation, then comfort.  
• **Infection** + **oxygenation** + close monitoring.  
• Mag-practice ng **Canada RN** respiratory drills sa bank.`,
      },
    },
    preTest: [
      q(
        "Canadian RN may COPD exacerbation, SpO₂ 88% sa kasalukuyang oxygen. Priyoridad?",
        [
          "Tapusin ang charting ng med error ng nakaraang shift.",
          "Suriin ang respiratory status at oxygen therapy, pagkatapos mag-collaborate para sa adjustment ayon sa protocol/order.",
          "Simulan ang discharge planning para bukas.",
          "HIIT sa hallway.",
        ],
        "Stabilize muna; charting at discharge pagkatapos ng immediate risk.",
      ),
      q(
        "Alin ang dapat mag-trigger ng urgent reassessment?",
        [
          "Stable mentation na gumaganda ang SpO₂ pagkatapos ng therapy.",
          "Bagong confusion at tumataas na antok kasabay ng mas mabigat na trabaho ng paghinga.",
          "Nagbabasa ng libro sa 2 L/min.",
          "Mild dry cough, walang pagbabago sa vitals.",
        ],
        "Altered mental status + respiratory decline: posibleng hypercapnic failure.",
      ),
      q(
        "Ang COPD self-management teaching sa Canada ay dapat bigyang-diin:",
        [
          "Itigil ang steroids kapag mas ginhawa na.",
          "Kilalanin ang mga trigger ng exacerbation at kailan humingi ng emergency care.",
          "Iwasan ang lahat ng activity magpakailanman.",
          "Hiram na inhaler kapag naubusan.",
        ],
        "Action plans at adherence; maintenance meds ay nagpapababa ng flares; ang activity ay naka-pace.",
      ),
    ],
    postTest: [
      q(
        "Tungkol sa oxygen sa COPD, alin ang pinaka-angkop sa exam reasoning?",
        [
          "Laging target 100% SpO₂ sa lahat.",
          "Titrate sa prescribed targets; bantayan ang CO₂ retention sa susceptible.",
          "Kontraindikado ang oxygen sa lahat ng COPD.",
          "Hindi kailanman ng humidification o skin care ang cannula.",
        ],
        "Individualized targets at monitoring; ang absolutes ay madalas mali.",
      ),
      q(
        "Sabi ng pasyente: “Itinigil ko ang inhaler kasi okay na ako.” Ano ang sagot?",
        [
          "Mabuti — gamot lang kapag may sakit.",
          "Ang maintenance therapy ay nagkokontrol ng pamamaga at bronchospasm kahit okay ang pakiramdam; pagtigil ay puwedeng mag-trigger ng flares — balikan natin ang regimen kasama ang team.",
          "Herbal steam na lang.",
          "Doblehin ang dose sa susunod na linggo nang walang doktor.",
        ],
        "Adherence teaching nang hindi nagbabago mag-isa ng prescription.",
      ),
      q(
        "Aling gawain ang maaaring **i-delegate** sa competent assistive personnel sa stable COPD?",
        [
          "Mag-interpret ng ABG at baguhin ang oxygen order nang mag-isa.",
          "Magtanghal at mag-record ng vital signs at mag-ulat ng abnormal.",
          "Magturo ng inhaler technique from scratch nang walang verification.",
          "Magpasya ng medical diagnosis para sa billing.",
        ],
        "Data collection + reporting oo; clinical interpretation at order changes hindi.",
      ),
    ],
  },
  "us-np-fnp:copd-clinical-judgment-gold": {
    title: "COPD: hatol sa primary care (FNP, US)",
    seoTitle: "COPD sa primary care | FNP US | NurseNest",
    seoDescription:
      "Adult primary-care FNP: GOLD-style concepts, exacerbation triage, differential vs CHF/PE, shared decision-making, safe escalation.",
    sections: {
      clinical_meaning: {
        heading: H.clinical_meaning,
        body: `**FNP / adult primary care**  
Isinasama mo ang **history**, **spirometry context kung mayroon**, **comorbidity burden**, **infection risk**, at **functional status** sa plano na tumutugma sa **evidence-based COPD management** at **collaborative agreement**.

Sa item-style reasoning: **risk stratification** (exacerbation history, hospitalizations), **step-up/step-down** ng gamot, **non-pharmacologic** (cessation, vaccines, pulmonary rehab referral), at **kailan mas ligtas ang ED** kaysa “phone tweaks.”`,
      },
      exam_relevance: {
        heading: H.exam_relevance,
        body: `Hanapin ang **differentiation** (COPD exacerbation vs **acute HF** vs **PE red flags**), **appropriate diagnostics**, **antibiotic/steroid decisions** alinsunod sa guidelines, **oxygen safety**, at **patient-centered counseling** nang hindi lumalampas sa ligtas na papel.`,
      },
      core_concept: { heading: H.core_concept, body: CORE },
      clinical_scenario: {
        heading: H.clinical_scenario,
        body: `**Outpatient follow-up pagkatapos ng ED**  
62-year-old na may COPD bumalik matapos **steroid taper at antibiotics** para sa exacerbation. May **dyspnea** pa ring **isang bloke**, **araw-araw na plema**, **dalawang ED visit** ngayong taon.

**FNP fork**  
I-optimize ang **controller therapy**, **inhaler technique**, **smoking cessation**, **vaccinations**, **pulmonary rehab**, at nakasulat na **exacerbation plan**. **Red-flag**: syncope, **severe resting hypoxemia**, **rapid mental status change**, **hemoptysis** — urgent evaluation. **Bitag**: **binabawas ang madalas na exacerbations** bilang “normal” nang hindi nag-i-intensify ng prevention.`,
      },
      takeaways: {
        heading: H.takeaways,
        body: `• **Exacerbations** = outcomes na dapat pigilan: vaccines, cessation, rehab, optimized inhaler regimen, malinaw na rescue instructions.  
• **Differential** na buhay kapag biglang lumala ang dyspnea (PE, ACS, HF, pneumothorax).  
• **Dokumentuhin** ang shared decisions at follow-up intervals.  
• Gumamit ng **NP-level** practice questions na **management synthesis** ang sinusukat.`,
      },
    },
    preTest: [
      q(
        "Aling history feature ang pinaka-supportive sa pag-intensify ng COPD maintenance therapy sa primary care?",
        [
          "Isang exacerbation sampung taon na ang nakalipas.",
          "Paulit-ulit na exacerbation o hospitalization sa nakaraang taon kahit may baseline therapy.",
          "Remote appendectomy.",
          "Mild occasional headache na walang respiratory symptoms.",
        ],
        "Madalas na exacerbations ang nagtuturo sa guideline-informed escalation.",
      ),
      q(
        "May acute pleuritic chest pain, unilateral leg swelling, at tachypnea ang COPD patient. Unang priyoridad?",
        [
          "Taasan lang ang home ICS dose.",
          "Kilalanin ang posibleng PE/ACS at **ituro sa emergency evaluation**.",
          "Doblehin ang home oxygen nang walang assessment.",
          "Mag-antala ng 2 linggo.",
        ],
        "Red-flag cardiopulmonary symptoms — hindi routine COPD tweak.",
      ),
      q(
        "Aling intervention ang may pinakamalakas na long-term benefit sa smokers na may COPD?",
        [
          "Occasional albuterol na walang smoking cessation.",
          "Tuluy-tuloy na **tobacco cessation** na may counseling at pharmacotherapy kung angkop.",
          "Araw-araw na sedative para sa anxiety.",
          "Iwasan ang lahat ng exercise.",
        ],
        "Smoking cessation ang pundasyon; sedatives at inactivity ay harmful.",
      ),
    ],
    postTest: [
      q(
        "Aling elemento ang dapat nasa COPD exacerbation action plan para sa naaangkop na primary-care patients?",
        [
          "Lihim na doblehin ang antibiyotikong hiniram sa kaibigan.",
          "Malinaw na **threshold** para sa rescue oral steroids/antibiotics kapag prescribed, at kailan tumawag sa 911.",
          "Itigil ang lahat ng inhaler kapag may sipon.",
          "Iwasan ang flu vaccine dahil sa mito.",
        ],
        "Nakasulat na plano ay nakakabawas ng pinsala; ad hoc borrowing at vaccine refusal ay nagpapataas ng risk.",
      ),
      q(
        "Bakit i-refer ang eligible COPD patients sa pulmonary rehabilitation?",
        [
          "Pinapalitan nito ang lahat ng gamot.",
          "Nakakapagbuti ng dyspnea, exercise capacity, at kalidad ng buhay sa maraming pasyente.",
          "Para lang sa post–lung transplant.",
          "Ginagamot ang emphysema.",
        ],
        "Evidence-based adjunct; hindi pumapalit sa pharmacotherapy.",
      ),
      q(
        "Aling outpatient finding ang pinakamahusay na nagpapahiwatig ng same-day escalation o ED referral?",
        [
          "Stable walk mula parking nang walang distress.",
          "Resting SpO₂ sa 70s% kahit may prescribed oxygen at acute symptoms.",
          "Mild pagod pagkatapos ng buong araw ng trabaho na stable vitals.",
          "Humihingi ng work note nang walang respiratory change.",
        ],
        "Severe hypoxemia at rest na may acute illness — emergency pattern.",
      ),
    ],
  },
};
