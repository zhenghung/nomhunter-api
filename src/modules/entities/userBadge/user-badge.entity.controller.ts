import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserBadgeEntityService } from "./user-badge.entity.service";
import { UserEntityService } from "../user/user.entity.service";
import { GameEntityService } from "../game/game.entity.service";
import { UserBadgeEntity } from "./user-badge.entity";
import { CreateUserBadgeReq } from "./req/create-user-badge.req";
import { CreateUserBadgeDto } from "./dto/create-user-badge.dto";
import { BadgeEntityService } from "../badge/badge.entity.service";

@ApiTags("UserBadgeEntity")
@Controller("entities/userBadge")
export class UserBadgeEntityController {
  private readonly logger = new Logger(UserBadgeEntityController.name);

  constructor(
    private readonly userBadgesService: UserBadgeEntityService,
    private readonly badgesService: BadgeEntityService,
    private readonly usersService: UserEntityService,
    private readonly gamesService: GameEntityService
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
