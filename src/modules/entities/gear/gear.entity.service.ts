import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GearEntity } from "./gear.entity";
import { CreateGearDto } from "./dto/create-gear.dto";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@Injectable()
export class GearEntityService {
  private readonly logger = new Logger(GearEntityService.name);

  constructor(
    @InjectRepository(GearEntity)
    private readonly gearEntityRepository: Repository<GearEntity>
  ) {}

  create(createGearDto: CreateGearDto): Promise<GearEntity> {
    return this.gearEntityRepository.save(createGearDto);
  }

  getById(id: string): Promise<GearEntity> {
    return this.gearEntityRepository
      .findOneOrFail(id)
      .catch(
        HttpExceptionsUtil.genericFindByUUIDErrorHandler(
          "GearEntity",
          id,
          this.logger
        )
      );
  }

  /**
   * Find all GearEntities
   * @param withFile inner join with file entity
   */
  findAll(withFile?: boolean): Promise<GearEntity[]> {
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
