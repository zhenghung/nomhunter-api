import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerBadgeEntity } from "./player-badge.entity";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class PlayerBadgeEntityService extends GenericEntityService<
  PlayerBadgeEntity
> {
  constructor(
    @InjectRepository(PlayerBadgeEntity)
    private readonly playerBadgeEntityRepository: Repository<PlayerBadgeEntity>
  ) {
    super(
      playerBadgeEntityRepository,
      new Logger(PlayerBadgeEntityService.name),
      PlayerBadgeEntity.name
    );
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
