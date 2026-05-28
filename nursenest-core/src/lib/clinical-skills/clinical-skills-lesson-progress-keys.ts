export function syntheticClinicalSkillProgressId(slug: string): string {
  return `clinical-skills:skill:${slug.trim()}`;
}
