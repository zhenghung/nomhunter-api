import { Injectable, Logger } from "@nestjs/common";
import { GamesService } from "../../entities/games/games.service";
import { RedisService } from "../../clients/redis/redis.service";
import { GameEntity } from "../../entities/games/game.entity";
import { ZonesService } from "../../entities/zones/zones.service";
import { RankInterface } from "./interface/rank.interface";

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    private readonly gamesService: GamesService,
    private readonly zonesService: ZonesService,
    private readonly redisService: RedisService
  ) {}

  /**
   * Fetch leaderboard
   */
  async getLeaderboard(id: string): Promise<RankInterface[]> {
    this.logger.log(`Getting leaderboard of venue/zone/season ${id}`);
    const result: string[] = await this.redisService.zRevRangeWithScores(id);
    const array: RankInterface[] = [];
    for (let i = 0; i < result.length; i += 2) {
      array.push({
        userId: result[i],
        score: parseInt(result[i + 1]),
      });
    }
    return array;
  }

  /**
   * Refresh zone leaderboard
   */
  async refreshZoneLeaderboard(zoneId: string): Promise<void> {
    this.logger.log(`Refreshing leaderboard of zone ${zoneId}`);
    const venueIds: string[] = await this.zonesService
      .getByIdJoinVenues(zoneId)
      .then((zones) => zones[0].venues.map((venue) => venue.id));
    // Get Highest Score for each user
    const mapBoard = new Map<string, number>();
    for (const venueId of venueIds) {
      await this.getLeaderboard(venueId).then((ranks) => {
        for (const rank of ranks) {
          if (mapBoard.has(rank.userId)) {
            mapBoard.set(
              rank.userId,
              Math.max(mapBoard.get(rank.userId), rank.score)
            );
          } else {
            mapBoard.set(rank.userId, rank.score);
          }
        }
      });
    }
    // Add score to redis
    await this.redisService.delete(zoneId);
    for (const [userId, score] of mapBoard) {
      await this.redisService.zAdd(zoneId, userId, score);
    }
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
}
