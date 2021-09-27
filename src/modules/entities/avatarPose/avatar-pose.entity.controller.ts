import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AvatarPoseEntity } from "./avatar-pose.entity";
import { AvatarPoseEntityService } from "./avatar-pose.entity.service";
import { FileEntityService } from "../file/file.entity.service";
import { CreateAvatarPoseReq } from "./req/create-avatar-pose.req";
import { CreateAvatarPoseDto } from "./dto/create-avatar-pose-dto";

@ApiTags("AvatarPoseEntity")
@Controller("entities/avatarPose")
export class AvatarPoseEntityController {
  private readonly logger = new Logger(AvatarPoseEntityController.name);

  constructor(
    private readonly avatarPoseEntityService: AvatarPoseEntityService,
    private readonly fileEntityService: FileEntityService
  ) {}

  @Post()
  async create(@Body() createAvatarPoseReq: CreateAvatarPoseReq): Promise<AvatarPoseEntity> {
    const dto: CreateAvatarPoseDto = {
      poseSilhouette: await this.fileEntityService.getById(createAvatarPoseReq.poseSilhouetteFileId),
      poseOutline: await this.fileEntityService.getById(createAvatarPoseReq.poseOutlineFileId),
      poseHandSilhouette: await this.fileEntityService.getById(createAvatarPoseReq.poseHandSilhouetteFileId),
      poseHandOutline: await this.fileEntityService.getById(createAvatarPoseReq.poseHandOutlineFileId),
    };
    return this.avatarPoseEntityService.create(dto);
  }

  @Get()
  findAll(): Promise<AvatarPoseEntity[]> {
    return this.avatarPoseEntityService.findAll();
  }
}
