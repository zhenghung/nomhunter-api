import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MissionEntity } from "./mission.entity";
import { MissionEntityService } from "./mission.entity.service";
import { GearEntityModule } from "../gear/gear.entity.module";
import { MissionEntityController } from "./mission.entity.controller";
import { TagEntityModule } from "../tag/tag.entity.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([MissionEntity]),
    GearEntityModule,
    TagEntityModule,
  ],
  providers: [MissionEntityService],
  controllers: [MissionEntityController],
  exports: [MissionEntityService],
})
export class MissionEntityModule {}
