import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VenueTagEntity } from "./venue-tag.entity";
import { CreateManyVenueTagsDto } from "./dto/create-many-venue-tags.dto";
import { GenericEntityService } from "../generic.entity.service";

@Injectable()
export class VenueTagEntityService extends GenericEntityService<
  VenueTagEntity
> {
  constructor(
    @InjectRepository(VenueTagEntity)
    private readonly venueTagEntityRepository: Repository<VenueTagEntity>
  ) {
    super(
      venueTagEntityRepository,
      new Logger(VenueTagEntityService.name),
      VenueTagEntity.name
    );
  }

  /**
   * Create venue tag entity
   * @param createManyVenueTagsDto
   */
  async createMany(
    createManyVenueTagsDto: CreateManyVenueTagsDto
  ): Promise<VenueTagEntity[]> {
    const venueTags: VenueTagEntity[] = createManyVenueTagsDto.tags.map(
      (tag) => {
        const venueTag = new VenueTagEntity();
        venueTag.venue = createManyVenueTagsDto.venue;
        venueTag.tag = tag;
        return venueTag;
      }
    );
    return this.venueTagEntityRepository.save(venueTags);
  }

  async findByVenueId(venueId: string): Promise<VenueTagEntity[]> {
    return this.venueTagEntityRepository
      .createQueryBuilder("venueTag")
      .innerJoinAndSelect("venueTag.venue", "venue")
      .innerJoinAndSelect("venueTag.tag", "tag")
      .where("venue.id = :id", { id: venueId })
      .getMany();
  }
}
