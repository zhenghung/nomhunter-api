import { Controller, Get, HttpStatus, Logger, Query, Req, UseGuards } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { LeaderboardType } from "./leaderboard.type";
import { RankInterface } from "./interface/rank.interface";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { VenueEntityService } from "../../entities/venue/venue.entity.service";
import { ZoneEntityService } from "../../entities/zone/zone.entity.service";
import { VenueRankInterface } from "./interface/venue-rank.interface";
import { ZoneRankInterface } from "./interface/zone-rank.interface";
import { SeasonRankInterface } from "./interface/season-rank.interface";
import { GameEntityService } from "../../entities/game/game.entity.service";

@ApiTags("Leaderboard")
@Controller("leaderboard")
export class LeaderboardController {
  private readonly logger = new Logger(LeaderboardController.name);

  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly venuesService: VenueEntityService,
    private readonly zonesService: ZoneEntityService,
    private readonly gamesService: GameEntityService
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
  @ApiOperation({ summary: "Fetch leaderboard" })
  @ApiOkResponse({ description: "Leaderboard retrieved successfully" })
  @Get()
  async getLeaderboard(@Query("venueId") venueId?: string, @Query("zoneId") zoneId?: string): Promise<RankInterface[]> {
    if (venueId && zoneId) {
      throw HttpExceptionsUtil.createHttpException(
        "Only one zoneId or venueId required",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    if (venueId) {
      this.logger.log("Fetching venue leaderboard details");
      return await this.leaderboardService.getLeaderboard(LeaderboardType.VENUE, venueId);
    }
    if (zoneId) {
      this.logger.log("Fetching zone leaderboard details");
      return await this.leaderboardService.getLeaderboard(LeaderboardType.ZONE, zoneId);
    }
    return await this.leaderboardService.getLeaderboard(LeaderboardType.SEASON, "SEASON");
  }

  @ApiImplicitQuery({
    name: "leaderboardType",
    required: true,
    enum: ["venues", "zone", "season"],
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get player rankings of logged in player" })
  @ApiCreatedResponse({
    description: "Specified rankings successfully retrieved for player",
  })
  @UseGuards(JwtAuthGuard)
  @Get("ranks")
  async getMyRanks(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Query("leaderboardType") leaderboardType: string
  ): Promise<VenueRankInterface[] | ZoneRankInterface[] | SeasonRankInterface> {
    switch (leaderboardType) {
      case "venues":
        // Venues
        const listOfVenueRanks: VenueRankInterface[] = [];
        const listOfVenues = await this.venuesService.findJoin("zone");
        for (const venueEntity of listOfVenues) {
          const ranks = await this.leaderboardService
            .getLeaderboard(LeaderboardType.VENUE, venueEntity.id)
            .then((rankList) => rankList.filter((rank) => rank.playerId == requestWithPlayer.user.id));
          const myRank = this.getScoreAndRankAfterFiltered(ranks, "venue");
          const game = await this.gamesService.findMatchingGame(
            venueEntity.id,
            requestWithPlayer.user.id,
            myRank.score
          );
          listOfVenueRanks.push({
            venueId: venueEntity.id,
            venueName: venueEntity.name,
            zoneName: venueEntity.zone.name,
            score: myRank.score,
            rank: myRank.rank,
            date: game ? game.createdAt : null,
          });
        }
        return listOfVenueRanks;
      case "zones":
        // Zones
        const listOfZoneRanks: ZoneRankInterface[] = [];
        const listOfZones = await this.zonesService.findAll();
        for (const zoneEntity of listOfZones) {
          const ranks = await this.leaderboardService
            .getLeaderboard(LeaderboardType.ZONE, zoneEntity.id)
            .then((rankList) => rankList.filter((rank) => rank.playerId == requestWithPlayer.user.id));
          const myRank = this.getScoreAndRankAfterFiltered(ranks, "zone");
          listOfZoneRanks.push({
            zoneId: zoneEntity.id,
            zoneName: zoneEntity.name,
            score: myRank.score,
            rank: myRank.rank,
          });
        }
        return listOfZoneRanks;
      default:
        // Season
        const seasonId = "SEASON";
        const ranks = await this.leaderboardService
          .getLeaderboard(LeaderboardType.SEASON, seasonId)
          .then((rankList) => rankList.filter((rank) => rank.playerId == requestWithPlayer.user.id));
        const myRank = this.getScoreAndRankAfterFiltered(ranks, "season");
        return {
          seasonId: seasonId,
          score: myRank.score,
          rank: myRank.rank,
        };
    }
  }

  private getScoreAndRankAfterFiltered(
    ranks: RankInterface[],
    type: string
  ): {
    rank: number;
    score: number;
  } {
    let myScore: number = null;
    let myRank: number = null;
    if (ranks.length == 1) {
      // Already ranked
      myScore = ranks[0].score;
      myRank = ranks[0].rank;
    } else if (ranks.length > 1) {
      throw HttpExceptionsUtil.createHttpException(
        `Multiple Ranks for player in a ${type}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        this.logger
      );
    }
    return {
      rank: myRank,
      score: myScore,
    };
  }
}
