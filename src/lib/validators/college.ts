import { z } from "zod";

const CollegeTypeEnum = z.enum(["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"]);

// ─── Create / Update College ──────────────────────────────
export const collegeSchema = z.object({
  name: z.string().min(3, "College name must be at least 3 characters").max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
    .min(3)
    .max(100),
  description: z.string().max(5000).optional(),
  location: z.string().min(5, "Please enter a full address").max(300),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  type: CollegeTypeEnum.default("PRIVATE"),
  ranking: z.number().int().positive().optional(),
  nirf: z.number().int().positive().optional(),
  establishedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  images: z.array(z.string().url()).max(10).optional().default([]),
  annualFees: z.number().positive("Fees must be positive").optional(),
  maxFees: z.number().positive("Max fees must be positive").optional(),
  accreditation: z
    .enum(["A++", "A+", "A", "B++", "B+", "B", "C", "D"])
    .optional(),
  approvedBy: z.array(z.string()).optional().default([]),
  totalStudents: z.number().int().positive().optional(),
  totalFaculty: z.number().int().positive().optional(),
  campusArea: z.number().positive().optional(),
});

// ─── College Filter / Search ──────────────────────────────
export const collegeFilterSchema = z.object({
  search: z.string().max(200).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  type: CollegeTypeEnum.optional(),
  accreditation: z.string().optional(),
  minFees: z.coerce.number().optional(),
  maxFees: z.coerce.number().optional(),
  minRanking: z.coerce.number().optional(),
  maxRanking: z.coerce.number().optional(),
  approvedBy: z.string().optional(), // comma-separated
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: z
    .enum(["ranking", "nirf", "annualFees", "name", "createdAt"])
    .default("ranking"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CollegeInput = z.infer<typeof collegeSchema>;
export type CollegeFilterInput = z.infer<typeof collegeFilterSchema>;
