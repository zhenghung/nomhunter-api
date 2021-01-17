import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { S3Module } from "./s3/s3.module";
import { LiveModule } from "./live/live.module";
import { PhotosModule } from "./photos/photos.module";

@Module({
  imports: [AuthModule, AvatarModule, S3Module, LiveModule, PhotosModule],
})
export class ServicesModule {}
