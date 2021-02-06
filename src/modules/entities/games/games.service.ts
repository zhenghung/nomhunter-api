import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameDto } from "./dto/create-game.dto";
import { GameEntity } from "./game.entity";

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(GameEntity)
    private readonly gameEntityRepository: Repository<GameEntity>
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

  async create(createGameDto: CreateGameDto): Promise<GameEntity> {
    this.logger.log("Creating Game: " + createGameDto);
    return await this.gameEntityRepository.save(createGameDto);
  }
}
