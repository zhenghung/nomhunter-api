import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZoneEntity } from "./zone.entity";
import { ZoneEntityService } from "./zone.entity.service";
import { ZoneEntityController } from "./zone.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ZoneEntity])],
  controllers: [ZoneEntityController],
  providers: [ZoneEntityService],
  exports: [ZoneEntityService],
})
export class ZoneEntityModule {}
