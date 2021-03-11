import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BadgesService } from "./badges.service";
import { BadgeEntity } from "./badge.entity";
import { CreateBadgeReq } from "./req/create-badge.req";
import { FilesService } from "../files/files.service";
import { FileEntity } from "../files/file.entity";
import { CreateBadgeDto } from "./dto/create-badge.dto";

@ApiTags("Badges")
@Controller("badges")
export class BadgesController {
  private readonly logger = new Logger(BadgesController.name);

  constructor(
    private readonly badgesService: BadgesService,
    private readonly filesService: FilesService
  ) {}

  @Post()
  async create(@Body() createBadgeReq: CreateBadgeReq): Promise<BadgeEntity> {
    this.logger.log(`Creating badge with name: ${createBadgeReq.name}`);

    // Get File By Id
    const fileEntity: FileEntity = await this.filesService.getById(
      createBadgeReq.fileId
    );

    // Construct DTO
    const createBadgeDto: CreateBadgeDto = {
      name: createBadgeReq.name,
      description: createBadgeReq.description,
      file: fileEntity,
    };

    return this.badgesService
      .create(createBadgeDto)
      .then((badgeEntity: BadgeEntity) => {
        this.logger.log(`Badge with id ${badgeEntity.id} successfully created`);
        return badgeEntity;
      });
  }

  @Get()
  findAll(): Promise<BadgeEntity[]> {
    this.logger.log("Fetching all badges");
    return this.badgesService.findAll();
  }
}
