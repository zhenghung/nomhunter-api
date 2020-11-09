import { ConfigFactory } from '@nestjs/config/dist/interfaces';

export const configFactory: ConfigFactory = () => ({
    env: process.env.NODE_ENV,

    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
    },

    http: {
        port: parseInt(process.env.HTTP_PORT, 10) || 3000,
    },
});
