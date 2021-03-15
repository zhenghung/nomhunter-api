import { Module } from "@nestjs/common";
import { PlayerEntityModule } from "../../entities/player/player.entity.module";
import { ProfileController } from "./profile.controller";
import { AvatarModule } from "../avatar/avatar.module";

@Module({
  imports: [PlayerEntityModule, AvatarModule],
  providers: [],
  controllers: [ProfileController],
})
export class ProfileModule {}
