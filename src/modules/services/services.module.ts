import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { S3Module } from "./s3/s3.module";
import { LiveModule } from "./live/live.module";
import { GoogleMapsModule } from "./google-maps/google-maps.module";

@Module({
  imports: [AuthModule, AvatarModule, S3Module, LiveModule, GoogleMapsModule],
})
export class ServicesModule {}
