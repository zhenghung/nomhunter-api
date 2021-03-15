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
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { ProfilePicInterface } from "./interface/profile-pic.interface.";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("Avatar")
@Controller("avatar")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new avatar for player" })
  @ApiCreatedResponse({ description: "Avatar created successfully for player" })
  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createAvatar(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Body() createAvatar: CreateAvatarDto
  ): Promise<ProfilePicInterface> {
    return this.avatarService.createAvatar(
      createAvatar,
      requestWithPlayer.user.id
    );
  }

  @ApiImplicitQuery({
    name: "playerId",
    required: false,
    type: String,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch image url of avatar for player" })
  @ApiOkResponse({ description: "Avatar Image Url retrieved successfully" })
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getAvatar(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Query("playerId") playerId?: string
  ): Promise<ProfilePicInterface> {
    if (playerId) {
      return this.avatarService.getAvatarImageUrl(playerId);
    }
    return this.avatarService.getAvatarImageUrl(requestWithPlayer.user.id);
  }
}
