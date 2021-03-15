import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeasonEntity } from "./season.entity";
import { SeasonEntityService } from "./season.entity.service";
import { SeasonEntityController } from "./season.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity])],
  controllers: [SeasonEntityController],
  providers: [SeasonEntityService],
  exports: [SeasonEntityService],
})
export class SeasonEntityModule {}
