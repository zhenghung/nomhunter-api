import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VenueTagEntityService } from "./venue-tag.entity.service";
import { VenueTagEntity } from "./venue-tag.entity";
import { VenueEntityModule } from "../venue/venue.entity.module";
import { TagEntityModule } from "../tag/tag.entity.module";
import { VenueTagEntityController } from "./venue-tag.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([VenueTagEntity]), VenueEntityModule, TagEntityModule],
  providers: [VenueTagEntityService],
  controllers: [VenueTagEntityController],
  exports: [VenueTagEntityService],
})
export class VenueTagEntityModule {}
