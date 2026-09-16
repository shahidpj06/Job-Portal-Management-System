import { z } from 'zod';

export const jobEditorSchema = z
  .object({
    category: z.enum(['DESIGN', 'ENGINEERING', 'MARKETING', 'OPERATIONS', 'PRODUCT', 'SALES']),
    companyId: z.string().trim().min(1, 'Company is required.'),
    currency: z.string().trim().length(3, 'Use a three-letter currency code.'),
    description: z.string().trim().min(20, 'Description must contain at least 20 characters.'),
    employmentType: z.enum(['CONTRACT', 'FREELANCE', 'FULL_TIME', 'INTERNSHIP', 'PART_TIME']),
    experienceLevel: z.enum(['DIRECTOR', 'ENTRY_LEVEL', 'EXECUTIVE', 'MID_LEVEL', 'SENIOR_LEVEL']),
    location: z.string().trim().min(2, 'Location is required.'),
    salaryMax: z.number().int().nonnegative('Maximum salary cannot be negative.'),
    salaryMin: z.number().int().nonnegative('Minimum salary cannot be negative.'),
    status: z.enum(['CLOSED', 'DRAFT', 'PUBLISHED']),
    summary: z.string().trim().min(20, 'Summary must contain at least 20 characters.'),
    title: z.string().trim().min(3, 'Title must contain at least 3 characters.'),
    workMode: z.enum(['HYBRID', 'ON_SITE', 'REMOTE'])
  })
  .superRefine((formValues, context) => {
    if (formValues.salaryMax < formValues.salaryMin) {
      context.addIssue({
        code: 'custom',
        message: 'Maximum salary cannot be lower than minimum salary.',
        path: ['salaryMax']
      });
    }
  });

export type JobEditorFormData = z.infer<typeof jobEditorSchema>;

export const JOB_EDITOR_DEFAULT_VALUES: JobEditorFormData = {
  category: 'ENGINEERING',
  companyId: '',
  currency: 'USD',
  description: '',
  employmentType: 'FULL_TIME',
  experienceLevel: 'MID_LEVEL',
  location: '',
  salaryMax: 120_000,
  salaryMin: 80_000,
  status: 'DRAFT',
  summary: '',
  title: '',
  workMode: 'HYBRID'
};
