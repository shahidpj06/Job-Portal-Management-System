import { z } from "zod";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const applicationFormSchema = z.object({
  resumeFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'The selected file is empty.')
    .refine((file) => file.size <= MAX_RESUME_BYTES, 'Resume must be 5 MB or smaller.')
    .refine(
      (file) =>
        file.name.toLowerCase().endsWith('.pdf') && (!file.type || file.type === 'application/pdf'),
      'Choose a PDF resume.'
    )
    .nullable(),
  coverLetter: z
    .string()
    .trim()
    .max(5000, 'Cover letter must contain no more than 5,000 characters.')
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;