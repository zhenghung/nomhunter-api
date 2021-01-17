import { HttpModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PhotosService } from "./photos.service";
import { PhotosController } from "./photos.controller";

@Module({
  imports: [ConfigService, HttpModule],
  providers: [PhotosService],
  controllers: [PhotosController],
})
export class PhotosModule {}
