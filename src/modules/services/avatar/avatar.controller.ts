import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { AvatarService } from "./avatar.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithUser } from "../auth/interface/request-with-user.interface";
import { ProfilePicInterface } from "./interface/profile-pic.interface.";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("Avatar")
@Controller("avatar")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new avatar for user" })
  @ApiCreatedResponse({ description: "Avatar created successfully for user" })
  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createAvatar(
    @Req() requestWithUser: RequestWithUser,
    @Body() createAvatar: CreateAvatarDto
  ): Promise<ProfilePicInterface> {
    return this.avatarService.createAvatar(
      createAvatar,
      requestWithUser.user.id
    );
  }

  @ApiImplicitQuery({
    name: "userId",
    required: false,
    type: String,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch image url of avatar for user" })
  @ApiOkResponse({ description: "Avatar Image Url retrieved successfully" })
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getAvatar(
    @Req() requestWithUser: RequestWithUser,
    @Query("userId") userId?: string
  ): Promise<ProfilePicInterface> {
    if (userId) {
      return this.avatarService.getAvatarImageUrl(userId);
    }
    return this.avatarService.getAvatarImageUrl(requestWithUser.user.id);
  }
}
