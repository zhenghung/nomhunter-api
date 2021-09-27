import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GameService } from "./game.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { CreateGameReq } from "./req/create-game.req";
import { GameEntity } from "../../entities/game/game.entity";

@ApiTags("Game")
@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create game for player" })
  @ApiCreatedResponse({ description: "Game created successfully for player" })
  @Post("play")
  @UseGuards(JwtAuthGuard)
  async createGame(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Body() createGameReq: CreateGameReq
  ): Promise<GameEntity> {
    return this.gameService.create(requestWithPlayer.user.id, createGameReq);
  }
}
