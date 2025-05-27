import c from 'ansis';
import type { ILogger, LogLevel } from './ILogger.js';
import { merge } from 'lodash-es';

export const MARK_INFO = 'ℹ'; // blue
export const MARK_ERROR = '✖'; // red
export const MARK_WARNING = '!'; // yellow
export const MARK_DEBUG = '[debug]'; // gray

const LEVEL_ORDER: LogLevel[] = ['silent', 'error', 'warn', 'info', 'debug'];

export interface PrettyLoggerOptions {
  /** Whether to use colors */
  color: boolean;
  /** Whether to use dimmed text for meta */
  dimMeta: boolean;
  customPrefix: {
    [key in LogLevel]?: string;
  };
}

export const defaultConsoleLoggerOptions: PrettyLoggerOptions = {
  color: true,
  dimMeta: true,
  customPrefix: {
    error: MARK_ERROR,
    warn: MARK_WARNING,
    info: MARK_INFO,
    debug: MARK_DEBUG,
  },
};

export class PrettyLogger implements ILogger {
  private options: PrettyLoggerOptions;
  constructor(
    public readonly level: LogLevel = 'debug',
    options?: Partial<PrettyLoggerOptions>
  ) {
    this.options = merge({}, defaultConsoleLoggerOptions, options);
  }

  // Used by logWithLevel to check if the level should output
  private shouldLog(target: LogLevel): boolean {
    if (this.level === 'silent') return false;
    return LEVEL_ORDER.indexOf(target) <= LEVEL_ORDER.indexOf(this.level);
  }

  // Generic unformatted log (default info-level)
  log(message: string, meta?: Record<string, unknown>): void {
    this.logWithLevel('info', message, meta);
  }

  // Dynamic log level (no prefix)
  logWithLevel(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const out = this.formatRaw(message, meta);
    switch (level) {
      case 'error':
        console.error(out);
        break;
      case 'warn':
        console.warn(out);
        break;
      case 'info':
        console.info(out);
        break;
      case 'debug':
        console.debug(out);
        break;
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    const prefix = this.options.color ? c.blue(this.options.customPrefix['info']) : this.options.customPrefix['info'];
    console.info(`${prefix} ${message}${this.metaStr(meta)}`);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    const prefix = this.options.color ? c.yellow(this.options.customPrefix['warn']) : this.options.customPrefix['warn'];
    console.warn(`${prefix} ${message}${this.metaStr(meta)}`);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    const prefix = this.options.color ? c.red(this.options.customPrefix['error']) : this.options.customPrefix['error'];
    console.error(`${prefix} ${message}${this.metaStr(meta)}`);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    const logMessage = `[debug] ${message}${this.metaStr(meta, false)}`;
    console.debug(this.options.color ? c.gray(logMessage) : logMessage);
  }

  // Helper to format meta
  private metaStr(meta?: Record<string, unknown>, isDimmed = true): string {
    const resolvedIsDimmed = this.options.dimMeta && isDimmed;
    const metaString = resolvedIsDimmed ? c.dim(JSON.stringify(meta)) : JSON.stringify(meta);
    return meta ? ` ${metaString}` : '';
  }

  // Raw (no mark/prefix)
  private formatRaw(message: string, meta?: Record<string, unknown>): string {
    return `${message}${this.metaStr(meta)}`;
  }
}
