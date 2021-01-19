import { Module } from "@nestjs/common";
import { AvatarController } from "./avatar.controller";
import { AvatarService } from "./avatar.service";
import { S3Module } from "../s3/s3.module";
import { FilesModule } from "../../entities/files/files.module";
import { UsersModule } from "../../entities/users/users.module";

@Module({
  imports: [FilesModule, UsersModule, S3Module],
  providers: [AvatarService],
  controllers: [AvatarController],
})
export class AvatarModule {}
