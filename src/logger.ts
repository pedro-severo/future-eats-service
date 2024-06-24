// istanbul ignore file
import winston from 'winston';
const { combine, align, colorize, timestamp, printf, json } = winston.format;
export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: 'combined.log',
            format: combine(timestamp(), json()),
            silent: process.env.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            filename: 'app-error.log',
            level: 'error',
            format: combine(timestamp(), json()),
            silent: process.env.NODE_ENV === 'test',
        }),
        new winston.transports.Console({
            silent:
                process.env.NODE_ENV === 'test' ||
                process.env.NODE_ENV === 'prod',
        }),
    ],
});
