import { Injectable, Logger } from "@nestjs/common";
import { GameEntityService } from "../../entities/game/game.entity.service";
import { RedisService } from "../../clients/redis/redis.service";
import { GameEntity } from "../../entities/game/game.entity";
import { ZoneEntityService } from "../../entities/zone/zone.entity.service";
import { RankInterface } from "./interface/rank.interface";
import { LeaderboardType } from "../../common/constants/leaderboard.type";
import { VenueEntityService } from "../../entities/venue/venue.entity.service";

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    private readonly gamesService: GameEntityService,
    private readonly venuesService: VenueEntityService,
    private readonly zonesService: ZoneEntityService,
    private readonly redisService: RedisService
  ) {}

  /**
   * Fetch leaderboard
   */
  async getLeaderboard(
    type: LeaderboardType,
    id: string
  ): Promise<RankInterface[]> {
    // Refresh Leaderboard
    let result: string[];
    if (type == LeaderboardType.VENUE) {
      this.logger.log("Try fetching venue leaderboard from cache");
      result = await this.redisService.zRevRangeWithScores(id);
      if (result.length == 0) {
        this.logger.log(`Rebuilding leaderboard of venue ${id}`);
        await this.refreshVenueLeaderboard(id);
      }
    } else {
      // Build Leaderboard of Zone or Season from Venue leaderboard
      switch (type) {
        case LeaderboardType.ZONE:
          this.logger.log(`Building leaderboard of zone ${id}`);
          await this.refreshZoneLeaderboard(id);
          break;
        default:
          this.logger.log(`Building leaderboard of season ${id}`);
          await this.refreshSeasonLeaderboard(id);
          break;
      }
    }
    result = await this.redisService.zRevRangeWithScores(id);
    const array: RankInterface[] = [];
    for (let i = 0; i < result.length; i += 2) {
      array.push({
        rank: i / 2 + 1,
        userId: result[i],
        score: parseInt(result[i + 1]),
      });
    }
    return array;
  }

  /**
   * Refresh venue leaderboard
   */
  async refreshVenueLeaderboard(venueId: string): Promise<void> {
    this.logger.log(`Refreshing leaderboard of venue ${venueId}`);
    const games: GameEntity[] = await this.gamesService.findAll(
      `venue.id = '${venueId}'`
    );
    // Get Highest Score for each user
    const mapBoard = new Map<string, number>();
    for (const game of games) {
      if (mapBoard.has(game.user.id)) {
        mapBoard.set(
          game.user.id,
          Math.max(mapBoard.get(game.user.id), game.score)
        );
      } else {
        mapBoard.set(game.user.id, game.score);
      }
    }
    // Add score to redis
    await this.redisService.delete(venueId);
    for (const [userId, score] of mapBoard) {
      await this.redisService.zAdd(venueId, userId, score);
    }
  }

  /**
   * Refresh zone leaderboard
   */
  async refreshZoneLeaderboard(zoneId: string): Promise<void> {
    this.logger.log(`Refreshing leaderboard of zone ${zoneId}`);
    const venueIds: string[] = await this.zonesService
      .getByIdJoinVenues(zoneId)
      .then((zones) => zones[0].venues.map((venue) => venue.id));
    // Get Accumulated Score for each user
    const mapBoard = await this.accumulateVenueScores(venueIds);
    // Add score to redis
    await this.redisService.delete(zoneId);
    for (const [userId, score] of mapBoard) {
      await this.redisService.zAdd(zoneId, userId, score);
    }
  }

  /**
   * Refresh Season leaderboard
   * @param seasonId
   */
  async refreshSeasonLeaderboard(seasonId: string): Promise<void> {
    this.logger.log("Refreshing leaderboard of season");
    // TODO: Only for this season (currently all)
    const venueIds: string[] = await this.venuesService
      .findAll()
      .then((venues) => venues.map((venue) => venue.id));
    // Get Accumulated Score for each user
    const mapBoard = await this.accumulateVenueScores(venueIds);
    // Add score to redis
    await this.redisService.delete(seasonId);
    for (const [userId, score] of mapBoard) {
      await this.redisService.zAdd(seasonId, userId, score);
    }
  }

  private async accumulateVenueScores(
    venueIds: string[]
  ): Promise<Map<string, number>> {
    const mapBoard = new Map<string, number>();
    for (const venueId of venueIds) {
      await this.getLeaderboard(LeaderboardType.VENUE, venueId).then(
        (ranks) => {
          for (const rank of ranks) {
            if (mapBoard.has(rank.userId)) {
              mapBoard.set(rank.userId, mapBoard.get(rank.userId) + rank.score);
            } else {
              mapBoard.set(rank.userId, rank.score);
            }
          }
        }
      );
    }
    return mapBoard;
  }
}
