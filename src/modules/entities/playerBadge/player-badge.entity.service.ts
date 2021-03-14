import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerBadgeEntity } from "./player-badge.entity";
import { CreatePlayerBadgeDto } from "./dto/create-player-badge.dto";

@Injectable()
export class PlayerBadgeEntityService {
  private readonly logger = new Logger(PlayerBadgeEntityService.name);

  constructor(
    @InjectRepository(PlayerBadgeEntity)
    private readonly playerBadgeEntityRepository: Repository<PlayerBadgeEntity>
  ) {}

  /**
   * Create player badge entity
   * @param createPlayerBadgesDto
   */
  create(
    createPlayerBadgesDto: CreatePlayerBadgeDto
  ): Promise<PlayerBadgeEntity> {
    return this.playerBadgeEntityRepository.save(createPlayerBadgesDto);
  }

  /**
   * Find entities inner join with badge, file, game, venue, zone
   * Sorted by date (latest first)
   * @param playerId
   */
  findByPlayerId(playerId: string): Promise<PlayerBadgeEntity[]> {
    return this.playerBadgeEntityRepository
      .createQueryBuilder("playerBadge")
      .innerJoinAndSelect("playerBadge.badge", "badge")
      .innerJoinAndSelect("badge.file", "file")
      .innerJoinAndSelect("playerBadge.game", "game")
      .innerJoinAndSelect("game.venue", "venue")
      .innerJoinAndSelect("venue.zone", "zone")
      .where("playerBadge.player.id = :id", { id: playerId })
      .orderBy("playerBadge.createdAt", "DESC")
      .getMany();
  }
}
