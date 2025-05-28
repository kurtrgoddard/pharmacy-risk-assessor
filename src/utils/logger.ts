
import { config } from '@/config/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private shouldLog(level: LogLevel): boolean {
    if (!config.logging.console) return false;
    
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    const configLevel = config.logging.level as LogLevel;
    return levels[level] >= levels[configLevel];
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };
  }

  private addToBuffer(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry('debug', message, data, context);
    this.addToBuffer(entry);
    
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${message}`, data || '');
    }
  }

  info(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry('info', message, data, context);
    this.addToBuffer(entry);
    
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${context ? `[${context}] ` : ''}${message}`, data || '');
    }
  }

  warn(message: string, data?: any, context?: string): void {
    const entry = this.createLogEntry('warn', message, data, context);
    this.addToBuffer(entry);
    
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${context ? `[${context}] ` : ''}${message}`, data || '');
    }
  }

  error(message: string, error?: Error | any, context?: string): void {
    const entry = this.createLogEntry('error', message, error, context);
    this.addToBuffer(entry);
    
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${context ? `[${context}] ` : ''}${message}`, error || '');
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return this.logs;
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getSystemInfo() {
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      environment: config.environment,
      logs: this.logs.slice(-50) // Last 50 logs
    };
  }
}

export const logger = new Logger();
