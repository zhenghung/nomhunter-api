import { Controller, Get, HttpStatus, Logger, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { ProfileResponseInterface } from "./interface/profile-response.interface";
import { UsersService } from "../../entities/users/users.service";
import { AvatarService } from "../avatar/avatar.service";
import { HttpExceptionsUtil } from "../../common/util/http-exceptions.util";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService
  ) {}

  @ApiImplicitQuery({
    name: "userId",
    required: true,
    type: String,
  })
  @ApiOperation({ summary: "Fetch User profile" })
  @ApiOkResponse({ description: "User profile retrieved successfully" })
  @Get()
  async getProfile(
    @Query("userId") userId: string
  ): Promise<ProfileResponseInterface> {
    if (!userId) {
      throw HttpExceptionsUtil.createHttpException(
        "UserId query required",
        HttpStatus.BAD_REQUEST,
        this.logger
      );
    }
    this.logger.log(`Getting profile of user: ${userId}`);
    return this.avatarService.getAvatarImageUrl(userId).then((avatar) => {
      return this.usersService.getById(userId).then((userEntity) => {
        return {
          userId: userEntity.id,
          name: `${userEntity.firstName} ${userEntity.lastName}`,
          avatarUrl: avatar.url,
        };
      });
    });
  }
}
