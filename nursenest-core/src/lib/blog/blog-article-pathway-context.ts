/**
 * Editorial context strings so models tailor content to licensure track and jurisdiction.
 * Keys align with {@link ADMIN_BLOG_TARGET_EXAM_OPTIONS} values where possible.
 */
export function pathwayEditorialContext(exam: string): string {
  const e = exam.trim();
  const map: Record<string, string> = {
    "NCLEX-RN":
      "US RN (NCLEX-RN): prioritize safety, ABCs, therapeutic communication, pharm/toxicity, delegation rules, and clinical judgment. Frame as NCLEX-style prioritization and elimination — not ward management memoirs.",
    "NCLEX-PN":
      "US LPN/LVN (NCLEX-PN): scope-appropriate nursing care, supervision/delegation boundaries, stable vs unstable patients, fundamentals, and safe med administration at practical-nurse level.",
    "REx-PN":
      "Canada Practical Nurse (REx-PN): Canadian exam framing, SI units and Canadian practice norms where relevant; avoid US-only regulators (e.g. state boards) unless explicitly comparing.",
    "NP-US":
      "US nurse practitioner board preparation: advanced assessment, differential reasoning, guideline-informed decisions, and primary-care or specialty-appropriate depth — still exam-prep, not independent practice advice.",
    CNPLE:
      "Canadian NP / CNPLE-oriented: Canadian scope, standards, and exam-style clinical reasoning; distinguish from US NP boards when content could diverge.",
    Allied:
      "Allied health / multi-track: keep clinical examples accurate to the stated topic; if exam track is broad, still anchor teaching to assessment-style questions and safety.",
  };
  return (
    map[e] ??
    `Exam or product track: "${e}". Explicitly tie teaching points to how this topic is tested — prioritization, red flags, interventions a candidate must recognize — not generic wellness blogging.`
  );
}

export function countryEditorialContext(country: "US" | "CA" | "unspecified"): string {
  if (country === "US") {
    return "Country: United States. Prefer US screening guidelines, units, and common US exam emphases when jurisdiction matters; do not substitute Canadian-only norms silently.";
  }
  if (country === "CA") {
    return "Country: Canada. Prefer Canadian regulatory and practice framing when jurisdiction matters (e.g. REx-PN, provincial context); avoid assuming US-only defaults.";
  }
  return "Country: not fixed — write for US and Canadian nursing candidates; call out jurisdiction when US vs CA practice differs materially.";
}
