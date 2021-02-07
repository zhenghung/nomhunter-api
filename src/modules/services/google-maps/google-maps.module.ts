import { HttpModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleMapsService } from "./google-maps.service";
import { GoogleMapsController } from "./google-maps.controller";
import { RedisModule } from "../../clients/redis/redis.module";

@Module({
  imports: [ConfigService, RedisModule, HttpModule],
  providers: [GoogleMapsService],
  controllers: [GoogleMapsController],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}
