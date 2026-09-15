import type { IProfileData } from "@/types/profile";
import { z } from "zod";

export const parseSkills = (value: string): string[] => {
  const skills = new Map<string, string>();

  value.split(',').forEach((item) => {
    const skill = item.trim();

    if (skill && !skills.has(skill.toLowerCase())) {
      skills.set(skill.toLowerCase(), skill);
    }
  });

  return Array.from(skills.values());
};

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.').max(50),
  lastName: z.string().trim().min(1, 'Enter your last name.').max(50),
  email: z.string(),
  phone: z.string().trim().max(30),
  location: z.string().trim().max(100),
  headline: z.string().trim().max(150),
  bio: z.string().trim().max(5000),
  skillsText: z
    .string()
    .max(2000)
    .refine((value) => parseSkills(value).length <= 30, {
      message: 'Add no more than 30 skills.'
    })
    .refine((value) => parseSkills(value).every((skill) => skill.length <= 50), {
      message: 'Each skill must contain no more than 50 characters.'
    })
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const getFormValues = (profile: IProfileData): ProfileFormValues => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  phone: profile.phone ?? '',
  location: profile.location ?? '',
  headline: profile.headline ?? '',
  bio: profile.bio ?? '',
  skillsText: profile.skills.join(', ')
});