import { Injectable, Logger } from "@nestjs/common";
import { TagEntityService } from "../../entities/tag/tag.entity.service";
import { VenueTagEntityService } from "../../entities/venueTag/venue-tag.entity.service";

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    private readonly tagEntityService: TagEntityService,
    private readonly venueTagEntityService: VenueTagEntityService
  ) {}

  findAllTags(): Promise<string[]> {
    return this.tagEntityService
      .findAll()
      .then((tagEntities) => tagEntities.map((tagEntity) => tagEntity.name));
  }

  findTagsForVenue(venueId: string): Promise<string[]> {
    return this.venueTagEntityService
      .findByVenueId(venueId)
      .then((venueTagEntities) =>
        venueTagEntities.map((venueTagEntity) => venueTagEntity.tag.name)
      );
  }
}
