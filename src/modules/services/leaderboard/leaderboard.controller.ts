import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { LeaderboardType } from "../../common/constants/leaderboard.type";
import { RankInterface } from "./interface/rank.interface";

@ApiTags("Leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
  private readonly logger = new Logger(LeaderboardController.name);

  constructor(private readonly leaderboardService: LeaderboardService) {}

  @ApiImplicitQuery({
    name: "venueId",
    required: false,
    type: String,
  })
  @ApiImplicitQuery({
    name: "zoneId",
    required: false,
    type: String,
  })
  @ApiOperation({ summary: "Fetch leaderboard" })
  @ApiOkResponse({ description: "Leaderboard retrieved successfully" })
  @Get()
  async getLeaderboard(
    @Query("venueId") venueId?: string,
    @Query("zoneId") zoneId?: string
  ): Promise<RankInterface[]> {
    if (venueId && zoneId) {
      throw HttpExceptionsUtil.createHttpException(
        "Only one zoneId or venueId required",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    if (venueId) {
      this.logger.log("Fetching venue leaderboard details");
      return await this.leaderboardService.getLeaderboard(
        LeaderboardType.VENUE,
        venueId
      );
    }
    if (zoneId) {
      this.logger.log("Fetching zone leaderboard details");
      return await this.leaderboardService.getLeaderboard(
        LeaderboardType.ZONE,
        zoneId
      );
    }
    return await this.leaderboardService.getLeaderboard(
      LeaderboardType.SEASON,
      "SEASON"
    );
  }
}
