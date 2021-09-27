import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerAvatarEntityService } from "./player-avatar.entity.service";
import { PlayerAvatarEntity } from "./player-avatar.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerAvatarEntity])],
  providers: [PlayerAvatarEntityService],
  controllers: [],
  exports: [PlayerAvatarEntityService],
})
export class PlayerAvatarEntityModule {}
