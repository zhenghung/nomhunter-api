import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigService],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
