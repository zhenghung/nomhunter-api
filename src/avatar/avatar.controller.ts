import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CreateAvatarDto } from "./dto/create.avatar.dto";
import { AvatarService } from "./avatar.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithUser } from "../auth/interface/request-with-user.interface";

@ApiTags("Avatar")
@Controller("avatar")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Post("create")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAvatar(
    @Req() requestWithUser: RequestWithUser,
    @Body() createAvatar: CreateAvatarDto
  ): Promise<string> {
    return this.avatarService.createAvatar(
      createAvatar,
      requestWithUser.user.id
    );
  }
}
