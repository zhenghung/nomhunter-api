import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { FindConditions } from "typeorm/find-options/FindConditions";
import { ZoneEntity } from "./zone.entity";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class ZoneEntityService extends GenericEntityService<ZoneEntity> {
  constructor(
    @InjectRepository(ZoneEntity)
    private readonly zoneEntityRepository: Repository<ZoneEntity>
  ) {
    super(zoneEntityRepository, new Logger(ZoneEntityService.name), ZoneEntity.name);
  }

  async findAll(conditions?: FindConditions<ZoneEntity>): Promise<ZoneEntity[]> {
    if (conditions) {
      return this.zoneEntityRepository.find(conditions);
    }
    return this.zoneEntityRepository.find();
  }

  async getByIdJoinVenues(id: string): Promise<ZoneEntity> {
    return this.zoneEntityRepository
      .createQueryBuilder("zone")
      .innerJoinAndSelect("zone.venues", "venues")
      .where("zone.id = :id", { id: id })
      .getOneOrFail()
      .catch(HttpExceptionsUtil.genericFindByUUIDErrorHandler("ZoneEntity", id, this.logger));
  }
}
