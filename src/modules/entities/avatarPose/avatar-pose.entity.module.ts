import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AvatarPoseEntity } from "./avatar-pose.entity";
import { AvatarPoseEntityController } from "./avatar-pose.entity.controller";
import { AvatarPoseEntityService } from "./avatar-pose.entity.service";
import { FileEntityModule } from "../file/file.entity.module";

@Module({
  imports: [TypeOrmModule.forFeature([AvatarPoseEntity]), FileEntityModule],
  providers: [AvatarPoseEntityService],
  controllers: [AvatarPoseEntityController],
  exports: [AvatarPoseEntityService],
})
export class AvatarPoseEntityModule {}
