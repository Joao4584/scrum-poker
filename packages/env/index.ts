import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

// When the code is built, it will be in the 'dist' folder.
// So we need to go up three levels to reach the root.
// packages/env/dist -> packages/env -> packages -> root
config({ path: resolve(__dirname, '..', '..', '..', '.env') });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT_WEB: z.coerce.number().default(3000),
  PORT_NEST: z.coerce.number().default(4000),
  NEXTAUTH_DEBUG: z.coerce.boolean().default(false),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  DB_HOST: z.string().default('0.0.0.0'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('password'),
  DB_DATABASE: z.string().default('nestdb'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;