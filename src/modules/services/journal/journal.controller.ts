import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { JournalService } from "./journal.service";
import { MyBadgeInterface } from "./interface/my-badge.interface";
import { HistoryGameInterface } from "./interface/history-game.interface";

@ApiTags("Journal")
@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get Player badges" })
  @ApiCreatedResponse({ description: "Player badges successfully retrieved" })
  @Get("badges")
  @UseGuards(JwtAuthGuard)
  async fetchMyBadges(
    @Req() requestWithPlayer: RequestWithPlayer
  ): Promise<MyBadgeInterface[]> {
    return this.journalService.fetchMyPlayerBadges(requestWithPlayer.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get Player Journal History" })
  @ApiCreatedResponse({
    description: "Player Journal History successfully retrieved",
  })
  @Get("history")
  @UseGuards(JwtAuthGuard)
  async fetchHistory(
    @Req() requestWithPlayer: RequestWithPlayer
  ): Promise<HistoryGameInterface[]> {
    return this.journalService.fetchHistory(requestWithPlayer.user.id);
  }
}
