import { Module } from "@nestjs/common";
import { UserEntityModule } from "./user/user.entity.module";
import { FileEntityModule } from "./file/file.entity.module";
import { VenueEntityModule } from "./venue/venue.entity.module";
import { ZoneEntityModule } from "./zone/zone.entity.module";
import { GameEntityModule } from "./game/game.entity.module";
import { SeasonEntityModule } from "./season/season.entity.module";
import { BadgeEntityModule } from "./badge/badge.entity.module";
import { UserBadgeEntityModule } from "./userBadge/user-badge.entity.module";

@Module({
  imports: [
    UserEntityModule,
    FileEntityModule,
    VenueEntityModule,
    BadgeEntityModule,
    UserBadgeEntityModule,
    ZoneEntityModule,
    GameEntityModule,
    SeasonEntityModule,
  ],
})
export class EntitiesModule {}
