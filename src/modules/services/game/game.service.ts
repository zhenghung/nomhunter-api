import { Injectable, Logger } from "@nestjs/common";
import { GameEntityService } from "../../entities/game/game.entity.service";
import { PlayerBadgeEntityService } from "../../entities/playerBadge/player-badge.entity.service";
import { VenueEntityService } from "../../entities/venue/venue.entity.service";
import { CreateGameReq } from "./req/create-game.req";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { GameEntity } from "../../entities/game/game.entity";

@Injectable()
export class GameService {
  private logger: Logger = new Logger(GameService.name);

  constructor(
    private readonly gameEntityService: GameEntityService,
    private readonly playerEntityService: PlayerEntityService,
    private readonly playerBadgeEntityService: PlayerBadgeEntityService,
    private readonly venueEntityService: VenueEntityService
  ) {}

  async create(
    playerId: string,
    createGameReq: CreateGameReq
  ): Promise<GameEntity> {
    const playerEntity = await this.playerEntityService.getById(playerId);
    const venueEntity = await this.venueEntityService.getByIdJoinBadge(
      createGameReq.venueId
    );

    // Create Game Entity
    this.logger.log(`Creating Game with req ${createGameReq}`);
    const gameEntity = await this.gameEntityService.create({
      player: playerEntity,
      venue: venueEntity,
      score: createGameReq.score,
    });

    // Award badge on condition
    if (createGameReq.score >= 40) {
      this.logger.log(`Creating PlayerBadge for game ${createGameReq}`);
      await this.playerBadgeEntityService.create({
        badge: venueEntity.badge,
        game: gameEntity,
        player: playerEntity,
      });
    }
    return gameEntity;
  }
}
