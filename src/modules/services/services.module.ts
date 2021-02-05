import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { LiveModule } from "./live/live.module";
import { GoogleMapsModule } from "./google-maps/google-maps.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";

@Module({
  imports: [
    AuthModule,
    AvatarModule,
    LiveModule,
    GoogleMapsModule,
    LeaderboardModule,
  ],
})
export class ServicesModule {}
