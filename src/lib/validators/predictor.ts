import { z } from "zod";

export const predictorSchema = z.object({
  exam: z.enum(["JEE Main", "JEE Advanced", "NEET", "CAT", "XAT", "GATE", "CMAT", "MAT"]),
  rank: z.number().int().positive("Rank must be a positive integer").optional(),
  score: z.number().positive("Score must be positive").optional(),
  percentile: z.number().min(0).max(100, "Percentile must be between 0 and 100").optional(),
  category: z
    .enum(["General", "OBC", "SC", "ST", "EWS", "PwD"])
    .optional()
    .default("General"),
  preferredState: z.string().optional(),
  preferredType: z.enum(["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"]).optional(),
}).refine(
  (data) => data.rank !== undefined || data.score !== undefined || data.percentile !== undefined,
  { message: "Provide at least one of rank, score, or percentile" }
);

export type PredictorInput = z.infer<typeof predictorSchema>;
