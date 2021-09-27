import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GenericEntityService } from "../generic.entity.service";
import { GearMappingEntity } from "./gear-mapping.entity";

@Injectable()
export class GearMappingEntityService extends GenericEntityService<GearMappingEntity> {
  constructor(
    @InjectRepository(GearMappingEntity)
    private readonly gearMappingEntityRepository: Repository<GearMappingEntity>
  ) {
    super(gearMappingEntityRepository, new Logger(GearMappingEntityService.name), GearMappingEntity.name);
  }

  async findByAvatarIdAndGearId(avatarPoseId: string, gearId: string): Promise<GearMappingEntity | undefined> {
    return this.gearMappingEntityRepository
      .createQueryBuilder("gearMapping")
      .where("gearMapping.avatarPose=:avatarPoseId", { avatarPoseId: avatarPoseId })
      .andWhere("gearMapping.gear=:gearId", { gearId: gearId })
      .getOne();
  }
}
