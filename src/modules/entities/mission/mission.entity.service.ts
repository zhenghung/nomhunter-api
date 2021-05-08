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

  async getByIdJoinAll(id: string): Promise<MissionEntity | undefined> {
    return this.missionEntityRepository
      .createQueryBuilder("mission")
      .leftJoinAndSelect("mission.requiredMission", "requiredMission")
      .leftJoinAndSelect("mission.tag", "tag")
      .leftJoinAndSelect("mission.rewardGear", "rewardGear")
      .where("mission.id = :id", { id: id })
      .getOne();
  }

  async findByTag(tagEntity: TagEntity): Promise<MissionEntity[]> {
    return this.missionEntityRepository
      .createQueryBuilder("mission")
      .leftJoinAndSelect("mission.requiredMission", "requiredMission")
      .leftJoinAndSelect("mission.tag", "tag")
      .leftJoinAndSelect("mission.rewardGear", "rewardGear")
      .where("mission.tag.id = :id", { id: tagEntity.id })
      .getMany();
  }
}
