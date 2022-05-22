import { Injectable, Logger } from "@nestjs/common";
import { GameEntityService } from "../../entities/game/game.entity.service";
import { PlayerBadgeEntityService } from "../../entities/playerBadge/player-badge.entity.service";
import { VenueEntityService } from "../../entities/venue/venue.entity.service";
import { CreateGameReq } from "./req/create-game.req";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { GameEntity } from "../../entities/game/game.entity";
import { GameCreatedEvent } from "../../common/events/game-created.event";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PlayerWalletEntityService } from "../../entities/playerWallet/player-wallet.entity.service";

@Injectable()
export class GameService {
  public static readonly SCORE_THRESHOLD_FOR_BADGE: number = 40;
  private logger: Logger = new Logger(GameService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly gameEntityService: GameEntityService,
    private readonly playerEntityService: PlayerEntityService,
    private readonly playerBadgeEntityService: PlayerBadgeEntityService,
    private readonly playerWalletEntityService: PlayerWalletEntityService,
    private readonly venueEntityService: VenueEntityService
  ) {}

  async create(playerId: string, createGameReq: CreateGameReq): Promise<GameEntity> {
    const playerEntity = await this.playerEntityService.getById(playerId);
    const venueEntity = await this.venueEntityService.getByIdJoinAll(createGameReq.venueId);

    // Create Game Entity
    this.logger.log(`Creating Game with req ${createGameReq}`);
    const gameEntity = await this.gameEntityService.create({
      player: playerEntity,
      venue: venueEntity,
      score: createGameReq.score,
    });

    const gameCreatedEvent: GameCreatedEvent = { game: gameEntity };
    this.eventEmitter.emit(GameCreatedEvent.EVENT, gameCreatedEvent);

    // Award badge on condition
    if (createGameReq.score >= GameService.SCORE_THRESHOLD_FOR_BADGE) {
      this.logger.log(`Creating PlayerBadge for game ${createGameReq}`);
      await this.playerBadgeEntityService.create({
        badge: venueEntity.badge,
        game: gameEntity,
        player: playerEntity,
      });
      await this.playerWalletEntityService.addCoin(playerId, createGameReq.score * 30);
    }
    return gameEntity;
  }
}
