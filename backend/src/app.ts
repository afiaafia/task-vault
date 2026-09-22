import express from 'express';
import { errorMiddleware } from '@middlewares/error.middleware.js';

export const api_timeout = 15_000;

export const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use(errorMiddleware);
