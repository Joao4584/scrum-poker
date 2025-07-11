import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('0.0.0.0'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_DATABASE: z.string().default('nestdb'),
  PORT_NEST: z.coerce.number().default(4000),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:', error.issues);
  } else {
    console.error('❌ Invalid environment variables:', error);
  }
  throw new Error('Invalid environment variables');
}

export const env = envSchema.parse(process.env);
