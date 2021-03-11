import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserBadgesService } from "./user-badges.service";
import { UsersService } from "../users/users.service";
import { GamesService } from "../games/games.service";
import { UserBadgeEntity } from "./user-badge.entity";
import { CreateUserBadgeReq } from "./req/create-user-badge.req";
import { CreateUserBadgeDto } from "./dto/create-user-badge.dto";
import { BadgesService } from "../badges/badges.service";

@ApiTags("UserBadges")
@Controller("userBadges")
export class UserBadgesController {
  private readonly logger = new Logger(UserBadgesController.name);

  constructor(
    private readonly userBadgesService: UserBadgesService,
    private readonly badgesService: BadgesService,
    private readonly usersService: UsersService,
    private readonly gamesService: GamesService
  ) {}

  @Post()
  async create(
    @Body() createUserBadgeReq: CreateUserBadgeReq
  ): Promise<UserBadgeEntity> {
    this.logger.log("Creating userBadge entity: ${createUserBadgeReq}");
    const user = await this.usersService.getById(createUserBadgeReq.userId);
    const badge = await this.badgesService.getById(createUserBadgeReq.badgeId);
    const game = await this.gamesService.getById(createUserBadgeReq.gameId);

    const createUserBadgeDto: CreateUserBadgeDto = {
      user,
      badge,
      game,
    };
    return this.userBadgesService
      .create(createUserBadgeDto)
      .then((userBadgeEntity: UserBadgeEntity) => {
        this.logger.log(
          `UserBadge with id ${userBadgeEntity.id} successfully created`
        );
        return userBadgeEntity;
      });
  }
}
