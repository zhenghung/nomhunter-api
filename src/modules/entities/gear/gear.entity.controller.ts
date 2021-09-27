import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GearEntityService } from "./gear.entity.service";
import { GearEntity } from "./gear.entity";
import { CreateGearReq } from "./req/create-gear.req";
import { FileEntityService } from "../file/file.entity.service";
import { FileEntity } from "../file/file.entity";
import { CreateGearDto } from "./dto/create-gear.dto";

@ApiTags("GearEntity")
@Controller("entities/gear")
export class GearEntityController {
  private readonly logger = new Logger(GearEntityController.name);

  constructor(
    private readonly gearEntityService: GearEntityService,
    private readonly fileEntityService: FileEntityService
  ) {}

  @Post()
  async create(@Body() createGearReq: CreateGearReq): Promise<GearEntity> {
    this.logger.log(`Creating gear with name: ${createGearReq.name}`);

    // Get File By Id
    const fileEntity: FileEntity = await this.fileEntityService.getById(createGearReq.fileId);

    // Construct DTO
    const createGearDto: CreateGearDto = {
      name: createGearReq.name,
      description: createGearReq.description,
      file: fileEntity,
      type: createGearReq.type,
    };

    return this.gearEntityService.create(createGearDto).then((gearEntity: GearEntity) => {
      this.logger.log(`Gear with id ${gearEntity.id} successfully created`);
      return gearEntity;
    });
  }

  @Get()
  findAll(): Promise<GearEntity[]> {
    this.logger.log("Fetching all gear entities");
    return this.gearEntityService.findAll();
  }
}
