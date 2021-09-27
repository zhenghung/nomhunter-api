import { Injectable, Logger } from "@nestjs/common";
import { GameEntityService } from "../../entities/game/game.entity.service";
import { RedisService } from "../../clients/redis/redis.service";
import { GameEntity } from "../../entities/game/game.entity";
import { ZoneEntityService } from "../../entities/zone/zone.entity.service";
import { RankInterface } from "./interface/rank.interface";
import { LeaderboardType } from "./leaderboard.type";
import { VenueEntityService } from "../../entities/venue/venue.entity.service";

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    private readonly gameEntityService: GameEntityService,
    private readonly venueEntityService: VenueEntityService,
    private readonly zoneEntityService: ZoneEntityService,
    private readonly redisService: RedisService
  ) {}

  /**
   * Fetch leaderboard
   */
  async getLeaderboard(type: LeaderboardType, id: string): Promise<RankInterface[]> {
    // Checking if id is valid for type
    await this.validateId(type, id);

    // Fetch Leaderboard from Redis Cache if exists
    this.logger.debug(`Try fetching ${type} leaderboard from cache`);
    let result = await this.redisService.zRevRangeWithScores(id);
    if (result.length == 0) {
      switch (type) {
        case LeaderboardType.VENUE:
          this.logger.log(`Rebuilding leaderboard of venue ${id}`);
          await this.refreshVenueLeaderboard(id);
          break;
        case LeaderboardType.ZONE:
          this.logger.log(`Building leaderboard of zone ${id}`);
          await this.refreshZoneLeaderboard(id);
          break;
        default:
          this.logger.log(`Building leaderboard of season ${id}`);
          await this.refreshSeasonLeaderboard(id);
          break;
      }
      result = await this.redisService.zRevRangeWithScores(id);
    }
    const array: RankInterface[] = [];
    for (let i = 0; i < result.length; i += 2) {
      array.push({
        rank: i / 2 + 1,
        playerId: result[i],
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
    const games: GameEntity[] = await this.gameEntityService.findAll(`venue.id = '${venueId}'`);
    // Get Highest Score for each player
    const mapBoard = new Map<string, number>();
    for (const game of games) {
      if (mapBoard.has(game.player.id)) {
        mapBoard.set(game.player.id, Math.max(mapBoard.get(game.player.id), game.score));
      } else {
        mapBoard.set(game.player.id, game.score);
      }
    }
    // Add score to redis
    await this.redisService.delete(venueId);
    for (const [playerId, score] of mapBoard) {
      await this.redisService.zAdd(venueId, playerId, score);
    }
  }

  /**
   * Refresh zone leaderboard
   */
  async refreshZoneLeaderboard(zoneId: string): Promise<void> {
    this.logger.log(`Refreshing leaderboard of zone ${zoneId}`);
    const venueIds: string[] = await this.zoneEntityService
      .getByIdJoinVenues(zoneId)
      .then((zone) => zone.venues.map((venue) => venue.id));
    // Get Accumulated Score for each player
    const mapBoard = await this.accumulateVenueScores(venueIds);
    // Add score to redis
    await this.redisService.delete(zoneId);
    for (const [playerId, score] of mapBoard) {
      await this.redisService.zAdd(zoneId, playerId, score);
    }
  }

  /**
   * Refresh Season leaderboard
   * @param seasonId
   */
  async refreshSeasonLeaderboard(seasonId: string): Promise<void> {
    this.logger.log("Refreshing leaderboard of season");
    // TODO: Only for this season (currently all)
    const venueIds: string[] = await this.venueEntityService
      .findAll()
      .then((venues) => venues.map((venue) => venue.id));
    // Get Accumulated Score for each player
    const mapBoard = await this.accumulateVenueScores(venueIds);
    // Add score to redis
    await this.redisService.delete(seasonId);
    for (const [playerId, score] of mapBoard) {
      await this.redisService.zAdd(seasonId, playerId, score);
    }
  }

  private async accumulateVenueScores(venueIds: string[]): Promise<Map<string, number>> {
    const mapBoard = new Map<string, number>();
    for (const venueId of venueIds) {
      await this.getLeaderboard(LeaderboardType.VENUE, venueId).then((ranks) => {
        for (const rank of ranks) {
          if (mapBoard.has(rank.playerId)) {
            mapBoard.set(rank.playerId, mapBoard.get(rank.playerId) + rank.score);
          } else {
            mapBoard.set(rank.playerId, rank.score);
          }
        }
      });
    }
    return mapBoard;
  }

  private async validateId(type: LeaderboardType, id: string): Promise<void> {
    switch (type) {
      case LeaderboardType.VENUE:
        await this.venueEntityService.getById(id);
        break;
      case LeaderboardType.ZONE:
        await this.zoneEntityService.getById(id);
        break;
      case LeaderboardType.SEASON:
        break;
      default:
        throw new Error(`Invalid Type: ${type}`);
    }
  }
}
