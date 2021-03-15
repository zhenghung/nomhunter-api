import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerBadgeEntity } from "./player-badge.entity";
import { PlayerBadgeEntityService } from "./player-badge.entity.service";
import { PlayerBadgeEntityController } from "./player-badge.entity.controller";
import { BadgeEntityModule } from "../badge/badge.entity.module";
import { PlayerEntityModule } from "../player/player.entity.module";
import { GameEntityModule } from "../game/game.entity.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerBadgeEntity]),
    BadgeEntityModule,
    PlayerEntityModule,
    GameEntityModule,
  ],
  providers: [PlayerBadgeEntityService],
  controllers: [PlayerBadgeEntityController],
  exports: [PlayerBadgeEntityService],
})
export class PlayerBadgeEntityModule {}
