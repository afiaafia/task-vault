import { z } from 'zod';
import { zBoolean, zNumber } from './primitives.js';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: zNumber.default(5000),

  MONGO_URI: z.string().min(1),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  TRUST_PROXY: zBoolean.default(false),
});
