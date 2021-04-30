import { Module } from "@nestjs/common";
import { TagEntityModule } from "../../entities/tag/tag.entity.module";
import { VenueTagEntityModule } from "../../entities/venueTag/venue-tag.entity.module";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";

@Module({
  imports: [TagEntityModule, VenueTagEntityModule],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
