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

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
