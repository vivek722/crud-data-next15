// lib/logger.js
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, json } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}${stack ? `\n${stack}` : ''}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  transports: [
    // Write all logs with importance level of `error` or higher to stderr
    new transports.Console({
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          const color = {
            error: '\x1b[31m',    // Red
            warn: '\x1b[33m',     // Yellow
            info: '\x1b[32m',     // Green
            http: '\x1b[36m',     // Cyan
            debug: '\x1b[35m'     // Magenta
          }[level] || '\x1b[0m';
          
          return `${color}${timestamp} [${level.toUpperCase()}]\x1b[0m ${message}`;
        })
      )
    }),
    
    // Write all logs to a file
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5
    }),
    
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

export default logger;