import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CreateAvatarDto } from "./dto/create-avatar.dto";
import { AvatarService } from "./avatar.service";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import JwtAuthGuard from "../auth/guard/jwt-auth.guard";
import { RequestWithPlayer } from "../auth/interface/request-with-player.interface";
import { PlayerAvatarInterface } from "./interface/player-avatar.interface";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { GearEntity } from "../../entities/gear/gear.entity";
import { Colors } from "../../common/constants/colors";
import { PlayerGearsInterface } from "./interface/player-gears.interface";
import { GearType } from "../../entities/gear/gear.type";
import { AvatarPoseEntity } from "../../entities/avatarPose/avatar-pose.entity";

@ApiTags("Avatar")
@Controller("avatar")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new playerAvatar for player" })
  @ApiCreatedResponse({ description: "Avatar created successfully for player" })
  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createAvatar(
    @Req() requestWithPlayer: RequestWithPlayer,
    @Body() createAvatar: CreateAvatarDto
  ): Promise<PlayerAvatarInterface> {
    return this.avatarService.createAvatar(createAvatar, requestWithPlayer.user.id);
  }

  @ApiImplicitQuery({
    name: "playerId",
    required: true,
    type: String,
  })
  @ApiOperation({ summary: "Fetch playerAvatar for player" })
  @ApiOkResponse({ description: "Avatar retrieved successfully" })
  @Get("profile")
  async getPlayerAvatar(@Query("playerId") playerId: string): Promise<PlayerAvatarInterface> {
    return this.avatarService.getPlayerAvatar(playerId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all player gears" })
  @ApiOkResponse({ description: "Player Gear retrieved successfully" })
  @Get("gears")
  @UseGuards(JwtAuthGuard)
  async getGears(@Req() requestWithPlayer: RequestWithPlayer): Promise<PlayerGearsInterface> {
    const gears: GearEntity[] = await this.avatarService.getProfileGears(requestWithPlayer.user.id);
    const poses: AvatarPoseEntity[] = await this.avatarService.getProfilePoses(requestWithPlayer.user.id);
    return {
      hats: gears.filter((gear) => gear.type == GearType.HAT),
      weapons: gears.filter((gear) => gear.type == GearType.WEAPON),
      faces: gears.filter((gear) => gear.type == GearType.FACE),
      colors: AvatarController.getColors(),
      poses: poses,
    };
  }

  private static getColors(): string[] {
    return [
      Colors.MANGO_SORBET_200_VALUE,
      Colors.PUMPKIN_SOUP_200_VALUE,
      Colors.SMOKED_SALMON_200_VALUE,
      Colors.STRAWBERRY_SMOOTHIE_100_VALUE,
      Colors.CASHEW_BUTTER_300_VALUE,
      Colors.CASHEW_BUTTER_600_VALUE,
      Colors.CASHEW_BUTTER_700_VALUE,
      Colors.CASHEW_BUTTER_900_VALUE,
      Colors.MANGO_SORBET_400_VALUE,
      Colors.PUMPKIN_SOUP_400_VALUE,
      Colors.SMOKED_SALMON_400_VALUE,
      Colors.STRAWBERRY_SMOOTHIE_600_VALUE,
      Colors.BLACKBERRY_PIE_700_VALUE,
      Colors.CABBAGE_SLAW_700_VALUE,
      Colors.BLUEBERRY_MUFFIN_800_VALUE,
      Colors.MINT_MILKSHAKE_400_VALUE,
    ];
  }
}
