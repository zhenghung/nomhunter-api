import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MissionEntity } from "./mission.entity";
import { GenericEntityService } from "../generic.entity.service";
import { TagEntity } from "../tag/tag.entity";

@Injectable()
export class MissionEntityService extends GenericEntityService<MissionEntity> {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionEntityRepository: Repository<MissionEntity>
  ) {
    super(
      missionEntityRepository,
      new Logger(MissionEntityService.name),
      MissionEntity.name
    );
  }

  async findByTag(tagEntity: TagEntity): Promise<MissionEntity[]> {
    return this.missionEntityRepository.find({ tag: tagEntity });
  }
}
