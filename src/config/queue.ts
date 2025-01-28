import Queue from 'bull';

export const emailQueue = new Queue('emailQueue', {
    redis: {
        host: 'redis',
        port: 6379,
    }
});