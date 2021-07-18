import { Module } from "@nestjs/common";
import { PlayerEntityModule } from "./player/player.entity.module";
import { FileEntityModule } from "./file/file.entity.module";
import { VenueEntityModule } from "./venue/venue.entity.module";
import { ZoneEntityModule } from "./zone/zone.entity.module";
import { GameEntityModule } from "./game/game.entity.module";
import { SeasonEntityModule } from "./season/season.entity.module";
import { BadgeEntityModule } from "./badge/badge.entity.module";
import { PlayerBadgeEntityModule } from "./playerBadge/player-badge.entity.module";
import { TagEntityModule } from "./tag/tag.entity.module";
import { VenueTagEntityModule } from "./venueTag/venue-tag.entity.module";
import { GearEntityModule } from "./gear/gear.entity.module";
import { MissionEntityModule } from "./mission/mission.entity.module";
import { PlayerMissionEntityModule } from "./playerMission/player-mission.entity.module";
import { MissionGroupEntityModule } from "./missionGroup/mission-group.entity.module";
import { MissionGroupFlagEntityModule } from "./missionGroupFlag/mission-group-flag.entity.module";

@Module({
  imports: [
    PlayerEntityModule,
    FileEntityModule,
    VenueEntityModule,
    BadgeEntityModule,
    PlayerBadgeEntityModule,
    ZoneEntityModule,
    GameEntityModule,
    SeasonEntityModule,
    TagEntityModule,
    VenueTagEntityModule,
    GearEntityModule,
    MissionEntityModule,
    PlayerMissionEntityModule,
    MissionGroupEntityModule,
    MissionGroupFlagEntityModule,
  ],
})
export class EntitiesModule {}
