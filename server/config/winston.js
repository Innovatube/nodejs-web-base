import fs from 'fs';
import winston from 'winston';
import 'winston-daily-rotate-file';

var tsFormat = new Date().toLocaleString();
var logDir = process.env.LOGGING_DIR || 'logs';

// Create logs directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const jsonFormatter = (logEntry) => {
  return `${logEntry.level.toUpperCase()} ${tsFormat} ${logEntry.message}`;
};

const logger = winston.createLogger({
  format: winston.format.printf(jsonFormatter),
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      timestamp: tsFormat,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      prepend: true,
      filename: logDir + '/%DATE%-log.log',
      maxDays:7,
      level: 'info'
    })
  ]
});

export default logger;
