import { Module } from "@nestjs/common";
import { UsersModule } from "../../entities/users/users.module";
import { ProfileController } from "./profile.controller";
import { AvatarModule } from "../avatar/avatar.module";

@Module({
  imports: [UsersModule, AvatarModule],
  providers: [],
  controllers: [ProfileController],
})
export class ProfileModule {}
