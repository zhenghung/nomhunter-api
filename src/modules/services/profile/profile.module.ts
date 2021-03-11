import { Module } from "@nestjs/common";
import { UserEntityModule } from "../../entities/user/user.entity.module";
import { ProfileController } from "./profile.controller";
import { AvatarModule } from "../avatar/avatar.module";

@Module({
  imports: [UserEntityModule, AvatarModule],
  providers: [],
  controllers: [ProfileController],
})
export class ProfileModule {}
