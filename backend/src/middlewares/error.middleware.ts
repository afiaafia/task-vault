import type { ErrorRequestHandler } from 'express';
import { logger } from '@utils/logger.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  logger.error({ error }, 'Unhandled request error');

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
