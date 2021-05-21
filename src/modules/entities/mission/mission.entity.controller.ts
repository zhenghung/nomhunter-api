import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MissionEntityService } from "./mission.entity.service";
import { MissionEntity } from "./mission.entity";
import { CreateMissionReq } from "./req/create-mission.req";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { GearEntityService } from "../gear/gear.entity.service";
import { TagEntityService } from "../tag/tag.entity.service";

@ApiTags("MissionEntity")
@Controller("entities/mission")
export class MissionEntityController {
  private readonly logger = new Logger(MissionEntityController.name);

  constructor(
    private readonly missionEntityService: MissionEntityService,
    private readonly tagEntityService: TagEntityService,
    private readonly gearEntityService: GearEntityService
  ) {}

  @Post()
  async create(
    @Body() createMissionReq: CreateMissionReq
  ): Promise<MissionEntity> {
    const rewardGearEntity = await this.gearEntityService.getByIdNullable(
      createMissionReq.rewardGearId
    );
    const tagEntity = await this.tagEntityService.getById(
      createMissionReq.tagId
    );
    const requiredMissionEntity = await this.missionEntityService.getByIdNullable(
      createMissionReq.requiredMissionId
    );

    // Construct DTO
    const createMissionDto: CreateMissionDto = {
      name: createMissionReq.name,
      description: createMissionReq.description,
      type: createMissionReq.type,
      tag: tagEntity,
      maxProgress: createMissionReq.maxProgress,
      rewardCoin: createMissionReq.rewardCoin,
      rewardExp: createMissionReq.rewardExp,
      rewardGear: rewardGearEntity,
      requiredMission: requiredMissionEntity,
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
