import { VenueEntity } from "../../venue/venue.entity";
import { TagEntity } from "../../tag/tag.entity";

export class CreateManyVenueTagsDto {
  venue: VenueEntity;
  tags: TagEntity[];
}
