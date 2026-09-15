import { z } from "zod";

const optionalHttpUrl = z
  .string()
  .trim()
  .max(2048)
  .url("Enter a valid URL.")
  .refine(
    (value) => {
      const protocol = new URL(value).protocol;
      return protocol === "https:" || protocol === "http:";
    },
    { message: "Use an HTTP or HTTPS URL." },
  )
  .nullable()
  .optional();

const companyFields = {
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(10000).nullable().optional(),
  logoUrl: optionalHttpUrl,
  websiteUrl: optionalHttpUrl,
};

export const createCompanySchema = z.object(companyFields).strict();

export const updateCompanySchema = z
  .object(companyFields)
  .partial()
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "Provide at least one field to update.",
  });

export const companyIdParamsSchema = z
  .object({
    companyId: z.cuid("Enter a valid company ID."),
  })
  .strict();

export const listCompaniesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(100).optional(),
  })
  .strict();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyIdParams = z.infer<typeof companyIdParamsSchema>;
export type ListCompaniesQuery = z.infer<typeof listCompaniesQuerySchema>;
