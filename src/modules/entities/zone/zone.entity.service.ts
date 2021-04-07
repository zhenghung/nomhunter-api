import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { FindConditions } from "typeorm/find-options/FindConditions";
import { ZoneEntity } from "./zone.entity";
import { CreateZoneDto } from "./dto/create-zone.dto";

@Injectable()
export class ZoneEntityService {
  private readonly logger = new Logger(ZoneEntityService.name);

  constructor(
    @InjectRepository(ZoneEntity)
    private readonly zoneEntityRepository: Repository<ZoneEntity>
  ) {}

  async findAll(
    conditions?: FindConditions<ZoneEntity>
  ): Promise<ZoneEntity[]> {
    if (conditions) {
      return this.zoneEntityRepository.find(conditions);
    }
    return this.zoneEntityRepository.find();
  }

  async getById(id: string): Promise<ZoneEntity> {
    return await this.zoneEntityRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "ZoneEntity",
          id,
          this.logger
        )
      );
  }

  async getByIdJoinVenues(id: string): Promise<ZoneEntity> {
    return this.zoneEntityRepository
      .createQueryBuilder("zone")
      .innerJoinAndSelect("zone.venues", "venues")
      .where("zone.id = :id", { id: id })
      .getOneOrFail()
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "ZoneEntity",
          id,
          this.logger
        )
      );
  }

  async create(createZoneDto: CreateZoneDto): Promise<ZoneEntity> {
    return await this.zoneEntityRepository.save(createZoneDto);
  }
}
