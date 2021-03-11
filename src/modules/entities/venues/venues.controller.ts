import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { CreateVenueReq } from "./req/create-venue.req";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { OptionalBoolPipe } from "../../common/pipes/optional-bool.pipe";
import { GoogleMapsService } from "../../services/google-maps/google-maps.service";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { DetailsResponseInterface } from "../../services/google-maps/interface/details-response.interface";
import { BadgesService } from "../badges/badges.service";

@ApiTags("Venues")
@Controller("venues")
export class VenuesController {
  private readonly logger = new Logger(VenuesController.name);

  constructor(
    private readonly venuesService: VenuesService,
    private readonly zonesService: ZonesService,
    private readonly googleMapsService: GoogleMapsService,
    private readonly badgesService: BadgesService
  ) {}

  @Post()
  async create(@Body() createVenueReq: CreateVenueReq): Promise<VenueEntity> {
    // Fetch photoReference, lat and lng via GoogleMapsApi
    const details: DetailsResponseInterface = await this.googleMapsService.getGooglePlacesDetails(
      createVenueReq.googlePlacesId
    );
    if (details.status != "OK") {
      throw HttpExceptionsUtil.createHttpException(
        "Invalid Place Id",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    const photoReference = details.result.photos[0].photo_reference;
    const latitude = details.result.geometry.location.lat.toString();
    const longitude = details.result.geometry.location.lng.toString();

    // Find Zone By Id
    const zone = await this.zonesService.getById(createVenueReq.zoneId);

    // Find Badge By Id
    const badge = await this.badgesService.getById(createVenueReq.badgeId);

    // Create Venue
    const createVenueDto: CreateVenueDto = {
      ...createVenueReq,
      latitude,
      longitude,
      photoReference,
      zone,
      badge,
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
