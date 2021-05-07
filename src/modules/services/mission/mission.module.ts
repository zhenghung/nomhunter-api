import { Module } from "@nestjs/common";
import { MissionEntityModule } from "../../entities/mission/mission.entity.module";
import { PlayerMissionEntityModule } from "../../entities/playerMission/player-mission.entity.module";
import { GearEntityModule } from "../../entities/gear/gear.entity.module";
import { MissionService } from "./mission.service";
import { MissionController } from "./mission.controller";
import { GameCreatedListener } from "./listeners/game-created.listener";
import { TagEntityModule } from "../../entities/tag/tag.entity.module";
import { VenueEntityModule } from "../../entities/venue/venue.entity.module";
import { VenueTagEntityModule } from "../../entities/venueTag/venue-tag.entity.module";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";
import { MissionProgressListener } from "./listeners/mission-progress.listener";

@Module({
  imports: [
    PlayerEntityModule,
    MissionEntityModule,
    PlayerMissionEntityModule,
    VenueEntityModule,
    TagEntityModule,
    VenueTagEntityModule,
    GearEntityModule,
  ],
  providers: [MissionService, GameCreatedListener, MissionProgressListener],
  controllers: [MissionController],
  exports: [],
})
export class MissionModule {}
