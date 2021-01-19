import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZoneEntity } from "./zone.entity";
import { ZonesService } from "./zones.service";
import { ZonesController } from "./zones.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ZoneEntity])],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}
