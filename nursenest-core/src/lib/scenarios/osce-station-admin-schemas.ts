import { z } from "zod";

const jsonLoose = z.unknown();

export const osceStationPostSchema = z
  .object({
    slug: z.string().min(2).max(120),
    title: z.string().min(2).max(300),
    description: z.string().max(8000).optional(),
    scenarioIntro: z.string().min(1),
    candidateInstructions: z.string().optional(),
    patientScript: z.string().optional(),
    steps: jsonLoose,
    examinerChecklist: jsonLoose.optional(),
    criticalFails: z.array(z.string()).optional(),
    rationales: jsonLoose.optional(),
    timeLimit: z.string().max(80).optional().nullable(),
    difficulty: z.string().min(1).max(40),
    category: z.string().min(1).max(80),
    pathwayId: z.string().max(80).optional().nullable(),
    isPublished: z.boolean().optional(),
    domain: z.string().max(120).optional().nullable(),
    roleTrack: z.string().max(80).optional().nullable(),
    sourceLegacyPath: z.string().max(512).optional().nullable(),
    extensions: jsonLoose.optional(),
  })
  .strict();

export const osceStationPatchSchema = osceStationPostSchema.partial().strict();
