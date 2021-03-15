import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadgeEntity } from "./badge.entity";
import { CreateBadgeDto } from "./dto/create-badge.dto";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class BadgeEntityService {
  private readonly logger = new Logger(BadgeEntityService.name);

  constructor(
    @InjectRepository(BadgeEntity)
    private readonly badgeEntityRepository: Repository<BadgeEntity>
  ) {}

  create(createBadgeDto: CreateBadgeDto): Promise<BadgeEntity> {
    return this.badgeEntityRepository.save(createBadgeDto);
  }

  getById(id: string): Promise<BadgeEntity> {
    return this.badgeEntityRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "BadgeEntity",
          id,
          this.logger
        )
      );
  }

  /**
   * Find all BadgeEntities
   * @param withFile inner join with file entity
   */
  findAll(withFile?: boolean): Promise<BadgeEntity[]> {
    if (withFile) {
      return this.badgeEntityRepository
        .createQueryBuilder("badge")
        .innerJoinAndSelect("badge.file", "file")
        .orderBy("badge.name", "ASC")
        .getMany();
    }
    return this.badgeEntityRepository.find();
  }

  findByJoinPlayerBadges(playerId: string): Promise<BadgeEntity[]> {
    return this.badgeEntityRepository
      .createQueryBuilder("badge")
      .innerJoinAndSelect("badge.file", "file")
      .innerJoinAndSelect("badge.playerBadges", "playerBadges")
      .innerJoinAndSelect("playerBadges.game", "game")
      .innerJoinAndSelect("game.venue", "venue")
      .innerJoinAndSelect("venue.zone", "zone")
      .where("playerBadges.player.id = :id", { id: playerId })
      .orderBy("badge.name", "ASC")
      .getMany();
  }
}
