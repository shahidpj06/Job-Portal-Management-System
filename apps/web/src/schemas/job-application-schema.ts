import { z } from 'zod';

const MAXIMUM_COVER_LETTER_LENGTH = 5_000;
const MAXIMUM_RESUME_FILE_SIZE = 5 * 1024 * 1024;
const PDF_FILE_EXTENSION = '.pdf';
const PDF_MIME_TYPE = 'application/pdf';

export const applicationFormSchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .max(
      MAXIMUM_COVER_LETTER_LENGTH,
      'Cover letter must contain no more than 5,000 characters.'
    ),
  resumeFile: z
    .instanceof(File)
    .refine(
      (file) => file.size > 0,
      'The selected file is empty.'
    )
    .refine(
      (file) => file.size <= MAXIMUM_RESUME_FILE_SIZE,
      'Resume must be 5 MB or smaller.'
    )
    .refine(
      (file) =>
        file.name
          .toLowerCase()
          .endsWith(PDF_FILE_EXTENSION) &&
        (!file.type || file.type === PDF_MIME_TYPE),
      'Choose a PDF resume.'
    )
    .nullable()
});

export type ApplicationFormValues = z.infer<
  typeof applicationFormSchema
>;