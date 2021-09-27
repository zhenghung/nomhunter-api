import { Module } from "@nestjs/common";
import { AvatarController } from "./avatar.controller";
import { AvatarService } from "./avatar.service";
import { S3Module } from "../../clients/s3/s3.module";
import { FileEntityModule } from "../../entities/file/file.entity.module";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";
import { AvatarPoseEntityModule } from "../../entities/avatarPose/avatar-pose.entity.module";
import { GearEntityModule } from "../../entities/gear/gear.entity.module";
import { PlayerAvatarEntityModule } from "../../entities/playerAvatar/player-avatar.entity.module";
import { GearMappingEntityModule } from "../../entities/gearMapping/gear-mapping.entity.module";

@Module({
  imports: [
    FileEntityModule,
    PlayerEntityModule,
    S3Module,
    PlayerAvatarEntityModule,
    AvatarPoseEntityModule,
    GearEntityModule,
    GearMappingEntityModule,
  ],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
