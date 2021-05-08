import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntityModule } from "../file/file.entity.module";
import { GearEntity } from "./gear.entity";
import { GearEntityService } from "./gear.entity.service";
import { GearEntityController } from "./gear.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([GearEntity]), FileEntityModule],
  providers: [GearEntityService],
  controllers: [GearEntityController],
  exports: [GearEntityService],
})
export class GearEntityModule {}
