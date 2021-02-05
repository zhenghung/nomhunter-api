import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RedisService } from "../../clients/redis/redis.service";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@ApiTags("Leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
  private readonly logger = new Logger(LeaderboardController.name);

  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly redisService: RedisService
  ) {}

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
  @ApiOperation({ summary: "Fetch leaderboard venues summary details" })
  @ApiOkResponse({ description: "Leaderboard venues retrieved successfully" })
  @Get()
  async getLeaderboard(
    @Query("venueId") venueId?: string,
    @Query("zoneId") zoneId?: string
  ): Promise<any[]> {
    if ((!venueId && !zoneId) || (venueId && zoneId)) {
      throw HttpExceptionsUtil.createHttpException(
        "Only one zoneId or venueId required",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    if (venueId) {
      this.logger.log("Fetching venue leaderboard details");
      await this.leaderboardService.refreshVenueLeaderboard(venueId);
      return await this.leaderboardService.getLeaderboard(venueId);
    }
    if (zoneId) {
      await this.leaderboardService.refreshZoneLeaderboard(zoneId);
      return await this.leaderboardService.getLeaderboard(zoneId);
    }
  }
}
