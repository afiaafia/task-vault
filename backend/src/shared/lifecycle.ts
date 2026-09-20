let shuttingDown = false;

export const beginShutdown = (): void => {
  shuttingDown = true;
};

export const isShuttingDown = (): boolean => shuttingDown;
