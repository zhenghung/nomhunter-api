import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import ConfigModule from "./config/config.module";
import DatabaseModule from "./database/database.module";
import { EntitiesModule } from "./entities/entities.module";
import { AuthModule } from "./auth/auth.module";
import { AvatarModule } from "./avatar/avatar.module";
import { S3Module } from "./s3/s3.module";
import { LiveModule } from "./live/live.module";
import { PhotosModule } from "./photos/photos.module";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    EntitiesModule,
    AuthModule,
    AvatarModule,
    S3Module,
    LiveModule,
    PhotosModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
