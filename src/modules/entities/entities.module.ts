import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { FilesModule } from "./files/files.module";
import { VenuesModule } from "./venues/venues.module";
import { ZonesModule } from "./zones/zones.module";
import { GamesModule } from "./games/games.module";
import { SeasonsModule } from "./seasons/seasons.module";
import { BadgesModule } from "./badges/badges.module";
import { UserBadgesModule } from "./userBadges/user-badges.module";

@Module({
  imports: [
    UsersModule,
    FilesModule,
    VenuesModule,
    BadgesModule,
    UserBadgesModule,
    ZonesModule,
    GamesModule,
    SeasonsModule,
  ],
})
export class EntitiesModule {}
