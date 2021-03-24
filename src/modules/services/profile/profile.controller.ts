import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { ProfileResponseInterface } from "./interface/profile-response.interface";
import { PlayerEntityService } from "../../entities/player/player.entity.service";
import { AvatarService } from "../avatar/avatar.service";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly playersService: PlayerEntityService,
    private readonly avatarService: AvatarService
  ) {}

  @ApiImplicitQuery({
    name: "playerId",
    required: true,
    type: String,
  })
  @ApiOperation({ summary: "Fetch Player profile" })
  @ApiOkResponse({ description: "Player profile retrieved successfully" })
  @Get()
  async getProfile(
    @Query("playerId") playerId: string
  ): Promise<ProfileResponseInterface> {
    if (!playerId) {
      throw HttpExceptionsUtil.createHttpException(
        "PlayerId query required",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    this.logger.log(`Getting profile of player: ${playerId}`);
    return this.avatarService.getAvatarImageUrl(playerId).then((avatar) => {
      return this.playersService.getById(playerId).then((playerEntity) => {
        return {
          playerId: playerEntity.id,
          name: `${playerEntity.nickname}`,
          avatarUrl: avatar.url,
        };
      });
    });
  }
}
