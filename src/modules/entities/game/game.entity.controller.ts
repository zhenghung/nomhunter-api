import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GameEntity } from "./game.entity";
import { GameEntityService } from "./game.entity.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UserEntityService } from "../user/user.entity.service";
import { VenueEntityService } from "../venue/venue.entity.service";
import { CreateGameReq } from "./req/create-game.req";

@ApiTags("GameEntity")
@Controller("entities/game")
export class GameEntityController {
  private readonly logger = new Logger(GameEntityController.name);

  constructor(
    private readonly gamesService: GameEntityService,
    private readonly usersService: UserEntityService,
    private readonly venuesService: VenueEntityService
  ) {}

  @Post()
  async create(@Body() createGameReq: CreateGameReq): Promise<GameEntity> {
    const createGameDto: CreateGameDto = {
      user: await this.usersService.getById(createGameReq.userId),
      venue: await this.venuesService.getById(createGameReq.venueId),
      score: createGameReq.score,
    };
    return this.gamesService.create(createGameDto).then((game) => {
      this.logger.log("Game successfully created " + game);
      return game;
    });
  }

  @Get()
  findAll(): Promise<GameEntity[]> {
    return this.gamesService.findAll();
  }
}
