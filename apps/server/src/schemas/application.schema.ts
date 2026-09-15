import { z } from "zod";

const applicationFields = {
  jobId: z.cuid("A valid job ID is required."),

  coverLetter: z
    .string()
    .trim()
    .max(5000, "Cover letter must contain no more than 5,000 characters.")
    .transform((value) => value || null)
    .optional(),
};

export const submitApplicationSchema = z.discriminatedUnion("resumeSource", [
  z
    .object({
      ...applicationFields,
      resumeSource: z.literal("profile"),
      resumeFileId: z.cuid("A valid resume file ID is required."),
      resumeUpdatedAt: z.iso.datetime(),
    })
    .strict(),

  z
    .object({
      ...applicationFields,
      resumeSource: z.literal("upload"),
    })
    .strict(),
]);

export const listCandidateApplicationsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
  .strict();

export const listAdminApplicationsQuerySchema =
  listCandidateApplicationsQuerySchema.extend({
    jobId: z.cuid("A valid job ID is required.").optional(),
  });

export const applicationIdParamsSchema = z
  .object({
    applicationId: z.cuid("A valid application ID is required."),
  })
  .strict();

export type ListCandidateApplicationsQuery = z.infer<
  typeof listCandidateApplicationsQuerySchema
>;

export type ListAdminApplicationsQuery = z.infer<
  typeof listAdminApplicationsQuerySchema
>;

export type ApplicationIdParams = z.infer<typeof applicationIdParamsSchema>;
export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
