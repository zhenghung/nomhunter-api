import { Module } from "@nestjs/common";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";
import { ProfileController } from "./profile.controller";
import { AvatarModule } from "../avatar/avatar.module";
import { ProfileService } from "./profile.service";
import { PlayerBadgeEntityModule } from "../../entities/playerBadge/player-badge.entity.module";
import { JournalModule } from "../journal/journal.module";
import { LeaderboardModule } from "../leaderboard/leaderboard.module";
import { ZoneEntityModule } from "../../entities/zone/zone.entity.module";
import { PlayerMissionEntityModule } from "../../entities/playerMission/player-mission.entity.module";
import { PlayerWalletEntityModule } from "../../entities/playerWallet/player-wallet.entity.module";

@Module({
  imports: [
    PlayerEntityModule,
    AvatarModule,
    PlayerBadgeEntityModule,
    JournalModule,
    LeaderboardModule,
    ZoneEntityModule,
    PlayerMissionEntityModule,
    PlayerWalletEntityModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
