import { Module } from "@nestjs/common";
import { S3Module } from "./s3/s3.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [S3Module, RedisModule],
})
export class ClientsModule {}
