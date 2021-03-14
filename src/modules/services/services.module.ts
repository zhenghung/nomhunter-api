import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { LiveModule } from "./live/live.module";
import { GoogleMapsModule } from "./google-maps/google-maps.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";
import { ProfileModule } from "./profile/profile.module";
import { GameModule } from "./game/game.module";
import { JournalModule } from "./journal/journal.module";

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
  ],
})
export class ServicesModule {}
