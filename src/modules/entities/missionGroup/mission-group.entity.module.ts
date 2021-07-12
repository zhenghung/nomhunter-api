import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MissionGroupEntityService } from "./mission-group.entity.service";
import { MissionGroupEntityController } from "./mission-group.entity.controller";
import { MissionGroupEntity } from "./mission-group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MissionGroupEntity])],
  providers: [MissionGroupEntityService],
  controllers: [MissionGroupEntityController],
  exports: [MissionGroupEntityService],
})
export class MissionGroupEntityModule {}
