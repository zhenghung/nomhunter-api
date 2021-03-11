import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerEntity } from "./player.entity";
import { PlayerEntityController } from "./player.entity.controller";
import { PlayerEntityService } from "./player.entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  providers: [PlayerEntityService],
  controllers: [PlayerEntityController],
  exports: [PlayerEntityService],
})
export class PlayerEntityModule {}
