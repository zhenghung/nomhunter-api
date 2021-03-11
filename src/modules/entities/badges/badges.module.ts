import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BadgeEntity } from "./badge.entity";
import { BadgesService } from "./badges.service";
import { BadgesController } from "./badges.controller";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEntity]), FilesModule],
  providers: [BadgesService],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}
