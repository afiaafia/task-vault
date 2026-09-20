import mongoose from 'mongoose';
import { env } from '@config/env.js';
import { logger } from '@utils/logger.js';

export const connectDb = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI, {
    maxPoolSize: env.NODE_ENV === 'production' ? 100 : 10,
    minPoolSize: env.NODE_ENV === 'production' ? 5 : 0,
    maxIdleTimeMS: 30_000,
    waitQueueTimeoutMS: 10_000,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    retryWrites: true,
    retryReads: true,
    compressors: ['zlib'],
    autoIndex: env.NODE_ENV !== 'production',
    autoCreate: env.NODE_ENV !== 'production',
    ...(env.NODE_ENV === 'production'
      ? {
          writeConcern: {
            w: 'majority',
          },
        }
      : {}),
  });

  logger.info('MongoDB connected');
};

export const disconnectDb = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
