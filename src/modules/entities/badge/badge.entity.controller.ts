import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BadgeEntityService } from "./badge.entity.service";
import { BadgeEntity } from "./badge.entity";
import { CreateBadgeReq } from "./req/create-badge.req";
import { FileEntityService } from "../file/file.entity.service";
import { FileEntity } from "../file/file.entity";
import { CreateBadgeDto } from "./dto/create-badge.dto";

@ApiTags("BadgeEntity")
@Controller("entities/badge")
export class BadgeEntityController {
  private readonly logger = new Logger(BadgeEntityController.name);

  constructor(
    private readonly badgeEntityService: BadgeEntityService,
    private readonly fileEntityService: FileEntityService
  ) {}

  @Post()
  async create(@Body() createBadgeReq: CreateBadgeReq): Promise<BadgeEntity> {
    this.logger.log(`Creating badge with name: ${createBadgeReq.name}`);

    // Get File By Id
    const fileEntity: FileEntity = await this.fileEntityService.getById(
      createBadgeReq.fileId
    );

    // Construct DTO
    const createBadgeDto: CreateBadgeDto = {
      name: createBadgeReq.name,
      description: createBadgeReq.description,
      file: fileEntity,
    };

    return this.badgeEntityService
      .create(createBadgeDto)
      .then((badgeEntity: BadgeEntity) => {
        this.logger.log(`Badge with id ${badgeEntity.id} successfully created`);
        return badgeEntity;
      });
  }

  @Get()
  findAll(): Promise<BadgeEntity[]> {
    this.logger.log("Fetching all badge");
    return this.badgeEntityService.findAll();
  }
}
