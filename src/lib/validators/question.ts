import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(10, "Question title must be at least 10 characters")
    .max(300, "Title too long"),
  content: z
    .string()
    .min(20, "Please provide more detail in your question")
    .max(2000, "Question too long"),
  collegeId: z.string().optional(), // optional — can be general or college-specific
});

export const answerSchema = z.object({
  content: z
    .string()
    .min(20, "Answer must be at least 20 characters")
    .max(3000, "Answer too long"),
});

export const questionFilterSchema = z.object({
  collegeId: z.string().optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type QuestionFilterInput = z.infer<typeof questionFilterSchema>;
