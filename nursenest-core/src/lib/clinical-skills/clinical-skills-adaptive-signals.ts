/**
 * When weak-topic labels align with bedside / procedural competency domains,
 * nudge the Clinical Skills workstation (`/app/clinical-skills`).
 */
const CLINICAL_SKILLS_FOCUS_SIGNAL =
  /\b(sterile|dressing|injection|subq|subcut|intramuscular|im\b|catheter|foley|urinary|trach|tracheostomy|ng\s*tube|nasogastric|wound|bedside|procedure|clinical\s*skill|aspiration|insertion|specimen|glove|hand\s*hygiene|assessment\s*skill|head\-to\-toe|neuro\s*check|iv\s*start|phlebotomy|sbar|handoff|delegation|rapid\s*response|code\s*blue|blood\s*transfusion|central\s*line|chest\s*tube|ostomy|drain|fall\s*risk|pressure\s*injury|oxygen|sepsis\s*screen|stroke\s*alert|documentation|patient\s*teaching|medication\s*administration)\b/i;

export function weakTopicSuggestsClinicalSkillsFocus(topicKey: string): boolean {
  const s = topicKey?.trim() ?? "";
  if (!s) return false;
  return CLINICAL_SKILLS_FOCUS_SIGNAL.test(s);
}
