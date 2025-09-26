import Queue from 'bull'

export const emailQueue = new Queue('emailQueue', {
    redis: process.env.REDIS_URL!,
})
