import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { VenueEntity } from "../venue/venue.entity";
import { TagEntity } from "../tag/tag.entity";

@Entity("venue_tag")
@Unique(["venue", "tag"])
export class VenueTagEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ name: "venue_id" })
  @ManyToOne(() => VenueEntity, (venueEntity) => venueEntity.venueTags)
  @JoinColumn({ name: "venue_id", referencedColumnName: "id" })
  venue: VenueEntity;

  @ApiProperty({ name: "tag_id" })
  @ManyToOne(() => TagEntity, (tagEntity) => tagEntity.venueTags)
  @JoinColumn({ name: "tag_id", referencedColumnName: "id" })
  tag: TagEntity;
}
