import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "./game.entity";
import { GamesService } from "./games.service";
import { GamesController } from "./games.controller";
import { UsersModule } from "../users/users.module";
import { VenuesModule } from "../venues/venues.module";

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UsersModule, VenuesModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
