import { Controller, Get, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GameEntity } from "./game.entity";
import { GameEntityService } from "./game.entity.service";

@ApiTags("GameEntity")
@Controller("entities/game")
export class GameEntityController {
  private readonly logger = new Logger(GameEntityController.name);

  constructor(private readonly gameEntityService: GameEntityService) {}

  @Get()
  findAll(): Promise<GameEntity[]> {
    this.logger.log("Fetching all game entities");
    return this.gameEntityService.findAll();
  }
}
