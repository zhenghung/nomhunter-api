import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GearMappingEntityService } from "./gear-mapping.entity.service";
import { CreateGearMappingReq } from "./req/create-gear-mapping.req";
import { AvatarPoseEntityService } from "../avatarPose/avatar-pose.entity.service";
import { AvatarPoseEntity } from "../avatarPose/avatar-pose.entity";
import { CreateGearMappingDto } from "./dto/create-gear-mapping.dto";
import { GearMappingEntity } from "./gear-mapping.entity";
import { GearEntityService } from "../gear/gear.entity.service";
import { GearEntity } from "../gear/gear.entity";

@ApiTags("GearMappingEntity")
@Controller("entities/gearMapping")
export class GearMappingEntityController {
  private readonly logger = new Logger(GearMappingEntityController.name);

  constructor(
    private readonly gearMappingEntityService: GearMappingEntityService,
    private readonly gearEntityService: GearEntityService,
    private readonly avatarPoseService: AvatarPoseEntityService
  ) {}

  @Post()
  async create(@Body() createGearMappingReq: CreateGearMappingReq): Promise<GearMappingEntity> {
    const gearEntity: GearEntity = await this.gearEntityService.getById(createGearMappingReq.gearId);
    const avatarPoseEntity: AvatarPoseEntity = await this.avatarPoseService.getById(createGearMappingReq.avatarPoseId);
    const createGearMappingDto: CreateGearMappingDto = {
      gear: gearEntity,
      avatarPose: avatarPoseEntity,
      transformX: createGearMappingReq.transformX,
      transformY: createGearMappingReq.transformY,
      transformRotation: createGearMappingReq.transformRotation,
    };
    return this.gearMappingEntityService.create(createGearMappingDto);
  }

  @Get()
  findAll(): Promise<GearMappingEntity[]> {
    return this.gearMappingEntityService.findAll();
  }
}
