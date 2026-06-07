import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: path.resolve('.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),

  JWT_REFRESH_SECRET: z.string().min(10),

  CORS_ORIGIN: z.string().default('*'),

  GOOGLE_CLIENT_ID: z.string().min(1),

  GOOGLE_CLIENT_SECRET: z.string().min(1),

  GOOGLE_CALLBACK_URL: z.string(),

  CLOUDINARY_URL: z.string(), 
});

const env = envSchema.parse(process.env);

export default env;
