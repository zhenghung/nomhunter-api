import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VenueEntity } from "./venue.entity";
import { VenuesService } from "./venues.service";
import { VenuesController } from "./venues.controller";
import { ZonesModule } from "../zones/zones.module";

@Module({
  imports: [TypeOrmModule.forFeature([VenueEntity]), ZonesModule],
  providers: [VenuesService],
  controllers: [VenuesController],
  exports: [VenuesService],
})
export class VenuesModule {}
