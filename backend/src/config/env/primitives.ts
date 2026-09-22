import { z } from 'zod';

export type IntegerBounds = Readonly<{
  min: number;
  max: number;
}>;

const assertIntegerConfiguration = (
  fallback: number,
  { min, max }: IntegerBounds
): void => {
  if (
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    min < 0 ||
    min > max
  ) {
    throw new RangeError(
      'Integer environment bounds must be ordered safe integers'
    );
  }

  if (!Number.isSafeInteger(fallback) || fallback < min || fallback > max) {
    throw new RangeError(
      `Integer environment fallback must be between ${min} and ${max}`
    );
  }
};

export const integerFromEnv = (fallback: number, bounds: IntegerBounds) => {
  assertIntegerConfiguration(fallback, bounds);

  const { min, max } = bounds;

  return z
    .string()
    .trim()
    .default(String(fallback))
    .superRefine((value, ctx) => {
      if (!/^\d+$/.test(value)) {
        ctx.addIssue({
          code: 'custom',
          message: 'must be a base 10 integer',
        });
        return;
      }

      const parsed = Number(value);

      if (parsed < min || parsed > max) {
        ctx.addIssue({
          code: 'custom',
          message: `must be an integer between ${min} and ${max}`,
        });
      }
    })
    .transform(Number);
};
