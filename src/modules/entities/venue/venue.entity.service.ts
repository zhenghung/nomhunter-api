import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { VenueEntity } from "./venue.entity";
import { FindConditions } from "typeorm/find-options/FindConditions";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class VenueEntityService extends GenericEntityService<VenueEntity> {
  constructor(
    @InjectRepository(VenueEntity)
    private readonly venueEntityRepository: Repository<VenueEntity>
  ) {
    super(
      venueEntityRepository,
      new Logger(VenueEntityService.name),
      VenueEntity.name
    );
  }

  async findAll(
    conditions?: FindConditions<VenueEntity>
  ): Promise<VenueEntity[]> {
    if (conditions) {
      return this.venueEntityRepository.find(conditions);
    }
    return this.venueEntityRepository.find();
  }

  async findJoin(property: string): Promise<VenueEntity[]> {
    return this.queryJoin(property).getMany();
  }

  async findJoinZoneAndBadge(): Promise<VenueEntity[]> {
    return this.queryJoin("zone")
      .innerJoinAndSelect("venue.badge", "badge")
      .getMany();
  }

  private queryJoin(property: string): SelectQueryBuilder<VenueEntity> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .innerJoinAndSelect(`venue.${property}`, property);
  }

  async getByIdJoinAll(id: string): Promise<VenueEntity> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .innerJoinAndSelect("venue.badge", "badge")
      .innerJoinAndSelect("venue.zone", "zone")
      .where("venue.id = :id", { id: id })
      .getOneOrFail()
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "VenueEntity",
          id,
          this.logger
        )
      );
  }

  async getByIdJoinZone(id: string): Promise<VenueEntity> {
    return this.getByIdJoinWith(id, "zone");
  }

  async getByIdJoinBadge(id: string): Promise<VenueEntity> {
    return this.getByIdJoinWith(id, "badge");
  }

  async getByIdJoinWith(id: string, property: string): Promise<VenueEntity> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .innerJoinAndSelect(`venue.${property}`, property)
      .where("venue.id = :id", { id: id })
      .getOneOrFail()
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "VenueEntity",
          id,
          this.logger
        )
      );
  }

  async getForPlayerBadges(playerId: string): Promise<VenueEntity[]> {
    return this.venueEntityRepository
      .createQueryBuilder("venue")
      .leftJoinAndSelect("venue.badge", "badge")
      .leftJoinAndSelect("badge.file", "file")
      .leftJoinAndSelect("venue.zone", "zone")
      .leftJoinAndSelect("venue.games", "game")
      .leftJoinAndSelect("game.playerBadge", "playerBadge")
      .leftJoinAndSelect("playerBadge.player", "player")
      .where("player.id = :id", { id: playerId })
      .getMany();
  }
}
