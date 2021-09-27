import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GearMappingEntity } from "./gear-mapping.entity";
import { GearMappingEntityService } from "./gear-mapping.entity.service";
import { GearMappingEntityController } from "./gear-mapping.entity.controller";
import { GearEntityModule } from "../gear/gear.entity.module";
import { AvatarPoseEntityModule } from "../avatarPose/avatar-pose.entity.module";

@Module({
  imports: [TypeOrmModule.forFeature([GearMappingEntity]), GearEntityModule, AvatarPoseEntityModule],
  providers: [GearMappingEntityService],
  controllers: [GearMappingEntityController],
  exports: [GearMappingEntityService],
})
export class GearMappingEntityModule {}
