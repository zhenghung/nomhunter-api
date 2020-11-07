import { ConfigFactory } from '@nestjs/config/dist/interfaces';

export const configFactory: ConfigFactory = () => ({
    env: process.env.NODE_ENV,

    database: {
        type: 'mongodb',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
    },

    http: {
        port: parseInt(process.env.HTTP_PORT, 10) || 3000,
    },
});
