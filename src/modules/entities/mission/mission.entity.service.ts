import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MissionEntity } from "./mission.entity";
import { GenericEntityService } from "../generic.entity.service";
import { CriteriaType } from "./criteria.type";

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
      .leftJoinAndSelect("mission.rewardGear", "rewardGear")
      .where("mission.id = :id", { id: id })
      .getOne();
  }

  async findByTag(tagId: string): Promise<MissionEntity[]> {
    return this.missionEntityRepository
      .createQueryBuilder("mission")
      .leftJoinAndSelect("mission.missionGroup", "missionGroup")
      .leftJoinAndSelect("mission.rewardGear", "rewardGear")
      .where("mission.criteriaRefId = :id", { id: tagId })
      .andWhere("mission.criteriaType = :criteriaType", {
        criteriaType: CriteriaType.TAG_COUNT,
      })
      .getMany();
  }

  async findGameScoreMissions(): Promise<MissionEntity[]> {
    return this.missionEntityRepository
      .createQueryBuilder("mission")
      .leftJoinAndSelect("mission.missionGroup", "missionGroup")
      .leftJoinAndSelect("mission.rewardGear", "rewardGear")
      .where("mission.criteriaType IN (:...criteriaTypes)", {
        criteriaTypes: [CriteriaType.GAME_SCORE, CriteriaType.GAME_SCORE_VENUE],
      })
      .getMany();
  }
}
