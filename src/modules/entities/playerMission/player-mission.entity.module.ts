import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerEntityModule } from "../player/player.entity.module";
import { PlayerMissionEntity } from "./player-mission.entity";
import { MissionEntityModule } from "../mission/mission.entity.module";
import { PlayerMissionEntityService } from "./player-mission.entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerMissionEntity]), MissionEntityModule, PlayerEntityModule],
  providers: [PlayerMissionEntityService],
  exports: [PlayerMissionEntityService],
})
export class PlayerMissionEntityModule {}
