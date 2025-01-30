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
        const formattedQuery = query.replace(/\s+/g, ' ').trim();

        const formattedParams = params.map(param => {
            if (typeof param === 'string') {
                return param.replace(/^"(.*)"$/, '$1');
            }
            return param;
        });

        const paramCount = (query.match(/\$\d+/g) || []).length;

        const groupedParams = [];
        for (let i = 0; i < formattedParams.length; i += paramCount) {
            groupedParams.push(formattedParams.slice(i, i + paramCount));
        }

        const logMessage = `
                === Database Query ===
                Query: ${formattedQuery}
                Parameters:
                ${groupedParams
            .map((params, index) => `  Row ${index + 1}: ${JSON.stringify(params)}`)
            .join('\n')}
                Timestamp: ${new Date().toISOString()}
                =======================
                `;

        logger.info(logMessage);
    }
};