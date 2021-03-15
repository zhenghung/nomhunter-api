import { Module } from "@nestjs/common";
import { PlayerBadgeEntityModule } from "../../entities/playerBadge/player-badge.entity.module";
import { JournalService } from "./journal.service";
import { JournalController } from "./journal.controller";
import { BadgeEntityModule } from "../../entities/badge/badge.entity.module";

@Module({
  imports: [PlayerBadgeEntityModule, BadgeEntityModule],
  providers: [JournalService],
  controllers: [JournalController],
})
export class JournalModule {}
