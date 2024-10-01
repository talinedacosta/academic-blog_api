import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error(_env.error.format());
  throw new Error(_env.error.message);
}

export const env = _env.data;
