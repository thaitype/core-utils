import type { ILogger, LogLevel } from './ILogger.js';

/**
 * ConsoleLogger is a simple logger that logs to the console.
 * It is used by default in the application.
 * It is a simple wrapper around console.log, console.error, console.warn, and console.debug.
 */
export class ConsoleLogger implements ILogger {
  constructor(public readonly level: LogLevel = 'debug') {}

  logWithLevel(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    switch (level) {
      case 'error':
        console.error(message, meta);
        break;
      case 'warn':
        console.warn(message, meta);
        break;
      case 'info':
        console.info(message, meta);
        break;
      case 'debug':
        console.debug(message, meta);
        break;
    }
  }

  log(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('info', message, meta);
  }
  info(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('info', message, meta);
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('warn', message, meta);
  }
  error(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('error', message, meta);
  }
  debug(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('debug', message, meta);
  }
}
