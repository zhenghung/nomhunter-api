import { Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [ConfigService],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
