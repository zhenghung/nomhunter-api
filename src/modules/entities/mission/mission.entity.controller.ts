import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MissionEntityService } from "./mission.entity.service";
import { MissionEntity } from "./mission.entity";
import { CreateMissionReq } from "./req/create-mission.req";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { GearEntityService } from "../gear/gear.entity.service";
import { MissionGroupEntityService } from "../missionGroup/mission-group.entity.service";

@ApiTags("MissionEntity")
@Controller("entities/mission")
export class MissionEntityController {
  private readonly logger = new Logger(MissionEntityController.name);

  constructor(
    private readonly missionEntityService: MissionEntityService,
    private readonly missionGroupEntityService: MissionGroupEntityService,
    private readonly gearEntityService: GearEntityService
  ) {}

  @Post()
  async create(
    @Body() createMissionReq: CreateMissionReq
  ): Promise<MissionEntity> {
    const rewardGearEntity = await this.gearEntityService.getByIdNullable(
      createMissionReq.rewardGearId
    );
    const missionGroupEntity = await this.missionGroupEntityService.getById(
      createMissionReq.missionGroupId
    );

    // Construct DTO
    const createMissionDto: CreateMissionDto = {
      name: createMissionReq.name,
      description: createMissionReq.description,
      maxProgress: createMissionReq.maxProgress,
      level: createMissionReq.level,
      missionGroup: missionGroupEntity,
      criteriaType: createMissionReq.criteriaType,
      criteriaValue: createMissionReq.criteriaValue,
      criteriaRefId: createMissionReq.criteriaRefId,
      rewardCoin: createMissionReq.rewardCoin,
      rewardExp: createMissionReq.rewardExp,
      rewardGear: rewardGearEntity,
    };
    this.logger.log(`Creating mission with name: ${createMissionDto.name}`);

    return this.missionEntityService
      .create(createMissionDto)
      .then((missionEntity: MissionEntity) => {
        this.logger.log(
          `Mission with id ${missionEntity.id} successfully created`
        );
        return missionEntity;
      });
  }

  @Get()
  findAll(): Promise<MissionEntity[]> {
    this.logger.log("Fetching all mission entities");
    return this.missionEntityService.findAll();
  }
}
