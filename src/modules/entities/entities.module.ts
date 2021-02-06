import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { FilesModule } from "./files/files.module";
import { VenuesModule } from "./venues/venues.module";
import { ZonesModule } from "./zones/zones.module";
import { GamesModule } from "./games/games.module";

@Module({
  imports: [UsersModule, FilesModule, VenuesModule, ZonesModule, GamesModule],
})
export class EntitiesModule {}
