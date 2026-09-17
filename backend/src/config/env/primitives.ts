import { z } from 'zod';

export const zBoolean = z.string().transform((value) => value === 'true');

export const zNumber = z.string().transform((value) => Number(value));
