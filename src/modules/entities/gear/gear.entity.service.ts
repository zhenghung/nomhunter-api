import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GearEntity } from "./gear.entity";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class GearEntityService extends GenericEntityService<GearEntity> {
  constructor(
    @InjectRepository(GearEntity)
    private readonly gearEntityRepository: Repository<GearEntity>
  ) {
    super(
      gearEntityRepository,
      new Logger(GearEntityService.name),
      GearEntity.name
    );
  }

  /**
   * Find all GearEntities
   * @param withFile inner join with file entity
   */
  async findAll(withFile?: boolean): Promise<GearEntity[]> {
    if (withFile) {
      return this.gearEntityRepository
        .createQueryBuilder("gear")
        .innerJoinAndSelect("gear.file", "file")
        .orderBy("gear.name", "ASC")
        .getMany();
    }
    return this.gearEntityRepository.find();
  }
}
