import { Module } from "@nestjs/common";
import { AvatarController } from "./avatar.controller";
import { AvatarService } from "./avatar.service";
import { S3Module } from "../../clients/s3/s3.module";
import { FileEntityModule } from "../../entities/file/file.entity.module";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";

@Module({
  imports: [FileEntityModule, PlayerEntityModule, S3Module],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
