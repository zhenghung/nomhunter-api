import { ConfigFactory } from "@nestjs/config/dist/interfaces";

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
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
  },

  aws: {
    region: process.env.AWS_REGION,
    accesskeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
    s3RootUrl: process.env.AWS_S3_ROOT_URL,
  },
});
