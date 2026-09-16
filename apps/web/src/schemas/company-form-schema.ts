import { z } from 'zod';

const MAXIMUM_COMPANY_DESCRIPTION_LENGTH = 10_000;
const MAXIMUM_COMPANY_NAME_LENGTH = 150;
const MAXIMUM_WEBSITE_URL_LENGTH = 2_048;

const SUPPORTED_WEBSITE_PROTOCOLS = ['http:', 'https:'];

export const companyFormSchema = z.object({
  description: z.string().trim().max(MAXIMUM_COMPANY_DESCRIPTION_LENGTH),
  name: z.string().trim().min(2, 'Enter a company name.').max(MAXIMUM_COMPANY_NAME_LENGTH),
  websiteUrl: z
    .string()
    .trim()
    .max(MAXIMUM_WEBSITE_URL_LENGTH)
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        try {
          const websiteUrl = new URL(value);

          return SUPPORTED_WEBSITE_PROTOCOLS.includes(websiteUrl.protocol);
        } catch {
          return false;
        }
      },
      {
        message: 'Enter a valid HTTP or HTTPS website URL.'
      }
    )
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
