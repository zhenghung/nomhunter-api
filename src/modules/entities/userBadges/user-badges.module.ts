import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBadgeEntity } from "./user-badge.entity";
import { UserBadgesService } from "./user-badges.service";
import { UserBadgesController } from "./user-badges.controller";
import { BadgesModule } from "../badges/badges.module";
import { UsersModule } from "../users/users.module";
import { GamesModule } from "../games/games.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBadgeEntity]),
    BadgesModule,
    UsersModule,
    GamesModule,
  ],
  providers: [UserBadgesService],
  controllers: [UserBadgesController],
  exports: [UserBadgesService],
})
export class UserBadgesModule {}
