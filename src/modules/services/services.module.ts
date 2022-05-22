import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { LiveModule } from "./live/live.module";
import { GoogleMapsModule } from "./google-maps/google-maps.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";
import { ProfileModule } from "./profile/profile.module";
import { GameModule } from "./game/game.module";
import { JournalModule } from "./journal/journal.module";
import { TagModule } from "./tag/tag.module";
import { MissionModule } from "./mission/mission.module";
import { ShopModule } from "./shop/shop.module";

@Module({
  imports: [
    AuthModule,
    AvatarModule,
    LiveModule,
    GoogleMapsModule,
    LeaderboardModule,
    ProfileModule,
    GameModule,
    JournalModule,
    TagModule,
    MissionModule,
    ShopModule,
  ],
})
export class ServicesModule {}
