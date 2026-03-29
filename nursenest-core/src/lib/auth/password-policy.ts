import { z } from "zod";

/** Shared rules for signup and password reset (production-safe, no deps beyond zod). */
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/[0-9]/, "Password must include a number.");
