import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MissionGroupFlagEntity } from "./mission-group-flag.entity";
import { MissionGroupFlagEntityService } from "./mission-group-flag.entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([MissionGroupFlagEntity])],
  providers: [MissionGroupFlagEntityService],
  controllers: [],
  exports: [MissionGroupFlagEntityService],
})
export class MissionGroupFlagEntityModule {}
