import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ZoneEntity } from "./zone.entity";
import { ZoneEntityService } from "./zone.entity.service";
import { CreateZoneDto } from "./dto/create-zone.dto";

@ApiTags("ZoneEntity")
@Controller("entities/zone")
export class ZoneEntityController {
  private readonly logger = new Logger(ZoneEntityController.name);

  constructor(private readonly zonesService: ZoneEntityService) {}

  @Post()
  create(@Body() createZoneDto: CreateZoneDto): Promise<ZoneEntity> {
    this.logger.log(`Creating zone with name: ${createZoneDto.name}`);
    return this.zonesService.create(createZoneDto).then((zone) => {
      this.logger.log(`Zone with name ${zone.name} successfully created`);
      return zone;
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<ZoneEntity> {
    this.logger.log(`Fetching zone with id ${id}`);
    return this.zonesService.getById(id);
  }

  @Get()
  findAll(): Promise<ZoneEntity[]> {
    return this.zonesService.findAll();
  }
}
