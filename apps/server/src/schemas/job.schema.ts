import { z } from "zod";

import {
  EmploymentType,
  ExperienceLevel,
  JobCategory,
  JobStatus,
  WorkMode,
} from "../generated/prisma/client.js";

const requiredText = (fieldName: string, minimumLength = 2) => {
  return z
    .string()
    .trim()
    .min(
      minimumLength,
      `${fieldName} must contain at least ${minimumLength} characters.`,
    );
};

const optionalTextList = z.array(z.string().trim().min(1)).default([]);

const jobFields = {
  title: requiredText("Job title", 3),

  companyName: requiredText("Company name"),

  companyLogoUrl: z
    .union([
      z.string().trim().url("Company logo must be a valid URL."),
      z.literal(""),
    ])
    .optional()
    .nullable()
    .transform((value) => value || null),

  category: z.enum(JobCategory),

  experienceLevel: z.enum(ExperienceLevel),

  employmentType: z.enum(EmploymentType),

  workMode: z.enum(WorkMode),

  location: requiredText("Location"),

  salaryMin: z.number().int().nonnegative().optional().nullable(),

  salaryMax: z.number().int().nonnegative().optional().nullable(),

  currency: z
    .string()
    .trim()
    .length(3, "Currency must use a three-letter code such as INR.")
    .transform((value) => value.toUpperCase())
    .default("INR"),

  summary: requiredText("Job summary", 20),

  description: requiredText("Job description", 20),

  responsibilities: optionalTextList,

  requirements: optionalTextList,

  skills: optionalTextList,

  benefits: optionalTextList,

  applicationDeadline: z.coerce.date().optional().nullable(),

  status: z.enum(JobStatus).default(JobStatus.DRAFT),
};

const validateSalaryRange = (
  data: {
    salaryMin?: number | null;
    salaryMax?: number | null;
  },
  context: z.RefinementCtx,
): void => {
  if (
    data.salaryMin !== undefined &&
    data.salaryMin !== null &&
    data.salaryMax !== undefined &&
    data.salaryMax !== null &&
    data.salaryMax < data.salaryMin
  ) {
    context.addIssue({
      code: "custom",
      path: ["salaryMax"],
      message: "Maximum salary cannot be lower than minimum salary.",
    });
  }
};

export const createJobSchema = z
  .object(jobFields)
  .strict()
  .superRefine(validateSalaryRange);

export const updateJobSchema = z
  .object(jobFields)
  .partial()
  .strict()
  .superRefine((data, context) => {
    if (Object.keys(data).length === 0) {
      context.addIssue({
        code: "custom",
        message: "Provide at least one field to update.",
      });
    }

    validateSalaryRange(data, context);
  });

export const jobIdParamsSchema = z.object({
  jobId: z.string().trim().min(1, "Job ID is required."),
});

export const listJobsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  category: z.enum(JobCategory).optional(),

  experienceLevel: z.enum(ExperienceLevel).optional(),

  search: z.string().trim().max(100).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobIdParams = z.infer<typeof jobIdParamsSchema>;
export type ListJobsQuery = z.infer<typeof listJobsQuerySchema>;
