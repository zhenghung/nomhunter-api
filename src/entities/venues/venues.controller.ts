import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VenuesService } from "./venues.service";
import { VenueEntity } from "./venue.entity";
import { CreateVenueDto } from "./dto/create-venue.dto";
import { ZonesService } from "../zones/zones.service";
import { CreateVenueReq } from "./dto/create-venue.req";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { OptionalBoolPipe } from "../../pipes/optional-bool.pipe";

@ApiTags("Venues")
@Controller("venues")
export class VenuesController {
  private readonly logger = new Logger(VenuesController.name);

  constructor(
    private readonly venuesService: VenuesService,
    private readonly zonesService: ZonesService
  ) {}

  @Post()
  async create(@Body() createVenueReq: CreateVenueReq): Promise<VenueEntity> {
    const zone = await this.zonesService.getById(createVenueReq.zone_id);
    const createVenueDto: CreateVenueDto = {
      ...createVenueReq,
      zone,
    };
    this.logger.log(`Creating venue with name: ${createVenueDto.name}`);
    return this.venuesService.create(createVenueDto).then((venue) => {
      this.logger.log(`Venue with name ${venue.name} successfully created`);
      return venue;
    });
  }

  @ApiImplicitQuery({
    name: "showZone",
    required: false,
    type: Boolean,
  })
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Query("showZone", OptionalBoolPipe) showZone?: boolean
  ): Promise<VenueEntity> {
    this.logger.log(`Fetching venue with id ${id}`);
    return showZone
      ? this.venuesService.getByIdJoinZone(id)
      : this.venuesService.getById(id);
  }

  @ApiImplicitQuery({
    name: "showZone",
    required: false,
    type: Boolean,
  })
  @Get()
  findAll(
    @Query("showZone", OptionalBoolPipe) showZone?: boolean
  ): Promise<VenueEntity[]> {
    this.logger.log("Fetching all venues");
    return showZone
      ? this.venuesService.findJoinZone()
      : this.venuesService.findAll();
  }
}
