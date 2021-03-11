import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PlayerBadgeEntityService } from "./player-badge.entity.service";
import { PlayerEntityService } from "../player/player.entity.service";
import { GameEntityService } from "../game/game.entity.service";
import { PlayerBadgeEntity } from "./player-badge.entity";
import { CreatePlayerBadgeReq } from "./req/create-player-badge.req";
import { CreatePlayerBadgeDto } from "./dto/create-player-badge.dto";
import { BadgeEntityService } from "../badge/badge.entity.service";

@ApiTags("PlayerBadgeEntity")
@Controller("entities/playerBadge")
export class PlayerBadgeEntityController {
  private readonly logger = new Logger(PlayerBadgeEntityController.name);

  constructor(
    private readonly playerBadgesService: PlayerBadgeEntityService,
    private readonly badgesService: BadgeEntityService,
    private readonly playersService: PlayerEntityService,
    private readonly gamesService: GameEntityService
  ) {}

  @Post()
  async create(
    @Body() createPlayerBadgeReq: CreatePlayerBadgeReq
  ): Promise<PlayerBadgeEntity> {
    this.logger.log("Creating playerBadge entity: ${createPlayerBadgeReq}");
    const player = await this.playersService.getById(
      createPlayerBadgeReq.playerId
    );
    const badge = await this.badgesService.getById(
      createPlayerBadgeReq.badgeId
    );
    const game = await this.gamesService.getById(createPlayerBadgeReq.gameId);

    const createPlayerBadgeDto: CreatePlayerBadgeDto = {
      player,
      badge,
      game,
    };
    return this.playerBadgesService
      .create(createPlayerBadgeDto)
      .then((playerBadgeEntity: PlayerBadgeEntity) => {
        this.logger.log(
          `PlayerBadge with id ${playerBadgeEntity.id} successfully created`
        );
        return playerBadgeEntity;
      });
  }
}
