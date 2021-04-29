import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { VenueTagEntityService } from "./venue-tag.entity.service";
import { CreateVenueTagReq } from "./req/create-venue-tag.req";
import { VenueEntityService } from "../venue/venue.entity.service";
import { TagEntityService } from "../tag/tag.entity.service";
import { CreateManyVenueTagsDto } from "./dto/create-many-venue-tags.dto";
import { VenueTagEntity } from "./venue-tag.entity";
import { ApiTags } from "@nestjs/swagger";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@ApiTags("VenueTagEntity")
@Controller("entities/venueTag")
export class VenueTagEntityController {
  private readonly logger = new Logger(VenueTagEntityController.name);

  constructor(
    private readonly venueTagEntityService: VenueTagEntityService,
    private readonly venueEntityService: VenueEntityService,
    private readonly tagEntityService: TagEntityService
  ) {}

  @Post()
  async create(
    @Body() createVenueTagReq: CreateVenueTagReq
  ): Promise<VenueTagEntity[]> {
    this.logger.log(`Creating venue tags: ${createVenueTagReq}`);
    const venue = await this.venueEntityService.getById(
      createVenueTagReq.venueId
    );
    const tags = await Promise.all(
      createVenueTagReq.tags.map((tagName) =>
        this.tagEntityService.getByTagName(tagName)
      )
    );
    const dto: CreateManyVenueTagsDto = { venue, tags };
    return this.venueTagEntityService
      .createMany(dto)
      .then((venueTagEntities: VenueTagEntity[]) => {
        this.logger.log(
          `Venue with id ${venueTagEntities[0].venue.id} successfully created`
        );
        return venueTagEntities;
      })
      .catch((error) => {
        throw HttpExceptionsUtil.createHttpException(
          `Failed to create venueTags | ${error}`,
          HttpStatus.BAD_REQUEST,
          this.logger,
          error
        );
      });
  }
}
