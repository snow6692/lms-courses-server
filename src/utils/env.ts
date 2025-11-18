// src/utils/env.ts
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
  DB_URL: z.string().url(),
  NODE_ENV: z.string().default("development"),

  // Accept string, split by comma, and trim
  ORIGIN: z.string().transform((str) => str.split(",").map((s) => s.trim())),

  // Coerce string → number
  PORT: z.coerce.number().min(1).default(5000),

  CLOUD_NAME: z.string().min(1),
  CLOUD_API_KEY: z.string().min(1),
  CLOUD_API_SECRET: z.string().min(1),

  REDIS_URL: z.string().url(),

  ACCESS_TOKEN: z.string().min(10),
  REFRESH_TOKEN: z.string().min(10),
  ACTIVATION_SECRET: z.string().min(10),

  // Coerce to number (minutes)
  ACCESS_TOKEN_EXPIRE: z.coerce.number().min(1),
  REFRESH_TOKEN_EXPIRE: z.coerce.number().min(1),

  SMTP_MAIL: z.string().email(),
  SMTP_PASS: z.string().min(6),
  SMTP_PORT: z.coerce.number().min(1),
  SMTP_SERVICE: z.string().min(1),
  SMTP_HOST: z.string().min(1),
});

export const ENV = envSchema.parse(process.env);
