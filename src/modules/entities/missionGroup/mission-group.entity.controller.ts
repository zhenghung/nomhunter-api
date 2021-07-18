import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { MissionGroupEntityService } from "./mission-group.entity.service";
import { MissionGroupEntity } from "./mission-group.entity";
import { CreateMissionGroupReq } from "./req/create-mission-group.req";
import { CreateMissionGroupDto } from "./dto/create-mission-group.dto";

@ApiTags("MissionGroupEntity")
@Controller("entities/missionGroup")
export class MissionGroupEntityController {
  private readonly logger = new Logger(MissionGroupEntityController.name);

  constructor(
    private readonly missionGroupEntityService: MissionGroupEntityService
  ) {}

  @Post()
  async create(
    @Body() createMissionGroupReq: CreateMissionGroupReq
  ): Promise<MissionGroupEntity> {
    const dto: CreateMissionGroupDto = { name: createMissionGroupReq.name };
    return this.missionGroupEntityService.create(dto);
  }

  @Get()
  async findAll(): Promise<MissionGroupEntity[]> {
    return this.missionGroupEntityService.findAll();
  }
}
