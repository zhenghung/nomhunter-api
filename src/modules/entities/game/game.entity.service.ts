import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameEntity } from "./game.entity";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class GameEntityService extends GenericEntityService<GameEntity> {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameEntityRepository: Repository<GameEntity>
  ) {
    super(
      gameEntityRepository,
      new Logger(GameEntityService.name),
      GameEntity.name
    );
  }

  async findAll(conditions?: string): Promise<GameEntity[]> {
    this.logger.log("Fetching Games");
    const selectQueryBuilder = this.gameEntityRepository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.venue", "venue")
      .innerJoinAndSelect("venue.badge", "badge")
      .innerJoinAndSelect("game.player", "player");
    if (conditions) {
      return selectQueryBuilder.where(conditions).getMany();
    }
    return selectQueryBuilder.getMany();
  }

  /**
   * Find first matching game that player obtained the specified score in a venue
   * @param venueId
   * @param playerId
   * @param score
   */
  async findMatchingGame(
    venueId: string,
    playerId: string,
    score: number
  ): Promise<GameEntity> {
    this.logger.log("Finding Matching Game");
    return this.gameEntityRepository
      .findOneOrFail({
        where: {
          venue: { id: venueId },
          player: { id: playerId },
          score: score,
        },
        order: {
          createdAt: "ASC",
        },
      })
      .catch(() => {
        this.logger.log("No game found");
        return null;
      });
  }

  /**
   * Create new Game Entity
   * @param createGameDto
   */
  async create(createGameDto: CreateGameDto): Promise<GameEntity> {
    this.logger.log("Creating Game: " + createGameDto);
    return await this.gameEntityRepository.save(createGameDto);
  }
}
