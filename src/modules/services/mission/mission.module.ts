import { Module } from "@nestjs/common";
import { MissionEntityModule } from "../../entities/mission/mission.entity.module";
import { PlayerMissionEntityModule } from "../../entities/playerMission/player-mission.entity.module";
import { MissionService } from "./mission.service";
import { MissionController } from "./mission.controller";
import { GameCreatedListener } from "./listeners/game-created.listener";
import { TagEntityModule } from "../../entities/tag/tag.entity.module";
import { VenueEntityModule } from "../../entities/venue/venue.entity.module";
import { VenueTagEntityModule } from "../../entities/venueTag/venue-tag.entity.module";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";
import { MissionCompletedListener } from "./listeners/mission-completed.listener";
import { MissionGroupEntityModule } from "../../entities/missionGroup/mission-group.entity.module";
import { MissionGroupFlagEntityModule } from "../../entities/missionGroupFlag/mission-group-flag.entity.module";

@Module({
  imports: [
    PlayerEntityModule,
    MissionGroupEntityModule,
    MissionGroupFlagEntityModule,
    MissionEntityModule,
    PlayerMissionEntityModule,
    VenueEntityModule,
    TagEntityModule,
    VenueTagEntityModule,
  ],
  providers: [MissionService, GameCreatedListener, MissionCompletedListener],
  controllers: [MissionController],
  exports: [],
})
export class MissionModule {}
