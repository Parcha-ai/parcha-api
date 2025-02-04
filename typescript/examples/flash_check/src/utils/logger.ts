export const log = {
  info: (event: string, ...args: any[]) => {
    console.info(`[INFO] ${event}`, ...args);
  },
  error: (event: string, error?: Error, ...args: any[]) => {
    console.error(`[ERROR] ${event}`, error ? { error, ...args } : args);
  },
  warn: (event: string, error?: Error, ...args: any[]) => {
    console.warn(`[WARN] ${event}`, error ? { error, ...args } : args);
  },
  debug: (event: string, ...args: any[]) => {
    console.debug(`[DEBUG] ${event}`, ...args);
  },
};
