/**
 * Publish-ready titles for new-grad manifest (no slot/allied/trans tokens).
 * Uses seed metadata: primaryKeyword, title (for allied/transition parsing), unit, audience, id.
 */

/** Must match generate-newgrad-seed-module angle list (longest match first) */
const N_ANGLE = [
  "floating to an unknown unit",
  "unsafe staffing ratios",
  "end-of-shift anxiety",
  "imposter syndrome spikes",
  "first missed assessment",
  "first rapid response",
  "first code blue",
  "calling the provider",
  "handling family anger",
  "preceptor conflict",
  "first death",
  "charting behind",
  "giving report",
  "med pass timing",
  "night shift reality",
];

const ANGLE_DISPLAY = {
  "first code blue": "Code Blue",
  "first rapid response": "Rapid Response",
  "first death": "Patient Death",
  "first missed assessment": "Missed Assessment",
  "unsafe staffing ratios": "Unsafe Staffing",
  "preceptor conflict": "Preceptor Conflict",
  "charting behind": "Charting Backlog",
  "giving report": "Shift Report",
  "handling family anger": "Angry Families",
  "med pass timing": "Med Pass Delays",
  "calling the provider": "Calling the Provider",
  "end-of-shift anxiety": "End-of-Shift Anxiety",
  "night shift reality": "Night Shift",
  "floating to an unknown unit": "Floating to a New Unit",
  "imposter syndrome spikes": "Imposter Syndrome",
};

function titleCaseUnit(unit) {
  if (!unit) return "the Unit";
  const u = unit.trim();
  if (/^icu$/i.test(u)) return "ICU";
  if (/^the ed$/i.test(u)) return "the ED";
  if (/^ed$/i.test(u)) return "the ED";
  if (/^med-surg$/i.test(u)) return "Med-Surg";
  if (/^labor and delivery$/i.test(u)) return "Labor & Delivery";
  if (/^same-day surgery$/i.test(u)) return "Same-Day Surgery";
  if (/^step-down$/i.test(u)) return "Step-Down";
  if (/^home health$/i.test(u)) return "Home Health";
  if (/^pacu$/i.test(u)) return "PACU";
  if (/^ltc$/i.test(u)) return "LTC";
  return u
    .split(/[\s-]+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(u.includes("-") ? "-" : " ");
}

function extractNursingAngle(pk) {
  const s = String(pk || "")
    .replace(/^new grad nurse\s+/i, "")
    .trim()
    .replace(/\s+/g, " ");
  const norm = (x) => x.replace(/\s+/g, " ").trim();
  for (const ang of [...N_ANGLE].sort((a, b) => b.length - a.length)) {
    if (s.endsWith(ang)) return ang;
    if (s.endsWith(ang.replace(/-/g, " "))) return ang;
  }
  const parts = s.split(/\s+/);
  return parts.slice(-4).join(" ") || s;
}

function displayAngle(raw) {
  const k = raw.toLowerCase().replace(/\s+/g, " ").trim();
  return ANGLE_DISPLAY[k] || raw;
}

const NURSING_TEMPLATES = [
  (u, d) => `First ${d} on ${u} as a New Grad Nurse: What to Do First`,
  (u, d) => `${d} on ${u} as a New Grad Nurse: Priorities and First Steps`,
  (u, d) => `Handling ${d} on ${u} as a New Grad Nurse: First Priorities`,
  (u, d) => `New Grads on ${u}: Staying Organized Around ${d}`,
  (u, d) => `On ${u}: How New Grad Nurses Handle ${d}`,
  (u, d) => `After ${d} on ${u}: Rebuilding Momentum on Your Shift`,
  (u, d) => `From Orientation to ${u}: What ${d} Really Looks Like`,
  (u, d) => `${d} on ${u}: A Practical Checklist for New Grad Nurses`,
];

function extractAlliedProfession(pk, title) {
  const m = String(pk || "").match(/^new grad\s+(.+?)\s+first year allied health$/i);
  if (m) return m[1].trim();
  const t = String(title || "");
  const m2 = t.match(/New Grad\s+([^(:]+?)\s+During/i);
  if (m2) return m2[1].trim();
  const m3 = t.match(/Day—\s*([^()]+?)\s*\(/);
  if (m3) return m3[1].trim();
  return "Allied Health Professional";
}

function extractAlliedTheme(title) {
  const t = String(title || "");
  let m = t.match(/During Your\s+(.+?)\s*\(/i);
  if (m) return m[1].trim();
  m = t.match(/Your\s+(.+?)\s+Lands on/i);
  if (m) return m[1].trim();
  m = t.match(/New Grad [^:]+:\s*(.+?)\s+and What Preceptors/i);
  if (m) return m[1].trim();
  m = t.match(/in Your First Month as a\s+(.+?)\s*\(/i);
  if (m) return m[1].trim();
  m = t.match(/Survive\s+(.+?)\s+in Your First Month/i);
  if (m) return m[1].trim();
  return "your first tough day";
}

function displayTheme(raw) {
  const k = raw.toLowerCase();
  const map = {
    "first solo shift": "Solo Shifts",
    "first critical value call": "Critical Value Calls",
    "first equipment failure": "Equipment Failures",
    "first angry clinician": "High-Stakes Conversations",
    "first missed protocol step": "Protocol Missteps",
    "first overtime cascade": "Surprise Overtime",
    "first scope question": "Scope Questions",
    "first documentation audit": "Documentation Audits",
    "first patient complaint": "Patient Complaints",
    "first code in department": "In-Department Codes",
  };
  return map[k] || raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

const ALLIED_TEMPLATES = [
  (prof, d) => `Your First ${d} as a New Grad ${prof}: What Preceptors Expect`,
  (prof, d) => `Short-Staffed Shifts and ${d}: A New Grad ${prof} Playbook`,
  (prof, d) => `New Grad ${prof}: Getting Through ${d} in Month One`,
  (prof, d) => `When ${d} Shows Up: Priorities for New Grad ${prof}s`,
  (prof, d) => `Real Workflow: ${d} for New Grad ${prof}s`,
  (prof, d) => `Recovering Confidence After ${d} as a New Grad ${prof}`,
  (prof, d) => `School vs Site: ${d} in Your First ${prof} Role`,
  (prof, d) => `Time Management Around ${d}: New Grad ${prof} Tips`,
];

function parseTransitionHook(pk) {
  return String(pk || "")
    .replace(/^healthcare career\s+/i, "")
    .replace(/\s+new professional$/i, "")
    .trim();
}

function displayHook(raw) {
  return raw
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

const TRANS_TEMPLATES = [
  (h) => `${h}: Planning Your Next Step After Licensure`,
  (h) => `Early-Career Healthcare: Navigating ${h}`,
  (h) => `${h}—What New Professionals Often Learn the Hard Way`,
  (h) => `Job Search Stress and ${h}: Staying Grounded`,
  (h) => `Career Moves: ${h} Without Losing Confidence`,
];

/**
 * @param {object} seed
 * @param {number} id — 1-based
 * @param {number} variantOffset — rotate templates if deduping
 */
export function buildPublishTitle(seed, id, variantOffset = 0) {
  const idx = id - 1 + variantOffset;
  if (seed.audience === "nursing") {
    const u = titleCaseUnit(seed.unit || "the unit");
    const rawAngle = extractNursingAngle(seed.primaryKeyword);
    const d = displayAngle(rawAngle);
    const t = NURSING_TEMPLATES[idx % NURSING_TEMPLATES.length];
    return t(u, d);
  }
  if (seed.audience === "allied") {
    const prof = extractAlliedProfession(seed.primaryKeyword, seed.title);
    const themeRaw = extractAlliedTheme(seed.title);
    const d = displayTheme(themeRaw);
    const t = ALLIED_TEMPLATES[idx % ALLIED_TEMPLATES.length];
    return t(prof, d);
  }
  const hookRaw = parseTransitionHook(seed.primaryKeyword);
  const h = displayHook(hookRaw);
  const t = TRANS_TEMPLATES[idx % TRANS_TEMPLATES.length];
  return t(h);
}
