import { Module } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { LeaderboardController } from "./leaderboard.controller";
import { GamesModule } from "../../entities/games/games.module";
import { RedisModule } from "../../clients/redis/redis.module";
import { ZonesModule } from "../../entities/zones/zones.module";

@Module({
  imports: [GamesModule, RedisModule, ZonesModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
