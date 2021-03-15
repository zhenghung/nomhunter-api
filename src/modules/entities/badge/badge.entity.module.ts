import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BadgeEntity } from "./badge.entity";
import { BadgeEntityService } from "./badge.entity.service";
import { BadgeEntityController } from "./badge.entity.controller";
import { FileEntityModule } from "../file/file.entity.module";

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEntity]), FileEntityModule],
  providers: [BadgeEntityService],
  controllers: [BadgeEntityController],
  exports: [BadgeEntityService],
})
export class BadgeEntityModule {}
