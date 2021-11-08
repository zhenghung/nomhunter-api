import { Module } from "@nestjs/common";
import { PlayerBadgeEntityModule } from "../../entities/playerBadge/player-badge.entity.module";
import { JournalService } from "./journal.service";
import { JournalController } from "./journal.controller";
import { BadgeEntityModule } from "../../entities/badge/badge.entity.module";
import { VenueEntityModule } from "../../entities/venue/venue.entity.module";

@Module({
  imports: [PlayerBadgeEntityModule, BadgeEntityModule, VenueEntityModule],
  providers: [JournalService],
  controllers: [JournalController],
  exports: [JournalService],
})
export class JournalModule {}
