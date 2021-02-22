import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeasonEntity } from "./season.entity";
import { SeasonsService } from "./seasons.service";
import { SeasonsController } from "./seasons.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SeasonEntity])],
  controllers: [SeasonsController],
  providers: [SeasonsService],
  exports: [SeasonsService],
})
export class SeasonsModule {}
