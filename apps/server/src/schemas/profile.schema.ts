import { z } from "zod";

const optionalTextSchema = (maxLength: number) => {
  return z
    .string()
    .trim()
    .max(maxLength)
    .nullable()
    .transform((value) => value || null)
    .optional();
};

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50)
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50)
      .optional(),

    phone: optionalTextSchema(30),
    location: optionalTextSchema(100),
    headline: optionalTextSchema(150),
    bio: optionalTextSchema(5000),

    skills: z
      .array(z.string().trim().min(1).max(50))
      .max(30, "You can add up to 30 skills.")
      .transform((skills) => {
        const seen = new Set<string>();

        return skills.filter((skill) => {
          const normalizedSkill = skill.toLowerCase();

          if (seen.has(normalizedSkill)) {
            return false;
          }

          seen.add(normalizedSkill);
          return true;
        });
      })
      .optional(),
  })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update.",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
