import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GameEntity } from "./game.entity";
import { GamesService } from "./games.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UsersService } from "../users/users.service";
import { VenuesService } from "../venues/venues.service";
import { CreateGameReq } from "./req/create-game.req";

@ApiTags("Games")
@Controller("games")
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
    private readonly venuesService: VenuesService
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
