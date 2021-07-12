import { Injectable, Logger } from "@nestjs/common";
import { GenericEntityService } from "../generic.entity.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MissionGroupEntity } from "./mission-group.entity";

@Injectable()
export class MissionGroupEntityService extends GenericEntityService<
  MissionGroupEntity
> {
  constructor(
    @InjectRepository(MissionGroupEntity)
    private readonly missionGroupEntityRepository: Repository<
      MissionGroupEntity
    >
  ) {
    super(
      missionGroupEntityRepository,
      new Logger(MissionGroupEntityService.name),
      MissionGroupEntity.name
    );
  }

  async fetchAllMissionsForPlayer(
    playerId: string
  ): Promise<MissionGroupEntity[]> {
    return this.missionGroupEntityRepository
      .createQueryBuilder("missionGroup")
      .leftJoinAndSelect(
        "missionGroup.missionGroupFlags",
        "missionGroupFlags",
        "missionGroupFlags.player = :playerId",
        { playerId: playerId }
      )
      .leftJoinAndSelect("missionGroup.missions", "missions")
      .leftJoinAndSelect(
        "missions.playerMissions",
        "playerMissions",
        "playerMissions.player = :playerId",
        { playerId: playerId }
      )
      .orderBy("missions.level", "ASC")
      .getMany();
  }
}
