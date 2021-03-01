import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameEntity } from "./game.entity";
import { RedisService } from "../../clients/redis/redis.service";

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameEntityRepository: Repository<GameEntity>,
    private readonly redisService: RedisService
  ) {}

  async findAll(conditions?: string): Promise<GameEntity[]> {
    this.logger.log("Fetching Games");
    const selectQueryBuilder = this.gameEntityRepository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.venue", "venue")
      .innerJoinAndSelect("game.user", "user");
    if (conditions) {
      return selectQueryBuilder.where(conditions).getMany();
    }
    return selectQueryBuilder.getMany();
  }

  /**
   * Find first matching game that user obtained the specified score in a venue
   * @param venueId
   * @param userId
   * @param score
   */
  async findMatchingGame(
    venueId: string,
    userId: string,
    score: number
  ): Promise<GameEntity> {
    this.logger.log("Finding Matching Game");
    return this.gameEntityRepository
      .findOneOrFail({
        where: { venue: { id: venueId }, user: { id: userId }, score: score },
        order: {
          createdAt: "ASC",
        },
      })
      .catch(() => {
        this.logger.log("No games found");
        return null;
      });
  }

  /**
   * Create new Game Entity
   * @param createGameDto
   */
  async create(createGameDto: CreateGameDto): Promise<GameEntity> {
    this.logger.log("Creating Game: " + createGameDto);
    const game = await this.gameEntityRepository.save(createGameDto);
    // Check and Update Leaderboard
    await this.updateLeaderboardCache(createGameDto);
    return game;
  }

  private async updateLeaderboardCache(
    createGameDto: CreateGameDto
  ): Promise<void> {
    const currentHighScore = await this.redisService.zScore(
      createGameDto.venue.id,
      createGameDto.user.id
    );
    if (!(currentHighScore && currentHighScore >= createGameDto.score)) {
      await this.redisService.zAdd(
        createGameDto.venue.id,
        createGameDto.user.id,
        createGameDto.score
      );
    }
  }
}
