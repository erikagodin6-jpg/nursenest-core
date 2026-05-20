/**
 * Shared types for Philippines NLE blog seed pipeline (scripts only; not bundled in Next).
 */

export type PhilippinesBlogAngle =
  | "structure"
  | "volume"
  | "nclex"
  | "us-migration"
  | "ca-migration"
  | "clinical"
  | "language"
  | "study-plan";

export type PhilippinesBlogSeedTopic = {
  slug: string;
  title: string;
  keyword: string;
  angle: PhilippinesBlogAngle;
  /** Clinical or professional theme rotated for variety */
  domain: string;
  index: number;
};
