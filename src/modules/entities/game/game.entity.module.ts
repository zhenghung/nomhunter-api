import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./game.entity";
import { GameEntityService } from "./game.entity.service";
import { GameEntityController } from "./game.entity.controller";

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameEntityController],
  providers: [GameEntityService],
  exports: [GameEntityService],
})
export class GameEntityModule {}
