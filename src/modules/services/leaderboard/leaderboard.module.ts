import { Module } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { LeaderboardController } from "./leaderboard.controller";
import { GameEntityModule } from "../../entities/game/game.entity.module";
import { RedisModule } from "../../clients/redis/redis.module";
import { ZoneEntityModule } from "../../entities/zone/zone.entity.module";
import { VenueEntityModule } from "../../entities/venue/venue.entity.module";
import { GameCreatedListener } from "./listeners/game-created.listener";

@Module({
  imports: [GameEntityModule, RedisModule, ZoneEntityModule, VenueEntityModule],
  providers: [LeaderboardService, GameCreatedListener],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
