// 🧩 Service: LoggerService 
// 📂 Location: /src/app/core/services/utility/logger.service.ts
// 📝 Description: Production proof logging service (use instead of console.log())

import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export enum LogLevel {
  DEBUG = 0,
  LOG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly isProd = environment.production;
  private readonly currentLogLevel = (environment as any).logLevel ?? LogLevel.LOG;

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, ...optional: unknown[]): void {
    if (!this.isProd && this.currentLogLevel <= LogLevel.DEBUG) {
      console.debug('[DEBUG]', message, ...optional);
    }
  }

  /**
   * Log general messages (only in development)
   */
  log(message: string, ...optional: unknown[]): void {
    if (!this.isProd && this.currentLogLevel <= LogLevel.LOG) {
      console.log('[LOG]', message, ...optional);
    }
  }

  /**
   * Log informational messages (only in development)
   */
  info(message: string, ...optional: unknown[]): void {
    if (!this.isProd && this.currentLogLevel <= LogLevel.INFO) {
      console.info('[INFO]', message, ...optional);
    }
  }

  /**
   * Log warning messages (only in development)
   */
  warn(message: string, ...optional: unknown[]): void {
    if (!this.isProd && this.currentLogLevel <= LogLevel.WARN) {
      console.warn('[WARN]', message, ...optional);
    }
  }

  /**
   * Log error messages (always logged, even in production)
   */
  error(message: string, ...optional: unknown[]): void {
    if (this.currentLogLevel <= LogLevel.ERROR) {
      console.error('[ERROR]', message, ...optional);
    }

    // Optional: send to external service in production
    // if (this.isProd) sendToSentry(message, optional)
  }

  /**
   * Format message with timestamp
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }
}

