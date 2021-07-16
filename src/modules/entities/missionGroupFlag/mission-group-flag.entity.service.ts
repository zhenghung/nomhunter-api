import { Injectable, Logger } from "@nestjs/common";
import { GenericEntityService } from "../generic.entity.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MissionGroupFlagEntity } from "./mission-group-flag.entity";
import { PlayerEntity } from "../player/player.entity";
import { MissionGroupEntity } from "../missionGroup/mission-group.entity";

@Injectable()
export class MissionGroupFlagEntityService extends GenericEntityService<
  MissionGroupFlagEntity
> {
  constructor(
    @InjectRepository(MissionGroupFlagEntity)
    private readonly missionGroupFlagEntityRepository: Repository<
      MissionGroupFlagEntity
    >
  ) {
    super(
      missionGroupFlagEntityRepository,
      new Logger(MissionGroupFlagEntityService.name),
      MissionGroupFlagEntity.name
    );
  }

  async delete(
    playerEntity: PlayerEntity,
    missionGroupEntity: MissionGroupEntity
  ): Promise<void> {
    await this.missionGroupFlagEntityRepository.delete({
      player: playerEntity,
      missionGroup: missionGroupEntity,
    });
  }
}
