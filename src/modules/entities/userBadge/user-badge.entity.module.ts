import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBadgeEntity } from "./user-badge.entity";
import { UserBadgeEntityService } from "./user-badge.entity.service";
import { UserBadgeEntityController } from "./user-badge.entity.controller";
import { BadgeEntityModule } from "../badge/badge.entity.module";
import { UserEntityModule } from "../user/user.entity.module";
import { GameEntityModule } from "../game/game.entity.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBadgeEntity]),
    BadgeEntityModule,
    UserEntityModule,
    GameEntityModule,
  ],
  providers: [UserBadgeEntityService],
  controllers: [UserBadgeEntityController],
  exports: [UserBadgeEntityService],
})
export class UserBadgeEntityModule {}
