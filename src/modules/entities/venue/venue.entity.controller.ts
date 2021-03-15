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
import { VenueEntityService } from "./venue.entity.service";
import { VenueEntity } from "./venue.entity";
import { CreateVenueDto } from "./dto/create-venue.dto";
import { ZoneEntityService } from "../zone/zone.entity.service";
import { CreateVenueReq } from "./req/create-venue.req";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { OptionalBoolPipe } from "../../common/pipes/optional-bool.pipe";
import { GoogleMapsService } from "../../services/google-maps/google-maps.service";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";
import { DetailsResponseInterface } from "../../services/google-maps/interface/details-response.interface";
import { BadgeEntityService } from "../badge/badge.entity.service";

@ApiTags("VenueEntity")
@Controller("entities/venue")
export class VenueEntityController {
  private readonly logger = new Logger(VenueEntityController.name);

  constructor(
    private readonly venueEntityService: VenueEntityService,
    private readonly zoneEntityService: ZoneEntityService,
    private readonly badgeEntityService: BadgeEntityService,
    private readonly googleMapsService: GoogleMapsService
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
    const zone = await this.zoneEntityService.getById(createVenueReq.zoneId);

    // Find Badge By Id
    const badge = await this.badgeEntityService.getById(createVenueReq.badgeId);

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
    return this.venueEntityService.create(createVenueDto).then((venue) => {
      this.logger.log(`Venue with name ${venue.name} successfully created`);
      return venue;
    });
  }

  @ApiImplicitQuery({
    name: "showZone",
    required: false,
    type: Boolean,
  })
  @ApiImplicitQuery({
    name: "showBadge",
    required: false,
    type: Boolean,
  })
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Query("showZone", OptionalBoolPipe) showZone?: boolean,
    @Query("showBadge", OptionalBoolPipe) showBadge?: boolean
  ): Promise<VenueEntity> {
    this.logger.log(`Fetching venue with id ${id}`);
    if (showZone && showBadge) {
      return this.venueEntityService.getByIdJoinAll(id);
    }
    if (showZone) {
      return this.venueEntityService.getByIdJoinZone(id);
    }
    if (showBadge) {
      return this.venueEntityService.getByIdJoinBadge(id);
    }
    return this.venueEntityService.getById(id);
  }

  @ApiImplicitQuery({
    name: "showZone",
    required: false,
    type: Boolean,
  })
  @ApiImplicitQuery({
    name: "showBadge",
    required: false,
    type: Boolean,
  })
  @Get()
  findAll(
    @Query("showZone", OptionalBoolPipe) showZone?: boolean,
    @Query("showBadge", OptionalBoolPipe) showBadge?: boolean
  ): Promise<VenueEntity[]> {
    this.logger.log("Fetching all venue entities");
    if (showZone && showBadge) {
      return this.venueEntityService.findJoinAll();
    }
    if (showZone) {
      return this.venueEntityService.findJoin("zone");
    }
    if (showBadge) {
      return this.venueEntityService.findJoin("badge");
    }
    return this.venueEntityService.findAll();
  }
}
