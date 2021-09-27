import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VenueEntity } from "./venue.entity";
import { VenueEntityService } from "./venue.entity.service";
import { VenueEntityController } from "./venue.entity.controller";
import { ZoneEntityModule } from "../zone/zone.entity.module";
import { GoogleMapsModule } from "../../services/google-maps/google-maps.module";
import { BadgeEntityModule } from "../badge/badge.entity.module";

@Module({
  imports: [TypeOrmModule.forFeature([VenueEntity]), ZoneEntityModule, GoogleMapsModule, BadgeEntityModule],
  providers: [VenueEntityService],
  controllers: [VenueEntityController],
  exports: [VenueEntityService],
})
export class VenueEntityModule {}
