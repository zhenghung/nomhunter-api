import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProfileResponseInterface } from "./interface/profile-response.interface";
import { ProfileService } from "./profile.service";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiImplicitQuery({
    name: "playerId",
    required: false,
    type: String,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch Player profile" })
  @ApiOkResponse({ description: "Player profile retrieved successfully" })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Query("playerId") playerId?: string
  ): Promise<ProfileResponseInterface> {
    if (playerId) {
      return this.profileService.getProfile(playerId, true);
    }
    return this.profileService.getProfile(requestWithPlayer.user.id, false);
  }
}
