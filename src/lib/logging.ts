import * as winston from 'winston';
import {Logger} from 'drizzle-orm';

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export const drizzleLogger: Logger = {
    logQuery(query: string, params: unknown[]) {
        logger.info({
            type: 'query',
            query,
            params,
        });
    }
};