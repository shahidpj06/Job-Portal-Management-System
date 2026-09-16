import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
  JWT_ACCESS_SECRET: z
    .string()
    .min(64, "JWT_ACCESS_SECRET must be at least 64 characters."),
  JWT_ACCESS_TOKEN_TTL: z.string().min(1).default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  SUPABASE_RESUMES_BUCKET: z.string().min(1),
  SUPABASE_AVATARS_BUCKET: z.string().min(1),
  RESEND_API_KEY: z.string().trim().min(1, "RESEND_API_KEY is required."),
  EMAIL_FROM: z.string().trim().email("EMAIL_FROM must be a valid email."),
});

export const env = environmentSchema.parse(process.env);
