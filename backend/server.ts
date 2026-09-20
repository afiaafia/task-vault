import { createServer } from 'node:http';
import { api_timeout, app } from '@app';
import { connectDb, disconnectDb } from '@config/db.js';
import { env } from '@config/env.js';
import { beginShutdown } from '@shared/lifecycle.js';
import { closeServer, listenServer } from '@utils/http.server.js';
import { logger } from '@utils/logger.js';

const server = createServer(app);

server.keepAliveTimeout = api_timeout;
server.headersTimeout = api_timeout + 1_000;
server.requestTimeout = api_timeout;

const shutdown = async (signal: string): Promise<void> => {
  beginShutdown();

  logger.info({ signal }, 'Shutting down server');

  try {
    await closeServer(server);
    await disconnectDb();

    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error(error, 'Shutdown failed');
    process.exit(1);
  }
};

const start = async (): Promise<void> => {
  try {
    await connectDb();

    await listenServer(server, env.PORT);

    logger.info(`Server running on http://localhost:${env.PORT}`);
  } catch (error) {
    logger.error(error, 'Server startup failed');

    await disconnectDb().catch(() => undefined);

    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('uncaughtException', (error) => {
  logger.fatal(error, 'Uncaught exception');
  void shutdown('uncaughtException');
});

process.on('unhandledRejection', (error) => {
  logger.fatal(error, 'Unhandled rejection');
  void shutdown('unhandledRejection');
});

void start();
